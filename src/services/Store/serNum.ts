import { mapModId } from '@/utils/utils';
import { request } from 'umi';

/**
 * 序列号追踪表
 * @param data
 * @param url
 * @returns
 */
export async function serNumDetail(data: QueryRequest<STORE.SN>): Promise<RowResponse<STORE.SN>> {
  return request('/bas/store/serNum/list', {
    method: 'POST',
    data: {
      ...data,
      dev: 'bas',
    },
  });
}

/**
 * 序列号选择
 * @param data
 * @param url
 * @returns
 */
export async function serNumFindList(data: QueryRequest<STORE.SN>): Promise<RowResponse<STORE.SN>> {
  return request('/bis/stock/getSerialNum', {
    method: 'POST',
    data,
  });
}

/**
 * 仓库报表
 * @param data
 * @returns
 */
export async function storeReports(
  params: QueryRequest<PUR.PurchaseOrder>,
  headers = { modId: mapModId.store },
  url = '',
): Promise<RowResponse<PUR.PurchaseOrder>> {
  return request(url, {
    params,
    headers,
    data: {
      dev: 'bas',
    },
  });
}
