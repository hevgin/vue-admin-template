import { asyncRoutes, constantRoutes, notFoundRoutes } from '@/router'
import Layout from '@/layout'
import pathToRegexp from 'path-to-regexp'

const permissionBtns = []
const sortedUuid = []
let includeNextPath = false
let firstRouterPath = ''

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
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, menus) {
  const permissionRoutes = []
  // 权限接口为空则不过滤接口
  if (menus.length === 0) {
    return routes
  }
  routes.forEach(route => {
    const tmp = { ...route }
    const data = hasPermission(tmp.name, menus)
    if (data.resourceCode) {
      if (tmp.children && tmp.children.length > 0) {
        tmp.children = filterAsyncRoutes(tmp.children, menus, permissionRoutes)
      }
      tmp.meta.title = data.resourceName
      if (data.icon) {
        tmp.meta.icon = data.icon
      }

      // 权限按钮
      if (tmp.resourceType === 1) {
        permissionBtns.push(tmp.resourceCode)
      }
      // 权限路由
      permissionRoutes.push(tmp)
    }
  })
  return permissionRoutes
}

/**
* 树级结构转换成平级结构
* @time 2022-06-25 22:11:53
*/
export function menuTreeToMenuList(menuTree, list = [], uuid = []) {
  menuTree.forEach(item => {
    if (item.children && item.children.length > 0) {
      menuTreeToMenuList(item.children, list, uuid)
    }
    list.push(item)
    uuid.push(item.uuid)
  })
  return { list, uuid }
}

// 对后端返回的功能权限数据按本地路由进行过滤并排序
export function filterAsyncTrees(asyncRoutes, menus) {
  const sortedRoutes = []
  asyncRoutes.forEach(route => {
    const tmp = { ...route }
    const data = hasPermission(tmp.name, menus)
    if (data.resourceCode) {
      if (tmp.children && tmp.children.length > 0) {
        data.children = filterAsyncTrees(tmp.children, menus, sortedRoutes)
      }
      sortedUuid.push(data.uuid)
      sortedRoutes.push(data)
    }
  })
  return sortedRoutes
}

/**
* 获取第一个路由path
* @time 2022-06-30 18:42:24
*/
export function getFirstRouter(routes, nextPath) {
  routes.forEach(item => {
    const path = item.path
    const regex = pathToRegexp(path)
    // console.log(nextPath, regex, regex.test(nextPath))
    if (regex.test(nextPath)) {
      includeNextPath = true
    }
    if (item.children && item.children.length > 0) {
      if (!firstRouterPath && !item.redirect) {
        firstRouterPath = path
      }
      return getFirstRouter(item.children, nextPath)
    }
    if (!firstRouterPath && (path === nextPath || path.indexOf('/:') < 0)) {
      firstRouterPath = path
    }
  })
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
  generateRoutes({ commit }, data = { menus: [], nextPath: '' }) {
    return new Promise(resolve => {
      const { list } = menuTreeToMenuList(data.menus, [])
      const permissionRoutes = filterAsyncRoutes(asyncRoutes, list)
      const routes = permissionRoutes.concat(notFoundRoutes)
      getFirstRouter(routes, data.nextPath)

      commit('SET_ROUTES', routes)
      commit('SET_PERMISSION_BTNS', permissionBtns)
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
      generatePageRouteTable(permissionRoutes, pageRouteTable[0].children)
      resolve([pageRouteTable, [...routes, ...constantRoutes], firstRouterPath, includeNextPath])
    })
  },

  // 将未排序的功能权限数据按本地路由顺序过滤并排序
  filterAsyncMenuTree({ commit }, menuTree) {
    return new Promise(resolve => {
      const { list, uuid } = menuTreeToMenuList(menuTree)
      const sortedRoutes = filterAsyncTrees(asyncRoutes, list)
      // sortedRoutes: 已过滤排序的路由
      // sortedUuid: 已过滤排序的uuid
      // list: 已扁平化的menuTree数据
      // uuid: list对应的uuid
      resolve([sortedRoutes, sortedUuid, list, uuid])
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
