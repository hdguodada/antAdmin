declare namespace PUR {
  export type PurchaseOrder = {
    dev?: boolean;
    date: string | number;
    deliveryDate: string | number;
    srcGhdBillNo?: React.Key[]; // 关联购货单
    srcThdBillNo?: React.Key[]; // 关联购货订单
    srcGhddBillNo?: React.Key[]; // 关联退货单
    cateName?: string;
    cateId?: React.Key;
    spec?: string;
    billNo: React.Key;
    suppId?: React.Key;
    suppName?: string;
    skuId?: React.Key;
    skuName?: string;
    storeName: string;
    storeCd: React.Key;
    unitId?: React.Key; // 采购明细表中的入库单位
    unitName?: string;
    baseUnitId?: React.Key;
    baseUnitName?: string;
    baseQty: number; // 基本单位的库存数量
    secondUnit: string; // 单位比例
    secondQty: string; // 仓库各副单位的状况,不需要展示基本单位的数量
    price: number; // 单价
    amount: number; // 采购金额
    tax: number; // 税额
    taxAmount: number; // 价税合计
    transTypeName: string;
    transType: React.Key; // 业务类型
    inLocationId?: React.Key; // 调入仓库；
    outLoactionId?: React.Key; // 调出仓库；
    inLocationName?: string;
    outLocationName?: string;
  };

  export type serItem = {
    // 序列号入库表单
    serNum: React.Key; //  序列号
    skuId: React.Key; // 出入库skuId
    storeCd: React.Key; // 仓库
    desc: string; // 备注
  };
  export type Entries = {
    dtlId?: React.Key;
    srcDtlId?: React.Key;
    autoId: React.Key;
    spuId?: React.Key;
    spuName?: string;
    cateName?: string;
    barCode?: React.Key;
    isWarranty?: boolean;
    currentQty?: number;
    realQty?: number;
    code?: React.Key;
    skuImageUrl?: string;
    spec?: string;
    skuId: React.Key;
    skuName: string;
    unitId: React.Key;
    unitList: BAS.Unit[];
    storeCd: React.Key;
    storeName: string;
    unitName: string;
    baseUnitId?: React.Key;
    baseUnitName?: string;
    inLocationUnitId: React.Key;
    inLocationUnitRate: number;
    inDefaultLocationUnitId?: React.Key;
    outDefaultLocationUnitId?: React.Key;
    isSerNum: boolean;
    qty?: number; // 数量
    price?: number; // 单价
    discountRate?: number; // 折扣
    deduction?: number; // 折扣额
    beforeDisAmount?: number; // 优惠前金额
    amount?: number; // 优惠后金额
    description?: string;
    serNumList: SN[]; // 序列号管理
    basQty?: number; // 基本数量
    taxPrice?: number; // 含税单价
    taxRate?: number; // 税率
    tax?: number; // 税额
    taxAmount?: number; // 价税合计
    inStoreCd?: React.Key; // 入库仓库；
    outStoreCd?: React.Key; // 出库仓库
    inStoreName?: string;
    outStoreName?: string;
    srcGhdBillNo?: { billId: React.Key; billNo: React.Key }[]; // 关联购货单
    srcThdBillNo?: { billId: React.Key; billNo: React.Key }[]; // 关联购货订单
    srcGhddBillNo?: { billId: React.Key; billNo: React.Key }[]; // 关联退货单
  };
  export type Account = {
    accId: React.Key; //  付款id
    account: ''; // 付款账户
    payment: '24.25'; // 付款金额
    DebtType: React.Key; // 账期类型
    settlement: React.Key; // 结算方式
  };
  export type feeBill = {
    amount: number; // 支出金额
    des?: string; // 支出描述
    suppId: React.Key;
    suppName: string; // 供应商名称
  };
  type base = {
    date: string; // 单据日期;
    deliveryDate?: string; // 交货日期
    billId: React.Key; // 订单id
    billNo: React.Key;
    totalAmount?: number; // 单据总金额
    totalQty?: number; // 单据总数量
    disRate?: number; // 优惠
    disAmount?: number; // 付款优惠
    rpAmount?: number; // 付款金额
    amount?: number; // 购货金额
    billStatus?: number; // 订单状态
    checkStatus?: number; // 是否审核
  };
  export type Purchase = base & {
    dev?: boolean;
    srcGhdBillNo?: { billId: React.Key; billNo: React.Key }[]; // 关联购货单
    srcThdBillNo?: { billId: React.Key; billNo: React.Key }[]; // 关联购货订单
    srcGhddBillNo?: { billId: React.Key; billNo: React.Key }[]; // 关联退货单
    cateName?: string;
    cateId?: React.Key;
    suppId?: React.Key;
    suppName?: string;
    stockInQty?: number; // 已入库数量
    bussType?: BussType; // 订单类型 暂定可能值(0, 1 , 2) 0 购货订单 只需保存,无需入库.  1 购货单 需入库 库存有变化 2 购货退货单 购货单的反向操作
    entries?: Entries[];
    operId?: React.Key;
    operName?: string;
  } & DefaultField;
}
