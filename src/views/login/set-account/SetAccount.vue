<template>
  <div class="login_content">
    <div class="top_tit">
      <div class="set_tips">设置用户名和密码</div>
      <div class="set_tips_info"><span>登陆密码</span>为下次进入此设备Nem桌面钱包的密码</div>
    </div>
    <div class="middle_input">
      <div class="gray_boder">
        <input placeholder="请设置用户名" type="text">
      </div>
      <div class="gray_boder">
        <input placeholder="请设置登陆密码" type="text">
        <img :src="loginSeePassword" alt="">
      </div>
      <div class="gray_boder">
        <input placeholder="请设置密码提示" type="text">
      </div>
    </div>
    <div class="bottom_btn">
      <div @click="jumpToCheckAccount" class="arrow_login_container pointer">
        <img class="absolute" :src="loginArrowLogin" alt="">
      </div>
      <div class="login_tips">登陆即注册</div>
    </div>
  </div>
</template>

<script>
  import loginSeePassword from '@/assets/images/login/loginSeePassword.png';
  import loginArrowLogin from '@/assets/images/login/loginArrowLogin.png';
  import {Component, Vue} from 'vue-property-decorator';

  @Component
  export default class SetAccount extends Vue {

    loginSeePassword = loginSeePassword
    loginArrowLogin = loginArrowLogin

    jumpToCheckAccount() {
      this.$router.push({
        name: 'checkAccount'
      })
    }
  }
</script>

<style scoped lang="less">
  @import "SetAccount.less";
</style>
