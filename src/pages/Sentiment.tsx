import { Button, Col, Input, Row, Space } from "antd";
import React from "react";

const { TextArea } = Input;

export const SentimentPage = () => {

    return (
        <Row>
            <Col span={24} >            
                <Space direction='vertical' style={{ 'width': "100%" }}>
                    <TextArea rows={4} />
                    <Button type="primary" block>
                        Analyze
                    </Button>
                </Space>
            </Col>
        </Row>
    )
}

export default SentimentPage;
