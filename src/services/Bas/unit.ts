import { request } from 'umi';

export async function queryUnit(data: QueryRequest<BAS.Unit>): Promise<RowResponse<BAS.Unit>> {
  return request('/bas/unit/list', {
    method: 'POST',
    data,
  });
}

export async function queryUnitInfo(id: BAS.Unit['unitId']): Promise<InfoResponse<BAS.Unit>> {
  return request('/bas/unit/info', {
    method: 'GET',
    params: { id },
  });
}

export async function updUnit(data: BAS.Unit) {
  return request('/bas/unit/upd', {
    method: 'POST',
    data,
  });
}

export async function addUnit(data: BAS.Unit) {
  return request('/bas/unit/add', {
    method: 'POST',
    data,
  });
}

export async function delUnit(data: BAS.Product['productId'][]) {
  return request('/bas/unit/del', {
    method: 'POST',
    data,
  });
}
