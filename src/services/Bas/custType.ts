import { request } from 'umi';

export async function queryCusttypes(
  data: QueryRequest<BAS.CustType>,
): Promise<RowResponse<BAS.CustType>> {
  return request('/bas/custType/list', { method: 'POST', data });
}

export async function queryCustTypeTree(): Promise<RowResponse<BAS.CustType>> {
  return request('/bas/custType/treelist', {
    method: 'POST',
  });
}
export async function updCusttype(data: BAS.CustType) {
  return request('/bas/custType/upd', {
    method: 'POST',
    data,
  });
}

export async function delCusttype(data: BAS.CustType['custTypeId'][]) {
  return request('/bas/custType/del', {
    method: 'POST',
    data,
  });
}

export async function addCusttype(data: BAS.CustType) {
  return request('/bas/custType/add', {
    method: 'POST',
    data,
  });
}
