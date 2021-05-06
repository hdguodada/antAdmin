import { request } from 'umi';
import { mapModId } from '@/utils/utils';
import { message } from 'antd';

export async function queryProducts(
  data: QueryRequest<BAS.Spu>,
  headers = { modId: mapModId.product },
): Promise<RowResponse<BAS.Spu>> {
  return request('/bas/product/list', {
    method: 'POST',
    data,
    headers,
  });
}

export async function queryProductInfo(
  id: BAS.Spu['spuId'],
  headers = { modId: mapModId.product },
): Promise<InfoResponse<BAS.Spu>> {
  return request('/bas/product/info', {
    method: 'GET',
    params: { id },
    headers,
  });
}

export async function updProduct(data: BAS.Spu, headers = { modId: mapModId.product }) {
  return request('/bas/product/updMain', {
    method: 'POST',
    data,
    headers,
  });
}

export async function addProduct(data: BAS.Spu, headers = { modId: mapModId.product }) {
  return request('/bas/product/add', {
    method: 'POST',
    data,
    headers,
  }).then((res) => {
    message.success(res.msg);
    return res;
  });
}

export async function delProduct(data: BAS.Spu['spuId'][], headers = { modId: mapModId.product }) {
  return request('/bas/product/add', {
    method: 'POST',
    data,
    headers,
  });
}

export async function queryProductTypes(
  data: QueryRequest<BAS.ProductType>,
  headers = { modId: mapModId.product },
): Promise<InfoResponse<BAS.ProductType[]>> {
  return request('/bas/category/list', {
    method: 'POST',
    data,
    headers,
  });
}

export async function queryTreeProductTypes(
  data: QueryRequest<BAS.ProductType>,
  headers = { modId: mapModId.product },
): Promise<InfoResponse<BAS.ProductType[]>> {
  return request('/bas/category/treelist', {
    method: 'POST',
    data,
    headers,
  });
}

export async function queryProductTypesInfo(
  id: BAS.ProductType['cateId'],
  headers = { modId: mapModId.product },
): Promise<InfoResponse<BAS.ProductType>> {
  return request('/bas/category/infoattr', {
    method: 'GET',
    params: { id },
    headers,
  });
}

export async function updProductType(data: BAS.ProductType, headers = { modId: mapModId.product }) {
  return request('/bas/category/saveattr', {
    method: 'POST',
    data,
    headers,
  });
}

export async function addProductType(data: BAS.ProductType, headers = { modId: mapModId.product }) {
  return request('/bas/category/add', {
    method: 'POST',
    data,
    headers,
  });
}

export async function delProductType(
  data: BAS.Spu['spuId'][],
  headers = { modId: mapModId.product },
) {
  return request('/bas/category/del', {
    method: 'POST',
    data,
    headers,
  });
}

export async function querySkuList(
  data: QueryRequest<PUR.Entries>,
  headers = { modId: mapModId.product },
): Promise<RowResponse<PUR.Entries>> {
  return request('/bas/product/skuList', {
    method: 'POST',
    data,
    headers,
  });
}
