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
      const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
      return randomDate.toISOString().slice(0, 19).replace('T', ' '); // 格式化为 YYYY-MM-DD HH:MM:SS
  }

  // 生成随机页面访问
  const pagesVisited = ['Homepage', 'Product A', 'Product B', 'Product C', 'Cart', 'Article A', 'Article B', 'Article C'];

  // 生成随机访问时长
  function generateRandomDuration() {
      return Math.floor(Math.random() * 30) + 1; // 假设最长访问时长为30分钟
  }

  const visitedData = [];
  // 生成随机用户行为数据并插入数据库
  for (let i = 0; i < 10; i++) {
      const user_id = generateRandomUserID();
      const date = generateRandomDate();
      const page_visited = pagesVisited[Math.floor(Math.random() * pagesVisited.length)];
      const duration_minutes = generateRandomDuration();

      // 构建插入语句
      // const insertQuery = `INSERT INTO user_behavior (user_id, date, page_visited, duration_minutes) VALUES (${user_id}, '${date}', '${page_visited}', ${duration_minutes})`;

      // try {
      //     // 执行插入语句
      //     await connection.query(insertQuery);
      //     console.log(`Inserted data for user ${user_id}`);
      // } catch (error) {
      //     console.error(`Error inserting data: ${error}`);
      // }
      visitedData.push({user_id, date, page_visited, duration_minutes})
  }
  console.log('VisitedData: ', visitedData)

  return visitedData;
}
