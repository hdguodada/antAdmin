﻿export default [
  {
    path: '/',
    redirect: '/desktop',
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
    path: '/bis',
    routes: [
      {
        name: 'purcOrder',
        path: 'purcOrder',
        component: './Purchase/Ghdd',
      },
      {
        path: 'purcOrder/:id',
        component: './Purchase/Ghdd/detail',
        hideInMenu: true,
      },

      {
        name: 'purchase',
        path: 'purchase',
        component: './Purchase/Ghd',
      },
      {
        path: 'purchase/:id',
        component: './Purchase/Ghd/detail',
        hideInMenu: true,
      },
      {
        name: 'Thd',
        path: 'Thd',
        component: './Purchase/Thd',
      },
      {
        path: 'Thd/:id',
        component: './Purchase/Thd/detail',
        hideInMenu: true,
      },
      {
        name: 'Reports',
        path: 'Reports',
        component: './Purchase/Reports',
      },
    ],
  },
  {
    name: 'sales',
    path: '/sales',
    routes: [
      {
        name: 'Xhdd',
        path: 'Xhdd',
        component: './Sales/xhdd',
      },
      {
        name: 'Xhdd',
        path: 'Xhdd/:id',
        component: './Sales/xhdd/detail',
      },
      {
        name: 'Xhd',
        path: 'Xhd',
        component: './Sales/xhd',
      },
      {
        name: 'Xhthd',
        path: 'Xhthd',
        component: './Sales/Xhthd',
      },
      {
        name: 'Reports',
        path: 'Reports',
        component: './Sales/Reports',
      },
    ],
  },
  {
    name: 'stock',
    icon: 'AppstockOutlined',
    path: '/stock',
    routes: [
      {
        // 调拨单
        name: 'stockChange',
        path: 'stockChange',
        component: './Store/stockChange',
      },
      {
        // 调拨单
        name: 'stockChange',
        path: 'stockChange/:id',
        component: './Store/stockChange/detail',
        hideInMenu: true,
      },
      {
        // 其他入库单
        name: 'stockIn',
        path: 'stockIn',
        component: './Store/stockIn',
      },
      {
        // 其他入库单
        name: 'stockIn',
        path: 'stockIn/:id',
        component: './Store/stockIn/detail',
        hideInMenu: true,
      },
      {
        // 其他出库单
        name: 'stockOut',
        path: 'stockOut',
        component: './Store/stockOut',
      },
      {
        // 其他出库单
        name: 'stockOut',
        path: 'stockOut/:id',
        component: './Store/stockOut/detail',
        hideInMenu: true,
      },

      {
        // 盘点
        name: 'inventory',
        path: 'inventory',
        component: './Store/inventory',
      },
      {
        // 报表
        name: 'Reports',
        path: 'Reports',
        component: './Store/Reports',
      },
      {
        // 盘点详情
        name: 'inventory',
        path: 'inventory/:id',
        component: './Store/inventory/detail',
      },
      {
        name: 'storeOrder',
        path: 'storeOrder',
        routes: [
          {
            name: 'inBalance',
            path: 'inBalance',
            component: './Store/inBalance',
          },
          {
            name: 'deliverDetail',
            path: 'deliverDetail',
            component: './Store/deliverDetail',
          },
          {
            name: 'serNumDetail',
            path: 'serNumDetail',
            component: './Store/serNum/serNumDetail',
          },
        ],
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
      },
      {
        name: 'supplier',
        path: 'supplier',
        component: './Bas/supplier',
      },
      {
        name: 'supplier',
        path: 'supplier/:id',
        component: './Bas/supplier/form',
      },
      {
        name: 'employ',
        path: 'employ',
        component: './Bas/employ',
      },
      {
        name: 'store',
        path: 'store',
        component: './Bas/store',
      },
      {
        name: 'basOthers',
        path: 'basOthers',
        component: './Bas/basOthers',
      },
      {
        name: 'account',
        path: 'account',
        component: './Bas/account',
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
        name: 'company',
        path: '/sys/company',
        component: './Sys/company',
      },
      {
        name: 'coderule',
        path: '/sys/coderule',
        component: './Sys/coderule',
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
