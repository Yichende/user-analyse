import React, { useState } from 'react';
import { Card, Button, DatePicker } from 'antd';
import { Line } from '@ant-design/charts';
import moment from 'moment';

const { RangePicker } = DatePicker;


const ChartPage: React.FC = () => {
  const [chartData, setChartData] = useState([]);


  const onFinish = () => {
    const mockData = [
      { behavior_id: 1, user_id: 1, create_time: '2024-03-01', behavior: '浏览' },
      { behavior_id: 2, user_id: 2, create_time: '2024-03-02', behavior: '购买' },
      { behavior_id: 3, user_id: 3, create_time: '2024-03-03', behavior: '搜索' },
      { behavior_id: 4, user_id: 4, create_time: '2024-03-04', behavior: '评论' },
      { behavior_id: 5, user_id: 5, create_time: '2024-03-05', behavior: '互动' },
    ];
    setChartData(mockData)

  };

  const onChange = (date, dateString) => {
  console.log(date, dateString);
  setChartData(dateString)
};

  return (
    <Card>
      <RangePicker onChange={onChange} style={{ marginBottom: 20 }} />
      <Button type="primary" onClick={onFinish} style={{ marginBottom: 20 }}>
        生成图表
      </Button>
      <Line
        data={chartData}
        xField="create_time"
        yField="user_id"
        seriesField="behavior"
        height={400}
      />
    </Card>
  );
};

export default ChartPage;
