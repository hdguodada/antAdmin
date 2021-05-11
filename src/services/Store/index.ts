import { request } from 'umi';
import { mapModId } from '@/utils/utils';

export * from './serNum';

/**
 * 调拨单列表
 * @param data
 * @param url
 * @returns
 */
export async function storeOIList(
  data: QueryRequest<PUR.PurchaseOrder>,
  url = '/bas/store/storeOI',
): Promise<RowResponse<PUR.PurchaseOrder>> {
  return request(url, {
    method: 'POST',
    data: {
      ...data,
      dev: 'bas',
    },
  });
}

export async function getCurrentStock(
  data: { skuId: React.Key; storeCd: React.Key },
  headers = { modId: mapModId.store },
) {
  return request('/bis/stock/getCurrent', { method: 'POST', data, headers });
}

export async function getSkuStock(
  params: { skuId: React.Key },
  headers = { modId: mapModId.store },
) {
  return request('/bis/stock/getSkuStock', { method: 'GET', params, headers });
}

export async function queryToPd(
  params: STORE.invOiParams,
): Promise<RowResponse<STORE.invOiResponse>> {
  return request('/bas/inventory/queryToPd', {
    params,
    method: 'GET',
    data: { dev: 'bas' },
    headers: { modId: mapModId.store },
  });
}

export async function queryPdRecordList(
  params: STORE.invOiParams,
): Promise<RowResponse<STORE.invOiResponse>> {
  return request('/bas/inventory/queryPdRecordList', {
    params,
    method: 'GET',
    data: { dev: 'bas' },
    headers: { modId: mapModId.store },
  });
}
