import { request } from 'umi';
import { mapModId } from '@/utils/utils';
import { message } from 'antd';

export async function queryCodeRule(
  data: MyRequest<Record<string, unknown>>,
  headers = { modId: mapModId.coderule },
): Promise<RowResponse<SYS.CodeRule>> {
  return request('/sys/coderule/list', {
    data,
    headers,
    method: 'POST',
  });
}

export async function delCodeRule(data: React.Key[], headers = { modId: mapModId.coderule }) {
  return request('/sys/coderule/del', {
    data,
    method: 'POST',
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}

export async function updCodeRule(data: SYS.CodeRule, headers = { modId: mapModId.coderule }) {
  return request('/sys/coderule/upd', {
    data,
    method: 'POST',
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}

export async function addCodeRule(data: SYS.CodeRule, headers = { modId: mapModId.coderule }) {
  return request('/sys/coderule/add', {
    data,
    method: 'POST',
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}
