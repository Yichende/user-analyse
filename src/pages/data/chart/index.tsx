import { Line } from '@antv/g2plot';
import { Breadcrumb, Button, Card, Form, Input, message, Modal, Select, Space } from 'antd';
import { useEffect, useRef, useState } from 'react';
import ChartForm from './components/ChartForm'

const ChartComponent = ({ chartData }) => {
  const chartContainer = useRef(null);
  useEffect(() => {
    // 渲染图表
    if (chartContainer.current) {
      const data = [
        { year: '1991', value: 3 },
        { year: '1992', value: 4 },
        { year: '1993', value: 3.5 },
        { year: '1994', value: 5 },
        { year: '1995', value: 4.9 },
        { year: '1996', value: 6 },
        { year: '1997', value: 7 },
        { year: '1998', value: 9 },
        { year: '1999', value: 13 },
      ];

      const linePlot = new Line(chartContainer.current, {
        data,
        xField: 'year',
        yField: 'value',
      });

      linePlot.render();
    }
  }, []);

  console.log('data in ChartComponent chartData: ', chartData);
  
  return (
    <Space direction="vertical" size={16}>
      <Card title="折线图示例" extra={<a href="#">More</a>} style={{ width: 300 }}>
        <div ref={chartContainer} style={{ width: '100%', height: '200px' }} />
      </Card>
    </Space>
  );
};

const ChartPage = () => {
  const [visible, setVisible] = useState(false);
  const [chartData, setChartData] = useState(null);

  // 填完表单后发送请求给后端拿数据
  const handleCreate = (values) => {
    console.log('valuse in handleCreate: ', values);
    const dummyData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      data: [20, 30, 25, 40, 35, 50],
      chartName: values.chartName,
      xAxis: values.xAxis,
      yAxis: values.yAxis,
    };

    setChartData(dummyData);
    setVisible(false);
  };

  const showModal = () => {
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        New Chart
      </Button>
      <ChartForm
        visible={visible}
        onCreate={handleCreate}
        onCancel={handleCancel}
        closeModal={closeModal}
      />
      {chartData && <ChartComponent chartData={chartData} />}
    </div>
  );
};

export default ChartPage;
