<template>
  <a v-if="!isExternal" :href="href" @click="toLink">
    <slot />
  </a>
  <a v-else :href="href" target="_blank">
    <slot />
  </a>
</template>

<script>
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
      await this.$store.dispatch('tagsView/delCachedView', { name: this.route.name })
      this.$nextTick(() => {
        this.$router.replace({ path: '/redirect' + this.to })
      })
    }
  }
}
</script>
