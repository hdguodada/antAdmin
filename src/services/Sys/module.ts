import { request } from 'umi';
import { mapModId } from '@/utils/utils';
import { message } from 'antd';

export async function queryModules(
  data: MyRequest<SYS.Module>,
  headers = { modId: '9' },
): Promise<RowResponse<SYS.Module>> {
  return request('/sys/module/treelist', {
    data,
    method: 'POST',
    headers,
  });
}

export async function updModule(data: SYS.Module, headers = { modId: mapModId.module }) {
  return request('/sys/module/upd', {
    data,
    method: 'POST',
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}

export async function addModule(data: SYS.Module, headers = { modId: mapModId.module }) {
  return request('/sys/module/add', {
    data,
    method: 'POST',
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}

export async function delModule(data: any, headers = { modId: mapModId.module }) {
  return request('/sys/module/del', {
    data,
    method: 'POST',
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}

export async function queryModuleInfo(
  id: SYS.Module['modId'],
  headers = { modId: mapModId.module },
): Promise<InfoResponse<SYS.Module>> {
  return request('/sys/module/info', {
    params: {
      id,
    },
    headers,
    method: 'POST',
  });
}
