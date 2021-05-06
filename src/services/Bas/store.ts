import { request } from 'umi';
import { mapModId } from '@/utils/utils';
import { message } from 'antd';

export async function queryStore(
  data: QueryRequest<BAS.Store>,
  headers = { modId: mapModId.store },
): Promise<RowResponse<BAS.Store>> {
  return request('/bas/store/list', { method: 'POST', data, headers });
}

export async function updStore(data: BAS.Store, headers = { modId: mapModId.store }) {
  return request('/bas/store/upd', {
    method: 'POST',
    data,
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}

export async function delStore(data: React.Key[], headers = { modId: mapModId.store }) {
  return request('/bas/store/del', {
    method: 'POST',
    data,
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}

export async function addStore(data: BAS.Store, headers = { modId: mapModId.store }) {
  return request('/bas/store/add', {
    method: 'POST',
    data,
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}
