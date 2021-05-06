declare module 'slash2';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';
declare module 'omit.js';

// google analytics interface
type GAFieldsObject = {
  eventCategory: string;
  eventAction: string;
  eventLabel?: string;
  eventValue?: number;
  nonInteraction?: boolean;
};

type MyResponse<T> = {
  code: 0;
  data: T;
  msg: string;
};

type RowResponse<T> = {
  code: 0;
  data: {
    rows: T[];
    total: number;
    pageSize: number;
    pageNumber: number;
    columns?: string[];
  };
  msg: string;
};

type InfoResponse<T> = {
  code: 0;
  data: T;
  msg: string;
};

type MyRequest<T> = { pageSize?: number; pageNumber?: number; modId?: number } & Partial<T>;
type QueryRequest<T> = {
  pageSize?: number;
  pageNumber?: number;
  current?: number;
  queryFilter?: Partial<T> & {
    pageSize?: number | undefined;
    current?: number | undefined;
    keyword?: string | undefined;
  };
  dev?: boolean;
  action?: 'add' | 'upd';
};
type MyHeaders = {
  modId: string;
};
type Region = {
  id: string;
  label: string;
  children?: Region[];
};
type globalData = {
  RegionTree: Region[];
};

type SelectOptions = {
  label?: string;
  value: string | number;
  type?: string;
  attrValues?: any;
}[];
type TreeData = { title: string; value: React.Key; key?: React.Key; children?: TreeData[] }[];
type DefaultField = {
  status?: number; //
  memo?: string; // 备注
  sortNum?: number; // 顺序号
  state?: number; // 状态
  delFlag?: 0 | 1; // 删除标志
  crtId?: string | number; // 添加人Id
  crtName?: string; // 添加人
  crtDate?: string; // 添加日期
  updId?: string | number; // 修改人Id
  updName?: string; // 修改人
  updDate?: string; // 修改日期
  dev?: boolean;
};

type Window = {
  ga: (
    command: 'send',
    hitType: 'event' | 'pageview',
    fieldsObject: GAFieldsObject | string,
  ) => void;
  reloadAuthorized: () => void;
};

type labelInValue = {
  value: string | number;
  key: string | number;
  label: string;
};

type FormProps<T> = {
  action: 'add' | 'upd';
  actionRef?: React.MutableRefObject<ActionType | undefined>;
  visible?: boolean;
  setVisible?: (visible: boolean) => void;
  initialValues?: T;
  refresh?: () => void;
};

declare let ga: () => void;
// preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
declare let ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: 'site' | undefined;
declare const REACT_APP_ENV: 'test' | 'dev' | 'pre' | false;
declare const BASE_URL: '/api' | '/';
declare const STATIC_URL: 'https://erp.zjqsa.com';
