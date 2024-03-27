// 创建十条随机用户交互行为数据
export async function insertRandomSocialInteractData() {
  // 生成随机用户ID
  function generateRandomUserID() {
      return Math.floor(Math.random() * 20) + 1;
  }

  // 生成随机日期时间
  function generateRandomDateTime() {
      const startDate = new Date(2023, 0, 1); // 开始日期
      const endDate = new Date(); // 当前日期
      const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
      return randomDate.toISOString().slice(0, 19).replace('T', ' '); // 格式化为 YYYY-MM-DD HH:MM:SS
  }

  // 生成随机互动类型
  const interactionTypes = ['Like', 'Comment', 'Share', 'Save', 'Dislike'];

  // 生成随机互动目标
  const interactTargets = ['Video A', 'Video B', 'Video C', 'Video D', 'Video E', 'Video F', 'Video G', 
  'Article A', 'Article B', 'Article C', 'Article D', 'Article E', 'Article F', 'Article G', ];

  const interactData = []
  // 生成随机社交互动数据并插入数据库
  for (let i = 0; i < 10; i++) {
      const user_id = generateRandomUserID();
      const date_time = generateRandomDateTime();
      const interaction_type = interactionTypes[Math.floor(Math.random() * interactionTypes.length)];
      const interact_target = interactTargets[Math.floor(Math.random() * interactTargets.length)];

      interactData.push({user_id, date_time, interaction_type, interact_target})
  }

  console.log('InteractData: ', interactData)
}

