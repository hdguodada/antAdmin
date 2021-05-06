declare namespace STORE {
  export type SN = {
    autoId: number;
    serNum: string;
    memo?: string;
    date?: string;
    storeName?: string;
    bussType?: React.Key;
    skuName?: string;
    skuId?: React.Key;
    storeCd?: React.Key;
    status?: number;
  };
  export type invOiParams = {
    date?: string;
    storeCd?: React.Key;
    cateId?: React.Key;
    skuName?: string;
    showZero?: boolean;
    isSerNum: boolean;
  };
  export type invOiResponse = {
    billId: React.Key;
    storeName: string;
    unitName: string;
    skuName: string;
    code: React.Key;
    storeCd: React.Key;
    skuId: React.Key;
    qty: number;
    cateName: string;
    unitId: React.Key;
    spuName: string;
    cateId: React.Key;
    isSerNum: boolean; // 盘点的都是非序列管理的商品
    checkInventory?: number; //  盘点库存
    change?: number;
  };
  export type invOiPdForm = {
    isSerNum: boolean;
    entries: invOiResponse[];
  };
}
