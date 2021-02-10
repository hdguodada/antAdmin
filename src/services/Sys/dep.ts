import { request } from 'umi';

export interface DepFilters {
  DepName: string;
  Phone: string;
}
export async function queryDepList(options: DepFilters | any): Promise<MyResponse<API.DepList>> {
  return request('/sys/dep/list', {
    method: 'POST',
    data: options
  });
}


export async function queryDepTreelist(options: DepFilters): Promise<MyResponse<API.DepList>> {
  return request('/sys/dep/treelist', {
    method: 'POST',
    data: options
  });
}



export async function queryDepTreeSelect(options: any): Promise<MyResponse<SelectOptions>> {
  return request('/sys/dep/treeselect', {
    method: 'POST',
    data: options
  });
}

export async function queryDepInfo(id: number | string): Promise<MyResponse<API.Dep>> {
  return request('/sys/dep/info', {
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
