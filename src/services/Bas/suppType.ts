import { request } from 'umi';
import { mapModId } from '@/utils/utils';
import { message } from 'antd';

export async function querySuppType(
  data: QueryRequest<BAS.SuppType>,
  headers = { modId: mapModId.supplier },
): Promise<RowResponse<BAS.SuppType>> {
  return request('/bas/suppType/list', { method: 'POST', data, headers });
}

export async function querySuppTypeTree(
  data: Record<string, unknown>,
  headers = { modId: mapModId.supplier },
): Promise<RowResponse<BAS.SuppType>> {
  return request('/bas/suppType/treelist', {
    method: 'POST',
    headers,
  });
}
export async function updSuppType(data: BAS.SuppType, headers = { modId: mapModId.supplier }) {
  return request('/bas/suppType/upd', {
    method: 'POST',
    data,
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}

export async function delSuppType(data: React.Key[], headers = { modId: mapModId.supplier }) {
  return request('/bas/suppType/del', {
    method: 'POST',
    data,
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}

export async function addSuppType(data: BAS.SuppType, headers = { modId: mapModId.supplier }) {
  return request('/bas/suppType/add', {
    method: 'POST',
    data,
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}
