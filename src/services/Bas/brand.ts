import { request } from 'umi';
import { mapModId } from '@/utils/utils';
import { message } from 'antd';

export async function queryBrands(
  data: QueryRequest<BAS.Brand>,
  headers = { modId: mapModId.product },
): Promise<RowResponse<BAS.Brand>> {
  return request('/bas/brand/list', {
    method: 'POST',
    data,
    headers,
  });
}

export async function queryBrandInfo(
  id: BAS.Brand['brandId'],
  headers = { modId: mapModId.product },
): Promise<InfoResponse<BAS.Brand>> {
  return request('/bas/brand/info', {
    method: 'GET',
    params: { id },
    headers,
  });
}

export async function updBrand(data: BAS.Brand, headers = { modId: mapModId.product }) {
  return request('/bas/brand/upd', {
    method: 'POST',
    data,
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}

export async function addBrand(data: BAS.Brand, headers = { modId: mapModId.product }) {
  return request('/bas/brand/add', {
    method: 'POST',
    data,
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}

export async function delBrand(
  data: BAS.Brand['brandId'][],
  headers = { modId: mapModId.product },
) {
  return request('/bas/brand/del', {
    method: 'POST',
    data,
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}
