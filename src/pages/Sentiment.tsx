import { Button, Col, Divider, Input, Row, Space, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";

const { TextArea } = Input;

const DICTONARY: { [key: string]: { name: string, color: string } } = {
    '-1': { name: "Negative", color: "red" },
    '0': { name: "Neutral", color: "blue" },
    '1': { name: "Positive", color: "green" }
}

const DUMMY_DATA = [
    {
      text: 'Barang ngga sesuai, ini toko penipu !',
      class: -1
    },
    {
      text: 'Kamu adalah manusia berang berang',
      class: 0
    },
    {
      text: 'Barang sesuai, cepat pula sampai nya, recommended pokoknya',
      class: 1
    },
  ];

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
}

export const SentimentPage = () => {
    const [prediction, setPrediction] = useState<Prediction[]>([]);
    const [input, setInput] = useState<string>("kamu anjing");
    
    /** onload */
    useEffect(() => {
        setPrediction(DUMMY_DATA);
    }, []);

    /** call model */
    const onSubmit = (text: string) => {
        // prediction here
        const predictionClass = -1;
        setPrediction([...prediction, { text , class: predictionClass }]);
    }

    return (
        <Row>
            <Col span={24} >            
                <Space direction='vertical' style={{ 'width': "100%" }}>
                    <TextArea rows={4} value={input} onChange={(e) => setInput(e.target.value)} />
                    <Button type="primary" onClick={() => onSubmit(input)} block>
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
