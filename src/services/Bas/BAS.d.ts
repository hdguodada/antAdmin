declare namespace BAS {
  export type purchase = {
    autoId: React.Key;
    spuId: React.Key;
    unitId: React.Key;
    storeCd: React.Key;
    spuId: React.Key;
    basUnitId: React.Key;
  };
  export type Store = {
    storeCd: string;
    storeName: string;
    linkman: string;
    tel: string;
    mobile: string;
    address: string;
  } & DefaultField;
  export type Post = {
    postId: React.Key;
    postName: string;
  } & DefaultField;
  export type Employ = {
    empId: React.Key;
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
    attrId: number | string;
    attrName: string;
    attrValues: AttrVaue[];
  };
  export type Unit = {
    unitId: React.Key;
    unitName: string;
    rate: number; // 1-基准单位
    price?: number;
    unitMid?: {
      key?: string;
      value: React.Key;
      label: string;
    };
    autoId: React.Key;
  } & DefaultField;
  export type Brand = {
    brandId: number;
    brandName: string;
    letter: string;
    logo: string;
    logoMid?: any;
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

    children: ProductType[];
  } & DefaultField;
  type mulspecListItem = {
    skuId?: React.Key;
    skuName?: string;
    autoId: React.Key;
    code: string; // 商品编码
    skuImageUrl: string;
    attrList?: { attrId: React.Key; attrValueId: React.Key }[];
    priceList: Spu['priceList'][];
  };

  export type Spu = {
    status: number; // 1上架 0 下架
    spuId: React.Key;
    spuName: string; // 产品名称
    cateId: ProductType['cateId']; // 商品类别
    cateName: ProductType['cateName'];
    brandId: Brand['brandId']; // 产品品牌
    brandName: Brand['brandName'];
    barCode: string; // spu的商品编码
    prodTag: number[]; // 产品标签 字典- ProdTag
    keywords: string; // 搜索关键字
    spec: string; // isMulSpec = 0的情况下规格型号
    isMulSpec: number; // 是否多规格
    baseUnit?: Unit['unitId'];
    selectedValueList: Attr[];
    unitList: Unit[]; // 数组数量为1代表单单位
    unitListText: Unit['unitId'][];
    storeCd: React.Key; // 默认仓库
    storeName: React.Key;
    outLocationUnitId: number; // 默认出库单位
    inLocationUnitId: number; // 默认入库单位
    isSerNum: 0 | 1; // 是否启用序列号管理
    isWarranty: 0 | 1; // 有效日期
    isMulUnit: 0 | 1; // 是否多计量
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
    docId: number;
    custId: number;
    docTypeId: number;
    docName: string;
    docPath: string;
    custName: string;
    docTypeName: string;
  } & DefaultField;
  export type CustRecord = {
    recordId: number;
    custId: number;
    relId: number;
    recordTypeId: number;
    content: string;
    exeDate: string;
    doc01: string;
    doc02: string;
    doc03: string;
    userId: number;
    delFlag: number;
    custName: string;
    relName: string;
    recordTypeName: string;
    realName: string;
  } & DefaultField;
  export type SuppType = {
    suppTypeId: number;
    psuppTypeId: number;
    suppTypeName: string;
    level?: any;
  } & DefaultField;
  export type Supplier = {
    address: string; // 地址
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
    memo: string; // 备注
    regioncd: string; // 所在地
    relMobile: string; // 联系人手机
    relName: string; // 联系人
    spell: string;
    suppCd: string;
    suppId: React.Key;
    suppName: string;
    suppShort: string; // 简称
    suppTypeId: number; // 供应商类型
    suppTypeName: string;
    tel: string;
    www: string;
    zipCode: string;
    regioncdMid: string[];
  } & DefaultField;
  export type CustArea = {
    areaId: string | number; // 客户区域Id
    pareaId: string | number; // 上级区域Id
    areaName: string; // 区域名称
    level: string | number; // 层级
  } & DefaultField;
  export type CustRel = {
    relId: string | number; // 联系人Id
    custId: string | number; // 客户Id
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
    relAli1: string; // 阿里旺旺1
    relAli2: string; // 阿里旺旺2
    relAli3: string; // 阿里旺旺3
    relMemo: string; // 备注
    action: 'add' | 'upd';
  } & DefaultField;
  export type CustLevel = {
    levelId: React.Key; // 客户等级Id
    levelName: string; // 客户等级名称
    discount: number; // 折扣率
  } & DefaultField;
  export type CustType = {
    custTypeId: string | number; // 客户类别Id
    pcustTypeId: string | number; // 上级类别Id
    custTypeName: string; // 客户类别名称
    level: number; // 层级
    children?: CustArea[];
  } & DefaultField;
  export type Customer = {
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
  } & DefaultField;
}
