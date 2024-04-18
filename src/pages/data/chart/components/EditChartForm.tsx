import { updatedChartById } from '@/services/ChartService';
import { Breadcrumb, Button, Form, Input, message, Modal, Select } from 'antd';
import { useEffect, useState } from 'react';

const { Option } = Select;

const EditChartForm = ({ visible, onCancel, cardInfo, form, initChartInfo }) => {
  // const [form] = Form.useForm();
  const [xAxis, setXAxis] = useState({ value: '' });
  const [yAxis, setYAxis] = useState({ value: '' });
  const [dataSource, setDataSource] = useState(null);
  const [step, setStep] = useState(1);
  const [modalTitle, setModalTitle] = useState('编辑图表');
  const [formData, setFormData] = useState({});
  const [chartType, setChartType] = useState(null);
  const [isChanged, setIsChanged] = useState(false);

  const options = [
    { value: 'visited_time', label: '访问时间' },
    { value: 'visited_target', label: '访问对象' },
    { value: 'duration_minutes', label: '停留时间(分钟)' },
  ];
  let selectedOptions = [xAxis.value, yAxis.value];
  const filteredOptions = options.filter((o) => {
    return !selectedOptions.includes(o.value);
  });

  const handleXAxisChange = (value) => {
    setXAxis(value);
    setIsChanged(true);
  };

  const handleYAxisChange = (value) => {
    setYAxis(value);
    setIsChanged(true);
  };

  const handleChartTypeChange = (value) => {
    setChartType(value);
    setIsChanged(true);
  };

  const handleChartNameChange = () => {
    setIsChanged(true);
  };

  const setBreadCrumb = () => {
    let breadCrumb = '';
    // 判断所选数据源
    switch (cardInfo.data_table_name) {
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

  const handleNext = () => {
    if (!isChanged) {
      message.warning('图表内容未变动');
    } else {
      form
        .validateFields()
        .then(async (values) => {
          form.resetFields(); // 重置表单
          // 将表单内容传回父组件后提交至后端
          const chartInfo = {
            chart_id: cardInfo.chart_id,
            chart_type: values.chartType,
            chart_name: values.chartName,
            chart_config: {
              xField: values.xAxis,
              yField: values.yAxis,
            },
          };
          await updatedChartById(chartInfo);
          console.log('chartInfo in next: ', chartInfo);
          message.success('表单提交成功！');
          setXAxis({ value: '' });
          setYAxis({ value: '' });
          initChartInfo();
          onCancel();
          setIsChanged(false)
        })
        .catch((err) => {
          message.error('请完善表单');
        });
    }
  };

  const CancelButtonClick = () => {
    onCancel();
    setXAxis({ value: '' });
    setYAxis({ value: '' });
    setDataSource(null);
    setChartType(null);
    setIsChanged(false);
    form.resetFields();
  };

  const handleTest = async () => {
    console.log('cardInfo: ', cardInfo);
  };

  useEffect(() => {}, []);

  return (
    <Modal
      open={visible}
      title={modalTitle}
      okText="Create"
      onCancel={onCancel}
      // onOk={handleCreate}
      footer={[
        <Button key="back" onClick={CancelButtonClick}>
          取消
        </Button>,
        <Button key="next" type="primary" onClick={handleNext}>
          完成
        </Button>,
        // <Button key="test" type="primary" onClick={handleTest}>
        //   测试
        // </Button>,
      ]}
    >
      <>
        <Breadcrumb
          style={{ margin: '5px' }}
          separator=">"
          items={[{ title: setBreadCrumb() }, { title: '图表配置' }]}
        />
        <Form form={form} layout="vertical" name="form_in_modal">
          <Form.Item name="chartName" label="图表名称" rules={[{ required: true }]}>
            <Input placeholder="请填写图表名称" onChange={handleChartNameChange} />
          </Form.Item>
          <Form.Item name="chartType" label="图表类型" rules={[{ required: true }]}>
            <Select placeholder="请选择图表类型" onChange={handleChartTypeChange}>
              <Option value="Line">折线图</Option>
              <Option value="Column">柱状图</Option>
              <Option value="Scatter">散点图</Option>
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
    </Modal>
  );
};

export default EditChartForm;
