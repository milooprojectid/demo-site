import { LayersModel, Tensor } from "@tensorflow/tfjs";
import { Button, Card, Col, Divider, Input, Row, Space, List } from "antd";
import React, { useEffect, useState } from "react";
import { CheckCircleTwoTone, CloseCircleTwoTone, MinusCircleTwoTone } from '@ant-design/icons';
import { Helper, Tokenizer } from "../libs/nlp";

const { TextArea } = Input;

const ICON: { [key: string]: any } = {
    '0': <CloseCircleTwoTone twoToneColor="#ec5858" />,
    '1': <MinusCircleTwoTone twoToneColor="#aee6e6" />,
    '2': <CheckCircleTwoTone twoToneColor="#52c41a" />
}

interface Prediction { 
    text: string; 
    class: number;
    key: string;
}

export const SentimentPage = () => {
    const [predictions, setPredictions] = useState<Prediction[]>([]);
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
        setPredictions([...predictions, { text , class: predictionClass, key: Date.now().toString() }]);
        setInput("");
    }

    const renderPrediction = (item: Prediction): any => {
      const icon = ICON[item.class.toString()];
      return (
        <List.Item key={item.key}>
          <List.Item.Meta
            avatar={icon}
            description={item.text}
          />
        </List.Item>
      )
    }

    return (
        <Row>
            <Col       
                xl={{ span: 8, offset: 8 }}
                lg={{ span: 10, offset: 7 }}
                md={{ span: 12, offset: 6 }}
                sm={{ span: 24 }}
                xs={{ span: 24 }} >            
            <Card>
                <Space direction='vertical' style={{ 'width': "100%" }}>
                    <TextArea rows={4} value={input} onChange={(e) => setInput(e.target.value)} />
                    <Button type="primary" onClick={() => input && onSubmit(input)} block>
                        Analyze
                    </Button >
                    <Divider />
                    <List
                        size="large"
                        bordered
                        dataSource={predictions}
                        renderItem={renderPrediction}
                    />
                </Space>
            </Card>
            </Col>
        </Row>
    )
}

export default SentimentPage;
