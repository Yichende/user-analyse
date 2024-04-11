import React, { useState } from 'react';
import { Row, Col, Form, Input, Button, Card, Divider, Carousel } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Line } from '@ant-design/charts';


const data1 = [
  { name: 'Jan', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Feb', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Mar', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Apr', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'May', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Jun', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Jul', uv: 3490, pv: 4300, amt: 2100 },
];

const data2 = [
  { name: 'Jan', uv: 1000, pv: 3400, amt: 2400 },
  { name: 'Feb', uv: 2000, pv: 2398, amt: 2210 },
  { name: 'Mar', uv: 3000, pv: 5800, amt: 2290 },
  { name: 'Apr', uv: 4780, pv: 2908, amt: 2000 },
  { name: 'May', uv: 2890, pv: 3800, amt: 2181 },
  { name: 'Jun', uv: 1390, pv: 1800, amt: 2500 },
  { name: 'Jul', uv: 2490, pv: 3300, amt: 2100 },
];

const Page = () => {
  const [currentChart, setCurrentChart] = useState(0);

  const handleNext = () => {
    setCurrentChart((prev) => (prev + 1) % 2);
  };

  const handlePrev = () => {
    setCurrentChart((prev) => (prev - 1 + 2) % 2);
  };

  const charts = [
    <Line
      key="chart1"
      data={data1}
      xField="name"
      yField={['pv', 'uv']}
      height={300}
      legend={{ position: 'top' }}
      label={{
        style: {
          fill: '#aaa',
        },
      }}
    />,
    <Line
      key="chart2"
      data={data2}
      xField="name"
      yField={['pv', 'uv']}
      height={300}
      legend={{ position: 'top' }}
      label={{
        style: {
          fill: '#aaa',
        },
      }}
    />,
  ];

  const onFinish = (values) => {
    console.log('Received values:', values);
  };


  return (
    <Row gutter={[16, 16]}>
      <Col span={12}>
        <Card title="Charts">
          <Carousel arrows={true} nextArrow={<RightOutlined onClick={handleNext} />} prevArrow={<LeftOutlined onClick={handlePrev} />} >
            {charts}
          </Carousel>
        </Card>
      </Col>
      <Col span={12}>
        <Card title="Form">
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item name="analysis_name" label="分析名称" rules={[{ required: true, message: '请输入分析名称' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="analysis_description" label="分析内容" rules={[{ required: true, message: '请输入分析内容' }]}>
              <Input.TextArea autoSize={{ minRows: 4, maxRows: 6 }} />
            </Form.Item>
            <Divider />
            <Form.Item>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default Page;
