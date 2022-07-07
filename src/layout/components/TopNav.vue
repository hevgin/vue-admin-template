<template>
  <div :class="wrapClass">
    <logo v-if="layoutType === 2" :collapse="true" />

    <el-tabs :value="activePath" type="card" :tab-position="position">
      <el-tab-pane v-for="tag in routes" :key="tag.path" :label="title(tag)" :name="tag.path">
        <app-link slot="label" :route="tag" :to="resolvePath(tag)">
          <item v-if="showNavIcon && icon(tag)" :icon="icon(tag)" :title="title(tag)" />
          {{ title(tag) }}
        </app-link>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import AppLink from './Sidebar/Link'
import Item from './Sidebar/Item'
import Logo from './Sidebar/Logo'
import { isExternal } from '@/utils/validate'
import bus from '@/utils/bus'
import { utilsRouter } from '@/router'

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
    return { }
  },
  computed: {
    ...mapGetters(['permission_routes']),

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
      const name = this.getActiveMenu()
      this.setChildRoutes(name)
      return name
    },

    activePath() {
      if (this.$route.path.indexOf('/redirect/') >= 0 && this._activePath) {
        return this._activePath
      }
      const path = this.getCurrentMenu()
      const name = this.getActiveMenu()
      this.setChildRoutes(name)
      this._activePath = path // eslint-disable-line
      return path
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
      const { name } = this.$route
      const route = utilsRouter.match({ name })
      const matched = route.matched
      return matched[0].name
    },

    getCurrentMenu() {
      const { name, meta } = this.$route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      const route = utilsRouter.match({ name })
      const matched = route.matched[0]
      return matched.path || '/'
    },

    setChildRoutes(name) {
      const menus = this.routes.filter((item) => {
        return item.name === name
      })
      if (menus.length === 0) {
        return
      }
      const route = menus[0].children || []

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
