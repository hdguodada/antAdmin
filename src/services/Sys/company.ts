import { request } from 'umi';
import { mapModId } from '@/utils/utils';

export async function queryCompanyInfo(
  id = 1001,
  headers = { modId: mapModId.company },
): Promise<MyResponse<API.Company>> {
  return request('/sys/company/info', {
    params: {
      id,
    },
    headers,
    method: 'POST',
  });
}

export async function updCompanyInfo(data: API.Company, headers = { modId: mapModId.company }) {
  return request('/sys/company/save', {
    data,
    headers,
    method: 'POST',
  });
}
