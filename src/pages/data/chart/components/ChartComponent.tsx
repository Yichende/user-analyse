import { queryVisitedBehavior } from '@/services/BehaviorService';
import { delChartByChartId } from '@/services/ChartService';
import { DeleteOutlined, EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Column, Line, Scatter } from '@ant-design/plots';
import { Avatar, Button, Card, Checkbox, message, Popover } from 'antd';
import { useEffect, useState } from 'react';
import { history } from '@umijs/max';

const { Meta } = Card;

const ChartComponent = ({ initChartInfo, currentCards }) => {
  const [target_duration_visitedBehavior, setTarget_duration_visitedBehavior] = useState([]);
  const [time_duration_visitedBehavior, setTime_duration_visitedBehavior] = useState([]);
  const [time_target_visitedBehavior, setTime_target_visitedBehavior] = useState([]);
  // const history = useHistory();
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [selectedCharts, setSelectedCharts] = useState([]);
  // target_duration

  // console.log('someInfo: ', currentCards);

  // 年月日时分秒
  const formattedTime = (time: string) => {
    const date = new Date(time);
    const formattedDate =
      date.getFullYear() +
      '-' +
      ('0' + (date.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + date.getDate()).slice(-2) +
      ' ' +
      ('0' + date.getHours()).slice(-2) +
      ':' +
      ('0' + date.getMinutes()).slice(-2) +
      ':' +
      ('0' + date.getSeconds()).slice(-2);
    return formattedDate;
  };

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
    // 格式化时间
    const visitedDataFormat = await formattedArray(data);
    // 计算平均停留时间
    const visitedDataReduce = await aggregatedDurationDataForTarget(visitedDataFormat);
    setTarget_duration_visitedBehavior(visitedDataReduce);
  };

  const initChartData = async () => {
    const visitedData = await queryVisitedBehavior();
    // console.log('visitedData: ', new Date(visitedData.data[0].visited_time));
    await target_duration(visitedData.data);
    await time_duration(visitedData.data);
    await time_target(visitedData.data);
  };

  useEffect(() => {
    console.log('EEEFFFECT  ');
    initChartData();
  }, []);

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

  const delChart = async (chartId) => {
    // console.log("r3r4343", typeof chartId)
    await delChartByChartId(chartId);
    message.success('删除成功');
    await initChartInfo();
  };

  const moreOption = (chartId) => (
    <div>
      <Button onClick={() => delChart(chartId)} type="text" danger icon={<DeleteOutlined />}>
        删除
      </Button>
    </div>
  );

  const handleCheckboxChange = (chartId) => {
    if (selectedCharts.includes(chartId)) {
      setSelectedCharts(selectedCharts.filter((id) => id !== chartId));
    } else {
      setSelectedCharts([...selectedCharts, chartId]);
    }
  };

  const handleButtonClick = () => {
    setShowCheckboxes(!showCheckboxes);
    setSelectedCharts([])
  };

  const handleConfirm = () => {
    // 在这里处理选中的图表
    // 可以将选中的图表传递给另一个页面，例如使用路由参数
    history.push({
      pathname: `/analysis/analysis_add?chartId=${selectedCharts.join(',')}`,
    });
    console.log('selectedCharts', selectedCharts);
  };

  const testClick = () => {
    console.log('currentCards: ', currentCards);
  };

  return (
    <>
      <Button type="primary" onClick={testClick}>
        TEST
      </Button>
      <Button onClick={handleButtonClick}>  
        {/* 是否显示可选框 */}
        {showCheckboxes ? 'Hide Checkboxes' : 'Show Checkboxes'}
      </Button>
      {showCheckboxes && <Button onClick={handleConfirm}>Confirm</Button>}
      {currentCards.map((card, index) => (  // 渲染图表
        <Card
          key={index}
          title={card.chart_name}
          style={{ width: 700, marginTop: 30 }}
          actions={[  // 选项
            <div key="setting">
              <SettingOutlined />
              <span style={{ marginLeft: 5 }}>设置</span>
            </div>,
            <div key="edit">
              <EditOutlined />
              <span style={{ marginLeft: 5 }}>编辑</span>
            </div>,

            <Popover content={moreOption(card.chart_id)} trigger="click" key="ellipsis">
              <EllipsisOutlined />
              <span style={{ marginLeft: 5 }}>更多</span>
            </Popover>,
          ]}
          extra={  // 若显示可选框则展示
            showCheckboxes && (
              <>
                <Checkbox
                  onChange={() => handleCheckboxChange(card.chart_id)}
                  checked={selectedCharts.includes(card.chart_id)}
                />
                <span style={{marginLeft: 5}}>选择</span>
              </>
            )
          }
        >
          {card.chart_type === 'Line' && (
            <Line
              data={selectData(
                JSON.parse(card.chart_config)['xField'],
                JSON.parse(card.chart_config)['yField'],
              )}
              xField={JSON.parse(card.chart_config)['xField']}
              yField={JSON.parse(card.chart_config)['yField']}
              slider={{
                x: true,
                start: 0, // 设置起始位置
                end: 1, // 设置结束位置
              }}
              height={400}
            />
          )}
          {card.chart_type === 'Column' && (
            <Column
              data={selectData(
                JSON.parse(card.chart_config)['xField'],
                JSON.parse(card.chart_config)['yField'],
              )}
              xField={JSON.parse(card.chart_config)['xField']}
              yField={JSON.parse(card.chart_config)['yField']}
              slider={{
                x: true,
                start: 0, // 设置起始位置
                end: 1, // 设置结束位置
              }}
              height={400}
            />
          )}
          {card.chart_type === 'Scatter' && (
            <Scatter
              data={selectData(
                JSON.parse(card.chart_config)['xField'],
                JSON.parse(card.chart_config)['yField'],
              )}
              xField={JSON.parse(card.chart_config)['xField']}
              yField={JSON.parse(card.chart_config)['yField']}
              slider={{
                x: true,
                start: 0, // 设置起始位置
                end: 1, // 设置结束位置
              }}
              height={400}
            />
          )}
          <Meta
            avatar={<Avatar src={card.avatar} />}
            title={card.username}
            description={`最后更新时间：${formattedTime(card.last_updated)}`}
          />
        </Card>
      ))}
    </>
  );
};

export default ChartComponent;
