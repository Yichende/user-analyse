import { request } from 'umi';

export async function addNewChart(values) {
  return await request('/api/addNewChart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    skipErrorHandler: true, // 跳过错误处理
    data: JSON.stringify(values),
  });
}

export async function getAllChart() {
  return await request('/api/getAllChart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    skipErrorHandler: true, // 跳过错误处理
  });
}

export async function delChartByChartId(chartId: number) {
  return await request('/api/deleteChartByChartId', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    skipErrorHandler: true, // 跳过错误处理
    data: JSON.stringify({chartId: chartId}),
  });
}

export async function getChartsByChartId(chartId: string) {
  return await request('/api/getChartsByChartId', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    skipErrorHandler: true,
    params: {chartId: chartId},
  });
}

export async function updatedChartById(values) {
  return await request('/api/updatedChartById', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    skipErrorHandler: true,
    data: JSON.stringify(values),
  });
}
