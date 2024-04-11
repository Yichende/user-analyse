import { queryUsersByPage } from '@/services/UserService';
import { addNewChart } from '@/services/ChartService';

//
export async function insertRandomChartData() {
  // 生成随机用户ID
  async function generateRandomUserId() {
    const res = await queryUsersByPage(100, 0);
    const index = Math.floor(Math.random() * res.users.length);
    const userId = res.users[index].user_id;
    return userId;
  }

  // 生成随机的chartName
  function generateRandomChartName() {
    return `图表-${Math.floor(Math.random() * 100)}`;
  }

  // 生成随机数据
  const generateMockData = (userId) => {
    const chartTypes = ['Line', 'Column'];
    const chartTypeScatter = 'Scatter';

    const randomIndex = Math.floor(Math.random() * 2);
    const randomData = Math.floor(Math.random() * 3);

    const mockData = [
      {
        chart_type: chartTypes[randomIndex],
        xAxis: { value: 'visited_time' },
        yAxis: { value: 'duration_minutes' },
      },
      {
        chart_type: chartTypes[randomIndex],
        xAxis: { value: 'visited_time' },
        yAxis: { value: 'duration_minutes' },
      },
      {
        chart_type: chartTypeScatter,
        xAxis: { value: 'visited_time' },
        yAxis: { value: 'visited_target' },
      },
    ];

    const data = {
      chartName: generateRandomChartName(),
      dataSource: 'visited_behavior',
      currentUserId: userId,
      ...mockData[randomData],
    };

    return {
      chart_type: data.chart_type,
      chart_name: data.chartName,
      data_table_name: data.dataSource,
      chart_config: {
        xField: data.xAxis.value,
        yField: data.yAxis.value,
      },
      create_user_id: data.currentUserId,
    };
  };

  // 生成10个示例数据
  // const mockDataArray = Array.from({ length: 10 }, () => generateMockData());

  for (let i = 0; i < 10; i++) {
    try {
      setTimeout(() => {
        generateRandomUserId().then(async(userId) => {
          const data = generateMockData(userId);
          const res = await addNewChart(data);
          console.log('res: ', res);
        });
      }, 2000);
    } catch (err) {
      console.log('err: ', err);
    }
  }


  // console.log("userId: ", generateRandomUserId())
  // 输出示例数据
  // console.log('mockDataArray: ', mockDataArray);
}
