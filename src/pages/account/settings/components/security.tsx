import { comparePassword, getCurrentUser } from '@/services/UserService';
import { Form, Input, List, Modal, Popover, Progress, type FormInstance, message } from 'antd';
import React, { useEffect, useState } from 'react';
import useStyles from './style.style';
import { changePassword } from '@/services/UserService';

type Unpacked<T> = T extends (infer U)[] ? U : T;
const passwordStrength = {
  strong: <span className="strong">强</span>,
  medium: <span className="medium">中</span>,
  weak: <span className="weak">弱 Weak</span>,
};

interface Values {
  title?: string;
  description?: string;
  modifier?: string;
}
interface CollectionCreateFormProps {
  initialValues: Values;
  onFormInstanceReady: (instance: FormInstance<Values>) => void;
}

interface ChangePasswordProps {
  newPassword: string;
  oldPassword: string;
}

const passwordProgressMap: {
  ok: 'success';
  pass: 'normal';
  poor: 'exception';
} = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};
// 防抖函数
function debounce(func, delay: number) {
  let timeoutId: any;

  return function () {
    const context = this;
    const args = arguments;

    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      func.apply(context, args);
    }, delay);
  };
}

const CollectionCreateForm: React.FC<CollectionCreateFormProps> = ({
  initialValues,
  onFormInstanceReady,
}) => {
  const [form] = Form.useForm();
  useEffect(() => {
    onFormInstanceReady(form);
  }, []);

  const [open, setVisible]: [boolean, any] = useState(false);
  const [popover, setPopover]: [boolean, any] = useState(false);

  const confirmDirty = false;

  const checkedOldPassword = debounce(async (_: any, value: string, callback: any) => {
    if (!value) {
      callback(new Error('请输入原密码'));
    }
    const passwordMatch = await comparePassword(value);
    if (!passwordMatch.passwordMatch) {
      // console.log('pwMatch: ', passwordMatch.passwordMatch);
      callback(new Error('原密码输入错误'));
    }
    callback();
  }, 2000);

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

  const checkConfirm = (_: any, value: string) => {
    const promise = Promise;
    if (value && value !== form.getFieldValue('newPassword')) {
      return promise.reject('两次输入的密码不匹配!');
    }
    return promise.resolve();
  };

  const { styles } = useStyles();
  // 获取当前密码长度
  const getPasswordStatus = () => {
    const value = form.getFieldValue('newPassword');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  // 密码强度显示
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

  const renderPasswordProgress = () => {
    const value = form.getFieldValue('newPassword');
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
    <Form layout="vertical" form={form} name="form_in_modal" initialValues={initialValues}>
      <Form.Item
        name="oldPassword"
        hasFeedback
        rules={[{ required: true, validator: checkedOldPassword }]}
      >
        <Input.Password size="large" placeholder="请输入原密码" />
      </Form.Item>
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
        <Form.Item
          name="newPassword"
          hasFeedback
          className={
            form.getFieldValue('newPassword') &&
            form.getFieldValue('newPassword').length > 0 &&
            styles.password
          }
          rules={[
            {
              required: true,
              message: '请输入新密码',
              validator: checkPassword,
            },
          ]}
        >
          <Input.Password size="large" placeholder="新密码至少6位，区分大小写" />
        </Form.Item>
      </Popover>
      <Form.Item
        name="confirm"
        hasFeedback
        rules={[
          {
            required: true,
            message: '请确认密码',
          },
          {
            validator: checkConfirm,
          },
        ]}
      >
        <Input.Password size="large" placeholder="确认密码" />
      </Form.Item>
    </Form>
  );
};

interface CollectionCreateFormModalProps {
  open: boolean;
  onCreate: (values: ChangePasswordProps) => void;
  onCancel: () => void;
  initialValues: Values;
}

const CollectionCreateFormModal: React.FC<CollectionCreateFormModalProps> = ({
  open,
  onCreate,
  onCancel,
  initialValues,
}) => {
  const [formInstance, setFormInstance] = useState<FormInstance>();
  return (
    <Modal
      open={open}
      title="修改密码"
      okText="确认"
      cancelText="取消"
      okButtonProps={{ autoFocus: true }}
      onCancel={onCancel}
      destroyOnClose
      onOk={async () => {
        try {
          const values = await formInstance?.validateFields();
          formInstance?.resetFields();
          onCreate(values);
        } catch (error) {
          console.log('Failed:', error);
        }
      }}
    >
      <CollectionCreateForm
        initialValues={initialValues}
        onFormInstanceReady={(instance) => {
          setFormInstance(instance);
        }}
      />
    </Modal>
  );
};

const SecurityView: React.FC = () => {
  const [initialUserInfo, setInitialUserInfo] = useState({ account: '' });
  const [open, setOpen] = useState(false);

  // 点击弹出表单确认键后触发
  const onCreate = async(values: ChangePasswordProps) => {
    console.log('Received values of form: ', values);
    const { newPassword, oldPassword } = values;
    const res = await changePassword(oldPassword, newPassword)
    if (res.message === 'success') {
      message.success('密码修改成功')
      setOpen(false);
    } else {
      message.error('修改密码失败');
    }
  };

  useEffect(() => {
    getCurrentUser()
      .then((data) => {
        // setState
        setInitialUserInfo(data);
      })
      .catch((error) => {
        console.log('error update user data: ', error);
      });
  }, []);

  const getData = () => [
    {
      title: '账户密码',
      description: (
        <>
          当前密码强度：
          {passwordStrength.strong}
        </>
      ),
      actions: [
        <a key="Modify" onClick={() => setOpen(true)}>
          修改
        </a>,
      ],
    },
    {
      title: '密保手机',
      description: `已绑定手机：138****8293`,
      actions: [<a key="Modify">修改</a>],
    },
    {
      title: '密保问题',
      description: '未设置密保问题，密保问题可有效保护账户安全',
      actions: [<a key="Set">设置</a>],
    },
    {
      title: '修改邮箱',
      description: `已绑定邮箱：${initialUserInfo.account}`,
      actions: [<a key="Modify">修改</a>],
    },
  ];

  const data = getData();
  return (
    <>
      <List<Unpacked<typeof data>>
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item actions={item.actions}>
            <List.Item.Meta title={item.title} description={item.description} />
          </List.Item>
        )}
      />
      <CollectionCreateFormModal
        open={open}
        onCreate={onCreate}
        onCancel={() => setOpen(false)}
        initialValues={{ modifier: 'public' }}
      />
    </>
  );
};

export default SecurityView;
