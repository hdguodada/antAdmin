import { request } from 'umi';
import { mapModId } from '@/utils/utils';
import { message } from 'antd';
import { MenuDataItem } from '@@/plugin-layout/runtime';

/**
 * 获取用户列表
 * @param options
 * @param headers
 */
export async function queryUsers(
  options: QueryRequest<SYS.CurrentUser>,
  headers = { modId: mapModId.user },
) {
  return request<MyResponse<SYS.UserList>>('/sys/user/list', {
    method: 'POST',
    data: options,
    headers,
  });
}
/**
 * 根据id 获取用户详情
 * @param id
 * @param headers
 */
export async function queryUserInfo(
  id: React.Key,
  headers = { modId: mapModId.user },
): Promise<MyResponse<SYS.CurrentUser>> {
  return request('/sys/user/info', {
    method: 'POST',
    params: {
      id,
    },
    headers,
  });
}

export async function delUser(options: any[], headers = { modId: mapModId.user }) {
  return request('/sys/user/del', {
    method: 'POST',
    data: options,
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}

export async function updUser(params: SYS.CurrentUser, headers = { modId: mapModId.user }) {
  return request('/sys/user/upd', {
    method: 'POST',
    data: params,
    headers,
  });
}

export async function addUser(params: SYS.CurrentUser, headers = { modId: mapModId.user }) {
  return request('/sys/user/add', {
    method: 'POST',
    data: params,
    headers,
  });
}

export async function resetPassword(
  headers = { modId: mapModId.user },
): Promise<MyResponse<unknown>> {
  return request('/sys/user/initpwd', {
    method: 'POST',
    headers,
  });
}

export async function queryCurrent(headers = { modId: mapModId.user }) {
  return request<MyResponse<SYS.CurrentUser>>('/sys/user/current', {
    method: 'POST',
    headers,
  });
}

export async function queryRouters(
  headers = { modId: mapModId.user },
): Promise<InfoResponse<MenuDataItem[]>> {
  return request('/sys/user/routers', {
    method: 'POST',
    headers,
  });
}

export async function queryUserRoles(
  options: {
    pageNumber: number;
  },
  headers = { modId: mapModId.user },
): Promise<MyResponse<SYS.UserRoleList>> {
  return request('/sys/role/list', {
    method: 'POST',
    data: options,
    headers,
  });
}
