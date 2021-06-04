import { request } from 'umi';

export async function queryLogList(
  data: MyRequest<SYS.Log>,
  headers = { modId: '12' },
): Promise<RowResponse<SYS.Log>> {
  return request('/sys/log/list', {
    method: 'POST',
    data,
    headers,
  });
}
