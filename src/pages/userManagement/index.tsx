import { delUserByUserAccount, queryUsersByPage, updateUser } from '@/services/UserService';
import { SearchOutlined } from '@ant-design/icons';
import type { GetRef, TableColumnType } from 'antd';
import {
  Avatar,
  Button,
  Flex,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Typography,
} from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import CreateUser from './components/CreateUser';

const { Option } = Select;

// const { Column, ColumnGroup } = Table;
type InputRef = GetRef<typeof Input>;

interface Item {
  user_id: number;
  avatar: string;
  account: string;
  username: string;
  role: string;
  create_time: Date;
}

interface updateItem {
  account: string;
  username: string;
  role: string;
}

type DataIndex = keyof Item;

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: Item;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  // record,
  // index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `请输入 ${title}!`,
            },
          ]}
        >
          {dataIndex === 'role' ? (
            <Select style={{ width: 120 }}>
              <Option value="admin">admin</Option>
              <Option value="data_admin">data_admin</Option>
              <Option value="data_analyst">data_analyst</Option>
            </Select>
          ) : (
            inputNode
          )}
          {/* {inputNode} */}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const UserManagementPage: React.FC = () => {
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const childRef = React.useRef<CreateUser>(null);

  const isEditing = (record: Item) => record.account === editingKey;

  const edit = (record: Partial<Item>) => {
    form.setFieldsValue({ Account: '', UserName: '', Role: '', ...record });
    setEditingKey(record.account);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (user_id: number) => {
    try {
      const row = (await form.validateFields()) as updateItem;
      const newData = [...users];
      // 获取当前表格行下标
      const index = newData.findIndex((item) => user_id === item.user_id);
      console.log('SAVE INDEX: ', index);
      if (index > -1) {
        // item 为当前用户数据，row为更新后当前表单数据
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        const userUpdateData = { user_id: user_id, ...row };
        // 后台数据传row和item.user_id
        const updated = await updateUser(userUpdateData);
        console.log('isUpdated', updated);
        if (updated.message === 'success') {
          message.success('更改成功');
        }
        setUsers(newData);
        //将key置空,editingKey表示正在修改的行
        setEditingKey('');
      } else {
        newData.push(row);
        setUsers(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<Item> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input // 获取输入的筛选词句
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 65 }}
          >
            搜索
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 65 }}
          >
            重置
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            关闭
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });
  // 时间格式以及Role转中文
  const formattedArray = (value: any) => {
    const users = value.users;
    const newArr = users.map(function (arr) {
      const date = new Date(arr.create_time);
      // let roleName = '';
      // const keyToReplace = 'role';
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
        ...arr,
        create_time: formattedDate,
        // [keyToReplace]: roleName,
      };
    });
    return newArr;
  };

  const initUserInfo = async () => {
    try {
      const userData = await queryUsersByPage(100, 0);
      const userDataFormat = await formattedArray(userData);
      setUsers(userDataFormat);
      // console.log('users: ', userDataFormat);
    } catch (error) {
      console.log(error);
    }
  };

  const delUser = async(record) => {
    // console.log('record', record.account)
    try {
      await delUserByUserAccount(record.account);
      message.success('删除成功')
      initUserInfo()
    } catch(err) {
      message.error('删除失败')
    }
  }

  useEffect(() => {
    initUserInfo();
  }, []);

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      width: '5%',
      render: (avatar: string) => <Avatar src={avatar} />,
    },
    {
      title: 'Account',
      dataIndex: 'account',
      width: '20%',
      editable: true,
      key: 'account',
      ...getColumnSearchProps('account'),
    },
    {
      title: 'UserName',
      dataIndex: 'username',
      width: '20%',
      editable: true,
      key: 'username',
      ...getColumnSearchProps('username'),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      width: '15%',
      editable: true,
      key: 'role',
      filters: [
        {
          text: 'admin',
          value: 'admin',
        },
        {
          text: 'data_admin',
          value: 'data_admin',
        },
        {
          text: 'data_analyst',
          value: 'data_analyst',
        },
      ],
      onFilter: (value, record) => record.role.includes(value),
    },
    {
      title: 'CreateTime',
      dataIndex: 'create_time',
      key: 'create_time',
      sorter: (a, b) => new Date(a.create_time) - new Date(b.create_time),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Item) => {
        const editable = isEditing(record);
        // console.log('RenderInCol: ', record);
        return editable ? (
          <span>
            <Typography.Link onClick={() => save(record.user_id)} style={{ marginRight: 8 }}>
              保存
            </Typography.Link>
            <Popconfirm title="确定取消？" onConfirm={cancel}>
              <a>取消</a>
            </Popconfirm>
          </span>
        ) : (
          
          <Space>
            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
              编辑
            </Typography.Link>
            <Popconfirm onConfirm={() => delUser(record)} title='确定删除？'>
              <a>删除</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = useCallback(() => {
    // console.log('childRef: ',childRef);
    if (childRef.current) {
      // 调用子组件的提交表单方法
      childRef.current.handleSubmit();
      setIsModalOpen(false);
      initUserInfo();
    } else {
      message.error('创建用户失败');
    }
  }, [childRef]);

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Flex gap="middle" vertical>
      <Flex justify={'flex-end'}>
        <Button type="primary" onClick={showModal} style={{ width: '10%', minWidth: '90px' }}>
          新增用户
        </Button>
      </Flex>
      <Modal title="新增用户" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <CreateUser ref={childRef} />
      </Modal>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={users}
          columns={mergedColumns}
          rowKey="user_id"
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
    </Flex>
  );
};
export default UserManagementPage;
