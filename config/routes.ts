export default [
  {
    path: '/',
    redirect: '/welcome',
  },
  // 用户登录
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './User/login',
          },
        ],
      },
    ],
  },
  {
    path: '/desktop',
    name: 'desktop',
    icon: 'smile',
    component: './Desktop',
  },
  {
    name: 'purchase',
    icon: 'ShoppingCartOutlined',
    path: '/purchase',
    routes: [
      {
        name: 'purchase',
        path: '/purchase',
        component: './Purchase/purchase',
      },
    ],
  },
  {
    name: 'bas',
    icon: 'SafetyOutlined',
    path: '/bas',
    routes: [
      {
        name: 'customer',
        path: 'customer',
        component: './Bas/customer',
      },
      {
        name: 'product',
        path: 'product',
        component: './Bas/product',
      },
      {
        name: 'productDetail',
        path: 'product/:id',
        component: './Bas/product/detail',
        hideInMenu: true,
      },
      {
        name: 'customerDetail',
        path: 'customer/:id',
        component: './Bas/customer/detail',
        hideInMenu: true,
      },
      {
        name: 'supplier',
        path: 'supplier',
        component: './Bas/supplier',
      },
      {
        name: 'employ',
        path: 'employ',
        component: './Bas/employ',
      },
      {
        name: 'basOthers',
        path: 'basOthers',
        component: './Bas/basOthers',
      },
    ],
  },
  {
    path: '/sys',
    icon: 'GlobalOutlined',
    name: 'sys',
    routes: [
      {
        name: 'user',
        path: '/sys/user',
        component: './Sys/user',
      },
      {
        name: 'dep',
        path: '/sys/dep',
        component: './Sys/dep',
      },
      {
        name: 'role',
        path: '/sys/role',
        component: './Sys/role',
      },

      {
        path: '/sys/coderule',
        component: './Sys/coderule',
      },
      {
        name: 'CompanyEdit',
        path: '/sys/CompanyEdit',
        component: './Sys/company',
      },
    ],
  },
  {
    name: 'init',
    icon: 'SettingFilled',
    path: '/init',
    routes: [
      {
        name: 'log',
        path: '/init/log',
        component: './Sys/log',
      },
      {
        name: 'ver',
        path: '/init/ver',
        component: './Sys/ver',
      },
      {
        name: 'exception',
        path: '/init/exception',
        component: './Sys/exception',
      },
      {
        name: 'dictDef',
        path: '/init/dictDef',
        component: './Sys/dict(def)',
      },
      {
        name: 'fun',
        path: '/init/fun',
        component: './Sys/fun',
      },
      {
        name: 'module',
        path: '/init/module',
        component: './Sys/module',
      },
    ],
  },
  {
    component: './404',
  },
];
