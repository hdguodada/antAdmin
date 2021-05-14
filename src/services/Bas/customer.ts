import { request } from 'umi';
import { mapModId } from '@/utils/utils';
import { message } from 'antd';

export async function queryCustomers(
  data: QueryRequest<BAS.Customer>,
  headers = { modId: mapModId.customer },
): Promise<RowResponse<BAS.Customer>> {
  return request('/bas/customer/list', {
    method: 'POST',
    headers,
    data,
  });
}

export async function queryCustomerAddress(
  data: QueryRequest<BAS.CustAddress>,
  headers = { modId: mapModId.customer },
): Promise<RowResponse<BAS.CustAddress>> {
  return request('/bas/custAddress/list', {
    method: 'POST',
    headers,
    data,
  });
}

export async function delCustomerAddress(
  data: K[],
  headers = { modId: mapModId.customer },
): Promise<RowResponse<BAS.CustAddress>> {
  return request('/bas/custAddress/del', {
    method: 'POST',
    headers,
    data,
  });
}

export async function delCustomer(data: React.Key[], headers = { modId: mapModId.customer }) {
  return request('/bas/customer/del', {
    method: 'POST',
    data,
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}

export async function updCustomers(data: BAS.Customer, headers = { modId: mapModId.customer }) {
  return request('/bas/customer/upd', {
    method: 'POST',
    data,
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}

export async function newCustomer(
  data: {
    basCustRelLists: [BAS.Rel];
    basCustomer: BAS.Customer;
    basCustFinance: BAS.CustomerFinance;
  },
  headers = { modId: mapModId.customer },
) {
  return request('/bas/customer/add', {
    method: 'POST',
    data,
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}

export async function queryCustomerInfo(
  id: BAS.Customer['custId'],
  headers = { modId: mapModId.customer },
): Promise<InfoResponse<BAS.Customer>> {
  return request('/bas/customer/info', {
    method: 'GET',
    headers,
    params: { id },
  });
}

export async function queryCustomerRel(
  data: QueryRequest<BAS.Rel>,
  headers = { modId: mapModId.customer },
): Promise<RowResponse<BAS.Rel>> {
  return request('/bas/custRel/list', {
    method: 'POST',
    headers,
    data,
  });
}

export async function updCustomerRel(data: BAS.Rel, headers = { modId: mapModId.customer }) {
  return request('/bas/custRel/upd', {
    method: 'POST',
    data,
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}

export async function addCustomerRel(data: BAS.Rel, headers = { modId: mapModId.customer }) {
  return request('/bas/custRel/add', {
    method: 'POST',
    data,
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}

export async function delCustomerRel(data: React.Key[], headers = { modId: mapModId.customer }) {
  return request('/bas/custRel/del', {
    method: 'POST',
    data,
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}

export async function queryCustRecord(
  data: QueryRequest<BAS.CustRecord>,
  headers = { modId: mapModId.customer },
): Promise<RowResponse<BAS.CustRecord>> {
  return request('/bas/custRecord/list', {
    method: 'POST',
    headers,
    data,
  });
}

export async function updCustRecord(data: BAS.CustRecord, headers = { modId: mapModId.customer }) {
  return request('/bas/custRecord/upd', {
    method: 'POST',
    data,
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}

export async function addCustRecord(data: BAS.CustRecord, headers = { modId: mapModId.customer }) {
  return request('/bas/custRecord/add', {
    method: 'POST',
    data,
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}

export async function delCustRecord(
  data: BAS.CustRecord['recordId'][],
  headers = { modId: mapModId.customer },
) {
  return request('/bas/custRecord/del', {
    method: 'POST',
    data,
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}

export async function queryCustDoc(
  data: QueryRequest<BAS.CustRecord>,
  headers = { modId: mapModId.customer },
): Promise<RowResponse<BAS.CustDoc>> {
  return request('/bas/custDoc/list', {
    method: 'POST',
    headers,
    data,
  });
}

export async function updCustDoc(data: BAS.CustDoc, headers = { modId: mapModId.customer }) {
  return request('/bas/custDoc/upd', {
    method: 'POST',
    data,
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}

export async function addCustDoc(data: BAS.CustDoc, headers = { modId: mapModId.customer }) {
  return request('/bas/custDoc/add', {
    method: 'POST',
    data,
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}

export async function delCustDoc(
  data: BAS.CustDoc['docId'][],
  headers = { modId: mapModId.customer },
) {
  return request('/bas/custDoc/del', {
    method: 'POST',
    data,
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}

export async function queryCustomerFinanceInfo(
  id: React.Key,
  headers = { modId: mapModId.supplier },
): Promise<InfoResponse<BAS.CustomerFinance>> {
  return request('/bas/custFinance/info', {
    method: 'GET',
    params: { id },
    headers,
  });
}

export async function saveCustomerFinance(
  data: BAS.Finance,
  headers = { modId: mapModId.supplier },
  action = 'add',
) {
  return request(`/bas/custFinance/${action}`, {
    method: 'POST',
    data,
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}
