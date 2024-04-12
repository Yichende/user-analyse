import { queryAllAnalysis } from '@/services/AnalysisService';
import { Avatar, Button, Space, Table, Modal, Form } from 'antd';
import { useEffect, useState } from 'react';
import AnalysisDetail from '../component/AnalysisDetail';

const AllAnalysisPage = () => {
  const [analysisInfo, setAnalysisInfo] = useState([]);
  const [analysisInfoInModal, setAnalysisInfoInModal] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = (index) => {
    console.log('index: ', index)
    console.log(analysisInfo[index])
    setAnalysisInfoInModal(analysisInfo[index])
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setAnalysisInfoInModal([])
  };

  const columns = [
    {
      title: '创建者',
      dataIndex: 'userInfo',
      key: 'userInfo',
      width: '25%',
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
    },
    {
      title: '分析描述',
      dataIndex: 'analysis_description',
      key: 'analysis_description',
    },
    {
      title: '更新时间',
      dataIndex: 'last_updated',
      key: 'last_updated',
    },
    {
      title: 'Action',
      key: 'action',
      width: '17%',
      render: (_, record,index) => (
        <Space size="middle">
          <a onClick={() => showModal(index)}>详情</a>
          <a>删除</a>
        </Space>
      ),
    },
  ];

  const test = async () => {
    // console.log('analysisInfoInModal: ', analysisInfoInModal)
    form.resetFields();
    console.log("resetForm")
  };

  // 时间格式以及Role转中文
  const formattedArray = (value: any) => {
    const info = value.analysisInfo;
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
      const analysisData = await queryAllAnalysis();
      const dataFormated = await formattedArray(analysisData);
      console.log('dataFormated: ', dataFormated);
      setAnalysisInfo(dataFormated);
    } catch (err) {
      console.log('err in init: ', err);
    }
  };

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
        pagination={{ pageSize: 2 }} // 如果需要分页，可以根据实际情况进行调整
      />
      <Button onClick={test}>Test</Button>
      {/* <Modal width='80%' title="分析详情" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}> */}
        <AnalysisDetail initAnalysisInfo={analysisInfoInModal} open={isModalVisible} onOk={handleOk} onCancel={handleCancel}/>
      {/* </Modal> */}
    </>
  );
};

export default AllAnalysisPage;
