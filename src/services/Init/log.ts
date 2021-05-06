import { request } from 'umi';

export async function queryLogList(
  data: MyRequest<API.Log>,
  headers = { modId: '12' },
): Promise<RowResponse<API.Log>> {
  return request('/sys/log/list', {
    method: 'POST',
    data,
    headers,
  });
}
