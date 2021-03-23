import { request } from 'umi';

export async function queryModules(data: MyRequest<API.Module>): Promise<RowResponse<API.Module>> {
  return request('/sys/module/treelist', {
    data,
    method: 'POST',
  });
}

export async function updModule(data: API.Module) {
  return request('/sys/module/upd', {
    data,
    method: 'POST',
  });
}

export async function delModule(data: any) {
  return request('/sys/module/del', {
    data,
    method: 'POST',
  });
}

export async function queryModuleInfo(id: API.Module['modId']): Promise<InfoResponse<API.Module>> {
  return request('/sys/module/info', {
    params: {
      id,
    },
    method: 'POST',
  });
}
