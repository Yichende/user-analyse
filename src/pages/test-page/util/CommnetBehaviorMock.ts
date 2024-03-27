// 创建十条随机用户评论行为数据
export async function insertRandomCommentData() {
  // 生成随机用户ID
  function generateRandomUserID() {
    return Math.floor(Math.random() * 20) + 1;
  }

  // 生成随机日期时间
  function generateRandomDateTime() {
    const startDate = new Date(2023, 0, 1); // 开始日期
    const endDate = new Date(); // 当前日期
    const randomDate = new Date(
      startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()),
    );
    return randomDate.toISOString().slice(0, 19).replace('T', ' '); // 格式化为 YYYY-MM-DD HH:MM:SS
  }

  // 生成随机产品
  const products = ['Product A', 'Product B', 'Product C', 'Product D', 'Product E', 'Product F', 'Product G', 'Product H',];

  // 生成随机评分
  function generateRandomRating() {
    return Math.floor(Math.random() * 5) + 1; // 假设评分为1到5之间的整数
  }

  // 随机评论
  const comments = [
    "产品外观时尚、简约，给人一种高端感。",
  "外观设计独特，很吸引眼球。",
  "外观很精致，给人一种质感很好的感觉。",
  "产品外观不错，符合我的审美。",
  "外观设计简洁大方，很喜欢。",
  "外观设计不够个性化，希望能有更多选择。",
  "产品外观有些廉价，不够精致。",
  "外观设计过于简单，缺乏新意。",
  "产品外观与描述不符，有些失望。",
  "外观质量不佳，存在瑕疵。",
  "产品质量非常可靠，使用起来很放心。",
  "质量很好，做工精细。",
  "产品质量达到了我的预期，很满意。",
  "质量一般，有待提升。",
  "质量不错，耐用性强。",
  "质量有保障，值得信赖。",
  "产品质量较差，存在一些小问题。",
  "质量控制不严格，出现了一些质量问题。",
  "质量不稳定，需要改进。",
  "产品质量差，使用起来不太放心。",
  "快递速度很快，超出了我的预期。",
  "快递小哥态度很好，送货速度也很快。",
  "快递速度较慢，希望能够改进。",
  "快递速度一般，没有特别突出的表现。",
  "快递速度很慢，耽误了我的使用。",
  "快递服务态度恶劣，送货速度也很慢。",
  "快递服务不及时，造成了不便。",
  "快递速度太慢了，需要提升服务质量。",
  "快递速度快，但包装不够严密，物品有损坏。",
  "快递速度快，但时常出现延迟送达的情况。",
  "客服态度很好，解决了我的问题。",
  "客服回复速度很快，服务也很周到。",
  "客服效率太低，希望能够改进。",
  "客服沟通能力不足，导致问题无法解决。",
  "客服态度恶劣，没有解决我的问题。",
  "客服回复速度慢，服务质量有待提升。",
  "客服回复模板化，缺乏个性化服务。",
  "客服不专业，无法解决我的问题。",
  "客服服务不够及时，造成了一些不便。",
  "客服回复不及时，让人感到不耐烦。",
  "售后服务很好，解决了我的问题。",
  "售后服务态度很好，耐心解答了我的疑问。",
  "售后服务效率高，很快就解决了问题。",
  "售后服务一般，需要改进。",
  "售后服务态度差，让人很不满意。",
  "售后服务反馈速度慢，不够及时。",
  "售后服务处理问题能力不足，影响了用户体验。",
  "售后服务反馈质量不高，解决问题不彻底。",
  "售后服务流程不清晰，导致处理问题拖延。",
  "售后服务处理问题效率低，耽误了使用时间。"
  ];

  const commentData = [];
  // 生成随机用户评论数据并插入数据库
  for (let i = 0; i < 10; i++) {
    const user_id = generateRandomUserID();
    const date_time = generateRandomDateTime();
    const product = products[Math.floor(Math.random() * products.length)];
    const rating = generateRandomRating();
    const comment = comments[Math.floor(Math.random() * comments.length)];

    commentData.push({ user_id, date_time, product, rating, comment });
  }
  console.log('CommentData: ', commentData);
}
