import { request } from 'umi';

export async function queryCompanyInfo(id = 1001): Promise<MyResponse<API.Company>> {
  return request('/sys/company/info', {
    params: {
      id,
    },
    method: 'POST',
  });
}

export async function updCompanyInfo(data: API.Company) {
  return request('/sys/company/save', {
    data,
    method: 'POST',
  });
}
