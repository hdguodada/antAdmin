import { request } from 'umi';

export async function queryVers(
  data: MyRequest<Record<string, unknown>>,
): Promise<RowResponse<API.Ver>> {
  return request('/sys/ver/list', {
    method: 'POST',
    data,
  });
}

export async function queryVerInfo(id: number): Promise<InfoResponse<API.Ver>> {
  return request('/sys/ver/info', {
    method: 'POST',
    params: { id },
  });
}
