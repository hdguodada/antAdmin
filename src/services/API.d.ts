declare namespace SYS {
  export type SysParams = {
    useCheck: 0 | 1;
    useTax: 0 | 1;
    tax: number;
  };
  export type Option = {
    type: string;
    id: number;
    label: string;
    isdef: 0 | 1;
  };
  export type Module = {
    modId: string | number; // 模块Id
    modName: string; // 模块名称
    pModId: string | number; // 父级模块Id
    url: string; // 模块地址
    path: string; // 路径
    component: string; // 组件
    icon: string; // 图标
    isModal: string; // 模式窗体
    ver1: string; // 试用版
    ver2: string; // 标准版
    ver3: string; // 增强版
    memo: string; // 模块说明
    cNName: string; // 模块中文名称
    cNIcon: string; // 模块中文Icon
    funs: { funName: string; funId: number | string }[];
  } & DefaultField;
  export type Fun = {
    funId: string | number; // 操作功能Id
    funName: string; // 操作功能名称
    funDesc: string; // 操作功能描述
  } & DefaultField;
  export type DictType = {
    dictTypeId: number | string; // 字典分类Id
    dictTypeName?: string; // 字典分类名称
    enumType?: string; // 枚举类型名
    action?: string;
  } & DefaultField;
  export type Dict = {
    dictTypeId: number | string; // 字典分类Id
    dictId: number | string; // 数据字典Id
    dictName: string; // 字典名称
    dictDesc?: string; // 字典描述
    exten1?: string; // 备用扩展1
    exten2?: string; // 备用扩展3
    exten3?: string; // 备用扩展3
    enumCode?: string; // 枚举值
    isSys?: 0 | 1; // 系统默认
    isDefault?: 0 | 1; // 默认值
    action?: 'add' | 'upd';
  } & DefaultField;
  export type Exception = {
    autoId: number;
    userId: number | string;
    client: string;
    iP: string;
    urlReferrer: string;
    url: string;
    message: string;
    detail: string;
    crtDate: string;
  };
  export type Ver = {
    verId: number;
    platform: string;
    version: string;
    ver1: number;
    ver2: number;
    ver3: number;
    verType: 0 | 1;
    upgradeDate: string;
    upgradeUrl: string;
  } & DefaultField;
  export type CodeRule = {
    codeId: string | number;
    codeName: string;
    len: number;
    yyyy: number;
    mm: number;
    dd: number;
    isRandom: number;
    startNo: number;
    prefix: string;
  } & DefaultField;
  export type Log = {
    userId: string;
    userName: string;
    content: string;
    modId: string;
    modName: string;
    machine: string;
    iP: string;
    refUrl: string;
    url: string;
  } & DefaultField;
  export type Company = {
    cmpId: number;
    cmpName: string;
    logo: string;
    bisTypeId: number;
    bisTypeName: number;
    AreaName: string;
    areaCd: string;
    address: string;
    tel: string;
    zipcode: string;
    www: string;
    email: string;
    linkman: string;
    mobile: string;
    intro: string;
    invoice: string;
    taxPayerNo: string;
    servicePhone: string;
    startDate: string;
    endDate: string;
  } & DefaultField;
  export type Dep = {
    depId: number | string;
    depName: string;
    pDepId: number | string;
    pDepName: string | null;
    leader: string;
    phone: string;
    level?: number;
  } & DefaultField;
  export type DepList = {
    rows: Dep[];
    total: number;
    pageSize: number;
    pageNumber: number;
  };
  export type UserRole = {
    roleId: string | number;
    roleName: string;
    roleDesc: string;
    sortNum: number;
    state: number;
    new?: boolean;
    stateName: string;
    funAuth:
      | {
          modId: number;
          funId: number;
        }[]
      | null;
    dataAuth: number[] | null;
  };
  export type UserRoleList = {
    rows: UserRole[];
    total: number;
    pageSize: number;
    pageNumber: number;
  };
  export type CurrentUser = {
    userName: string;
    realName: string;
    mobile: string;
    depId: string | number;
    depName?: string;
    lastLogin?: string;
    loginCnt?: number;
    userId: React.Key;
    name?: string;
    passWord?: string;
    email?: string;
  };

  export type UserList = {
    rows: CurrentUser[];
    total: number;
    pageSize: number;
    pageNumber: number;
  };

  export type LoginStateType = {
    code: number;
    loginResultInfo: {
      token: string;
      RealName: string;
      UserName: string;
      UserId: number;
    };
    msg: string;
  };

  export type NoticeIconData = {
    id: string;
    key: string;
    avatar: string;
    title: string;
    datetime: string;
    type: string;
    read?: boolean;
    description: string;
    clickClose?: boolean;
    extra: any;
    status: string;
  };
  export type Routers = {
    name: string;
    children?: Routers;
    meta?: any;
    component: string;
    path: string;
  }[];
}
