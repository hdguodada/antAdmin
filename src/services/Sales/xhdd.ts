import { mapModId } from '@/utils/utils';
import { request } from 'umi';

/**
 * 销售订单列表
 * @param data
 * @param url
 * @param headers
 * @returns
 */
export async function xhddList(
  data: QueryRequest<Sale.xhdd>,
  url: string,
  headers = { modId: mapModId.sales },
): Promise<RowResponse<Sale.xhdd>> {
  return request(url, {
    method: 'POST',
    data,
    headers,
  });
}
