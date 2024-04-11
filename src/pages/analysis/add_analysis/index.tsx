import { getChartsByChartId } from '@/services/ChartService';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useSearchParams } from '@umijs/max';
import { Button, Card, Carousel, Col, Divider, Empty, Form, Input, Row } from 'antd';
import { useEffect, useState } from 'react';
import ChartComponent from '../component/ChartComponent';

const AddAnalysisPage = () => {
  const [currentChart, setCurrentChart] = useState(0);
  const [params] = useSearchParams();
  const [currentCards, setCurrentCards] = useState([]);
  const [chartId, setChartId] = useState(null);

  const selectChartId = params?.get('chartId');

  const handleNext = () => {
    setCurrentChart((prev) => (prev + 1) % 2);
  };

  const handlePrev = () => {
    setCurrentChart((prev) => (prev - 1 + 2) % 2);
  };

  const onFinish = (values) => {
    console.log('Received values:', values);
  };
  const test = async () => {
    const id = params?.get('chartId');
    console.log('ChartID: ', id);
    if (id !== null) {
      const res = await getChartsByChartId(id);
      console.log('res: ', res);
    }
  };

  const initChartInfo = async () => {
    const id = params?.get('chartId');
    setChartId(id);
    if (id !== null || chartId !== null) {
      const chartInfo = await getChartsByChartId(id);
      setCurrentCards(chartInfo.chartInfo);
      console.log('chartInfo', chartInfo.chartInfo);
    } else {
      console.log('chartId is null')
    }
  };

  useEffect(() => {
    initChartInfo();
  }, []);

  return (
    <Row gutter={[16, 16]}>
      <Col span={12}>
        <Carousel
          arrows={true}
          nextArrow={<RightOutlined onClick={handleNext} />}
          prevArrow={<LeftOutlined onClick={handlePrev} />}
        >
          {/* {currentCards.map((card, index) => (
            <div key={index}>{chartId !== null ? <ChartComponent card={card} /> : <Empty />}</div>
          ))} */}
          <Card title='暂无数据'><Empty /></Card>
        </Carousel>
      </Col>
      <Col span={12}>
        <Card title="Form">
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="analysis_name"
              label="分析名称"
              rules={[{ required: true, message: '请输入分析名称' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="analysis_description"
              label="分析内容"
              rules={[{ required: true, message: '请输入分析内容' }]}
            >
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
      <Button onClick={test}>Test</Button>
    </Row>
  );
};

export default AddAnalysisPage;
