import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'
import resource from '../views/upms/resource/resource'
import role from '../views/upms/role/role'
import user from '../views/upms/user'
// import user2 from '../views/yun/user'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/404', component: _import('404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index')
    }]
  },

  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: 'Example', icon: 'example' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: _import('table/index'),
        meta: { title: 'Table', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: _import('tree/index'),
        meta: { title: 'Tree', icon: 'tree' }
      }
    ]
  },
  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: _import('form/index'),
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  }
]

// 异步挂载的路由 动态需要根据权限加载的路由表
export const asyncRouterMap = [
  {
    path: '/log',
    component: Layout,
    redirect: '/log/kafka/',
    name: 'kafka日志',
    meta: { title: 'kafka日志', icon: 'table', role: ['/log/kafka/'] }, // kafka日志测试
    children: [
      {
        path: '/kafka/',
        component: _import('kafka/index'),
        name: 'kafka日志测试',
        meta: { title: 'kafka日志测试', icon: 'tree', role: ['/log/kafka/'] } // kafka日志测试
      },
      {
        path: '/kafka/',
        component: _import('kafka/index'),
        name: 'kafka日志测试2',
        meta: { title: 'kafka日志测试3', icon: 'tree', role: ['/log/kafka/'] } // kafka日志测试
      }]
  },
  {
    path: '/upms',
    component: Layout,
    redirect: '/upms/user',
    name: 'upms',
    meta: { title: 'upms', icon: 'table', role: ['/upms/user'] },
    children: [
      {
        path: 'user',
        name: '用户',
        component: user,
        meta: { title: '用户', icon: 'table', role: ['/upms/user'] }
      },
      {
        path: 'role',
        name: 'role',
        component: role,
        meta: { title: '角色', icon: 'tree', role: ['/upms/role'] }
      },
      {
        path: 'resource',
        name: 'resource',
        component: resource,
        meta: { title: '资源', icon: 'tree', role: ['/upms/resource'] }
      }
    ]
  },
  {
    path: '/yun',
    component: Layout,
    redirect: '/yun/user',
    name: 'yun',
    meta: { title: 'yun', icon: 'table' },
    children: [
      {
        path: 'user',
        name: '用户',
        component: _import('yun/user/index'),
        meta: { title: '用户2', icon: 'table' }
      },
      {
        path: 'globalt',
        name: 'globalt',
        component: _import('yun/globalt/index'),
        meta: { title: 'globalt', icon: 'tree' }
      },
      {
        path: 'crmMember',
        name: 'crmMember',
        component: _import('yun/crmMember/index'),
        meta: { title: 'crmMember', icon: 'tree' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true } // 必需放在所有的router之后，被坑的不行
]

export default new Router({
  mode: 'history', // 后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

