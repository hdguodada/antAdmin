import { request } from 'umi';

/**
 * 获取用户列表
 * @param options
 */
export async function queryUsers<T>(options: T) {
  return request<MyResponse<API.UserList>>('/sys/user/list', {
    method: 'POST',
    data: options,
  });
}
/**
 * 根据id 获取用户详情
 * @param options
 */
export async function queryUserInfo(id: number | string): Promise<MyResponse<API.CurrentUser>> {
  return request('/sys/user/info', {
    method: 'POST',
    params: {
      id
    }
  });
}

export async function delUser(options: any[]) {
  return request('/sys/user/del', {
    method: 'POST',
    data: options,
  });
}

export async function updUser(params: API.CurrentUser) {
  return request('/sys/user/upd', {
    method: 'POST',
    data: params,
  });
}

export async function queryCurrent() {
  return request<MyResponse<API.CurrentUser>>('/sys/user/current', {
    method: 'POST',
  });
}

export async function queryRouters(): Promise<any> {
  return request('/sys/user/routers', {
    method: 'POST',
  });
}

export async function queryUserTypes(options: {
  pageNumber: number
}): Promise<MyResponse<API.UserRoleList>> {
  return request('/sys/role/list', {
    method: 'POST',
    data: options
  });
}
