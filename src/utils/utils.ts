/* eslint no-useless-escape:0 import/prefer-default-export:0 */
import type { DataNode } from 'antd/lib/tree';

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export function sleep(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export function transformRegionCd(RegionCd: string) {
  return RegionCd.split('-');
}

export function transformTreeData(
  list: any[],
  payload = '',
  key = 'id',
  title = 'label',
  children = 'children',
): DataNode[] {
  return list.map((item) => {
    return {
      [payload]: item[payload],
      key: item[key],
      value: item[key],
      title: item[title],
      children: item[children]
        ? transformTreeData(item[children], payload, key, title, children)
        : undefined,
    };
  });
}

export function transformSimpleTreeData(list: any[], id = 'id', pId = 'pId', title = 'children') {
  return list.map((item) => ({
    pId: item[pId],
    id: item[id],
    value: item[id],
    title: item[title],
  }));
}

export function listToTree(arr: any[], id = 'id', pid = 'pid') {
  const t = new Array(0);
  // eslint-disable-next-line no-return-assign,no-sequences
  const map = arr.reduce((res, item) => ((res[item[id]] = { ...item }), res), {});
  Object.values(map).forEach((item) => {
    // @ts-ignore
    if (!item[pid]) {
      t.push(item);
    } else {
      // @ts-ignore
      const parent = map[item[pid]];
      parent.children = parent.children || [];
      parent.children.push(item);
    }
  });

  return t;
}
