import { insertSearchBehavior } from "@/services/MockService";

// 创建十条随机用户搜索行为数据
export async function insertRandomSearchData() {
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

  // 生成随机搜索查询
  const searchQueries = ['iPhone', 'Laptop', 'Headphones', 'Camera', 'Smartwatch', 'Tablet'];

  // 生成随机搜索结果数量
  function generateRandomResultsCount() {
    return Math.floor(Math.random() * 200) + 1; // 假设最多搜索结果为200个
  }

  const searchData = [];
  // 生成随机用户搜索行为数据并插入数据库
  for (let i = 0; i < 10; i++) {
    const user_id = generateRandomUserID();
    const search_time = generateRandomDate();
    const search_query = searchQueries[Math.floor(Math.random() * searchQueries.length)];
    const results_count = generateRandomResultsCount();
    const value = { user_id, search_time, search_query, results_count }

    searchData.push(value);

    try {
      setTimeout(async () => {
        const res = await insertSearchBehavior(value);
        console.log('res: ', res);
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  }
  console.log('SearchData: ', searchData);
}
