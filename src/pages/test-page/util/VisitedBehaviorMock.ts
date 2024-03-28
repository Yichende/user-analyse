import { insertVisitedBehavior } from '@/services/MockService';

// 创建十条随机用户浏览行为数据
export async function insertRandomVisitedBehavior() {
  // 生成随机用户ID
  function generateRandomUserID() {
    return Math.floor(Math.random() * 20) + 1;
  }

  // 生成随机日期
  function generateRandomDate() {
    const startDate = new Date(2023, 0, 1); // 开始日期
    const endDate = new Date(); // 当前日期
    const randomDate = new Date(
      startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()),
    );
    return randomDate.toISOString().slice(0, 19).replace('T', ' '); // 格式化为 YYYY-MM-DD HH:MM:SS
  }

  // 生成随机页面访问
  const pagesVisited = [
    'Homepage',
    'Product A',
    'Product B',
    'Product C',
    'Cart',
    'Article A',
    'Article B',
    'Article C',
  ];

  // 生成随机访问时长
  function generateRandomDuration() {
    return Math.floor(Math.random() * 30) + 1; // 假设最长访问时长为30分钟
  }

  const visitedData = [];
  // 生成随机用户行为数据并插入数据库
  for (let i = 0; i < 10; i++) {
    const user_id = generateRandomUserID();
    const visited_time = generateRandomDate();
    const visited_target = pagesVisited[Math.floor(Math.random() * pagesVisited.length)];
    const duration_minutes = generateRandomDuration();
    const value = { user_id, visited_time, visited_target, duration_minutes };
    visitedData.push(value);

    try {
      setTimeout(async () => {
        const res = await insertVisitedBehavior(value);
        console.log('res: ', res);
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  }
  console.log('VisitedData: ', visitedData);

  return visitedData;
}
