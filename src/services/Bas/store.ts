import { request } from 'umi';

export async function queryStore(data: QueryRequest<BAS.Store>): Promise<RowResponse<BAS.Store>> {
  return request('/bas/store/list', { method: 'POST', data });
}

export async function updStore(data: BAS.Store) {
  return request('/bas/store/upd', {
    method: 'POST',
    data,
  });
}

export async function delStore(data: BAS.Store['storeCd'][]) {
  return request('/bas/store/del', {
    method: 'POST',
    data,
  });
}

export async function addStore(data: BAS.Store) {
  return request('/bas/store/add', {
    method: 'POST',
    data,
  });
}
