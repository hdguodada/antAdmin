import { request } from 'umi';

import type { RoleDataType } from '@/pages/Sys/role'


export async function queryRoleList(options: MyRequest<RoleDataType>): Promise<RowResponse<RoleDataType>> {
  return request('/sys/role/list', {
    method: 'POST',
    data: options
  });
}

export async function queryRoleInfo(id: number | string): Promise<InfoResponse<RoleDataType>> {
  return request('/sys/role/info', {
    method: 'POST',
    params: { id }
  });
}


export async function updDep(data: API.Dep): Promise<MyResponse<API.Dep>> {
  return request('/sys/dep/treeselect', {
    method: 'POST',
    data
  });
}
