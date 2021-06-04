import { request } from 'umi';

import type { RoleDataType } from '@/pages/Sys/role';
import { mapModId } from '@/utils/utils';
import { message } from 'antd';

export async function queryRoleList(
  options: MyRequest<SYS.UserRole>,
  headers = { modId: mapModId.role },
): Promise<RowResponse<RoleDataType>> {
  return request('/sys/role/list', {
    method: 'POST',
    headers,
    data: options,
  });
}

export async function queryRoleInfo(
  id: number | string,
  headers = { modId: mapModId.role },
): Promise<InfoResponse<SYS.UserRole>> {
  return request('/sys/role/info', {
    method: 'POST',
    params: { id },
    headers,
  });
}

export async function updRole(data: SYS.UserRole, headers = { modId: mapModId.role }) {
  return request('/sys/role/upd', {
    method: 'POST',
    data,
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}

export async function addRole(data: SYS.UserRole, headers = { modId: mapModId.role }) {
  return request('/sys/role/add', {
    method: 'POST',
    data,
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}

export async function delRole(data: (string | number)[], headers = { modId: mapModId.role }) {
  return request('/sys/role/del', {
    method: 'POST',
    data,
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}
