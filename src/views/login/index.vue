<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <div class="logo-wrap">
          <span class="logo">
            <svg-icon icon-class="logo-full" />
          </span>
          <h3 class="title">CUSC</h3>
        </div>
        <div class="desc">国际一流的汽车数字化运营服务商 建设美好车生活</div>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input ref="username" v-model="loginForm.username" placeholder="请输入用户名" name="username" type="text" tabindex="1" auto-complete="on" />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType" placeholder="请输入密码" name="password" tabindex="2" auto-complete="on" @keyup.enter.native="handleLogin" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <div class="auto-login">
        <el-checkbox v-model="checked">自动登录</el-checkbox>
        <el-link type="primary">忘记密码？</el-link>
      </div>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登 录</el-button>

    </el-form>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入登录用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('登录密码不能少于6个字符'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/' })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
.login-container {
  min-height: 100%;
  width: 100%;
  background: #f1f2f5 url(../../assets/img/login_bg.svg) no-repeat center 0 / contain;
  overflow: hidden;

  .login-form {
    margin: -150px 0 0 -245px;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 420px;
    height: 300px;
    padding: 35px;
    background: #fff;
    box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.06);
    border-radius: 6px;
  }

  .title-container {
    width: 420px;
    height: 100px;
    position: absolute;
    left: 0;
    top: -130px;
    .logo-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      .logo {
        font-size: 90px;
        line-height: 1;
      }
      .title {
        margin: 0 0 0 10px;
        padding: 0 0 0 10px;
        border-left: 1px solid #ddd;
        font-size: 40px;
        color: #000;
        line-height: 1;
      }
    }
    .desc {
      color: #999;
      font-size: 14px;
      text-align: center;
    }
  }

  .el-form-item {
    position: relative;
    margin-bottom: 30px;
    .svg-container {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 2;
      padding: 0 5px 0 15px;
      color: #889aa4;
      width: 30px;
      display: inline-block;
    }
    .el-input__inner {
      padding-left: 40px;
    }
  }

  .auto-login {
    margin: 20px auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 1px;
    font-size: 16px;
    color: #889aa4;
    cursor: pointer;
    user-select: none;
  }
}
</style>
