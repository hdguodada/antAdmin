import { request } from 'umi';

export async function queryFuns(data: MyRequest<API.Fun>): Promise<RowResponse<API.Fun>> {
  return request('/sys/fun/list', {
    data,
    method: 'POST',
  });
}

export async function updFuns(data: MyRequest<API.Fun>) {
  return request('/sys/fun/upd', {
    data,
    method: 'POST',
  });
}

export async function delFuns(data: API.Fun['funId'][]) {
  return request('/sys/fun/del', {
    data,
    method: 'POST',
  });
}

export async function addFuns(data: MyRequest<API.Fun>) {
  return request('/sys/fun/add', {
    data,
    method: 'POST',
  });
}
