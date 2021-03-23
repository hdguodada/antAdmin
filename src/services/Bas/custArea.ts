import { request } from 'umi';

export async function queryCustArea(
  data: QueryRequest<BAS.CustArea>,
): Promise<RowResponse<BAS.CustArea>> {
  return request('/bas/custArea/list', { method: 'POST', data });
}

export async function queryCustAreaTree(params: any): Promise<RowResponse<BAS.CustArea>> {
  return request('/bas/custArea/treelist', { method: 'POST', params });
}

export async function addCustArea(data: BAS.CustArea) {
  return request('/bas/custArea/add', { method: 'POST', data });
}

export async function updCustArea(data: BAS.CustArea) {
  return request('/bas/custArea/upd', { method: 'POST', data });
}

export async function delCustArea(data: BAS.CustArea['areaId'][]) {
  return request('/bas/custArea/del', { method: 'POST', data });
}
