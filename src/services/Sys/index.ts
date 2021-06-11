import { request } from 'umi';

export * from './dep';
export * from './role';
export * from './user';
export * from './company';
export * from './coderule';
export * from './ver';
export * from './exception';
export * from './dict';
export * from './fun';
export * from './module';

export async function queryOptions(
  data = {},
  headers = { modId: '92' },
): Promise<MyResponse<SYS.Option[]>> {
  return request('/sys/option/all', {
    method: 'POST',
    data,
    headers,
  });
}

export async function queryParams(
  data = {},
  headers = { modId: '92' },
): Promise<MyResponse<SYS.SysParams>> {
  return request('/sys/para/info', {
    data,
    headers,
  });
}

export async function saveParams(
  data = {},
  headers = { modId: '92' },
): Promise<MyResponse<Record<string, string>>> {
  return request('/sys/para/save', {
    method: 'POST',
    data,
    headers,
  });
}

export async function queryRegionTree(
  data = {},
  headers = { modId: '92' },
): Promise<RowResponse<Region>> {
  return request('/sys/region/treeselect', {
    method: 'POST',
    data,
    headers,
  });
}

export async function getCode(
  codeId: string,
  headers = { modId: '92' },
): Promise<MyResponse<string>> {
  return request('/sys/coderule/getcode', {
    method: 'GET',
    params: {
      codeId,
    },
    headers,
  });
}

export async function getCodeList(
  codeId: string,
  num: number,
  headers = { modId: '92' },
): Promise<MyResponse<string[]>> {
  return request('/sys/coderule/getcodelist', {
    method: 'GET',
    params: {
      codeId,
      num,
    },
    headers,
  });
}

export async function upload(type: string, data: any, headers = { modId: '92' }) {
  return request('/sys/upload/upload', {
    method: 'POST',
    params: { type },
    headers,
    data,
  });
}
