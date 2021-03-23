import type React from 'react';
import { request } from 'umi';

export async function queryEmploy(
  data: QueryRequest<BAS.Employ>,
): Promise<RowResponse<BAS.Employ>> {
  return request('/bas/employ/list', { method: 'POST', data });
}

export async function queryEmployInfo(id: BAS.Employ['empId']) {
  return request('/bas/employ/info', {
    method: 'GET',
    params: { id },
  });
}
export async function updEmploy(data: BAS.Employ) {
  return request('/bas/employ/upd', {
    method: 'POST',
    data,
  });
}

export async function delEmploy(data: React.Key[]) {
  return request('/bas/employ/del', {
    method: 'POST',
    data,
  });
}

export async function addEmploy(data: BAS.Employ) {
  return request('/bas/employ/add', {
    method: 'POST',
    data,
  });
}

export async function queryPost(data: QueryRequest<BAS.Post>): Promise<RowResponse<BAS.Post>> {
  return request('/bas/post/list', { method: 'POST', data });
}

export async function queryPostInfo(id: BAS.Post['postId']) {
  return request('/bas/post/info', {
    method: 'GET',
    params: { id },
  });
}
export async function updPost(data: BAS.Post) {
  return request('/bas/post/upd', {
    method: 'POST',
    data,
  });
}

export async function delPost(data: BAS.Post['postId'][]) {
  return request('/bas/post/del', {
    method: 'POST',
    data,
  });
}

export async function addPost(data: BAS.Post) {
  return request('/bas/post/add', {
    method: 'POST',
    data,
  });
}
