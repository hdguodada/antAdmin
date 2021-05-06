import { request } from 'umi';
import { mapModId } from '@/utils/utils';
import { message } from 'antd';

export async function queryCustLevel(
  data: QueryRequest<BAS.CustLevel>,
  headers = { modId: mapModId.customer },
): Promise<RowResponse<BAS.CustLevel>> {
  return request('/bas/custlevel/list', { method: 'POST', data, headers });
}

export async function updCustLevel(data: BAS.CustLevel, headers = { modId: mapModId.customer }) {
  return request('/bas/custlevel/upd', { method: 'POST', data, headers }).then((res) => {
    message.success(res.msg);
  });
}

export async function addCustLevel(data: BAS.CustLevel, headers = { modId: mapModId.customer }) {
  return request('/bas/custlevel/add', { method: 'POST', data, headers }).then((res) => {
    message.success(res.msg);
  });
}

export async function delCustLevel(
  data: BAS.CustLevel['levelId'][],
  headers = { modId: mapModId.customer },
) {
  return request('/bas/custlevel/del', { method: 'POST', data, headers }).then((res) => {
    message.success(res.msg);
  });
}
