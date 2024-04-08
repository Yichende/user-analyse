import { queryVisitedBehavior } from '@/services/BehaviorService';
import { getAllChart } from '@/services/ChartService';
import { Line } from '@antv/g2plot';
import { Button, Card, Pagination, Space } from 'antd';
import { useEffect, useRef, useState } from 'react';
import ChartForm from './components/ChartForm';

const ChartComponent = ({ chartData }) => {
  const chartContainer = useRef(null);
  const getData = async () => {
    return await queryVisitedBehavior();
  };

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
    // const data =  queryVisitedBehavior();

    const linePlot = new Line(chartContainer.current, {
      data,
      xField: 'visited_target',
      yField: 'duration_minutes',
    });

    linePlot.render();
    console.log('data: ', data);
  }

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
  const [visitedBehavior, setVisitedBehavior] = useState([]);
  const [chartInfo, setChartInfo] = useState([])

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

  // const  test = chartInfo[0]["chart_name"];
  const handleTest = async () => {
    const res = await getAllChart();
    // const visitData = await queryVisitedBehavior();
    // // console.log('res: ', JSON.parse(res.chartInfo[0].chart_config)["xField"])
    console.log('res: ', res.chartInfo)
    setChartInfo(res.chartInfo)

    console.log('visitData', visitedBehavior.data);
    setVisitedBehavior(visitedBehavior.data)

    // console.log('dfafd: ', test)
  };

  // const chartInfo = [
  //   { title: 'Card 1', content: 'Content of Card 1' },
  //   { title: 'Card 2', content: 'Content of Card 2' },
  //   { title: 'Card 3', content: 'Content of Card 3' },
  //   { title: 'Card 4', content: 'Content of Card 4' },
  //   { title: 'Card 5', content: 'Content of Card 5' },
  //   { title: 'Card 6', content: 'Content of Card 6' },
  //   { title: 'Card 7', content: 'Content of Card 7' },
  //   { title: 'Card 8', content: 'Content of Card 8' },
  //   // 添加更多卡片数据...
  // ];

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
    const visitedData = await queryVisitedBehavior();
    setVisitedBehavior(visitedData);
  };

  useEffect(() => {
    initChartData();
  },[]);

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
      {chartData && <ChartComponent chartData={chartData} />}
      <div>
        {/* 显示当前页的卡片 */}
        {currentCards.map((card, index) => (
          <Card key={index} title={card.chart_name}>
            <p>{card.chart_config}</p>
          </Card>
        ))}

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
