declare namespace PUR {
  export type PurchaseOrder = {
    billId?: K;
    dev?: string;
    dateStr: string;
    deliveryDateStr: string | number;
    inDateStr: string;
    srcGhdBillNo?: K[]; // 关联购货单
    srcThdBillNo?: K[]; // 关联购货订单
    srcGhddBillNo?: K[]; // 关联退货单
    cateName?: string;
    cateId?: K;
    spec?: string;
    billNo: K;
    suppId?: K;
    suppName?: string;
    skuId?: K;
    skuName?: string;
    storeName: string;
    storeCd: K;
    unitId?: K; // 采购明细表中的入库单位
    unitName?: string;
    baseUnitId?: K;
    baseUnitName?: string;
    baseQty: number; // 基本单位的库存数量
    secondUnit: string; // 单位比例
    secondQty: string; // 仓库各副单位的状况,不需要展示基本单位的数量
    price: number; // 单价
    amount: number; // 采购金额
    tax: number; // 税额
    taxAmount: number; // 价税合计
    bussType: K; // 业务类型
    inLocationId?: K; // 调入仓库；
    outLoactionId?: K; // 调出仓库；
    inLocationName?: string;
    outLocationName?: string;
    summary?: any[];
    statusName?: string;
    suppTypeName?: string;
  };

  export type serItem = {
    // 序列号入库表单
    serNum: K; //  序列号
    skuId: K; // 出入库skuId
    storeCd: K; // 仓库
    desc: string; // 备注
  };
  export type Entries = {
    dtlId?: K;
    srcDtlId?: K;
    autoId: K;
    spuId?: K;
    spuName?: string;
    cateName?: string;
    spuCode?: K;
    isWarranty?: boolean;
    currentQty?: number;
    realQty?: number;
    code?: K;
    skuImageUrl?: string;
    spec?: string;
    skuId: K;
    skuName: string;
    unitId: K;
    unitList: BAS.Unit[];
    storeCd: K;
    storeName: string;
    unitName: string;
    baseUnitId?: K;
    baseUnitName?: string;
    inLocationUnitId: K;
    inLocationUnitRate: number;
    inDefaultLocationUnitId?: K;
    outDefaultLocationUnitId?: K;
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
    inStoreCd?: K; // 入库仓库；
    outStoreCd?: K; // 出库仓库
    inStoreName?: string;
    outStoreName?: string;
    srcGhdBillNo?: { billId: K; billNo: K }[]; // 关联购货单
    srcThdBillNo?: { billId: K; billNo: K }[]; // 关联购货订单
    srcGhddBillNo?: { billId: K; billNo: K }[]; // 关联退货单
  };
  export type Account = {
    accId: K; //  付款id
    account: ''; // 付款账户
    payment: '24.25'; // 付款金额
    DebtType: K; // 账期类型
    settlement: K; // 结算方式
  };
  export type feeBill = {
    amount: number; // 支出金额
    des?: string; // 支出描述
    suppId: K;
    suppName: string; // 供应商名称
  };
  type base = {
    date: string; // 单据日期;
    deliveryDate?: string; // 交货日期
    billId: K; // 订单id
    billNo: K;
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
    dev?: string;
    srcGhdBillNo?: { billId: K; billNo: K }[]; // 关联购货单
    srcThdBillNo?: { billId: K; billNo: K }[]; // 关联购货订单
    srcGhddBillNo?: { billId: K; billNo: K }[]; // 关联退货单
    cateName?: string;
    cateId?: K;
    suppId?: K;
    suppName?: string;
    custId?: K;
    custName?: string;
    stockInQty?: number; // 已入库数量
    bussType?: BussType; // 订单类型 暂定可能值(0, 1 , 2) 0 购货订单 只需保存,无需入库.  1 购货单 需入库 库存有变化 2 购货退货单 购货单的反向操作
    entries?: Entries[];
    operId?: K;
    operName?: string;
    contactName?: string; // 供应商名称或者客户名称
    printInfo?: {
      chineseTaxAmount: string;
      totalAmount: number;
      totalQty: number;
      totalReducedAmount: number;
      totalTax: number;
      totalTaxAmount: number;
    };
  } & DefaultField;
}
