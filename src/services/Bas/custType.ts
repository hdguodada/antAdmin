import { request } from 'umi';
import { mapModId } from '@/utils/utils';

export async function queryCusttypes(
  data: QueryRequest<BAS.CustType>,
  headers = { modId: mapModId.customer },
): Promise<RowResponse<BAS.CustType>> {
  return request('/bas/custType/list', { method: 'POST', data, headers });
}

export async function queryCustTypeTree(
  data = {},
  headers = { modId: mapModId.customer },
): Promise<RowResponse<BAS.CustType>> {
  return request('/bas/custType/treelist', {
    method: 'POST',
    data,
    headers,
  });
}
export async function updCusttype(data: BAS.CustType, headers = { modId: mapModId.customer }) {
  return request('/bas/custType/upd', {
    method: 'POST',
    data,
    headers,
  });
}

export async function delCusttype(
  data: BAS.CustType['custTypeId'][],
  headers = { modId: mapModId.customer },
) {
  return request('/bas/custType/del', {
    method: 'POST',
    data,
    headers,
  });
}

export async function addCusttype(data: BAS.CustType, headers = { modId: mapModId.customer }) {
  return request('/bas/custType/add', {
    method: 'POST',
    data,
    headers,
  });
}
