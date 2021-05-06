import { mapModId } from '@/utils/utils';
import type React from 'react';
import { request } from 'umi';

export async function queryAccount(
  data: QueryRequest<BAS.Account>,
  headers = { modId: mapModId.account },
): Promise<RowResponse<BAS.Account>> {
  return request('/bas/account/list', {
    method: 'POST',
    data,
    headers,
  });
}

export async function queryAccountInfo(
  id: BAS.Account['accountId'],
  headers = { modId: mapModId.account },
): Promise<InfoResponse<BAS.Account>> {
  return request('/bas/account/info', {
    method: 'GET',
    params: { id },
    headers,
  });
}

export async function updAccount(data: BAS.Account, headers = { modId: mapModId.account }) {
  return request('/bas/account/upd', {
    method: 'POST',
    data,
    headers,
  });
}

export async function addAccount(data: BAS.Account, headers = { modId: mapModId.account }) {
  return request('/bas/account/add', {
    method: 'POST',
    data,
    headers,
  });
}

export async function delAccount(data: React.Key[], headers = { modId: mapModId.account }) {
  return request('/bas/account/del', {
    method: 'POST',
    data,
    headers,
  });
}
