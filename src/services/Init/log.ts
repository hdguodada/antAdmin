import { request } from 'umi';

export async function queryLogList(data: MyRequest<{}>): Promise<RowResponse<API.Log>> {
  return request('/sys/log/list', {
    method: 'POST',
    data,
  });
}
