import { request } from 'umi';

export async function queryDicts(data: MyRequest<API.Dict>): Promise<RowResponse<API.Dict>> {
  return request('/sys/dictDef/list', {
    data,
    method: 'POST',
  });
}

export async function updDict(data: API.Dict) {
  return request('/sys/dictDef/upd', {
    data,
    method: 'POST',
  });
}

export async function delDict(data: API.Dict['dictTypeId'][]) {
  return request('/sys/dictDef/del', {
    data,
    method: 'POST',
  });
}

export async function addDict(data: API.Dict) {
  return request('/sys/dictDef/add', {
    data,
    method: 'POST',
  });
}

export async function queryDictInfo(params: {
  typeId: number;
  id: number;
}): Promise<InfoResponse<API.Dict>> {
  return request('/sys/dictDef/info', {
    params,
    method: 'POST',
  });
}

export async function queryDictTypes(
  data: MyRequest<API.DictType>,
): Promise<RowResponse<API.DictType>> {
  return request('/sys/dicttype/list', {
    method: 'POST',
    data,
  });
}

export async function updDictType(data: API.DictType) {
  return request('/sys/dicttype/upd', {
    data,
    method: 'POST',
  });
}

export async function addDictType(data: API.DictType) {
  return request('/sys/dicttype/add', {
    data,
    method: 'POST',
  });
}

export async function delDictType(data: API.DictType['dictTypeId'][]) {
  return request('/sys/dicttype/del', {
    data,
    method: 'POST',
  });
}
