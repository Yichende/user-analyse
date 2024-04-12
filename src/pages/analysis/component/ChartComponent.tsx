import { queryVisitedBehavior } from '@/services/BehaviorService';
import { Column, Line, Scatter } from '@ant-design/plots';
import { Card } from 'antd';
import { useEffect, useState } from 'react';
import { history } from '@umijs/max';

const ChartComponent = ({ card }) => {
  const [target_duration_visitedBehavior, setTarget_duration_visitedBehavior] = useState([]);
  const [time_duration_visitedBehavior, setTime_duration_visitedBehavior] = useState([]);
  const [time_target_visitedBehavior, setTime_target_visitedBehavior] = useState([]);

  const { chart_type, chart_name, chart_config } = card;

  // 时间格式 年月日
  const formattedArray = (value: any) => {
    value.sort((a, b) => new Date(a.visited_time) - new Date(b.visited_time));
    const newArr = value.map(function (arr) {
      // console.log("arr: ", arr)
      const date = new Date(arr.visited_time);
      const formattedDate =
        date.getFullYear() +
        '-' +
        ('0' + (date.getMonth() + 1)).slice(-2) +
        '-' +
        ('0' + date.getDate()).slice(-2);
      return {
        ...arr,
        visited_time: formattedDate,
      };
    });
    return newArr;
  };

  // 计算每个访问对象的平均停留时间
  const aggregatedDurationDataForTarget = (data) => {
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
      item.duration_minutes = Math.round((item.total_duration_minutes / item.count) * 100) / 100;
    });

    return reduceData;
  };

  // 计算每个访问日期的平均停留时间
  const aggregatedDurationDataForDate = (data) => {
    const reduceData = data.reduce((acc, cur) => {
      const existingItem = acc.find((item) => item.visited_time === cur.visited_time);
      if (existingItem) {
        existingItem.count++;
        existingItem.total_duration_minutes += cur.duration_minutes;
      } else {
        acc.push({
          visited_time: cur.visited_time,
          count: 1,
          total_duration_minutes: cur.duration_minutes,
        });
      }
      return acc;
    }, []);

    // 计算平均值
    reduceData.forEach((item) => {
      item.duration_minutes = Math.round((item.total_duration_minutes / item.count) * 100) / 100;
    });
    return reduceData;
  };

  // 若x轴为访问时间，y轴为停留时间，计算某一访问日期的平均停留时间
  const time_duration = async (data) => {
    const visitedDataFormat = await formattedArray(data);
    // console.log('visitedDataFormat: ', visitedDataFormat);
    const visitedDataReduce = await aggregatedDurationDataForDate(visitedDataFormat);
    // console.log('visitedDataReduce: ', visitedDataReduce);
    setTime_duration_visitedBehavior(visitedDataReduce);
  };

  // 若x轴为访问时间，y轴为访问对象，散点图
  const time_target = async (data) => {
    const visitedDataFormat = await formattedArray(data);
    // console.log('visitedDataFormat: ', visitedDataFormat);
    setTime_target_visitedBehavior(visitedDataFormat);
  };

  // 若x轴为访问对象，y轴为停留时间，计算某一对象的平均停留时间
  const target_duration = async (data) => {
    const visitedDataFormat = await formattedArray(data);
    // console.log('visitedDataFormat: ', visitedDataFormat);
    const visitedDataReduce = await aggregatedDurationDataForTarget(visitedDataFormat);
    // console.log('visitedDataReduce: ', visitedDataReduce);
    setTarget_duration_visitedBehavior(visitedDataReduce);
  };

  const selectData = (xField, yField) => {
    if (xField === 'visited_time' && yField === 'duration_minutes') {
      return time_duration_visitedBehavior;
    } else if (xField === 'visited_time' && yField === 'visited_target') {
      return time_target_visitedBehavior;
    } else if (xField === 'visited_target' && yField === 'duration_minutes') {
      return target_duration_visitedBehavior;
    } else {
      return '';
    }
  };

  const initChartData = async () => {
    const visitedData = await queryVisitedBehavior();
    // console.log('visitedData: ', new Date(visitedData.data[0].visited_time));
    await target_duration(visitedData.data);
    await time_duration(visitedData.data);
    await time_target(visitedData.data);
  };


  const toAddChart = () => {
    history.push({
      pathname: `/data/chart`,
    });
  }

  useEffect(() => {
    initChartData();
  }, []);

  return (
    <div>
      <Card title={chart_name} extra={<a href="#" onClick={toAddChart}>选择其他图表</a>}>
        {chart_type === 'Line' && (
          <Line
            data={selectData(
              JSON.parse(chart_config)['xField'],
              JSON.parse(chart_config)['yField'],
            )}
            xField={JSON.parse(chart_config)['xField']}
            yField={JSON.parse(chart_config)['yField']}
            slider={{
              x: true,
              start: 0, // 设置起始位置
              end: 1, // 设置结束位置
            }}
            height={400}
          />
        )}
        {chart_type === 'Column' && (
          <Column
            data={selectData(
              JSON.parse(chart_config)['xField'],
              JSON.parse(chart_config)['yField'],
            )}
            xField={JSON.parse(chart_config)['xField']}
            yField={JSON.parse(chart_config)['yField']}
            slider={{
              x: true,
              start: 0, // 设置起始位置
              end: 1, // 设置结束位置
            }}
            height={400}
          />
        )}
        {chart_type === 'Scatter' && (
          <Scatter
            data={selectData(
              JSON.parse(chart_config)['xField'],
              JSON.parse(chart_config)['yField'],
            )}
            xField={JSON.parse(chart_config)['xField']}
            yField={JSON.parse(chart_config)['yField']}
            slider={{
              x: true,
              start: 0, // 设置起始位置
              end: 1, // 设置结束位置
            }}
            height={400}
          />
        )}
      </Card>
    </div>
  );
};

export default ChartComponent;
