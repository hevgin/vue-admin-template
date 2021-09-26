<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device === 'mobile' && sidebar.opened" class="drawer-bg" @click="handleClickOutside" />

    <template v-if="layoutType === 0">
      <div class="header-container">
        <logo :collapse="false" />
        <right-panel />
      </div>
      <sidebar class="sidebar-container" />
      <div class="main-container">
        <div class="navbar-container">
          <navbar />
        </div>
        <app-main />
      </div>
    </template>

    <template v-else-if="layoutType === 1">
      <div class="header-container">
        <logo :collapse="false" />
        <top-nav mode="horizontal" wrap-class="top-nav-container" />
        <right-panel />
      </div>
      <sidebar class="sidebar-container" />
      <div class="main-container">
        <div class="navbar-container">
          <navbar />
        </div>
        <app-main />
      </div>
    </template>

    <template v-else-if="layoutType === 2">
      <sidebar class="sidebar-container" style="top:0" />
      <div class="main-container">
        <div class="header-container">
          <right-panel />
        </div>
        <div class="navbar-container">
          <navbar />
        </div>
        <app-main />
      </div>
    </template>

  </div>
</template>

<script>
import settings from '@/settings'
import Logo from './components/Sidebar/Logo'
import { Navbar, Sidebar, AppMain, TopNav, RightPanel } from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',
  components: {
    Logo,
    Navbar,
    Sidebar,
    AppMain,
    TopNav,
    RightPanel
  },
  mixins: [ResizeMixin],
  data() {
    return {
      title: settings.title
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    layoutType() {
      return this.$store.state.settings.layoutType
    },
    classObj() {
      return {
        'hide-sidebar': !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        'without-animation': this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>
