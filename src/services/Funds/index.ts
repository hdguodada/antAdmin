import { mapModId } from '@/utils/utils';
import { request } from 'umi';

export async function fundUnHxList(
  data: QueryRequest<FUND.Entries>,
  headers = { modId: mapModId.funds },
) {
  return request('/funds/findUnhxList', {
    data: {
      ...data,
      dev: 'funds',
    },
    headers,
    method: 'POST',
  });
}
