import { request } from 'umi';
import { mapModId } from '@/utils/utils';

export async function queryUnit(
  data: QueryRequest<BAS.Unit>,
  headers = { modId: mapModId.product },
): Promise<RowResponse<BAS.Unit>> {
  return request('/bas/unit/list', {
    method: 'POST',
    data,
    headers,
  });
}

export async function queryUnitInfo(
  id: React.Key,
  headers = { modId: mapModId.product },
): Promise<InfoResponse<BAS.Unit>> {
  return request('/bas/unit/info', {
    method: 'GET',
    params: { id },
    headers,
  });
}

export async function updUnit(data: BAS.Unit, headers = { modId: mapModId.product }) {
  return request('/bas/unit/upd', {
    method: 'POST',
    data,
    headers,
  });
}

export async function addUnit(data: BAS.Unit, headers = { modId: mapModId.product }) {
  return request('/bas/unit/add', {
    method: 'POST',
    data,
    headers,
  });
}

export async function delUnit(data: React.Key[], headers = { modId: mapModId.product }) {
  return request('/bas/unit/del', {
    method: 'POST',
    data,
    headers,
  });
}
