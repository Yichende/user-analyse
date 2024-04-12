import React, { useState } from 'react';
import { Table, Button, Modal } from 'antd';

// 子组件，用于显示传入的表格行数据
const DetailModal = ({ rowData, visible, onClose }) => {
  // 如果rowData为null，返回null以避免报错
  if (!rowData) return null;

  // 子组件中的表格列配置
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    // 其他列配置
  ];

  return (
    <Modal
      title="详情"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      {/* 在这里显示传入的表格行数据 */}
      <div>
        <p>ID: {rowData.id}</p>
        <p>Name: {rowData.name}</p>
        {/* 其他数据项 */}
      </div>
      
      {/* 子组件中的表格，只显示点击的行数据 */}
      <Table dataSource={[rowData]} columns={columns} />
    </Modal>
  );
};

// 父组件
const ParentComponent = () => {
  // 模拟表格数据
  const data = [
    { key: '1', id: '001', name: 'John', age: 30 },
    { key: '2', id: '002', name: 'Doe', age: 25 },
    // 更多数据项
  ];

  // 定义状态来控制Modal的显示与隐藏，以及传入子组件的行数据
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  // 点击Action时触发的函数，用于设置选中行数据并显示Modal
  const handleActionClick = (record) => {
    setSelectedRowData(record);
    setModalVisible(true);
  };

  // 表格列配置
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    // 更多列配置
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Button onClick={() => handleActionClick(record)}>查看详情</Button>
      ),
    },
  ];

  return (
    <div>
      <Table dataSource={data} columns={columns} />

      {/* 传入选中的行数据给子组件 */}
      <DetailModal
        rowData={selectedRowData}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </div>
  );
};

export default ParentComponent;
