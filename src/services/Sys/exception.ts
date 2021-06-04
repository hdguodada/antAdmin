import { request } from 'umi';

export async function queryException(
  data: MyRequest<Record<string, unknown>>,
): Promise<RowResponse<SYS.Exception>> {
  return request('/sys/exception/list', {
    data,
    method: 'POST',
  });
}
