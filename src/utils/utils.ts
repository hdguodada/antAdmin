/* eslint no-useless-escape:0 import/prefer-default-export:0 */
import type { DataNode } from 'antd/lib/tree';
import type { MenuDataItem } from '@@/plugin-layout/runtime';

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

export function transformRegionCd(regionCd: string) {
  console.log([regionCd.slice(0, 4), regionCd.slice(4, 6), regionCd.slice(7)]);
  return [regionCd.slice(0, 4), regionCd.slice(0, 6), regionCd];
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

export const copyFilterObj = (obj: any, blackList: string[]) => {
  const p = new Set(Object.keys(obj));
  blackList.forEach((a) => p.delete(a));
  const returnObj: any = {};
  [...p].forEach((k) => {
    returnObj[k] = obj[k];
  });
  return returnObj;
};
export const errImage =
  'data:image/png;base64,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';

export const calRate = (record: any) => {
  const curUnit = record.unitList.find((i: any) => i.unitId === record.unitId);
  const rate = curUnit?.rate;
  return rate || 1;
};

export const toDecimal2 = (number: number) => Math.round(number * 100) / 100;

/**
 * 数字补0
 * @param num
 * @param length
 */
export function prefixInteger(num: string, length: number) {
  return (Array(length).join('0') + num).slice(-length);
}

export const calPrice = (values: PUR.Purchase, formRef: any, calRpAmount = false) => {
  if (values.entries !== undefined) {
    let totalQty = 0;
    let totalAmount = 0;
    const entries = (values.entries as PUR.Entries[]).map((record) => {
      const price = toDecimal2(record.price || 0) * (record?.qty || 0);
      const discountRate = record.discountRate || 0;
      const deduction = toDecimal2((price * discountRate) / 100);
      const amount = price - deduction;
      const tax = toDecimal2((amount * (record.taxRate || 0)) / 100);
      const taxPrice = toDecimal2((record.price || 0) * (1 + (record.taxRate || 0) / 100));
      const taxAmount = toDecimal2(tax + amount);
      const rate = calRate(record);
      return {
        ...record,
        rate,
        deduction,
        basQty: (record.qty || 0) * rate,
        beforeDisAmount: price,
        amount,
        taxPrice,
        tax,
        taxAmount,
      };
    });
    entries.forEach((item) => {
      totalQty += item.qty || 0;
      totalAmount += item.taxAmount || 0;
    });
    const disAmount = formRef.current?.getFieldValue('disAmount');
    formRef.current?.setFieldsValue({
      entries,
      totalQty,
      totalAmount: toDecimal2(totalAmount),
      amount: toDecimal2(totalAmount - disAmount),
    });
  }
  if (values.disRate !== undefined) {
    const totalAmount = formRef.current?.getFieldValue('totalAmount');
    if (totalAmount) {
      formRef.current?.setFieldsValue({
        disAmount: toDecimal2((totalAmount * values.disRate) / 100),
        amount: toDecimal2(totalAmount - (totalAmount * values.disRate) / 100),
      });
    }
  }
  if (values.disAmount !== undefined) {
    const totalAmount = formRef.current?.getFieldValue('totalAmount');
    if (totalAmount) {
      formRef.current?.setFieldsValue({
        disRate: toDecimal2((values.disAmount / totalAmount) * 100),
        amount: toDecimal2(totalAmount - values.disAmount),
      });
    }
  }
  if (calRpAmount) {
    const rpAmount = formRef.current?.getFieldValue('rpAmount');
    const amount = formRef.current?.getFieldValue('amount');
    const accountPayableSum = formRef.current?.getFieldValue('accountPayableSum');
    formRef.current?.setFieldsValue({
      arrears: toDecimal2(amount - rpAmount),
      totalArrears: toDecimal2(accountPayableSum + amount - rpAmount),
    });
  }
};

export const calModId = (fatherPath: string, route: MenuDataItem[], path: string) => {
  return route.find((item) => item.path === fatherPath)?.children?.find((j) => j.path === path);
};

export const mapModId = {
  product: '87',
  customer: '86',
  employ: '89',
  store: '99',
  supplier: '88',
  initialization: '92',
  coderule: '65',
  company: '15',
  dep: '10',
  dict: '5',
  fun: '3',
  module: '2',
  role: '9',
  user: '11',
  ver: '7',
  ghdd: '52',
  purchaseGhdd: '52',
  sales: '94',
  account: '93',
  funds: '110',
};

export const filterRoutes = (sysRoutes: any[], apiRoutes: any[]) => {
  const res = sysRoutes.filter((sysRoute) => {
    return apiRoutes.findIndex((apiRoute) => apiRoute.path === sysRoute.path) !== -1;
  });
  return res;
};
