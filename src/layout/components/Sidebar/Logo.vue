<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <a v-if="collapse" key="collapse" :href="appHome" class="sidebar-logo-link">
        <svg-icon class="sidebar-logo" icon-class="logo" />
        <h1 class="sidebar-title">{{ title }} </h1>
      </a>
      <a v-else key="expand" :href="appHome" class="sidebar-logo-link">
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

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  height: $headerHeight;
  line-height: $headerHeight;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 10px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: normal;
      letter-spacing: 2px;
      font-size: 16px;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 3px;
    }
  }
}
</style>
