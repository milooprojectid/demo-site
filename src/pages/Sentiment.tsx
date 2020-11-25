import { LayersModel, Tensor } from "@tensorflow/tfjs";
import { Button, Col, Divider, Input, Row, Space, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";

import { Helper, Tokenizer } from "../libs/nlp";

const { TextArea } = Input;

const DICTONARY: { [key: string]: { name: string, color: string } } = {
    '0': { name: "Negative", color: "red" },
    '1': { name: "Neutral", color: "blue" },
    '2': { name: "Positive", color: "green" }
}

const TABLE_COLUMN = [
    {
      title: 'Text',
      dataIndex: 'text',
      key: 'text',
      render: (value: string) => <p>{value}</p>,
    },
    {
      title: 'Prediction',
      dataIndex: 'class',
      key: 'class',
      render: (value: number) => {
        const dict = DICTONARY[value.toString()];
        return <Tag color={dict.color} key={value} >{ dict.name }</Tag>
      },
    }
  ];

interface Prediction { 
    text: string; 
    class: number;
    key: string;
}

export const SentimentPage = () => {
    const [prediction, setPrediction] = useState<Prediction[]>([]);
    const [input, setInput] = useState<string>("");
    const [model, setModel] = useState<LayersModel | null>(null);
    const [tokenizer, setTokenizer] = useState<Tokenizer | null>(null);
    
    /** on first load */
    useEffect(() => {
      loadModel();
      loadTokenizer();
    }, []);

    /** on all loaded */
    useEffect(() => {
      if (model && tokenizer) {
        console.log("model loaded");
      }
    }, [model, tokenizer]);

    const loadModel = async () => {
      const model = await Helper.loadKerasModel("https://storage.googleapis.com/miloo/research/model/sentiment/model.json");
      setModel(model);
    }

    const loadTokenizer = async () => {
      const tokenizer = await Tokenizer.loadFromUrl("https://storage.googleapis.com/miloo/research/model/sentiment/token");
      setTokenizer(tokenizer);
    }

    const predict = (text: string): number => {
      const tokenized = tokenizer!.textsToSequences([text]);
      const sequences = Helper.generatePadSequences(tokenized);
      const prediction = (model!.predict(sequences) as Tensor).dataSync();
      console.info(`PREDICTION ${prediction}`)
      return Helper.getClass(prediction);
    }

    /** call model */
    const onSubmit = (text: string) => {
        const predictionClass = predict(text);
        setPrediction([...prediction, { text , class: predictionClass, key: Date.now().toString() }]);
        setInput("");
    }

    return (
        <Row>
            <Col span={24} >            
                <Space direction='vertical' style={{ 'width': "100%" }}>
                    <TextArea rows={4} value={input} onChange={(e) => setInput(e.target.value)} />
                    <Button type="primary" onClick={() => input && onSubmit(input)} block>
                        Analyze
                    </Button >
                    <Divider />
                    <Table columns={TABLE_COLUMN} dataSource={prediction} pagination={false} />
                </Space>
            </Col>
        </Row>
    )
}

export default SentimentPage;
