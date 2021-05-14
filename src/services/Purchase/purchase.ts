import { message } from 'antd';
import { request } from 'umi';
import { mapModId } from '@/utils/utils';
import { AdvancedSearchFormField } from '@/utils/columns';

/**
 * 新增购货订单
 * @param data
 * @param url
 * @param headers
 * @returns
 */
export async function addPurchase(
  data: PUR.Purchase,
  url = '/bis/purcOrder/add',
  headers = { modId: mapModId.purchaseGhdd },
): Promise<InfoResponse<{ id: string }>> {
  return request(url, {
    method: 'POST',
    data,
    headers,
  });
}

/**
 * 修改购货订单
 * @param data
 * @param url
 * @param headers
 * @returns
 */
export async function updPurchase(
  data: PUR.Purchase,
  url = '/bis/purcOrder/upd',
  headers = { modId: mapModId.purchaseGhdd },
) {
  return request(url, {
    method: 'POST',
    data,
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}

/**
 * 删除购货订单
 * @param data
 * @param url
 * @param headers
 * @returns
 */
export async function delPurchase(
  data: React.Key[],
  url = '/bis/purcOrder/del',
  headers = { modId: mapModId.purchaseGhdd },
) {
  return request(url, {
    method: 'POST',
    data,
    headers,
  });
}

/**
 * 开启关闭购货订单
 * @param data
 * @param action
 * @param headers
 * @returns
 */
export async function openClosePurchase(
  data: React.Key[],
  action = 'open',
  headers = { modId: mapModId.purchaseGhdd },
) {
  return request(`/bis/purcOrder/${action}`, {
    method: 'POST',
    data,
    headers,
  });
}

/**
 * 购货订单列表
 * @param data
 * @param url
 * @param headers
 * @returns
 */
export async function queryPurchase(
  data: QueryRequest<AdvancedSearchFormField>,
  url = '/bis/Ghdd/list',
  headers = { modId: mapModId.purchaseGhdd },
): Promise<RowResponse<PUR.Purchase>> {
  return request(url, {
    method: 'POST',
    data,
    headers,
  });
}

/**
 * 购货订单详情
 * @returns
 * @param id
 * @param url
 * @param headers
 * @param data
 */
export async function queryPurchaseInfo(
  id: React.Key,
  url = '/bis/purcOrder/info',
  headers = { modId: mapModId.purchaseGhdd },
  data?: any,
): Promise<InfoResponse<PUR.Purchase>> {
  return request(url, {
    method: 'GET',
    params: { id },
    headers,
    data,
  });
}

/**
 * 购货订单未入库部分详情
 * @returns
 * @param id
 * @param headers
 * @param url
 */
export async function queryPurchaseUnStockIn(
  id: React.Key,
  headers = { modId: mapModId.purchaseGhdd },
  url:
    | '/bis/purcOrder/infoUnStockIn'
    | '/bis/purchase/infoReturn'
    | '/bis/purcOrder/infoReturnable',
): Promise<InfoResponse<PUR.Purchase>> {
  return request(url, { method: 'GET', params: { id }, headers });
}

type PurchaseRequest = {
  data: [string, string]; // 单据日期
  deliveryDate: [string, string]; // 交割日期
  suppId: React.Key; // 供应商
  skuId: React.Key;
  billNo: React.Key;
};
/**
 * 采购订单追踪表
 * @returns
 * @param data
 * @param headers
 */
export async function purchaseOrderListByGhdd(
  data: QueryRequest<PurchaseRequest>,
  headers = { modId: mapModId.purchaseGhdd },
): Promise<RowResponse<PUR.PurchaseOrder>> {
  return request('/report/purchase/purcOrderTrack', {
    method: 'POST',
    data,
    headers,
  });
}

/**
 * 采购明细表
 * @returns
 * @param data
 * @param headers
 */
export async function purchaseDtl(
  data: QueryRequest<PurchaseRequest>,
  headers = { modId: mapModId.purchaseGhdd },
): Promise<ReportsResponse<PUR.PurchaseOrder>> {
  return request('/report/purchase/purchaseDtl', {
    method: 'POST',
    data,
    headers,
  });
}

/**
 * 采购汇总表(按商品)
 * @returns
 * @param data
 * @param headers
 */
export async function purcSumBySku(
  data: QueryRequest<PurchaseRequest>,
  headers = { modId: mapModId.purchaseGhdd },
): Promise<RowResponse<PUR.PurchaseOrder>> {
  return request('/report/purchase/purcSumBySku', {
    method: 'POST',
    data,
    headers,
  });
}

/**
 * 采购汇总表(按供应商)
 * @returns
 * @param data
 */
export async function purcSumBySupp(
  data: QueryRequest<PurchaseRequest>,
): Promise<RowResponse<PUR.PurchaseOrder>> {
  return request('/report/purchase/purcSumBySupp', {
    method: 'POST',
    data,
  });
}

/**
 * 采购汇总表(按供应商)
 * @returns
 * @param data
 */
export async function purcAndPay(
  data: QueryRequest<PurchaseRequest>,
): Promise<RowResponse<PUR.PurchaseOrder>> {
  return request('/report/purchase/purcAndPay', {
    method: 'POST',
    data: {
      ...data,
    },
  });
}
