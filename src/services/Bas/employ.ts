import type React from 'react';
import { request } from 'umi';
import { mapModId } from '@/utils/utils';
import { message } from 'antd';

export async function queryEmploy(
  data: QueryRequest<BAS.Employ>,
  headers = { modId: mapModId.employ },
): Promise<RowResponse<BAS.Employ>> {
  return request('/bas/employ/list', { method: 'POST', data, headers });
}

export async function queryEmployInfo(
  id: BAS.Employ['empId'],
  headers = { modId: mapModId.employ },
) {
  return request('/bas/employ/info', {
    method: 'GET',
    params: { id },
    headers,
  });
}
export async function updEmploy(data: BAS.Employ, headers = { modId: mapModId.employ }) {
  return request('/bas/employ/upd', {
    method: 'POST',
    data,
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}

export async function delEmploy(data: React.Key[], headers = { modId: mapModId.employ }) {
  return request('/bas/employ/del', {
    method: 'POST',
    data,
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}

export async function addEmploy(data: BAS.Employ, headers = { modId: mapModId.employ }) {
  return request('/bas/employ/add', {
    method: 'POST',
    data,
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}

export async function queryPost(
  data: QueryRequest<BAS.Post>,
  headers = { modId: mapModId.employ },
): Promise<RowResponse<BAS.Post>> {
  return request('/bas/post/list', { method: 'POST', data, headers });
}

export async function queryPostInfo(id: BAS.Post['postId'], headers = { modId: mapModId.employ }) {
  return request('/bas/post/info', {
    method: 'GET',
    params: { id },
    headers,
  });
}
export async function updPost(data: BAS.Post, headers = { modId: mapModId.employ }) {
  return request('/bas/post/upd', {
    method: 'POST',
    data,
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}

export async function delPost(data: BAS.Post['postId'][], headers = { modId: mapModId.employ }) {
  return request('/bas/post/del', {
    method: 'POST',
    data,
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}

export async function addPost(data: BAS.Post, headers = { modId: mapModId.employ }) {
  return request('/bas/post/add', {
    method: 'POST',
    data,
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}
