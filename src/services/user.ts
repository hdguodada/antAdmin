import { request } from 'umi';

export async function queryUsers<T>(options: T) {
  return request<MyResponse<API.UserList>>('/sys/user/list', {
    method: "POST",
    data: options
  });
}

export async function delUser(options: any[]) {
  return request('/sys/user/del', {
    method: "POST",
    data: options
  })
}

export async function updUser(params: API.CurrentUser) {
  return request('/sys/user/upd', {
    method: "POST",
    data: params
  })
}

export async function queryCurrent() {
  return request<MyResponse<API.CurrentUser>>('/sys/user/current', {
    method: "POST"
  });
}

export async function queryNotices(): Promise<any> {
  return request<{ data: API.NoticeIconData[] }>('/api/notices');
}
export async function queryRouters(): Promise<any> {
  return request('/sys/user/routers', {
    method: "POST"
  })
}
