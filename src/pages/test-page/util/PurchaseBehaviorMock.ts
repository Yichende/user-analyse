// 创建十条随机用户浏览行为数据
export async function insertRandomPurchaseData() {
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

  // 生成随机购买商品
  const products = ['Product A', 'Product B', 'Product C', 'Product D', 'Product E', 'Product F', 'Product G', 'Product H',];

  // 生成随机购买数量
  function generateRandomQuantity() {
      return Math.floor(Math.random() * 20) + 1; // 假设购买数量最多为5个
  }

  // 生成随机总金额
  function generateRandomTotalAmount() {
      return Math.floor(Math.random() * 1000) + 1; // 假设最高总金额为1000
  }

  const purchaseData = [];

  // 生成随机用户购买数据并插入数据库
  for (let i = 0; i < 10; i++) {
      const user_id = generateRandomUserID();
      const date = generateRandomDate();
      const product_purchased = products[Math.floor(Math.random() * products.length)];
      const quantity = generateRandomQuantity();
      const total_amount = generateRandomTotalAmount();

      purchaseData.push({user_id, date, product_purchased, quantity, total_amount})
  }
  console.log('PurchaseData: ', purchaseData)
}
