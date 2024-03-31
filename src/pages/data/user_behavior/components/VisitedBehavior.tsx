import { queryVisitedBehavior } from '@/services/BehaviorService';
import { updateUser } from '@/services/UserService';
import { SearchOutlined } from '@ant-design/icons';
import type { GetRef, TableColumnType } from 'antd';
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Select,
  Space,
  Table,
  Typography,
} from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import React, { useEffect, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';

type InputRef = GetRef<typeof Input>;

interface Item {
  user_id: string;
  visited_time: string;
  visited_target: string;
  duration_minutes: number;
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
        {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const VisitedTable: React.FC = () => {
  const [form] = Form.useForm();
  const [behaviorData, setBehaviorData] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  const isEditing = (record: Item) => record.user_id === editingKey;

  const edit = (record: Partial<Item>) => {
    form.setFieldsValue({ VisitedTarget: '', duration_minutes: '', ...record });
    setEditingKey(record.user_id);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (user_id: number) => {
    try {
      const row = (await form.validateFields()) as updateItem;

      const newData = [...behaviorData];
      const index = newData.findIndex((item) => user_id === item.user_id);
      console.log('SAVVEE INDEX: ', index);
      if (index > -1) {
        // item 为当前用户数据，row为更新后当前表单数据
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });

        setBehaviorData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setBehaviorData(newData);
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
        <Input
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
        setTimeout(() => searchInput.current?.select(), 3000);
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

  // 时间格式
  const formattedArray = (value: any) => {
    // const id = value.behavior_id;
    const newArr = value.map(function (arr) {
      const date = new Date(arr.visited_time);
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
        visited_time: formattedDate,
      };
    });
    return newArr;
  };

  const initVisitedInfo = async () => {
    try {
      const visitedData = await queryVisitedBehavior();
      const visitedDataFormat = await formattedArray(visitedData.data);
      setBehaviorData(visitedDataFormat);
      // console.log('behaviorData: ', visitedData.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    initVisitedInfo();
  }, []);

  const columns = [
    {
      title: 'UserId',
      dataIndex: 'user_id',
      // width: '5%',
    },
    {
      title: 'VisitedTime',
      dataIndex: 'visited_time',
      // width: '20%',
      ...getColumnSearchProps('visited_time'),
      sorter: (a, b) => new Date(a.visited_time) - new Date(b.visited_time),
    },
    {
      title: 'VisitedTarget',
      dataIndex: 'visited_target',
      // width: '20%',
      editable: true,
      ...getColumnSearchProps('visited_target'),
    },
    {
      title: 'DurationMinutes',
      dataIndex: 'duration_minutes',
      // width: '15%',
      editable: true,
      sorter: (a, b) => a.duration_minutes - b.duration_minutes,
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
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            编辑
          </Typography.Link>
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

  return (
    <div>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={behaviorData}
          columns={mergedColumns}
          rowKey="behavior_id"
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
    </div>
  );
};

export default VisitedTable;
