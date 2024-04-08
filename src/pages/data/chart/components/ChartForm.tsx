import { addNewChart } from '@/services/ChartService';
import { getCurrentUser } from '@/services/UserService';
import { Breadcrumb, Button, Form, Input, message, Modal, Select } from 'antd';
import { useEffect, useState, useMemo } from 'react';

const { Option } = Select;

const ChartForm = ({ visible, onCreate, onCancel, closeModal }) => {
  const [form] = Form.useForm();
  const [xAxis, setXAxis] = useState({ value: '' });
  const [yAxis, setYAxis] = useState({ value: '' });
  const [dataSource, setDataSource] = useState(null);
  const [step, setStep] = useState(1);
  const [modalTitle, setModalTitle] = useState('请选择数据源');
  const [formData, setFormData] = useState({});
  const [breadCrumbItems, setBreadCrumbItems] = useState({});
  const [chartType, setChartType] = useState(null);
  const [currentUserId, setCurrentUserId] = useState();

  const options = [
    { value: 'visited_time', label: '访问时间' },
    { value: 'visited_target', label: '访问对象' },
    { value: 'duration_minutes', label: '停留时间(分钟)' },
  ];
  let selectedOptions = [xAxis.value, yAxis.value];
  const filteredOptions = options.filter((o) => {
    return !selectedOptions.includes(o.value);
  });

  const handleDataSourceChange = (value) => {
    setDataSource(value);
  };

  const handleXAxisChange = (value) => {
    setXAxis(value);
  };

  const handleYAxisChange = (value) => {
    setYAxis(value);
  };

  const handleChartTypeChange = (value) => {
    setChartType(value);
  };

  const handleNext = () => {
    if (step === 1) {
      // 此处可以添加表单验证逻辑
      form
        .validateFields()
        .then((values) => {
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
          console.log('FormINFO: ', form.getFieldsValue());
          form.resetFields();
          console.log('data: ', { ...values, xAxis, yAxis });
          onCreate({ ...values, xAxis, yAxis });
          message.success('表单提交成功！');
          setStep(1);
          setXAxis({ value: '' });
          setYAxis({ value: '' });
          form.resetFields();
          closeModal();
        })
        .catch((err) => {
          // console.error('Validation failed:', err);
          message.error('请完善表单');
        });
    }
  };

  const CancelButtonClick = () => {
    if (step === 1) {
      closeModal();
      setBreadCrumbItems({});
      setXAxis({ value: '' });
      setYAxis({ value: '' });
      setDataSource(null);
      setChartType(null);
      form.resetFields();
    } else {
      setBreadCrumbItems({});
      setStep(1);
      setModalTitle('请选择数据源');
    }
  };

  const handleTest = async () => {
    console.log('TESTTT: ', form.getFieldsValue());
    const data = form.getFieldsValue();
    const value = {
      chart_type: data.chartType,
      chart_name: data.chartName,
      data_table_name: dataSource,
      chart_config: {
        xField: data.xAxis.value,
        yField: data.yAxis.value,
      },
      create_user_id: currentUserId,
    };

    setFormData({ ...value });
    console.log('Formdataaa: ', formData);
    // await addNewChart(formData);
    // setTimeout(async () => {
    //   await addNewChart(formData);
    // }, 1000);
    // setTimeout(() => {
    //   setFormData({});
    // }, 1000);
  };

  const sendChartData = async () => {
    // console.log('send')
    await addNewChart(formData);
    // console.log('after send', formData)
  }

  useEffect(() => {
    getCurrentUser().then((userInfo) => {
      // console.log('userInfo: ', userInfo.userId)
      setCurrentUserId(userInfo.userId);
    });
  }, []);

  useMemo(() => {
    console.log('Formdata in memo: ', formData);
    if (Object.entries(formData).length !== 0 ) {
      console.log('sendChartData')
      // sendChartData()
    }
  }, [formData])

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
        <Button key="test" type="primary" onClick={handleTest}>
          测试
        </Button>,
      ]}
    >
      {step === 1 ? (
        <Form form={form} layout="vertical" name="form_selectDataSource">
          <Form.Item name="dataSource" label="数据源" rules={[{ required: true }]}>
            <Select value={dataSource} placeholder="请选择数据源" onChange={handleDataSourceChange}>
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
          <Breadcrumb
            style={{ margin: '5px' }}
            separator=">"
            items={[breadCrumbItems, { title: '' }]}
          />
          <Form form={form} layout="vertical" name="form_in_modal">
            <Form.Item name="chartName" label="图表名称" rules={[{ required: true }]}>
              <Input placeholder="请填写图表名称" />
            </Form.Item>
            <Form.Item name="chartType" label="图表类型" rules={[{ required: true }]}>
              <Select placeholder="请选择图表类型" onChange={handleChartTypeChange}>
                <Option value="Line">折线图</Option>
                <Option value="Column">柱状图</Option>
                <Option value="Pie">饼图</Option>
              </Select>
            </Form.Item>
            <Form.Item name="xAxis" label="X轴数据" rules={[{ required: true }]}>
              <Select labelInValue placeholder="请选择x轴数据" onChange={handleXAxisChange}>
                {filteredOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="yAxis" label="Y轴数据" rules={[{ required: true }]}>
              <Select labelInValue placeholder="请选择y轴数据" onChange={handleYAxisChange}>
                {filteredOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </>
      )}
    </Modal>
  );
};

export default ChartForm;
