import { request } from 'umi';


export async function getServerStatus() {
  return await request('/getServerStatus', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    skipErrorHandler: true,
  });
}