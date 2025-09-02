import Vue from 'vue'
import Router from 'vue-router'
import Notifications from 'vue-notification'
// import Notify from '@wcjiang/notify';

Vue.use(Router)
Vue.use(Notifications)

export const constantRoutes = [
  {
    path: '/dashboard',
    name: 'dashboard',
    title: '首页',
    component: () => import('@/components/DashboardPage'),
    children: [
      {
        path: 'welcome',
        name: 'welcome',
        meta: { title: '统计' },
        component: () => import('@/components/WelcomePage'),
      },
      {
        path: 'wechat',
        name: 'wechat',
        meta: { title: '微信' },
        component: () => import('@/components/Main/WechatPage'),
      },
      {
        path: 'friend',
        name: 'friend',
        meta: { title: '好友' },
        component: () => import('@/components/Main/FriendPage'),
      },
      {
        path: 'roles',
        name: 'roles',
        meta: { title: '角色' },
        component: () => import('@/components/Main/RolesPage'),
      },
      {
        path: 'system',
        name: 'system',
        meta: { title: '参数' },
        component: () => import('@/components/Main/SystemPage'),
      },
      {
        path: 'admin',
        name: 'admin',
        component: () => import('@/components/Main/AdminPage'),
      },
      {
        path: 'logs',
        name: 'logs',
        component: () => import('@/components/Main/LogsPage'),
      },
      {
        path: 'admin/add',
        name: 'admin_add',
        component: () => import('@/components/Main/AdminAddPage'),
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/components/LoginPage'),
  },
  {
    path: '*',
    redirect: '/dashboard',
  },
]

export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes,
})
