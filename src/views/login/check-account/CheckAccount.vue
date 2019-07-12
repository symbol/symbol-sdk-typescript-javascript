<template>
  <div class="check_content">
    <div class="head_sculpture">
      <img alt="">
    </div>
    <div class="wallet_name">ASDFG</div>
    <div class="login_password">
      <div class="gray_boder">
        <input type="text" placeholder="请输入登陆密码">
        <img :src="loginSeePassword" alt="">
      </div>
    </div>
    <div class="password_tips">
      忘记密码？查看<span class="see_password_tips">密码提示</span>
    </div>
    <div class="bottom_btn">
      <div @click="jumpToMonitorPanel" class="arrow_login_container">
        <img class="absolute" :src="loginArrowLogin" alt="">
      </div>
    </div>
  </div>
</template>

<script lang="ts">
    import loginSeePassword from '@/assets/images/login/loginSeePassword.png';
    import loginArrowLogin from '@/assets/images/login/loginArrowLogin.png';
    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class CheckAccount extends Vue {
        loginSeePassword = loginSeePassword
        loginArrowLogin = loginArrowLogin

        jumpToMonitorPanel() {
            this.$router.push({
                name: 'monitorPanel'
            })
        }
    }
</script>

<style scoped lang="less">
  @import "CheckAccount.less";
</style>
