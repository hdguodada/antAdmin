import { request } from 'umi';

export async function queryCodeRule(
  data: MyRequest<Record<string, unknown>>,
): Promise<RowResponse<API.CodeRule>> {
  return request('/sys/coderule/list', {
    data,
    method: 'POST',
  });
}
