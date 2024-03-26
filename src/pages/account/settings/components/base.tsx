import { getCurrentUser } from '@/services/UserService';
import { UploadOutlined } from '@ant-design/icons';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { Button, Divider, Flex, Form, message, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import useStyles from './index.style';
import { comparePassword, changePassword } from '@/services/UserService';

const BaseView: React.FC = () => {
  const { styles } = useStyles();
  // 头像组件 方便以后独立，增加裁剪之类的功能
  const AvatarView = ({ avatar }: { avatar: string }) => (
    <>
      <div className={styles.avatar_title}>头像</div>
      <div className={styles.avatar}>
        <img src={avatar} alt="avatar" />
      </div>
      <Upload showUploadList={false}>
        <div className={styles.button_view}>
          <Button>
            <UploadOutlined />
            更换头像
          </Button>
        </div>
      </Upload> 
    </>
  );


  const [initialUserInfo, setInitialUserInfo] = useState({avatar: ''});

  const [form] = Form.useForm();
  const initUserFormInfo = (data: API.CurrentUser) => {
    const user = data;
    form.setFieldsValue({
      account: user.account,
      username: user.username,
    });
  };

  useEffect(() => {
    getCurrentUser()
      .then((data) => {
        // 初始化表单
        initUserFormInfo(data);
        // setState
        setInitialUserInfo(data);
      })
      .catch((error) => {
        console.log('error update user data: ', error);
      });
  }, []);

  const testClick = async() => {
    const res = await changePassword('123456', '123456')
    console.log('resultTest: ', res);
  };

  const getAvatarURL = () => {
    const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
    return initialUserInfo.avatar ? initialUserInfo.avatar : url;
  };
  const handleFinish = async () => {
    message.success('更新基本信息成功');
  };
  return (
    <div className={styles.baseView}>
      {
        <>
          <div className={styles.left}>
            <>
              <Divider orientation="left" plain>
                Preview
              </Divider>

              <Flex gap="small" align="flex-start" vertical>
                <Button type="primary" onClick={testClick}>
                  Primary
                </Button>
              </Flex>
            </>
            <ProForm
              layout="vertical"
              onFinish={handleFinish}
              submitter={{
                searchConfig: {
                  submitText: '更新基本信息',
                },
                render: (_, dom) => dom[1],
              }}
              form={form}
              // initialValues={initialValues}
            >
              <ProFormText
                width="md"
                name="account"
                label="账号"
                disabled
              />
              <ProFormText
                // initialValue = {initialValues.username}
                width="md"
                name="username"
                label="昵称"
                rules={[
                  {
                    required: true,
                    message: '请输入您的昵称!',
                  },
                ]}
              />
            </ProForm>
          </div>
          <div className={styles.right}>
            <AvatarView avatar={getAvatarURL()} />
          </div>
        </>
      }
    </div>
  );
};
export default BaseView;
