import { addNewChart, getAllChart } from '@/services/ChartService';
import { Button, Pagination } from 'antd';
import { useEffect, useState } from 'react';
import ChartComponent from './components/ChartComponent';
import ChartForm from './components/ChartForm';

const ChartPage = () => {
  const [visible, setVisible] = useState(false);
  // const [chartData, setChartData] = useState(null);
  const [chartInfo, setChartInfo] = useState([]);
  const [currentCards, setCurrentCards] = useState([]);

  // 当前页码
  const [currentPage, setCurrentPage] = useState(1);

  // 每页显示的卡片数量
  const cardsPerPage = 3;

  // 计算当前页要显示的卡片范围
  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;

  // 处理页码变化的回调函数
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // 计算当前页要显示的卡片范围
    const startIndex = (page - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;
    setCurrentCards(chartInfo.slice(startIndex, endIndex));
    // console.log('pageInfo: ', currentCards, page);
  };

  const initChartData = async () => {
    const chart = await getAllChart();
    const chartInfo = chart.chartInfo;
    // 更改显示顺序
    chartInfo.sort((a, b) => new Date(b.last_updated) - new Date(a.last_updated));
    setChartInfo(chartInfo);
    setCurrentCards(chartInfo.slice(startIndex, endIndex));
  };

  // 填完表单后发送请求给后端拿数据
  const handleCreate = async (values) => {
    setVisible(false);
    const chartInfo = {
      chart_type: values.chartType,
      chart_name: values.chartName,
      chart_config: {
        xField: values.xAxis.value,
        yField: values.yAxis.value,
      },
      data_table_name: values.data_table_name,
      create_user_id: values.create_user_id,
    }
    // console.log('chartINfo: ', chartInfo)  
    await addNewChart(chartInfo);
    await initChartData();
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

  const handleTest = async () => {
    // const visitedData = await queryVisitedBehavior();
    // console.log('VIsitedData: ', visitedData);
    console.log('chartInfo: ', chartInfo);
  };

  useEffect(() => {
    initChartData();
  }, []);

  return (
    <div>
      {/* <Button type="primary" onClick={showModal}>
        New Chart
      </Button> */}
      {/* <Button key="test" type="primary" onClick={handleTest}>
        测试
      </Button> */}
      <ChartForm
        visible={visible}
        onCreate={handleCreate}
        onCancel={handleCancel}
        closeModal={closeModal}
      />
      <div>
        <ChartComponent showModal={showModal} initChartInfo={initChartData} currentCards={currentCards} />
        {/* 分页器组件 */}
        <Pagination
          style={{ marginTop: '20px', textAlign: 'center' }}
          current={currentPage}
          pageSize={cardsPerPage}
          total={chartInfo.length}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default ChartPage;
