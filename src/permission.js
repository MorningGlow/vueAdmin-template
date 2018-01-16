import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      console.log(store.getters.resources + '长度')
      if (store.getters.resources.length === 0) { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetInfo').then(res => { // 拉取info
          const roles = res.data.resource
          console.log(roles.length)
          store.dispatch('GenerateRoutes', { roles }).then(() => { // 生成可访问的路由表
            if (store.getters.addRouters === undefined) {
              console.log('判断' + store.getters.addRouters)
            } else {
              console.log('判断是0' + store.getters.addRouters)
              router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
              console.log('判断是2' + store.getters.routers)
              console.log('判断是33' + store.getters.resources)
              // console.log('判断是33' + store.getters.resources)
              store.getters.resources.forEach(resource => {
                console.log('判断是33' + resource)
              })
              store.getters.routers.forEach(router => {
                console.log(router.name)
              })
            }

            if (roles.length === 0) {
              next()
            } else {
              next({ ...to }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
            }
            // next()
          })
        }).catch(err => {
          // console.log(err)
          Message.error(err)
        })
      } else {
        next() // 当有用户权限的时候，说明所有可访问路由已生成 如访问没权限的全面会自动进入404页面
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
