import { request } from 'umi';

export async function queryCustLevel(
  data: QueryRequest<BAS.CustLevel>,
): Promise<RowResponse<BAS.CustLevel>> {
  return request('/bas/custlevel/list', { method: 'POST', data });
}

export async function updCustLevel(data: BAS.CustLevel) {
  return request('/bas/custlevel/upd', { method: 'POST', data });
}

export async function addCustLevel(data: BAS.CustLevel) {
  return request('/bas/custlevel/add', { method: 'POST', data });
}

export async function delCustLevel(data: BAS.CustLevel['levelId'][]) {
  return request('/bas/custlevel/del', { method: 'POST', data });
}
