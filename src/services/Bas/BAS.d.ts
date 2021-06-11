declare namespace BAS {
  export type Account = {
    accountId: string; // 账户Id
    accountNo: string; // 账户编号
    accountName: string; // 账户名称
    isDeafult: number; // 是否默认
    balanceDate: string; // 余额日期
    initBalance: number; // 期初余额
    currentBalance: number; // 当前余额
    lastSettBalance: number; // 上次结账后余额
    accountTypeId: number; // 结算账户类别
  } & DefaultField;
  export type Store = {
    storeCd: string;
    storeName: string;
    linkman: string;
    tel: string;
    mobile: string;
    address: string;
  } & DefaultField;
  export type Post = {
    postId: K;
    postName: string;
  } & DefaultField;
  export type Employ = {
    empId: K;
    depId: number;
    empCd: string;
    empName: string;
    spell: string;
    idcard: string;
    birthday: string;
    sex: number;
    tel: string;
    mobile: string;
    qq: string;
    weixin: string;
    email: string;
    address: string;
    joinDate: string;
    leaveDate: string;
    leaveReason?: any;
    depName?: string;
  } & Post &
    DefaultField;
  export type AttrVaue = {
    attrValueId: number;
    attrValueName: string;
  };
  export type Attr = {
    autoId: string | number;
    attrId?: number | string;
    attrName: string;
    attrValues: AttrVaue[];
  };
  export type Unit = {
    unitId: K;
    unitName: string;
    rate?: number; // 1-基准单位
    price?: number;
    unitMid?: {
      key: string;
      value: K;
      label: K;
    };
    inLocationUnitId?: K;
    outLocationUnitId?: K;
    autoId: K;
  } & DefaultField;
  export type Brand = {
    brandId: number;
    brandName: string;
    letter: string;
    logo: string;
    logoMid?: {
      response?: { data: { path: string } };
      url: string;
    }[];
  } & DefaultField;
  export type ProductType = {
    cateId: number;
    pcateId: number;
    cateName: string;
    hasChild: number;
    level: number;
    path: string;
    attrList: Attr[];
    iconUrl: string;
    isLeaf: 0 | 1;
    children: ProductType[];
  } & DefaultField;
  type mulspecListItem = {
    skuId?: K;
    skuName?: string;
    autoId: K;
    skuCode: string; // 商品条码
    skuImageUrl: string;
    attrList?: { attrId: K; attrValueId: K }[];
    priceList: Spu['priceList'][];
  };

  export type Spu = {
    status: number; // 1上架 0 下架
    spuId: K;
    spuName: string; // 产品名称
    cateId: ProductType['cateId']; // 商品类别
    cateName: ProductType['cateName'];
    brandId: Brand['brandId']; // 产品品牌
    brandName: Brand['brandName'];
    spuCode: string; // spu的商品编码
    prodTag: number[]; // 产品标签 字典- ProdTag
    keywords: string; // 搜索关键字
    spec: string; // isMulSpec = 0的情况下规格型号
    isMulSpec: boolean; // 是否多规格
    baseUnit?: Unit['unitId'];
    selectedValueList: Attr[];
    unitList: Unit[]; // 数组数量为1代表单单位
    unitListText: Unit['unitId'][];
    storeCd: K; // 默认仓库
    storeName: K;
    outLocationUnitId: K; // 默认出库单位
    inLocationUnitId: K; // 默认入库单位
    isSerNum: boolean; // 是否启用序列号管理
    isWarranty: boolean; // 有效日期
    isMulUnit: boolean;
    salePrice: number; // 零售价
    wholesalePrice: number; // 批发价
    memo: string; // 备注
    albumList: {
      url?: string;
      response?: InfoResponse<{ path: string }>;
    }[];
    desc: string; // 富文本
    basePrice: number; // 成本价 基准价格
    priceList: CustLevel & {
      unitPrices?: (Unit & { price: number })[];
    };
    mulspecList: mulspecListItem[];
  };
  export type CustDoc = {
    docId: K;
    custId: K;
    docTypeId: K;
    docName: string;
    docPath: string;
    custName: string;
    docTypeName: string;
  } & DefaultField;
  export type CustRecord = {
    recordId: K;
    custId: K;
    relId: K;
    recordTypeId: K;
    content: string;
    exeDate: string;
    doc01: string;
    doc02: string;
    doc03: string;
    userId: K;
    delFlag: number;
    custName: string;
    relName: string;
    recordTypeName: string;
    realName: string;
  } & DefaultField;
  export type SuppType = {
    suppTypeId: K;
    psuppTypeId: K;
    suppTypeName: string;
    level?: any;
    children: SuppType[];
  } & DefaultField;
  export type Finance = {
    suppId?: K;
    custId?: K;
    financeId?: K;
    taxInvoice: string;
    taxPayerNo: string;
    taxBank: string;
    taxBankAccount: string;
    taxAddress?: string;
    taxTel?: string;
    taxEmail?: string;
    debtTypeId?: any;
    initDate: string;
    isDebtInit?: any;
    initPayable?: any;
    initPayableOther?: any;
    initPerPayable?: any;
    arrearageSum: number;
    lastSettArreSum: number;
    action?: 'add' | 'upd';
  } & DefaultField;

  export type CustomerFinance = {
    custId: K;
    invoice: string; // 开票名称
    taxNumber: string; // 开票税号
    invoiceAddress: string; // 开户地址
    invoiceTel: string; // 开户电话
    bankName: string; // 开户名称
    bank: string; // 开户银行
    bankAccount: string; // 银行账号
    alipay: string; // 支付宝账号
    wxpay: string; // 微信账号
    settlementId: number; // 结算方式
    debtTypeId: number; // 账期类型
    initDate: string; // 余额日期
    isInit: number; // 对账初始化
    initRecv: number; // 期初应收款
    initPerRecv?: number; // 期初预收款
    InitRecvOther?: number; // 期初其他应收款
    creditLimit: number; // 授信额度
  } & DefaultField;
  export type Supplier = {
    address: string; // 地址
    contactName?: string;
    buyerId: number; // 采购员
    buyerName: string;
    checkDate: string; // 审核日期
    checkId: number; // 审核员
    checkName: string;
    checkStatus: number; // 审核状态
    depId: number; // 所属部门
    depName: string;
    email: string; // 邮箱
    fax: string; // 传真
    intro: string; // 简介
    mainRelId: number; // 联系人
    mainRelName: string;
    memo: string; // 备注
    regioncd: string; // 所在地
    relMobile: string; // 联系人手机
    relName: string; // 联系人
    spell: string;
    suppCd: string;
    suppId: K;
    suppName: string;
    suppShort: string; // 简称
    suppTypeId: number; // 供应商类型
    suppTypeName: string;
    tel: string;
    www: string;
    zipCode: string;
    accountPayableSum: number; // 应付款
    regioncdMid: string[];
  } & DefaultField;
  export type CustArea = {
    areaId: string | number; // 客户区域Id
    pareaId: string | number; // 上级区域Id
    areaName: string; // 区域名称
    level: string | number; // 层级
    children: CustArea[];
  } & DefaultField;
  export type Rel = {
    relId: K; // 联系人Id
    custId?: K; // 客户Id
    isMain: number; // 主联系人
    relName: string; // 姓名
    job: string; // 职位
    sex: 0 | 1; // 性别
    birthday: string; // 出生日期
    relMobile: string; // 手机号码
    relTel: string; // 工作电话
    relEmail: string; // 工作邮箱
    relWeiXin: string; // 微信号
    relQq: string; // QQ号码
    relMemo: string; // 备注
    suppId: K;
    action: 'add' | 'upd';
    autoId?: K;
  } & DefaultField;
  export type CustLevel = {
    levelId: K; // 客户等级Id
    levelName: string; // 客户等级名称
    discount: number; // 折扣率
  } & DefaultField;
  export type CustAddress = {
    custId: K;
    addressId: K;
    linkman: string;
    mobile: string;
    regioncd: string;
    address: string;
    fullAddress: string;
    isDefault: boolean;
    regioncdMid: K[];
  } & DefaultField;
  export type CustType = {
    custTypeId: string | number; // 客户类别Id
    pcustTypeId: string | number; // 上级类别Id
    custTypeName: string; // 客户类别名称
    level: number; // 层级
    children?: CustType[];
  } & DefaultField;
  export type Customer = {
    contactName?: string;
    custId: string | number; // 客户Id
    pCustId: string | number; // 上级客户
    isPerson: 0 | 1; // 个人客户
    custCd: string; // 客户编号
    custName: string; // 客户名称
    custShort: string; // 客户简称
    spell: string; // 助记码
    custLevelId: string | number; // 客户等级
    custLevelName: string;
    custTypeId: string | number; // 客户类别
    custTypeName: string;
    custTags: string; // 客户标签
    depId: string | number; // 所属部门Id
    depName: string;
    salesmanId: string | number; // 所属业务员Id
    salesman: string;
    custAreaId: string | number; // 所属区域Id
    custAreaName: string;
    share: string; // 共享给
    sourceId: string | number; // 客户来源
    creditLevelId: string | number; // 信用等级
    relLevelId: string | number; // 关系等级
    tel: string; // 公司电话
    fax: string; // 公司传真
    regioncd: string; // 所在地区
    regionCdMid: string[]; // 所在地区中转字段
    address: string; // 详细地址
    zipCode: string; // 邮政编码
    wWW: string; // 公司网址
    email: string; // 公司邮箱
    industryId: string | number; // 所属行业
    intro: string; // 公司简介
    isHot: 0 | 1; // 热点客户
    hotTypeId: string; // 热点分类
    hotDesc: string; // 热点说明
    mainRelId: string | number; // 主联系人Id
    sortNum: string; // 显示顺序
    seaId: string; // 所属公海
    accountPayableSum: number;
  } & DefaultField;
}
