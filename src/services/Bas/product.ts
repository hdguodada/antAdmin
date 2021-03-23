import { request } from 'umi';

export async function queryProducts(data: QueryRequest<BAS.Spu>): Promise<RowResponse<BAS.Spu>> {
  return request('/bas/product/list', {
    method: 'POST',
    data,
  });
}

export async function queryProductInfo(id: BAS.Spu['spuId']): Promise<InfoResponse<BAS.Spu>> {
  return request('/bas/product/info', {
    method: 'GET',
    params: { id },
  });
}

export async function updProduct(data: BAS.Spu) {
  return request('/bas/product/updMain', {
    method: 'POST',
    data,
  });
}

export async function addProduct(data: BAS.Spu) {
  return request('/bas/product/add', {
    method: 'POST',
    data,
  });
}

export async function delProduct(data: BAS.Spu['spuId'][]) {
  return request('/bas/product/add', {
    method: 'POST',
    data,
  });
}

export async function queryProductTypes(
  data: QueryRequest<BAS.ProductType>,
): Promise<InfoResponse<BAS.ProductType[]>> {
  return request('/bas/category/list', {
    method: 'POST',
    data,
  });
}

export async function queryTreeProductTypes(
  data: QueryRequest<BAS.ProductType>,
): Promise<InfoResponse<BAS.ProductType[]>> {
  return request('/bas/category/treelist', {
    method: 'POST',
    data,
  });
}

export async function queryProductTypesInfo(
  id: BAS.ProductType['cateId'],
): Promise<InfoResponse<BAS.ProductType>> {
  return request('/bas/category/infoattr', {
    method: 'GET',
    params: { id },
  });
}

export async function updProductType(data: BAS.ProductType) {
  return request('/bas/category/saveattr', {
    method: 'POST',
    data,
  });
}

export async function addProductType(data: BAS.ProductType) {
  return request('/bas/category/add', {
    method: 'POST',
    data,
  });
}

export async function delProductType(data: BAS.Spu['spuId'][]) {
  return request('/bas/category/del', {
    method: 'POST',
    data,
  });
}

export async function querySkuList(
  data: QueryRequest<BAS.mulspecListItem>,
): Promise<RowResponse<BAS.mulspecListItem>> {
  return request('/bas/sku/list', {
    method: 'POST',
    data,
  });
}
