import { request } from 'umi';

interface DepFilters {
  DepName: string
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



export async function queryDepTreeSelect(options): Promise<MyResponse<SelectOptions>> {
  return request('/sys/dep/treeselect', {
    method: 'POST',
    data: options
  });
}
