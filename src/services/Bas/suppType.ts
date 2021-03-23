import { request } from 'umi';

export async function querySuppType(
  data: QueryRequest<BAS.SuppType>,
): Promise<RowResponse<BAS.SuppType>> {
  return request('/bas/suppType/list', { method: 'POST', data });
}

export async function querySuppTypeTree(): Promise<RowResponse<BAS.SuppType>> {
  return request('/bas/suppType/treelist', {
    method: 'POST',
  });
}
export async function updSuppType(data: BAS.SuppType) {
  return request('/bas/suppType/upd', {
    method: 'POST',
    data,
  });
}

export async function delSuppType(data: BAS.SuppType['suppTypeId'][]) {
  return request('/bas/suppType/del', {
    method: 'POST',
    data,
  });
}

export async function addSuppType(data: BAS.SuppType) {
  return request('/bas/suppType/add', {
    method: 'POST',
    data,
  });
}
