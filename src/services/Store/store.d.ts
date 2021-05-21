declare namespace STORE {
  export type SN = {
    autoId: number;
    serNum: string;
    memo?: string;
    date?: string;
    storeName?: string;
    bussType?: K;
    skuName?: string;
    skuId?: K;
    storeCd?: K;
    status?: number;
  };
  export type invOiParams = {
    date?: string;
    storeCd?: K;
    cateId?: K;
    skuName?: string;
    showZero?: number;
    isSerNum: number;
  };
  export type invOiEntries = {
    cateId: K;
    cateName: string;
    checkInventoryQty?: any;
    dtlId?: any;
    isSerNum: number;
    memmo: string;
    qty: number;
    skuId: K;
    skuName: string;
    spuCode: string;
    storeCd: string;
    storeName: string;
    unitId: K;
    unitName: string;
    autoId: K;
    unitList: PUR.Entries['unitList'];
    inventoryResult: any;
  };
  export type invOiForm = {
    billId: K;
    billNo: K;
    pdDate: string;
    date: string;
    pdDateStr: string;
    storeName: string;
    skuName: string;
    cateId: K;
    isDelete: number;
    showZero: number;
    storeCd: string;
    isSerNum: 0 | 1;
    entries: invOiEntries[];
    pdResult: { billId: K; billNo: string }[];
  };
}
