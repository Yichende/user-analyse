import { delAnalysisById, queryAnalysisByCreateUserId } from '@/services/AnalysisService';
import { getCurrentUser } from '@/services/UserService';
import { SearchOutlined } from '@ant-design/icons';
import type { InputRef, TableColumnType } from 'antd';
import { Avatar, Button, Input, message, Popconfirm, Space, Table } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import { useEffect, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import AnalysisDetail from '../component/AnalysisDetail';

interface Item {
  userInfo: {
    user_name: string;
    user_avatar: string;
  };
  analysis_name: string;
  analysis_description: string;
  last_updated: string;
}

const MyAnalysisPage = () => {
  const [analysisInfo, setAnalysisInfo] = useState([]);
  const [analysisInfoInModal, setAnalysisInfoInModal] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const [currentRow, setCurrentRow] = useState(0);

  const showModal = (index) => {
    const currentIndex = index + currentRow;
    console.log('index: ', index);
    console.log(analysisInfo[currentIndex]);
    setAnalysisInfoInModal(analysisInfo[currentIndex]);
    setIsModalVisible(true);
  };

  // 时间格式以及Role转中文
  const formattedArray = (value: any) => {
    const info = value.creatorAnalysis;
    const newArr = info.map(function (arr) {
      const date = new Date(arr.last_updated);
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
        last_updated: formattedDate,
      };
    });
    return newArr;
  };

  const initAnalysisInfo = async () => {
    try {
      const { userId } = await getCurrentUser();
      const analysisData = await queryAnalysisByCreateUserId(userId);
      // const analysisData = await queryAllAnalysis();
      const dataFormated = await formattedArray(analysisData);
      // console.log('dataFormated: ', dataFormated);
      dataFormated.sort((a, b) => new Date(b.last_updated) - new Date(a.last_updated));
      setAnalysisInfo(dataFormated);
    } catch (err) {
      console.log('err in init: ', err);
    }
  };

  const handlePageChange = (pagination, pageSize) => {
    setCurrentRow((pagination - 1) * pageSize);
    // console.log('pagination', pagination)
    // console.log('pageSize', pageSize)
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setAnalysisInfoInModal([]);
  };

  const handleDel = async (index) => {
    const currentIndex = index + currentRow;
    console.log(analysisInfo[currentIndex].analysis_id);
    if (analysisInfo[currentIndex].analysis_id !== null) {
      const res = await delAnalysisById(analysisInfo[currentIndex].analysis_id);
      message[res.message === 'ok' ? 'success' : 'error'](
        res.message === 'ok' ? '删除成功' : '删除失败',
      );
      initAnalysisInfo();
    }
    console.log('del');
  };

  const test = async () => {
    const res = await getCurrentUser();
    console.log('res: ', res);
  };

  type DataIndex = keyof Item;

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
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
            style={{ width: 90 }}
          >
            筛选
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
    onFilter: (value, record) => {
      if (dataIndex === 'userInfo') {
        return record[dataIndex].user_name
          .toString()
          .toLowerCase()
          .includes((value as string).toLowerCase());
      } else {
        return record[dataIndex]
          .toString()
          .toLowerCase()
          .includes((value as string).toLowerCase());
      }
    },
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

  const columns = [
    {
      title: '创建者',
      dataIndex: 'userInfo',
      key: 'userInfo',
      width: '25%',
      ...getColumnSearchProps('userInfo'),
      render: (userInfo) => (
        <div>
          <Avatar src={userInfo.user_avatar} />
          <span style={{ marginLeft: 8 }}>{userInfo.user_name}</span>
        </div>
      ),
    },
    {
      title: '分析名',
      dataIndex: 'analysis_name',
      key: 'analysis_name',
      width: '15%',
      ...getColumnSearchProps('analysis_name'),
    },
    {
      title: '分析描述',
      dataIndex: 'analysis_description',
      key: 'analysis_description',
      ellipsis: true,
    },
    {
      title: '更新时间',
      dataIndex: 'last_updated',
      key: 'last_updated',
      sorter: (a, b) => new Date(a.last_updated) - new Date(b.last_updated),
    },
    {
      title: 'Action',
      key: 'action',
      width: '13%',
      render: (_, record, index) => (
        <Space size="middle">
          <a onClick={() => showModal(index)}>详情</a>
          <Popconfirm title="确定删除？" onConfirm={() => handleDel(index)}>
            <a>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    initAnalysisInfo();
  }, []);

  return (
    <>
      <Table
        rowKey="analysis_id"
        bordered
        columns={columns}
        dataSource={analysisInfo}
        pagination={{ pageSize: 10, onChange: handlePageChange }} // 如果需要分页，可以根据实际情况进行调整
      />
      <Button onClick={test}>Test</Button>
      <AnalysisDetail
        initAnalysisInfo={analysisInfoInModal}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      />
    </>
  );
};

export default MyAnalysisPage;
