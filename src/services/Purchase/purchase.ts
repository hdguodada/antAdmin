import { message } from 'antd';
import { request } from 'umi';
import { mapModId } from '@/utils/utils';

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
  data: QueryRequest<PUR.Purchase>,
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
  date: [string, string]; // 单据日期
  deliveryDate: [string, string]; // 交割日期
  suppId: React.Key; // 供应商
  skuId: React.Key;
  billNo: React.Key;
};
/**
 * 采购订单追踪表
 * @returns
 * @param date
 * @param headers
 */
export async function purchaseOrderListByGhdd(
  date: QueryRequest<PurchaseRequest>,
  headers = { modId: mapModId.purchaseGhdd },
): Promise<RowResponse<PUR.Purchase>> {
  return request('/bas/purchaseOrderList/purchaseGhdd', {
    method: 'POST',
    data: {
      ...date,
      dev: true,
    },
    headers,
  });
}

/**
 * 采购明细表
 * @returns
 * @param date
 * @param headers
 */
export async function purchaseOrderListByDetail(
  date: QueryRequest<PurchaseRequest>,
  headers = { modId: mapModId.purchaseGhdd },
): Promise<RowResponse<PUR.PurchaseOrder>> {
  return request('/bas/purchaseOrderList/purchaseDetail', {
    method: 'POST',
    data: {
      ...date,
      dev: true,
    },
    headers,
  });
}

/**
 * 采购汇总表(按商品)
 * @returns
 * @param date
 * @param headers
 */
export async function purchaseDetailBySku(
  date: QueryRequest<PurchaseRequest>,
  headers = { modId: mapModId.purchaseGhdd },
): Promise<RowResponse<PUR.PurchaseOrder>> {
  return request('/bas/purchaseOrderList/purchaseDetailBySku', {
    method: 'POST',
    data: {
      ...date,
      dev: true,
    },
    headers,
  });
}

/**
 * 采购汇总表(按供应商)
 * @returns
 * @param date
 */
export async function purchaseDetailBySupp(
  date: QueryRequest<PurchaseRequest>,
): Promise<RowResponse<PUR.PurchaseOrder>> {
  return request('/bas/purchaseOrderList/purchaseDetailBySupp', {
    method: 'POST',
    data: {
      ...date,
      dev: true,
    },
  });
}

/**
 * 采购汇总表(按供应商)
 * @returns
 * @param date
 */
export async function purchaseDetailByPay(
  date: QueryRequest<PurchaseRequest>,
): Promise<RowResponse<PUR.PurchaseOrder>> {
  return request('/bas/purchaseOrderList/purchaseDetailByPay', {
    method: 'POST',
    data: {
      ...date,
    },
  });
}
