import { userRegister } from '@/services/UserService';
import { history, useModel } from '@umijs/max';
import { Form, Input, message, Popover, Progress, Select } from 'antd';
import type { FC } from 'react';
import React,  { useImperativeHandle, useEffect, useState } from 'react';
import useStyles from './style.style';
// import { flushSync } from 'react-dom';

const FormItem = Form.Item;

const passwordProgressMap: {
  ok: 'success';
  pass: 'normal';
  poor: 'exception';
} = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};
const CreateUser: FC = React.forwardRef((props, ref) => {
  const { styles } = useStyles();
  const [open, setVisible]: [boolean, any] = useState(false);
  const [popover, setPopover]: [boolean, any] = useState(false);
  const { initialState, setInitialState } = useModel('@@initialState');
  const confirmDirty = false;

  const formRef = React.useRef<Form>(null);

  let interval: number | undefined;

  // 子组件中的提交表单方法
  const handleSubmit = () => {
    if (formRef.current) {
      formRef.current.submit();
    }
  };

  useImperativeHandle(
    ref,
    () => ({ handleSubmit })
  );

  const passwordStatusMap = {
    ok: (
      <div className={styles.success}>
        <span>强度：强</span>
      </div>
    ),
    pass: (
      <div className={styles.warning}>
        <span>强度：中</span>
      </div>
    ),
    poor: (
      <div className={styles.error}>
        <span>强度：太短</span>
      </div>
    ),
  };

  const [form] = Form.useForm();
  useEffect(
    () => () => {
      clearInterval(interval);
    },
    [interval],
  );
  // 获取当前密码长度
  const getPasswordStatus = () => {
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  const onFinish = async (values: API.UserRegisterParams) => {
    // 向后端发送注册请求
    try {
      const response = await userRegister(values);
      // console.log(response);
      if (response && response.message === 'ok') {
        message.success('注册成功');
        form.resetFields();
      }
    } catch (error: any) {
      if (error.response.data.message === 'User already exists') {
        message.error('此用户已存在');
      }
    }
  };
  const checkConfirm = (_: any, value: string) => {
    const promise = Promise;
    if (value && value !== form.getFieldValue('password')) {
      return promise.reject('两次输入的密码不匹配!');
    }
    return promise.resolve();
  };
  const checkPassword = (_: any, value: string) => {
    const promise = Promise;
    // 没有值的情况
    if (!value) {
      setVisible(!!value);
      return promise.reject('请输入密码!');
    }
    // 有值的情况
    if (!open) {
      setVisible(!!value);
    }
    setPopover(!popover);
    if (value.length < 6) {
      return promise.reject('');
    }
    if (value && confirmDirty) {
      form.validateFields(['confirm']);
    }
    return promise.resolve();
  };

  const renderPasswordProgress = () => {
    const value = form.getFieldValue('password');
    const passwordStatus = getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          size={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };
  return (
    <div className={styles.main} style={{ marginTop: 20 }}>
      <Form ref={formRef} form={form} name="UserRegister" onFinish={onFinish}>
        <FormItem
          name="account"
          rules={[
            {
              required: true,
              message: '请输入邮箱地址!',
            },
            {
              type: 'email',
              message: '邮箱地址格式错误!',
            },
          ]}
        >
          <Input size="large" placeholder="邮箱" />
        </FormItem>
        <Popover
          getPopupContainer={(node) => {
            if (node && node.parentNode) {
              return node.parentNode as HTMLElement;
            }
            return node;
          }}
          content={
            open && (
              <div
                style={{
                  padding: '4px 0',
                }}
              >
                {passwordStatusMap[getPasswordStatus()]}
                {renderPasswordProgress()}
                <div
                  style={{
                    marginTop: 10,
                  }}
                >
                  <span>请至少输入 6 个字符。请不要使用容易被猜到的密码。</span>
                </div>
              </div>
            )
          }
          overlayStyle={{
            width: 240,
          }}
          placement="right"
          open={open}
        >
          <FormItem
            name="password"
            className={
              form.getFieldValue('password') &&
              form.getFieldValue('password').length > 0 &&
              styles.password
            }
            rules={[
              {
                validator: checkPassword,
              },
            ]}
          >
            <Input.Password size="large" placeholder="至少6位密码，区分大小写" />
          </FormItem>
        </Popover>

        <FormItem
          name="confirm"
          rules={[
            {
              required: true,
              message: '确认密码',
            },
            {
              validator: checkConfirm,
            },
          ]}
        >
          <Input.Password size="large" placeholder="确认密码" />
        </FormItem>

        <Form.Item
          name="role"
          rules={[
            {
              required: true,
              message: '请至少选择一个角色!',
            },
          ]}
        >
          <Select size="large" placeholder="请选择角色">
            <Select.Option value="admin">管理员</Select.Option>
            <Select.Option value="data_admin">数据管理员</Select.Option>
            <Select.Option value="data_analyst">数据分析师</Select.Option>
          </Select>
        </Form.Item>

        {/* <FormItem>
          <div className={styles.footer}>
            <Button size="large" type="primary" htmlType="submit">
              <span>注册</span>
            </Button>
            <Button size="large">
              <span>取消</span>
            </Button>
          </div>
        </FormItem> */}
      </Form>
    </div>
  );
});
export default CreateUser;
