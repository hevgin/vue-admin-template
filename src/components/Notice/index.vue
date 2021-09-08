<template>
  <div class="header-notice" @click="click">
    <el-badge :value="200" :max="99">
      <svg-icon icon-class="notice" />
    </el-badge>
  </div>
</template>

<script>

export default {
  name: 'Notice',
  data() {
    return {

    }
  },
  methods: {
    click() {
      console.log('notice')
    }
  }
}
</script>
<style lang="scss">
.header-notice {
  .el-badge__content.is-fixed {
    top: 12px;
    right: 14px;
    background: #ff4d4f;
    border: 0 none;
    display: flex;
    align-items: center;
    line-height: 1;
  }
}
</style>
