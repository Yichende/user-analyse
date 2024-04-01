import { Line } from '@antv/g2plot';
import { Breadcrumb, Button, Card, Form, Input, message, Modal, Select, Space } from 'antd';
import { useEffect, useRef, useState } from 'react';

const { Option } = Select;

const ChartForm = ({ visible, onCreate, onCancel, closeModal }) => {
  const [form] = Form.useForm();
  const [xAxis, setXAxis] = useState(null);
  const [yAxis, setYAxis] = useState(null);
  const [dataSource, setDataSource] = useState(null);
  const [step, setStep] = useState(1);
  const [modalTitle, setModalTitle] = useState('请选择数据源');
  const [formData, setFormData] = useState({});
  const [breadCrumbItems, setBreadCrumbItems] = useState({});

  // const handleCreate = () => {
  //   form
  //     .validateFields()
  //     .then((values) => {
  //       form.resetFields();
  //       console.log('data: ', { ...values, xAxis, yAxis });
  //       onCreate({ ...values, xAxis, yAxis });
  //     })
  //     .catch((err) => console.error('Validation failed:', err));
  // };
  const handleDataSourceChange = (value) => {
    setDataSource(value);
  };

  const handleXAxisChange = (value) => {
    setXAxis(value);
  };

  const handleYAxisChange = (value) => {
    setYAxis(value);
  };

  const handleNext = () => {
    if (step === 1) {
      // 此处可以添加表单验证逻辑
      form
        .validateFields()
        .then((values) => {
          console.log('vvvvvalues: ', values)
          let breadCrumb = '';
          switch (values.dataSource) {
            case 'visited_behavior':
              breadCrumb = '浏览行为表';
              break;
            case 'purchase_behavior':
              breadCrumb = '购买行为表';
              break;
            case 'search_behavior':
              breadCrumb = '搜索行为表';
              break;
            case 'comment_behavior':
              breadCrumb = '评论行为表';
              break;
            case 'interact_behavior':
              breadCrumb = '互动行为表';
              break;
          }
          setFormData({ ...formData, ...values });
          setBreadCrumbItems({ title: breadCrumb });
          setStep(2);
          setModalTitle('请完善以下内容');
        })
        .catch(() => {
          message.error('请填写表单内容');
        });
    } else {
      form
        .validateFields()
        .then((values) => {
          form.resetFields();
          console.log('data: ', { ...values, xAxis, yAxis });
          onCreate({ ...values, xAxis, yAxis });
          message.success('表单提交成功！');
          setStep(1);
          closeModal();
        })
        .catch((err) => console.error('Validation failed:', err));
      form.resetFields();
    }
  };

  const CancelButtonClick = () => {
    if (step === 1) {
      closeModal();
      setBreadCrumbItems({});
      form.resetFields();
    } else {
      setBreadCrumbItems({});
      setStep(1);
      setModalTitle('请选择数据源');
    }
  };

  const breadCrumbInStep2 = () => {
    let breadCrumb = '';
    switch (formData) {
      case 'visited_behavior':
        breadCrumb = '浏览行为表';
        break;
      case 'purchase_behavior':
        breadCrumb = '购买行为表';
        break;
      case 'search_behavior':
        breadCrumb = '搜索行为表';
        break;
      case 'comment_behavior':
        breadCrumb = '评论行为表';
        break;
      case 'interact_behavior':
        breadCrumb = '互动行为表';
        break;
    }
    return breadCrumb;
  };

  return (
    <Modal
      open={visible}
      title={modalTitle}
      okText="Create"
      onCancel={onCancel}
      // onOk={handleCreate}
      footer={[
        <Button key="back" onClick={CancelButtonClick}>
          {step === 1 ? '取消' : '上一步'}
        </Button>,
        <Button key="next" type="primary" onClick={handleNext}>
          {step === 1 ? '下一步' : '完成'}
        </Button>,
      ]}
    >
      {step === 1 ? (
        <Form form={form} layout="vertical" name="form_selectDataSource">
          <Form.Item name="dataSource" label="数据源" rules={[{ required: true }]}>
            <Select placeholder="请选择数据源" onChange={handleDataSourceChange}>
              <Option value="visited_behavior">浏览行为表</Option>
              <Option value="purchase_behavior">购买行为表</Option>
              <Option value="search_behavior">搜索行为表</Option>
              <Option value="comment_behavior">评论行为表</Option>
              <Option value="interact_behavior">互动行为表</Option>
            </Select>
          </Form.Item>
        </Form>
      ) : (
        <>
          <Breadcrumb style={{margin: '5px'}} separator=">" items={[breadCrumbItems, {title: ''}]} />
          <Form form={form} layout="vertical" name="form_in_modal">
            <Form.Item name="chartName" label="图表名称" rules={[{ required: true }]}>
              <Input placeholder="请填写图表名称" />
            </Form.Item>
            <Form.Item name="chartType" label="图表类型" rules={[{ required: true }]}>
              <Select placeholder="请选择图表类型" onChange={handleXAxisChange}>
                <Option value="visited_time">折线图</Option>
                <Option value="visited_target">柱状图</Option>
                <Option value="visited_target">饼图</Option>
              </Select>
            </Form.Item>
            <Form.Item name="xAxis" label="X轴数据" rules={[{ required: true }]}>
              <Select placeholder="请选择x轴数据" onChange={handleXAxisChange}>
                <Option value="visited_time">Visited Time</Option>
                <Option value="visited_target">Visited Target</Option>
              </Select>
            </Form.Item>
            <Form.Item name="yAxis" label="Y轴数据" rules={[{ required: true }]}>
              <Select placeholder="请选择y轴数据" onChange={handleYAxisChange}>
                <Option value="duration_minutes">Duration (minutes)</Option>
              </Select>
            </Form.Item>
          </Form>
        </>
      )}
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
