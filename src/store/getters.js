const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  permissionBtns: state => state.permission.permissionBtns,
  currentChildRoute: state => state.permission.currentChildRoute,
  currentRouteTitle: state => state.permission.currentRouteTitle,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  dict: state => state.dict.dictionary
}
export default getters
