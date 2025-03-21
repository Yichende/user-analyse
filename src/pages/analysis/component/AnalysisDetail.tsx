import { getChartsByChartId } from '@/services/ChartService';
import { getCurrentUser } from '@/services/UserService';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
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
import { updateAnalysisById } from '@/services/AnalysisService';

const AnalysisDetail = ({ initAnalysisInfo, open, onOk, onCancel, componentDisabled, loadAnalysisInfo }) => {
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

  const [form] = Form.useForm();

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

  const onFinish = async (values) => {
    const analysisInfo = {
      analysis_id: initAnalysisInfo.analysis_id,
      analysis_name: values.analysis_name,
      analysis_description: values.analysis_description,
    };
    const res = await updateAnalysisById(analysisInfo)
    console.log('res: ', res)
    await loadAnalysisInfo();
    message.success('更改成功');
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
  };

  return (
    <Modal
      width="80%"
      title="分析详情"
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      footer={
        <Button key="back" onClick={onCancel}>
          返回
        </Button>
      }
    >
      <Row gutter={[16, 16]}>
        <Col span={14}>
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
              <Card title="图表-暂无数据">
                <Empty />
              </Card>
            )}
          </Carousel>
        </Col>
        <Col span={10}>
          <Card title="分析">
            <Form form={form} disabled={componentDisabled} layout="vertical" onFinish={onFinish}>
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
                  更改
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        {/* <Button onClick={test}>Test</Button> */}
      </Row>
    </Modal>
  );
};

export default AnalysisDetail;
