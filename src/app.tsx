import React from 'react';
import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import { notification } from 'antd';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { history } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import type { RequestOptionsInit, ResponseError } from 'umi-request';
import { queryCurrent, queryRouters } from './services/Sys/user';
import {
  SmileOutlined,
  HeartOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  SafetyOutlined,
  GlobalOutlined,
  SettingFilled,
  MoneyCollectOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const IconMap: any = {
  smile: <SmileOutlined style={{ fontSize: '16px' }} />,
  heart: <HeartOutlined style={{ fontSize: '16px' }} />,
  ShoppingCartOutlined: <ShoppingCartOutlined style={{ fontSize: '16px' }} />,
  AppstockOutlined: <AppstoreOutlined style={{ fontSize: '16px' }} />,
  SafetyOutlined: <SafetyOutlined style={{ fontSize: '16px' }} />,
  GlobalOutlined: <GlobalOutlined style={{ fontSize: '16px' }} />,
  SettingFilled: <SettingFilled style={{ fontSize: '16px' }} />,
  MoneyCollectOutlined: <MoneyCollectOutlined style={{ fontSize: '16px' }} />,
  SettingOutlined: <SettingOutlined style={{ fontSize: '16px' }} />,
};

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  globalData?: globalData;
  fetchUserInfo?: () => Promise<MyResponse<API.CurrentUser> | undefined>;
  fetchRouters?: () => Promise<MyResponse<API.Routers> | undefined>;
  fetchGlobalData?: () => Promise<globalData | undefined>;
  menuData?: API.Routers;
  globalDataLoaded?: boolean;
}> {
  const fetchUserInfo = async () => {
    try {
      return await queryCurrent();
    } catch (error) {
      history.push('/user/login');
    }
    return undefined;
  };

  // const IconBc = (name: string) =>
  //   React.createElement(Icons && (Icons as any)[name], {
  //     style: { fontSize: '16px' },
  //   });
  const fetchRouters = async () => {
    try {
      const r = (await queryRouters())?.data;
      return r.map((item: any) => ({
        ...item,
        icon: IconMap[item.meta.icon] || '',
      }));
    } catch (error) {
      history.push('/user/login');
    }
    return undefined;
  };
  // 如果是登录页面，不执行
  if (history.location.pathname !== '/user/login') {
    const currentUser = (await fetchUserInfo())?.data;
    if (currentUser) {
      currentUser.name = currentUser?.realName;
    }
    const menuData = (await fetchRouters()) || [];
    return {
      menuData,
      fetchUserInfo,
      currentUser,
      settings: {},
      globalDataLoaded: false,
    };
  }
  return {
    fetchUserInfo,
    fetchRouters,
    settings: {},
  };
}

export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== '/user/login') {
        history.push('/user/login');
      }
    },
    menuHeaderRender: false,
    menuDataRender: (menuData) => menuData,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    ...initialState?.settings,
    breadcrumbRender: false,
  };
};

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方法不被允许。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/** 异常处理程序 */
const errorHandler = (error: ResponseError) => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  }

  if (!response) {
    notification.error({
      message: error.message,
    });
  }
  throw error;
};

/** 请求拦截器 */
const authHeaderInterceptor = (url: string, options: RequestOptionsInit) => {
  const token = localStorage.getItem('token');
  let endUrl;
  if (options?.data?.dev) {
    endUrl = `/${options?.data?.dev}${url}`;
  } else {
    endUrl = BASE_URL + url;
  }
  const authHeader = { ...options.headers, Authorization: `Bearer ${token}` };
  return {
    url: endUrl,
    options: { ...options, interceptors: true, headers: authHeader },
  };
};
/** 响应拦截 增加延时 */
const demoResponseInterceptors = async (response: Response) => {
  const data = await response.clone().json();

  if (data.code !== 0) {
    return Promise.reject(new Error(data.msg || 'Error'));
  }
  return response;
};

export const request: RequestConfig = {
  errorHandler,
  requestInterceptors: [authHeaderInterceptor],
  responseInterceptors: [demoResponseInterceptors],
};
