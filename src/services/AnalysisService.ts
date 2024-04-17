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

export async function delAnalysisById(analysisId: number) {
  console.log('analysisId: ', analysisId )
  return await request('/api/delAnalysisById', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    skipErrorHandler: true, // 跳过错误处理
    data: JSON.stringify({analysisId: analysisId})
  });
}

export async function queryAnalysisByCreateUserId(creatorId: number) {
  return await request('/api/queryAnalysisByCreateUserId', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    skipErrorHandler: true, // 跳过错误处理
    data: JSON.stringify({creatorId: creatorId})
  });
}

export async function updateAnalysisById(values) {
  return await request('/api/updateAnalysisById', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    skipErrorHandler: true, // 跳过错误处理
    data: JSON.stringify(values)
  });
}