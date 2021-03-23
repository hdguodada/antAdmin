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

export async function queryOptions(): Promise<MyResponse<API.Option[]>> {
  return request('/sys/option/all', {
    method: 'POST',
  });
}

export async function queryRegionTree(): Promise<RowResponse<Region>> {
  return request('/sys/region/treeselect', {
    method: 'POST',
    data: {},
  });
}

export async function getCode(codeId: string): Promise<MyResponse<string>> {
  return request('/sys/coderule/getcode', {
    method: 'GET',
    params: {
      codeId,
    },
  });
}

export async function getCodeList(codeId: string, num: number): Promise<MyResponse<string[]>> {
  return request('/sys/coderule/getcodelist', {
    method: 'GET',
    params: {
      codeId,
      num,
    },
  });
}

export async function upload(type: string) {
  return request('/sys/upload/upload', {
    method: 'POST',
    params: { type },
  });
}
