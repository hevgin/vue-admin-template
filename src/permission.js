import router from './router'
import { utilsRouter } from './router'
import store from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import getPageTitle from '@/utils/get-page-title'
import { getToken } from '@/utils/auth'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

let loaded = false

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  const hasToken = getToken()

  if (to.name === 'Login') {
    next()
    return
  }
  if (from.path === '/' && !hasToken) {
    next(`/login`)
    return
  }
  // set page title
  document.title = getPageTitle(to.meta.title)
  if (loaded) {
    if (to.params.noCache) {
      await store.dispatch('tagsView/delCachedView', to)
      next()
    } else {
      next()
    }
    NProgress.done()
  } else {
    loaded = true
    try {
      // const menus = (NODE_ENV === 'development' || NODE_ENV === 'debug') ? [] : await store.dispatch('user/getMenus')
      // const menus = await store.dispatch('user/getMenus')
      const accessRoutes = await store.dispatch('permission/generateRoutes', [])
      router.addRoutes(accessRoutes[0])
      utilsRouter.addRoutes(accessRoutes[1])
      // hack method to ensure that addRoutes is complete
      // set the replace: true, so the navigation will not leave a history record
      next({ ...to, replace: true })
    } catch (error) {
      // remove token and go to login page to re-login
      await store.dispatch('user/resetToken')
      const path = to.path.substring(1)
      next(`/login?redirect=${process.env.VUE_APP_ROUTER}${path}`)
      NProgress.done()
    }
  }
})

router.afterEach((to, from) => {
  if (to.name === 'Login') {
    loaded = false
  }
  NProgress.done()
})
