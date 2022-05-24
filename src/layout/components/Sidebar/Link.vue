<template>
  <a v-if="!isExternal" :href="href" @click="toLink">
    <slot />
  </a>
  <a v-else :href="href" target="_blank">
    <slot />
  </a>
</template>

<script>
import { utilsRouter } from '@/router'
import { isExternal } from '@/utils/validate'

export default {
  props: {
    to: {
      type: String,
      required: true
    },
    route: {
      type: Object,
      required: true
    }
  },
  computed: {
    isExternal() {
      return isExternal(this.to)
    },
    href() {
      if (this.isExternal) {
        return this.to
      } else {
        return process.env.VUE_APP_ROUTER + this.to.substring(1)
      }
    }
  },
  methods: {
    async toLink(e) {
      e.preventDefault()

      // 点击菜单处理重定向路由刷新问题
      let name = this.route.name
      if (this.route.redirect) {
        const matchedRoute = utilsRouter.match(this.route.redirect)
        if (matchedRoute.name) {
          name = matchedRoute.name
        }
      }

      await this.$store.dispatch('tagsView/delCachedView', { name })
      this.$nextTick(() => {
        this.$router.replace({ path: '/redirect' + this.to })
      })
    }
  }
}
</script>
