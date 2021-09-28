<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <a :href="appHome" class="sidebar-logo-link">
        <svg-icon class="sidebar-logo" icon-class="logo" />
        <h1 class="sidebar-title">{{ title }} </h1>
      </a>
    </transition>
  </div>
</template>

<script>
import settings from '@/settings'
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: settings.title
    }
  },
  computed: {
    appHome() {
      return process.env.VUE_APP_STATIC
    }
  }
}
</script>
