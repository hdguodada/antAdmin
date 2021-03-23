import { request } from 'umi';

export async function querySuppliers(
  data: QueryRequest<BAS.Supplier>,
): Promise<RowResponse<BAS.Supplier>> {
  return request('/bas/supplier/list', {
    method: 'POST',
    data,
  });
}

export async function querySuppliersInfo(
  id: BAS.Supplier['suppId'],
): Promise<InfoResponse<BAS.Supplier>> {
  return request('/bas/supplier/info', {
    method: 'GET',
    params: { id },
  });
}

export async function updSupplier(data: BAS.Supplier) {
  return request('/bas/supplier/upd', {
    method: 'POST',
    data,
  });
}

export async function addSupplier(data: {
  basCustRelLists: BAS.Supplier[];
  Supplier: BAS.Supplier;
}) {
  return request('/bas/supplier/add', {
    method: 'POST',
    data,
  });
}
