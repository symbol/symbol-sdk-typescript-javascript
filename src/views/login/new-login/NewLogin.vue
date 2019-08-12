<template>
  <div class="relogin_container radius scroll">
    <video muted="muted" src="@/common/img/login/cloudsVideo.mp4" loop="loop" autoplay="true"></video>

    <div class="get_start" v-if="showStartContent">
      <div class="text_container">
        <div class="top">
          <img src="@/common/img/login/loginNewLogo.png" alt="">
        </div>

        <div class="middle_text">
          WELCOME TO CATAPULT-NANO-Wallet
        </div>

        <div class="bottom_text">
          This is a distributed desktop wallet based on catapult. come and explore the wonderful journey of catapult.
        </div>

        <div @click="jumpToDashBoard" class="bottom_input pointer">
          GET START
        </div>
      </div>
    </div>

    <div v-if="showCreateLockContent">

    </div>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class MonitorRelogin extends Vue {
        showStartContent = false
        showCreateLockContent = true
        showInputLockContent = false

        jumpToDashBoard() {
            this.showStartContent = false
        }

        created() {
            this.$store.state.app.isInLoginPage = true
        }
    }
</script>
<style scoped lang="less">
  @import "NewLogin.less";
</style>
