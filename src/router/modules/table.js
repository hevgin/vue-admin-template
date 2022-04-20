/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/example',
  name: 'Example',
  component: Layout,
  redirect: '/example/table',
  meta: { title: 'Table', icon: 'el-icon-s-help' },
  children: [
    {
      path: '/example/table',
      name: 'Table',
      component: () => import('@/views/table/index'),
      meta: { title: 'Table', icon: 'table' }
    },
    {
      path: '/example/tree',
      name: 'Tree',
      component: () => import('@/views/tree/index'),
      meta: { title: 'Tree', icon: 'tree' }
    }
  ]
}
export default tableRouter
