<template>
  <div class="right-panel-container">
    <header-search class="item" />
    <screenfull class="item" />
    <question class="item" />
    <notice class="item" />
    <page-layout class="item" />
    <el-dropdown class="item" trigger="click">
      <div class="user-info">
        <img class="avatar" :src="avatar">
        <span class="name">Serati Ma</span>
      </div>
      <el-dropdown-menu slot="dropdown" class="user-dropdown">
        <el-dropdown-item><i class="el-icon-user" />个人中心</el-dropdown-item>
        <el-dropdown-item><i class="el-icon-setting" />个人设置</el-dropdown-item>
        <el-dropdown-item divided @click.native="logout"> <i class="el-icon-switch-button" />退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import Screenfull from '@/components/Screenfull'
import HeaderSearch from '@/components/HeaderSearch'
import Question from '@/components/Question'
import Notice from '@/components/Notice'
import PageLayout from '@/components/PageLayout'

export default {
  name: 'RightPanel',
  components: {
    Screenfull,
    HeaderSearch,
    Question,
    Notice,
    PageLayout
  },
  data() {
    return {}
  },
  computed: {
    avatar() {
      return this.$store.state.user.avatar || `${process.env.VUE_APP_STATIC}img/avatar.png`
    }
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>
