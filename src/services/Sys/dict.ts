import { request } from 'umi';
import { mapModId } from '@/utils/utils';
import type React from 'react';
import { message } from 'antd';

export async function queryDicts(
  data: MyRequest<API.Dict>,
  headers = { modId: mapModId.dict },
): Promise<RowResponse<API.Dict>> {
  return request('/sys/dictDef/list', {
    data,
    method: 'POST',
    headers,
  });
}

export async function updDict(data: API.Dict, headers = { modId: mapModId.dict }) {
  return request('/sys/dictDef/upd', {
    data,
    method: 'POST',
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}

export async function delDict(
  data: { dictTypeId: React.Key; dictId: React.Key }[],
  headers = { modId: mapModId.dict },
) {
  return request('/sys/dictDef/del', {
    data,
    method: 'POST',
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}

export async function addDict(data: API.Dict, headers = { modId: mapModId.dict }) {
  return request('/sys/dictDef/add', {
    data,
    method: 'POST',
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}

export async function queryDictInfo(
  params: {
    typeId: number;
    id: number;
  },
  headers = { modId: mapModId.dict },
): Promise<InfoResponse<API.Dict>> {
  return request('/sys/dictDef/info', {
    params,
    method: 'POST',
    headers,
  });
}

export async function queryDictTypes(
  data: QueryRequest<API.DictType>,
  headers = { modId: mapModId.dict },
): Promise<RowResponse<API.DictType>> {
  return request('/sys/dicttype/list', {
    method: 'POST',
    headers,
    data,
  });
}

export async function updDictType(data: API.DictType, headers = { modId: mapModId.dict }) {
  return request('/sys/dicttype/upd', {
    data,
    method: 'POST',
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}

export async function addDictType(data: API.DictType, headers = { modId: mapModId.dict }) {
  return request('/sys/dicttype/add', {
    data,
    method: 'POST',
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}

export async function delDictType(
  data: API.DictType['dictTypeId'][],
  headers = { modId: mapModId.dict },
) {
  return request('/sys/dicttype/del', {
    data,
    method: 'POST',
    headers,
  }).then((res) => {
    message.success(res.msg);
  });
}
