import { userRegister } from '@/services/UserService';
import { queryVisitedBehavior, queryPurchaseBehavior, querySearchBehavior, queryCommentBehavior, queryInteractBehavior } from '@/services/BehaviorService';
import { Button, Divider, Flex, message } from 'antd';
import { insertRandomVisitedBehavior } from './util/VisitedBehaviorMock'
import { insertRandomPurchaseData } from './util/PurchaseBehaviorMock';
import { insertRandomSearchData } from './util/SearchBehaviorMock';
import { insertRandomCommentData } from './util/CommentBehaviorMock';
import { insertRandomSocialInteractData } from './util/InteractBehaviorMock';

const TestPage = () => {
  // 生成随机邮箱
  const generateRandomEmail = () => {
    const emailDomains = ['example.com', 'test.com', 'domain.com'];
    const randomDomain = emailDomains[Math.floor(Math.random() * emailDomains.length)];
    const randomString = Math.random().toString(36).substring(7);
    return `user${randomString}@${randomDomain}`;
  };

  // 注册十个用户
  const registerTenUsers = async () => {
    const users = [];
    for (let i = 0; i < 10; i++) {
      const account = generateRandomEmail();
      const password = '123456';
      const role = Math.random() < 0.5 ? 'data_admin' : 'data_analyst'; // 随机选择用户角色
      const values = { account, password, role };
      try {
        setTimeout(async () => {
          const user = await userRegister(values);
          users.push(user);
        }, 3000);
      } catch (error) {
        console.error(`Failed to register user: ${error}`);
      }
    }
    return users;
  };

  const createUser = async () => {
    message.success('创建成功');
    registerTenUsers()
      .then((users) => {
        console.log('All users registered:', users);
      })
      .catch((error) => {
        console.error('Error registering users:', error);
      });
  };

  const formattedArray = (value) => {
    const users = value.users
    const newArr = users.map(function (arr) {
      const date = new Date(arr.create_time);
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
      return {
        account: arr.account,
        avatar: arr.avatar,
        create_time: formattedDate,
        role: arr.role,
        user_id: arr.user_id,
        username: arr.username,
      };
    });
    return newArr;
  };
// queryVisitedBehavior, 
// queryPurchaseBehavior, 
// querySearchBehavior, 
// queryCommentBehavior, 
// queryInteractBehavior
  const testClick = async () => {
    try {
      const res = await queryInteractBehavior();
      console.log('res: ', res);
    } catch (error) {
      console.log('ERROR:::: ', error);
    }
  };

  return (
    <>
      <Divider orientation="left" plain>
        Preview
      </Divider>

      <Flex gap="small" align="flex-start" vertical>
        <Button type="primary" onClick={createUser}>
          创建10名用户
        </Button>
        <Button type="primary" onClick={testClick}>
          测试
        </Button>
        <Button type="primary" onClick={insertRandomVisitedBehavior}>
          创建十条用户浏览行为数据
        </Button>
        <Button type="primary" onClick={insertRandomPurchaseData}>
          创建十条用户购买行为数据
        </Button>
        <Button type="primary" onClick={insertRandomSearchData}>
          创建十条用户搜索行为数据
        </Button>
        <Button type="primary" onClick={insertRandomCommentData}>
          创建十条用户评论行为数据
        </Button>
        <Button type="primary" onClick={insertRandomSocialInteractData}>
          创建十条用户交互行为数据
        </Button>
      </Flex>
    </>
  );
};
export default TestPage;
