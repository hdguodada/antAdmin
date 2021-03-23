import { request } from 'umi';

export async function queryCustomers(
  data: QueryRequest<BAS.Customer>,
): Promise<RowResponse<BAS.Customer>> {
  return request('/bas/customer/list', {
    method: 'POST',
    data,
  });
}

export async function updCustomers(data: BAS.Customer) {
  return request('/bas/customer/upd', {
    method: 'POST',
    data,
  });
}

export async function newCustomer(data: {
  basCustRelLists: BAS.CustRel[];
  basCustomer: BAS.Customer;
}) {
  return request('/bas/customer/add', {
    method: 'POST',
    data,
  });
}

export async function queryCustomerInfo(
  id: BAS.Customer['custId'],
): Promise<InfoResponse<BAS.Customer>> {
  return request('/bas/customer/info', {
    method: 'GET',
    params: { id },
  });
}

export async function queryCustomerRel(
  data: QueryRequest<BAS.CustRel>,
): Promise<RowResponse<BAS.CustRel>> {
  return request('/bas/custRel/list', {
    method: 'POST',
    data,
  });
}

export async function updCustomerRel(data: BAS.CustRel) {
  return request('/bas/custRel/upd', {
    method: 'POST',
    data,
  });
}

export async function addCustomerRel(data: BAS.CustRel) {
  return request('/bas/custRel/add', {
    method: 'POST',
    data,
  });
}

export async function delCustomerRel(data: BAS.CustRel['custId'][]) {
  return request('/bas/custRel/del', {
    method: 'POST',
    data,
  });
}

export async function queryCustRecord(
  data: QueryRequest<BAS.CustRecord>,
): Promise<RowResponse<BAS.CustRecord>> {
  return request('/bas/custRecord/list', {
    method: 'POST',
    data,
  });
}

export async function updCustRecord(data: BAS.CustRecord) {
  return request('/bas/custRecord/upd', {
    method: 'POST',
    data,
  });
}

export async function addCustRecord(data: BAS.CustRecord) {
  return request('/bas/custRecord/add', {
    method: 'POST',
    data,
  });
}

export async function delCustRecord(data: BAS.CustRecord['recordId'][]) {
  return request('/bas/custRecord/del', {
    method: 'POST',
    data,
  });
}

export async function queryCustDoc(
  data: QueryRequest<BAS.CustRecord>,
): Promise<RowResponse<BAS.CustDoc>> {
  return request('/bas/custDoc/list', {
    method: 'POST',
    data,
  });
}

export async function updCustDoc(data: BAS.CustDoc) {
  return request('/bas/custDoc/upd', {
    method: 'POST',
    data,
  });
}

export async function addCustDoc(data: BAS.CustDoc) {
  return request('/bas/custDoc/add', {
    method: 'POST',
    data,
  });
}

export async function delCustDoc(data: BAS.CustDoc['docId'][]) {
  return request('/bas/custDoc/del', {
    method: 'POST',
    data,
  });
}
