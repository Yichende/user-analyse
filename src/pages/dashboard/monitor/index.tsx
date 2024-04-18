import React, { useState, useEffect } from 'react';
import { AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Area, ResponsiveContainer } from 'recharts';
import { Card, Progress } from 'antd';
import { getServerStatus } from '@/services/ServerService';

const { Meta } = Card;

const ServerStatus = () => {
  const [serverStatus, setServerStatus] = useState(null);

  const fetchServerStatus = async () => {
    try {
      const response = await getServerStatus()
      setServerStatus(response);
    } catch (error) {
      console.error('Error fetching server status:', error);
    }
  };

  const formatUptime = (uptime) => {
    const days = Math.floor(uptime / (3600 * 24));
    const hours = Math.floor((uptime % (3600 * 24)) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
  
    return `${days} 天 ${hours} 时 ${minutes} 分`;
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
      <Card title="服务器状态" style={{ width: 800 , marginTop: 30}}>
        {serverStatus && (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={serverStatus.cpu.map((cpu, index) => ({ ...cpu, name: `CPU ${index + 1}` }))}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                title='Cpu使用率变化'
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <defs>
                  <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="niceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="sysGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ffc658" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="idleGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff4d4f" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ff4d4f" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="user" stackId="1" stroke="#8884d8" fill="url(#userGradient)" name="用户态" />
                <Area type="monotone" dataKey="nice" stackId="1" stroke="#82ca9d" fill="url(#niceGradient)" name="优先级较低" />
                <Area type="monotone" dataKey="sys" stackId="1" stroke="#ffc658" fill="url(#sysGradient)" name="系统态" />
                <Area type="monotone" dataKey="idle" stackId="1" stroke="#ff4d4f" fill="url(#idleGradient)" name="空闲态" />
              </AreaChart>
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
              description={`服务器已运行时间: ${formatUptime(serverStatus.uptime)}`}
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
