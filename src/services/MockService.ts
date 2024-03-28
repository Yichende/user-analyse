import { request } from 'umi';

export async function insertVisitedBehavior(value: API.VisitedBehavior) {
  return await request('/api/insertVisitedBehavior', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    skipErrorHandler: true,
    data: JSON.stringify(value),
  });
}


export async function insertPurchaseBehavior(value: API.PurchaseBehavior) {
  return await request('/api/insertPurchaseBehavior', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    skipErrorHandler: true,
    data: JSON.stringify(value),
  });
}

export async function insertSearchBehavior(value: API.SearchBehavior) {
  return await request('/api/insertSearchBehavior', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    skipErrorHandler: true,
    data: JSON.stringify(value),
  });
}

export async function insertCommentBehavior(value: API.CommentBehavior) {
  return await request('/api/insertCommentBehavior', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    skipErrorHandler: true,
    data: JSON.stringify(value),
  });
}

export async function insertInteractBehavior(value: API.InteractBehavior) {
  return await request('/api/insertInteractBehavior', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    skipErrorHandler: true,
    data: JSON.stringify(value),
  });
}


