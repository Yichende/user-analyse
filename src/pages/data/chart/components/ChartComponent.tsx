import { queryVisitedBehavior } from '@/services/BehaviorService';
import { Column, Line, Pie } from '@ant-design/plots';
import { Card } from 'antd';
import { useEffect, useState } from 'react';

const ChartComponent = ({ currentCards }) => {
  const [visitedBehavior, setVisitedBehavior] = useState([]);

  console.log('someInfo: ', currentCards);
  let ChartToRender;

  // 根据图表类型选择相应的图表组件
  switch (currentCards.chart_type) {
    case 'Line':
      ChartToRender = Line;
      break;
    case 'Column':
      ChartToRender = Column;
      break;
    case 'Pie':
      ChartToRender = Pie;
      break;
    default:
      ChartToRender = Column; // 默认为折线图
  }

  // 时间格式
  const formattedArray = (value: any) => {
    // const id = value.behavior_id;
    const newArr = value.map(function (arr) {
      const date = new Date(arr.visited_time);
      const formattedDate =
        date.getFullYear() +
        '-' +
        ('0' + (date.getMonth() + 1)).slice(-2) +
        '-' +
        ('0' + date.getDate()).slice(-2);
      // ' ' +
      // ('0' + date.getHours()).slice(-2);
      // ':' +
      // ('0' + date.getMinutes()).slice(-2) +
      // ':' +
      // ('0' + date.getSeconds()).slice(-2);
      return {
        ...arr,
        visited_time: formattedDate,
      };
    });
    return newArr;
  };

  // 对数据进行聚合操作，计算每个 visited_target 的平均访问时长
  // const aggregatedData = (data) => {
  //   const reduceData = data.reduce((acc, cur) => {
  //     if (!acc[cur.visited_target]) {
  //       acc[cur.visited_target] = {
  //         visited_target: cur.visited_target,
  //         total_duration_min: 0,
  //         count: 0,
  //       };
  //     }

  //     acc[cur.visited_target].total_duration_min += cur.duration_minutes;
  //     acc[cur.visited_target].count++;
  //     return acc;
  //   }, [])

  //   reduceData.forEach(item => {
  //     item.avg_duration_min = (item.total_duration_min / item.count).toFixed(2);
  //   });
  //   return reduceData;
  // };

  const aggregatedData = (data) => {
    const reduceData = data.reduce((acc, cur) => {
      const existingItem = acc.find((item) => item.visited_target === cur.visited_target);
      if (existingItem) {
        existingItem.count++;
        existingItem.total_duration_minutes += cur.duration_minutes;
      } else {
        acc.push({
          visited_target: cur.visited_target,
          count: 1,
          total_duration_minutes: cur.duration_minutes,
        });
      }
      return acc;
    }, []);

    // 计算平均值
    reduceData.forEach((item) => {
      item.duration_minutes = Math.round((item.total_duration_minutes / item.count) * 100)/100;
      // item.visited_time = new Date(item.visited_time)
    });

    // reduceData.sort((a, b) => a.visited_time - b.visited_time)

    // 时间排序


    return reduceData;
  };

  // 若x轴为访问时间，y轴为停留时间，计算某一访问日期的平均停留时间
  const time_duration = () => {

  }

  // 若x轴为访问时间，y轴为访问对象，散点图
  // const time_target = () => {
  }

  // 若x轴为访问对象，y轴为停留时间，计算某一对象的平均停留时间
  const target_duration = () => {

  }

  const initChartData = async () => {
    const visitedData = await queryVisitedBehavior();
    const visitedDataFormat = await formattedArray(visitedData.data);
    console.log('visitedDataFormat: ', visitedDataFormat);
    const visitedDataReduce = await aggregatedData(visitedDataFormat);
    console.log('visitedDataReduce: ', visitedDataReduce);
    setVisitedBehavior(visitedDataReduce);
  };

  useEffect(() => {
    console.log('EEEFFFECT  ');
    initChartData();
  }, []);

  return (
    <>
      {currentCards.map((card, index) => (
        <Card key={index} title={card.chart_name} style={{ width: 600, marginTop: 30 }}>
          <ChartToRender
            data={visitedBehavior} // 填入你的数据数组
            xField={JSON.parse(card.chart_config)['xField']}
            yField={JSON.parse(card.chart_config)['yField']}
            height={400}
          />
          <p>Chart Type: {card.chart_type}</p>
          <p>Last Updated: {card.last_updated}</p>
          <p>XX: {JSON.parse(card.chart_config)['xField']}</p>
          <p>YY: {JSON.parse(card.chart_config)['yField']}</p>
        </Card>
      ))}
    </>
  );
};

export default ChartComponent;
