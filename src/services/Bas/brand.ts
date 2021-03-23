import { request } from 'umi';

export async function queryBrands(data: QueryRequest<BAS.Brand>): Promise<RowResponse<BAS.Brand>> {
  return request('/bas/brand/list', {
    method: 'POST',
    data,
  });
}

export async function queryBrandInfo(id: BAS.Brand['brandId']): Promise<InfoResponse<BAS.Brand>> {
  return request('/bas/brand/info', {
    method: 'GET',
    params: { id },
  });
}

export async function updBrand(data: BAS.Brand) {
  return request('/bas/brand/upd', {
    method: 'POST',
    data,
  });
}

export async function addBrand(data: BAS.Brand) {
  return request('/bas/brand/add', {
    method: 'POST',
    data,
  });
}

export async function delBrand(data: BAS.Brand['brandId'][]) {
  return request('/bas/brand/del', {
    method: 'POST',
    data,
  });
}
