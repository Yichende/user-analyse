export default [
  {
    path: '/user',
    layout: false,
    routes: [
      { path: '/user/login', layout: false, name: '登录', component: './user/login' },
      { path: '/user', redirect: '/user/login' },
      {
        name: '注册结果',
        icon: 'smile',
        path: '/user/register-result',
        component: './user/register-result',
      },
      { name: '注册', icon: 'smile', path: '/user/register', component: './user/register' },
    ],
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: 'dashboard',
    routes: [
      { path: '/dashboard', redirect: '/dashboard/analysis' },
      {
        name: '分析页',
        icon: 'smile',
        path: '/dashboard/analysis',
        component: './dashboard/analysis',
      },
      {
        name: '监控页',
        icon: 'smile',
        path: '/dashboard/monitor',
        component: './dashboard/monitor',
      },
    ],
  },
  {
    name: '用户管理',
    icon: 'icon-yonghuguanli',
    path: '/user_management',
    component: './userManagement',
  },
  {
    name: '数据管理',
    icon: 'icon-shujuguanli',
    path: '/data',
    routes: [
      {
        name: '用户行为数据管理',
        path: '/data/behavior',
        component: './data/user_behavior'
      },
      {
        name: '图表管理',
        path: '/data/chart',
        component: './data/chart'
      }
    ],
  },
  {
    name: '数据分析',
    icon: 'icon-shujufenxi',
    path: '/analysis',
    routes: [
      {
        name: '全部分析',
        path: '/analysis/analysis_all',
        component: './analysis/all_analysis'
      },
      {
        name: '我的分析',
        path: '/analysis/analysis_my',
        component: './analysis/my_analysis'
      },
      {
        name: '添加分析',
        path: '/analysis/analysis_add',
        component: './analysis/add_analysis'
      },
    ]
  },
  {
    name: '个人页',
    icon: 'user',
    path: '/account',
    routes: [
      { path: '/account', redirect: '/account/center' },
      { name: '个人中心', icon: 'smile', path: '/account/center', component: './account/center' },
      {
        name: '个人设置',
        icon: 'smile',
        path: '/account/settings',
        component: './account/settings',
      },
    ],
  },
  { path: '/test', name: '测试页面', icon: 'pieChart', component: './test-page' },
  { path: '/', redirect: '/dashboard/analysis' },
  { component: '404', path: '/*' },
];
