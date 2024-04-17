import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, Progress } from 'antd';
// import 'antd/dist/antd.css';
import { getServerStatus } from '@/services/ServerService';

const { Meta } = Card;

const ServerStatus = () => {
  const [serverStatus, setServerStatus] = useState(null);

  const fetchServerStatus = async () => {
    try {
      const response = await getServerStatus()
      // const data = await response.json();
      setServerStatus(response);
    } catch (error) {
      console.error('Error fetching server status:', error);
    }
  };

  useEffect(() => {
    // 获取服务器状态
    fetchServerStatus();

    // 每隔6秒刷新一次页面
    const interval = setInterval(fetchServerStatus, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card title="服务器状态" style={{ width: 800 }}>
        {serverStatus && (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={serverStatus.cpu.map((cpu, index) => ({ ...cpu, name: `cpu${index + 1}` }))}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="speed" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
            <Meta
              title="内存占用率"
              description={
                <Progress
                  percent={Math.round(((serverStatus.totalMemory - serverStatus.freeMemory) / serverStatus.totalMemory) * 100)}
                  status="active"
                />
              }
            />
            <br/>
            <Meta
              title={`操作系统类型: ${serverStatus.type}`}
              description={`平台信息: ${serverStatus.platform}`}
            />
            <br />
            <Meta
              title={`CPU 架构: ${serverStatus.arch}`}
              description={`总内存: ${Math.round(serverStatus.totalMemory / (1024 * 1024 * 1024))} GB`}
            />
            <br />
            <Meta
              title={`可用内存: ${Math.round(serverStatus.freeMemory / (1024 * 1024 * 1024))} GB`}
              description={`服务器已运行时间: ${Math.round(serverStatus.uptime / 60)} 分钟`}
            />
            <br />
            <Meta
              title={`平均负载: ${serverStatus.loadAverage}`}
              description={`CPU 核心数量: ${serverStatus.cpu.length}`}
            />
            <br />
          </>
        )}
      </Card>
    </div>
  );
};

export default ServerStatus;
