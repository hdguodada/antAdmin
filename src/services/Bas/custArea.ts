import { request } from 'umi';
import { mapModId } from '@/utils/utils';

export async function queryCustArea(
  data: QueryRequest<BAS.CustArea>,
  headers = { modId: mapModId.customer },
): Promise<RowResponse<BAS.CustArea>> {
  return request('/bas/custArea/list', { method: 'POST', data, headers });
}

export async function queryCustAreaTree(
  params: any,
  headers = { modId: mapModId.customer },
): Promise<RowResponse<BAS.CustArea>> {
  return request('/bas/custArea/treelist', { method: 'POST', params, headers });
}

export async function addCustArea(data: BAS.CustArea, headers = { modId: mapModId.customer }) {
  return request('/bas/custArea/add', { method: 'POST', data, headers });
}

export async function updCustArea(data: BAS.CustArea, headers = { modId: mapModId.customer }) {
  return request('/bas/custArea/upd', { method: 'POST', data, headers });
}

export async function delCustArea(
  data: BAS.CustArea['areaId'][],
  headers = { modId: mapModId.customer },
) {
  return request('/bas/custArea/del', { method: 'POST', data, headers });
}
