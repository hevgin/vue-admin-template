<template>
  <div :class="wrapClass">
    <logo v-if="layoutType === 2" :collapse="true" />

    <el-tabs :value="activeMenu" type="card" :tab-position="position">
      <el-tab-pane v-for="tag in routes" :key="tag.path" :label="title(tag)" :name="tag.path">
        <app-link slot="label" :to="resolvePath(tag)">
          <item v-if="showNavIcon && icon(tag)" :icon="icon(tag)" :title="title(tag)" />
          {{ title(tag) }}
        </app-link>
      </el-tab-pane>
    </el-tabs>

    <!-- <el-menu :active-text-color="variables.menuActiveText" :default-active="activeMenu" :mode="mode" @select="setChildRoutes">
      <el-menu-item v-for="item in routes" :key="item.path" :index="item.path">
        <app-link :to="resolvePath(item)">
          <item v-if="showNavIcon && icon(item)" :icon="icon(item)" :title="title(item)" />
          <span class="nav-name">{{ title(item) }}</span>
        </app-link>
      </el-menu-item>
    </el-menu> -->
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import AppLink from './Sidebar/Link'
import Item from './Sidebar/Item'
import Logo from './Sidebar/Logo'
import variables from '@/styles/variables.scss'
import { isExternal } from '@/utils/validate'
import bus from '@/utils/bus'

export default {
  name: 'TopNav',
  components: {
    AppLink,
    Item,
    Logo
  },
  props: {
    position: {
      type: String,
      default: 'top'
    },
    wrapClass: {
      type: String,
      default: 'top-nav-container'
    }
  },
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters([
      'permission_routes'
    ]),

    showNavIcon() {
      return this.$store.state.settings.showNavIcon
    },

    layoutType() {
      return this.$store.state.settings.layoutType
    },

    routes() {
      const route = this.permission_routes.filter(item => {
        return !item.hidden
      })
      return route
    },

    activeMenu() {
      const path = this.getActiveMenu()
      this.setChildRoutes(path)
      return path
    },

    variables() {
      return variables
    }
  },

  mounted() {
    const self = this
    bus.$on('SET_CHILD_ROUTES', () => {
      setTimeout(() => {
        const path = self.getActiveMenu()
        self.setChildRoutes(path)
      }, 0)
    })
  },
  methods: {
    icon(item = {}) {
      const meta = item.meta || item.children && item.children[0].meta || {}
      return meta.icon || ''
    },

    title(item = {}) {
      const meta = item.meta || item.children && item.children[0].meta || {}
      return meta.title || ''
    },

    getActiveMenu() {
      const { path, matched } = this.$route
      const menu = matched.filter(item => {
        return item.path === path || item.regex.test(path)
      })
      const parent = menu[0].parent || menu[0]
      const parentPath = this.getParentPath(parent)
      return parentPath
    },

    getParentPath(route) {
      if (route.parent) {
        return this.getParentPath(route.parent)
      } else {
        return route.path || '/'
      }
    },

    setChildRoutes(path) {
      const menus = this.routes.filter(item => {
        return item.path === path
      })
      const route = menus[0].children || []
      route.forEach(item => {
        // 当前path为相对路径的路由加上绝对路径
        if (item.path.indexOf('/') === -1) {
          item.path = `${path}/${item.path}`
        }
      })

      const meta = menus[0].meta || route[0].meta
      const title = meta.title

      this.$store.commit('permission/SET_CHILD_ROUTES', { route, title })
    },

    resolvePath(item, parentPath = '') {
      if (item.redirect) {
        return item.redirect
      } else if (item.children && item.children.length > 0) {
        parentPath = item.path.indexOf('/') === 0 ? item.path : `${parentPath}/${item.path}`
        return this.resolvePath(item.children[0], parentPath)
      } else if (isExternal(item.path)) {
        return item.path
      } else {
        const path = item.path.indexOf('/') === 0 ? item.path : `${parentPath}/${item.path}`
        return path
      }
    }
  }
}
</script>
