import { request } from 'umi';
import { mapModId } from '@/utils/utils';

export async function queryVers(
  data: MyRequest<Record<string, unknown>>,
  headers = { modId: mapModId.ver },
): Promise<RowResponse<API.Ver>> {
  return request('/sys/ver/list', {
    method: 'POST',
    data,
    headers,
  });
}

export async function queryVerInfo(
  id: number,
  headers = { modId: mapModId.ver },
): Promise<InfoResponse<API.Ver>> {
  return request('/sys/ver/info', {
    method: 'POST',
    params: { id },
    headers,
  });
}
