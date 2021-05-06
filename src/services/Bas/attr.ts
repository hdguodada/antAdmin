import { request } from 'umi';
import { mapModId } from '@/utils/utils';
import { message } from 'antd';

export async function queryAttr(
  data: QueryRequest<BAS.Attr>,
  headers = { modId: mapModId.product },
): Promise<MyResponse<BAS.Attr[]>> {
  return request('/bas/attribute/list', {
    method: 'POST',
    data,
    headers,
  });
}

export async function queryAttrInfo(
  id: BAS.Attr['attrId'],
  headers = { modId: mapModId.product },
): Promise<InfoResponse<BAS.Attr>> {
  return request('/bas/attribute/info', {
    method: 'GET',
    params: { id },
    headers,
  });
}

export async function updAttr(data: BAS.Attr, headers = { modId: mapModId.product }) {
  return request('/bas/attribute/upd', {
    method: 'POST',
    data,
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}

export async function addAttr(data: BAS.Attr, headers = { modId: mapModId.product }) {
  return request('/bas/attribute/add', {
    method: 'POST',
    data,
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}

export async function delAttr(data: BAS.Attr['attrId'][], headers = { modId: mapModId.product }) {
  return request('/bas/attribute/del', {
    method: 'POST',
    data,
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}

export async function delAttrValue(
  data: BAS.AttrVaue['attrValueId'][],
  headers = { modId: mapModId.product },
) {
  return request('/bas/attribute/delAttrValue', {
    method: 'POST',
    data,
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}

export async function addAttrValue(
  data: {
    attrId: BAS.Attr['attrId'];
    attrValueName: BAS.AttrVaue['attrValueName'];
  },
  headers = { modId: mapModId.product },
) {
  return request('/bas/attribute/addAttrValue', {
    method: 'POST',
    data,
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}
