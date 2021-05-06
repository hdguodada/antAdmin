import { request } from 'umi';
import { mapModId } from '@/utils/utils';
import { message } from 'antd';
import type React from 'react';

export async function querySuppliers(
  data: QueryRequest<BAS.Supplier>,
  headers = { modId: mapModId.supplier },
): Promise<RowResponse<BAS.Supplier>> {
  return request('/bas/supplier/list', {
    method: 'POST',
    headers,
    data,
  });
}

export async function querySuppliersInfo(
  id: BAS.Supplier['suppId'],
  headers = { modId: mapModId.supplier },
): Promise<InfoResponse<BAS.Supplier>> {
  return request('/bas/supplier/info', {
    method: 'GET',
    headers,
    params: { id },
  });
}

export async function saveSupplier(
  data: BAS.Supplier,
  headers = { modId: mapModId.supplier },
  action = 'upd',
) {
  return request(`/bas/supplier/${action}`, {
    method: 'POST',
    data,
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}

export async function addSupplier(
  data: {
    basSupplier: BAS.Supplier;
    basSuppRelLists: BAS.Rel[];
    basSuppFinance: BAS.Finance;
  },
  headers = { modId: mapModId.supplier },
) {
  return request(`/bas/supplier/add`, {
    method: 'POST',
    data,
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}

export async function delSupplier(data: React.Key[], headers = { modId: mapModId.supplier }) {
  return request('/bas/supplier/del', {
    method: 'POST',
    data,
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}

export async function querySuppFinanceInfo(
  id: React.Key,
  headers = { modId: mapModId.supplier },
): Promise<InfoResponse<BAS.Finance>> {
  return request('/bas/SuppFinance/info', {
    method: 'GET',
    params: { id },
    headers,
  });
}

export async function saveSuppFinance(
  data: BAS.Finance,
  headers = { modId: mapModId.supplier },
  action = 'add',
) {
  return request(`/bas/SuppFinance/${action}`, {
    method: 'POST',
    data,
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}

export async function querySuppRel(
  data: QueryRequest<BAS.Rel>,
  headers = { modId: mapModId.supplier },
): Promise<RowResponse<BAS.Rel>> {
  return request('/bas/suppRel/list', {
    method: 'POST',
    data,
    headers,
  });
}

export async function saveSuppRel(data: BAS.Rel, headers = { modId: mapModId.supplier }) {
  const action = data?.action || 'add';
  return request(`/bas/suppRel/${action}`, {
    method: 'POST',
    data,
    headers,
  });
}

export async function delSuppRel(data: React.Key[], headers = { modId: mapModId.supplier }) {
  return request(`/bas/suppRel/del`, {
    method: 'POST',
    data,
    headers,
  });
}
