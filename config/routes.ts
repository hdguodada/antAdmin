export default [
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
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './Welcome',
      },
    ],
  },
  {
    name: 'list.table-list',
    icon: 'table',
    path: '/list',
    component: './TableList',
  },
  {
    path: '/sys',
    icon: "smile",
    routes: [
      {
        path: '/sys/user',
        component: './Sys/user',
      },
      {
        path: '/sys/user/:id',
        component: './Sys/user/detail'
      },
      {
        path: '/sys/dep',
        component: './Sys/dep',
      },
      {
        path: '/sys/dep/:id',
        component: './Sys/dep/detail'
      },
      {
        path: '/sys/role',
        component: './Sys/role',
      },
      {
        path: '/sys/role/:id',
        component: './Sys/role/detail'
      },
    ]
  },
  {
    path: '/',
    redirect: '/main/datacenter',
  },

  {
    component: './404',
  },
];
