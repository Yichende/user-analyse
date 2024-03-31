import { Button, Card, Form, Input, Modal, Select, Space } from 'antd';
import { useState } from 'react';
import { Line } from '@antv/g2plot';
import { useEffect, useRef } from 'react';

const { Option } = Select;

const ChartForm = ({ visible, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  const [xAxis, setXAxis] = useState(null);
  const [yAxis, setYAxis] = useState(null);

  const handleCreate = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        console.log('data: ', { ...values, xAxis, yAxis });
        onCreate({ ...values, xAxis, yAxis });
      })
      .catch((err) => console.error('Validation failed:', err));
  };

  const handleXAxisChange = (value) => {
    setXAxis(value);
  };

  const handleYAxisChange = (value) => {
    setYAxis(value);
  };

  return (
    <Modal
      open={visible}
      title="Create Chart"
      okText="Create"
      onCancel={onCancel}
      onOk={handleCreate}
    >
      <Form form={form} layout="vertical" name="form_in_modal">
        <Form.Item name="chartName" label="Chart Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="xAxis" label="X Axis" rules={[{ required: true }]}>
          <Select onChange={handleXAxisChange}>
            <Option value="visited_time">Visited Time</Option>
            <Option value="visited_target">Visited Target</Option>
            {/* Add more options as needed */}
          </Select>
        </Form.Item>
        <Form.Item name="yAxis" label="Y Axis" rules={[{ required: true }]}>
          <Select onChange={handleYAxisChange}>
            <Option value="duration_minutes">Duration (minutes)</Option>
            {/* Add more options as needed */}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const ChartComponent = ({ chartData }) => {
  const chartContainer = useRef(null);
  // ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  // const data = [
  //   { visited_time: 'Jan', duration_minutes: 20 },
  //   { visited_time: 'Feb', duration_minutes: 30 },
  //   { visited_time: 'Mar', duration_minutes: 25 },
  //   { visited_time: 'Apr', duration_minutes: 40 },
  //   { visited_time: 'May', duration_minutes: 34 },
  //   { visited_time: 'Jun', duration_minutes: 50 },
  // ];

  // const config = {
  //   data: data,
  //   height: 400,
  //   autoFit: true,
  //   smooth: true,
  // };
  useEffect(() => {
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

  // return <Line data={data} title={chartData.chartName} yField={chartData.yAxis} xField={chartData.xAxis} />;
  // return <TinyLine {...config} />;
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

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        New Chart
      </Button>
      <ChartForm visible={visible} onCreate={handleCreate} onCancel={handleCancel} />
      {chartData && <ChartComponent chartData={chartData} />}
    </div>
  );
};

export default ChartPage;
