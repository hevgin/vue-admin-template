import { asyncRoutes, constantRoutes, notFoundRoutes } from '@/router'
import Layout from '@/layout'

const permissionBtns = []

function hasPermission(name, menus) {
  const data = menus.filter(item => {
    return item.resourceCode === name
  })
  return data[0] || {}
}

function generatePageRouteTable(routes, ret = []) {
  routes.forEach(item => {
    if (item.children && item.children.length) {
      const route = { ...item }
      delete route.children
      ret.push(route)
      generatePageRouteTable(item.children, ret)
    } else {
      ret.push(item)
    }
  })
}

/**
 * Filter asynchronous menu tables by recursion
 * @param menus asyncBtns
 */
export function filterAsyncBtns(menus) {
  menus.forEach(menu => {
    const tmp = { ...menu }
    if (tmp.resourceType === 1) {
      permissionBtns.push(tmp.resourceCode)
    }
  })
  return permissionBtns
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, menus) {
  const res = []
  // 权限接口为空则不过滤接口
  if (menus.length === 0) {
    return routes
  }
  routes.forEach(route => {
    const tmp = { ...route }
    const data = hasPermission(tmp.name, menus)
    if (data.resourceCode) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, menus)
      }
      tmp.meta.title = data.resourceName
      if (data.icon) {
        tmp.meta.icon = data.icon
      }
      // const permission = tmp.meta && tmp.meta.permission
      // if (permission && permissionBtns.length > 0) {
      //   for (const key in permission) {
      //     if (!permissionBtns.includes(key)) {
      //       delete permission[`${key}`]
      //     }
      //   }
      // }
      res.push(tmp)
    }
  })
  return res
}

const state = {
  routes: [],
  addRoutes: [],
  currentChildRoute: [],
  currentRouteTitle: '',
  permissionBtns: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_CHILD_ROUTES: (state, data) => {
    state.currentChildRoute = data.route
    state.currentRouteTitle = data.title
  },
  SET_PERMISSION_BTNS: (state, permissionBtns) => {
    state.permissionBtns = permissionBtns
  }
}

const actions = {
  generateRoutes({ commit }, menus) {
    return new Promise(resolve => {
      filterAsyncBtns(menus)
      commit('SET_PERMISSION_BTNS', permissionBtns)
      const accessedRoutes = filterAsyncRoutes(asyncRoutes, menus)
      const routes = accessedRoutes.concat(notFoundRoutes)
      commit('SET_ROUTES', routes)
      // 将页面路由转换为二级
      const pageRouteTable = [
        {
          path: '/',
          component: Layout,
          redirect: '/dashboard',
          name: 'Home',
          children: []
        },
        notFoundRoutes[0]
      ]
      generatePageRouteTable(accessedRoutes, pageRouteTable[0].children)
      resolve([pageRouteTable, [...routes, ...constantRoutes]])
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
