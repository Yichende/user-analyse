import { request } from 'umi';


export async function addAnalysis(values) {
  return await request('/api/addAnalysis', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    skipErrorHandler: true, // 跳过错误处理
    data: JSON.stringify(values),
  });
}

export async function queryAllAnalysis() {
  return await request('/api/queryAllAnalysis', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    skipErrorHandler: true, // 跳过错误处理
  });
}