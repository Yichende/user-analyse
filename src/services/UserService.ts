import { request } from 'umi';

// 用户登录，返回token
export async function userLogin(values: API.LoginParams) {
  return await request('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(values),
  });
}

// 用户注册
export async function userRegister(values: API.UserRegisterParams) {
  return await request('/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    skipErrorHandler: true, // 跳过错误处理
    data: JSON.stringify(values),
  });
}

// 获取当前用户信息
export async function getCurrentUser() {
  const account = localStorage.getItem('account');
  const accountData = { account: account };
  return await request('/api/currentUser', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    skipErrorHandler: true,
    params: accountData,
  });
}

// 比对当前用户密码
export async function comparePassword(password: string) {
  const account = localStorage.getItem('account');
  const accountData = { account: account, password: password };
  return await request('/api/comparePassword', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    skipErrorHandler: true,
    data: JSON.stringify(accountData),
  });
}

// 更改当前用户密码
export async function changePassword(oldPassword: string, newPassword: string) {
  const account = localStorage.getItem('account');
  const accountData = { account: account, newPassword: newPassword, oldPassword: oldPassword };
  return await request('/api/changePassword', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    skipErrorHandler: true,
    data: JSON.stringify(accountData),
  });
}

export async function queryUsersByPage(limit: number, offset: number) {
  return await request('/api/queryUsersByPage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    skipErrorHandler: true,
    data: JSON.stringify({ limit, offset }),
  });
}

export async function updateUser(values: API.UserUpdated) {
  return await request('/api/updateUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    skipErrorHandler: true,
    data: JSON.stringify(values),
  })
}
