import { request } from 'umi';
import { mapModId } from '@/utils/utils';
import { BussTypeApiUrl } from '@/pages/Purchase/components';

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
  data?: Partial<STORE.invOiForm>,
  url = '/bis/stockInventory/queryToPd',
): Promise<InfoResponse<STORE.invOiForm>> {
  return request(url, {
    data,
    method: 'POST',
    headers: { modId: mapModId.store },
  });
}

export async function stockInventoryInfo(id: K): Promise<InfoResponse<STORE.invOiForm>> {
  return request('/bis/stockInventory/info', {
    params: { id },
    method: 'GET',
    headers: { modId: mapModId.store },
  });
}

export async function stockInventoryAdd(
  data: Partial<STORE.invOiForm>,
): Promise<InfoResponse<STORE.invOiForm>> {
  return request('/bis/stockInventory/add', {
    data,
    method: 'POST',
    headers: { modId: mapModId.store },
  });
}

export async function queryPdRecordList(
  data: STORE.invOiParams,
): Promise<RowResponse<STORE.invOiForm>> {
  return request(`${BussTypeApiUrl.盘点}/list`, {
    data,
    method: 'POST',
    headers: { modId: mapModId.store },
  });
}

export async function delPdRecordList(data: K[]): Promise<RowResponse<STORE.invOiForm>> {
  return request(`${BussTypeApiUrl.盘点}/del`, {
    data,
    method: 'POST',
    headers: { modId: mapModId.store },
  });
}
