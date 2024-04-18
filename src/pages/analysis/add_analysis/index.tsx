import { addAnalysis } from '@/services/AnalysisService';
import { getChartsByChartId } from '@/services/ChartService';
import { getCurrentUser } from '@/services/UserService';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { history, useSearchParams } from '@umijs/max';
import { Button, Card, Carousel, Col, Divider, Empty, Form, Input, message, Row } from 'antd';
import { useEffect, useState } from 'react';
import ChartComponent from '../component/ChartComponent';

const AddAnalysisPage = () => {
  const [currentChart, setCurrentChart] = useState(0);
  const [params] = useSearchParams();
  const [currentCards, setCurrentCards] = useState([]);
  const [chartId, setChartId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(0);

  const [form] = Form.useForm();

  const handleNext = () => {
    setCurrentChart((prev) => (prev + 1) % 2);
  };

  const handlePrev = () => {
    setCurrentChart((prev) => (prev - 1 + 2) % 2);
  };

  const onFinish = async (values) => {
    console.log('Received values:', values);
    const analysisInfo = {
      analysis_name: values.analysis_name,
      analysis_description: values.analysis_description,
      create_user_id: currentUserId,
      chart_id: chartId,
    };
    console.log('analysisInfo: ', analysisInfo);
    await addAnalysis(analysisInfo);
    message.success('提交成功');
    history.replace({
      pathname: `/analysis/analysis_add`,
    });
    form.resetFields();
    setChartId(null);
    setCurrentCards([])
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
    getCurrentUser().then((userInfo) => {
      setCurrentUserId(userInfo.userId);
    });
    const id = params?.get('chartId');
    setChartId(id);
    if (id !== null || chartId !== null) {
      const chartInfo = await getChartsByChartId(id);
      setCurrentCards(chartInfo.chartInfo);
      console.log('chartInfo', chartInfo.chartInfo);
    } else {
      console.log('chartId is null');
    }
  };

  const toAddChart = () => {
    history.push({
      pathname: `/data/chart`,
    });
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
          {currentCards.map((card, index) => (
            <div key={index}>
              <ChartComponent card={card} />
            </div>
          ))}
          {!chartId && (
            <Card
              title="图表-暂无数据"
              extra={
                <a href="#" onClick={toAddChart}>
                  添加图表
                </a>
              }
            >
              <Empty />
            </Card>
          )}
        </Carousel>
      </Col>
      <Col span={12}>
        <Card title="分析">
          <Form form={form} layout="vertical" onFinish={onFinish}>
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
      {/* <Button onClick={test}>Test</Button> */}
    </Row>
  );
};

export default AddAnalysisPage;
