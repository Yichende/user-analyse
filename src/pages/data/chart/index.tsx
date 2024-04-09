import { queryVisitedBehavior } from '@/services/BehaviorService';
import { getAllChart } from '@/services/ChartService';
import { Button, Pagination } from 'antd';
import { useEffect, useState } from 'react';
import ChartComponent from './components/ChartComponent';
import ChartForm from './components/ChartForm';

const ChartPage = () => {
  const [visible, setVisible] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [visitedBehavior, setVisitedBehavior] = useState([]);
  const [chartInfo, setChartInfo] = useState([]);

  // 填完表单后发送请求给后端拿数据
  const handleCreate = (values) => {
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

  const handleTest = async () => {
    const visitedData = await queryVisitedBehavior();
    console.log('VIsitedData: ', visitedData)
    console.log('chartInfo: ', chartInfo);

    console.log('visitedBehavior: ', visitedBehavior);
  };

  // 当前页码
  const [currentPage, setCurrentPage] = useState(1);

  // 每页显示的卡片数量
  const cardsPerPage = 6;

  // 计算当前页要显示的卡片范围
  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;

  // 根据当前页码获取对应的卡片数据
  const currentCards = chartInfo.slice(startIndex, endIndex);

  // 处理页码变化的回调函数
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const initChartData = async () => {
    const chartInfo = await getAllChart();
    setChartInfo(chartInfo.chartInfo);
    // const visitedData = await queryVisitedBehavior();
    // setVisitedBehavior(visitedData.data);
  };

  useEffect(() => {
    initChartData();
  }, []);

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        New Chart
      </Button>
      <Button key="test" type="primary" onClick={handleTest}>
        测试
      </Button>
      <ChartForm
        visible={visible}
        onCreate={handleCreate}
        onCancel={handleCancel}
        closeModal={closeModal}
      />
      <div>
        {/* 显示当前页的卡片 */}
        {/* {currentCards.map((card, index) => (
          <Card key={index} title={card.chart_name}>
            <p>{card.chart_config}</p>
          </Card>
        ))} */}

        <ChartComponent currentCards={currentCards} />

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
