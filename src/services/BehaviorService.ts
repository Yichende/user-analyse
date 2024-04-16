import { request } from 'umi';

export async function queryVisitedBehavior() {
  return await request('/api/queryVisitedBehavior', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function queryPurchaseBehavior() {
  return await request('/api/queryPurchaseBehavior', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function querySearchBehavior() {
  return await request('/api/querySearchBehavior', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function queryCommentBehavior() {
  return await request('/api/queryCommentBehavior', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function queryInteractBehavior() {
  return await request('/api/queryInteractBehavior', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function delBehaviorById(table_name, behavior_id) {
  return await request('/api/delBehaviorById', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({table_name, behavior_id})
  });
}