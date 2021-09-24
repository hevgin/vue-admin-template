<template>
  <el-dropdown trigger="click" placement="bottom">
    <div class="icon-layout-wrap"><svg-icon icon-class="layout" /></div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item @click.native="handleCommand(2)">分栏布局</el-dropdown-item>
      <el-dropdown-item @click.native="handleCommand(1)">横向布局</el-dropdown-item>
      <el-dropdown-item @click.native="handleCommand(0)">常规布局</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: 'PageLayout',
  data() {
    return {}
  },
  methods: {
    handleCommand(command) {
      this.$store.commit('settings/CHANGE_SETTING', { key: 'layoutType', value: command })
    }
  }
}
</script>
<style lang="scss" scoped>
.icon-layout-wrap {
  height: 100%;
}
</style>
