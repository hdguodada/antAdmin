import { request } from 'umi';

export async function queryAttr(data: QueryRequest<BAS.Attr>): Promise<MyResponse<BAS.Attr[]>> {
  return request('/bas/attribute/list', {
    method: 'POST',
    data,
  });
}

export async function queryAttrInfo(id: BAS.Attr['attrId']): Promise<InfoResponse<BAS.Attr>> {
  return request('/bas/attribute/info', {
    method: 'GET',
    params: { id },
  });
}

export async function updAttr(data: BAS.Attr) {
  return request('/bas/attribute/upd', {
    method: 'POST',
    data,
  });
}

export async function addAttr(data: BAS.Attr) {
  return request('/bas/attribute/add', {
    method: 'POST',
    data,
  });
}

export async function delAttr(data: BAS.Attr['attrId'][]) {
  return request('/bas/attribute/del', {
    method: 'POST',
    data,
  });
}

export async function delAttrValue(data: BAS.AttrVaue['attrValueId'][]) {
  return request('/bas/attribute/delAttrValue', {
    method: 'POST',
    data,
  });
}

export async function addAttrValue(data: {
  attrId: BAS.Attr['attrId'];
  attrValueName: BAS.AttrVaue['attrValueName'];
}) {
  return request('/bas/attribute/addAttrValue', {
    method: 'POST',
    data,
  });
}
