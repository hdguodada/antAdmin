import { request } from 'umi';
import { mapModId } from '@/utils/utils';
import { message } from 'antd';

export interface DepFilters {
  depName?: string;
  phone?: string;
}
export async function queryDepList(
  options?: DepFilters | any,
  headers = { modId: mapModId.dep },
): Promise<MyResponse<API.DepList>> {
  return request('/sys/dep/list', {
    method: 'POST',
    data: options,
    headers,
  });
}

export async function queryDepTreelist(
  options: DepFilters,
  headers = { modId: mapModId.dep },
): Promise<MyResponse<API.DepList>> {
  return request('/sys/dep/treelist', {
    method: 'POST',
    data: options,
    headers,
  });
}

export async function queryDepTreeSelect(
  options: any,
  headers = { modId: mapModId.dep },
): Promise<MyResponse<SelectOptions>> {
  return request('/sys/dep/treeselect', {
    method: 'POST',
    data: options,
    headers,
  });
}

export async function queryDepInfo(
  id: number | string,
  headers = { modId: mapModId.dep },
): Promise<MyResponse<API.Dep>> {
  return request('/sys/dep/info', {
    method: 'POST',
    params: { id },
    headers,
  });
}

export async function updDep(data: API.Dep, headers = { modId: mapModId.dep }) {
  return request('/sys/dep/upd', {
    method: 'POST',
    data,
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}

export async function delDep(data: API.Dep['depId'][], headers = { modId: mapModId.dep }) {
  return request('/sys/dep/del', {
    method: 'POST',
    data,
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}

export async function addDep(data: API.Dep, headers = { modId: mapModId.dep }) {
  return request('/sys/dep/add', {
    method: 'POST',
    data,
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}
