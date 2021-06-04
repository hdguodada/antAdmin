import { request } from 'umi';
import { mapModId } from '@/utils/utils';
import { message } from 'antd';

export async function queryFuns(
  data: MyRequest<SYS.Fun>,
  headers = { modId: mapModId.fun },
): Promise<RowResponse<SYS.Fun>> {
  return request('/sys/fun/list', {
    data,
    method: 'POST',
    headers,
  });
}

export async function updFuns(data: MyRequest<SYS.Fun>, headers = { modId: mapModId.fun }) {
  return request('/sys/fun/upd', {
    data,
    method: 'POST',
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}

export async function delFuns(data: SYS.Fun['funId'][], headers = { modId: mapModId.fun }) {
  return request('/sys/fun/del', {
    data,
    method: 'POST',
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}

export async function addFuns(data: MyRequest<SYS.Fun>, headers = { modId: mapModId.fun }) {
  return request('/sys/fun/add', {
    data,
    method: 'POST',
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}
