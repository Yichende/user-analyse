import { addAnalysis } from '@/services/AnalysisService';
import { getChartsByChartId } from '@/services/ChartService';
import { getCurrentUser } from '@/services/UserService';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { history, useSearchParams } from '@umijs/max';
import {
  Button,
  Card,
  Carousel,
  Col,
  Divider,
  Empty,
  Form,
  Input,
  message,
  Modal,
  Row,
} from 'antd';
import { useEffect, useState } from 'react';
import ChartComponent from '../component/ChartComponent';

const AnalysisDetail = ({ initAnalysisInfo, open, onOk, onCancel }) => {
  const [currentChart, setCurrentChart] = useState(0);
  const [currentCards, setCurrentCards] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(0);

  const [testId, setTestId] = useState(initAnalysisInfo);

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
      chart_id: initAnalysisInfo.chart_id,
    };
    console.log('analysisInfo: ', analysisInfo);
    await addAnalysis(analysisInfo);
    message.success('提交成功');
  };

  const [form] = Form.useForm();

  // const initChartInfo = async () => {
  //   getCurrentUser().then((userInfo) => {
  //     setCurrentUserId(userInfo.userId);
  //   });
  //   if (chartId !== null) {
  //     const chartInfo = await getChartsByChartId(chartId);
  //     setCurrentCards(chartInfo.chartInfo);
  //     // console.log('chartInfo', chartInfo.chartInfo);
  //   } else {
  //     console.log('chartId is null');
  //   }
  //   form.setFieldsValue({
  //     analysis_name: initAnalysisInfo.analysis_name,
  //     analysis_description: initAnalysisInfo.analysis_description,
  //   });
  // };

  const initChartInfo = async () => {
    try {
      const userInfo = await getCurrentUser();
      setCurrentUserId(userInfo.userId);

      if (initAnalysisInfo.chart_id !== null && typeof initAnalysisInfo.chart_id !== 'undefined') {
        const chartInfo = await getChartsByChartId(initAnalysisInfo.chart_id);
        setCurrentCards(chartInfo.chartInfo);
      } else {
        console.log('chartId is null');
      }

      form.setFieldsValue({
        analysis_name: initAnalysisInfo.analysis_name,
        analysis_description: initAnalysisInfo.analysis_description,
      });
    } catch (error) {
      console.error('Error initializing chart info:', error);
    }
  };

  const toAddChart = () => {
    history.push({
      pathname: `/data/chart`,
    });
  };

  useEffect(() => {
    if (initAnalysisInfo.chart_id) {
      initChartInfo();
    }
  }, [initAnalysisInfo.chart_id]);

  const test = async () => {
    console.log('initAnalysisInfo: ', initAnalysisInfo);
    console.log('open: ', open);
    console.log('test: ', testId);
    // initChartInfo();
  };

  return (
    <Modal width="80%" title="分析详情" open={open} onOk={onOk} onCancel={onCancel}>
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
            {!initAnalysisInfo.chart_id && (
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
        <Button onClick={test}>Test</Button>
      </Row>
    </Modal>
  );
};

export default AnalysisDetail;
