import { request } from 'umi';

import type { RoleDataType } from '@/pages/Sys/role';

export async function queryRoleList(
  options: MyRequest<API.UserRole>,
): Promise<RowResponse<RoleDataType>> {
  return request('/sys/role/list', {
    method: 'POST',
    data: options,
  });
}

export async function queryRoleInfo(id: number | string): Promise<InfoResponse<API.UserRole>> {
  return request('/sys/role/info', {
    method: 'POST',
    params: { id },
  });
}

export async function updRole(data: API.UserRole): Promise<InfoResponse<unknown>> {
  return request('/sys/role/upd', {
    method: 'POST',
    data,
  });
}

export async function delRole(data: (string | number)[]): Promise<InfoResponse<unknown>> {
  return request('/sys/role/del', {
    method: 'POST',
    data,
  });
}
