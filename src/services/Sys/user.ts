import { request } from 'umi';
import { mapModId } from '@/utils/utils';
import { message } from 'antd';

/**
 * 获取用户列表
 * @param options
 * @param headers
 */
export async function queryUsers(
  options: QueryRequest<API.CurrentUser>,
  headers = { modId: mapModId.user },
) {
  return request<MyResponse<API.UserList>>('/sys/user/list', {
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
): Promise<MyResponse<API.CurrentUser>> {
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

export async function updUser(params: API.CurrentUser, headers = { modId: mapModId.user }) {
  return request('/sys/user/upd', {
    method: 'POST',
    data: params,
    headers,
  });
}

export async function addUser(params: API.CurrentUser, headers = { modId: mapModId.user }) {
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
  return request<MyResponse<API.CurrentUser>>('/sys/user/current', {
    method: 'POST',
    headers,
  });
}

export async function queryRouters(headers = { modId: mapModId.user }): Promise<any> {
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
): Promise<MyResponse<API.UserRoleList>> {
  return request('/sys/role/list', {
    method: 'POST',
    data: options,
    headers,
  });
}
