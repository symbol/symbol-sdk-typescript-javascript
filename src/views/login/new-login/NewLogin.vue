<template>
  <div class="relogin_container radius scroll">
    <video muted="muted" src="../../../assets/images/login/cloudsVideo.mp4" loop="loop" autoplay="true"></video>
    <div class="text_container">
      <div class="top">
        <img src="../../../assets/images/login/loginNewLogo.png" alt="">
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
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import reloginAddress from '../../../assets/images/login/relogin/reloginAddress.png'
    import reloginApostille from '../../../assets/images/login/relogin/reloginApostille.png'
    import reloginAsset from '../../../assets/images/login/relogin/reloginAsset.png'
    import reloginFile from '../../../assets/images/login/relogin/reloginFile.png'
    import reloginLink from '../../../assets/images/login/relogin/reloginLink.png'
    import reloginNamespace from '../../../assets/images/login/relogin/reloginNamespace.png'
    import reloginSend from '../../../assets/images/login/relogin/reloginSend.png'
    import reloginWidgets from '../../../assets/images/login/relogin/reloginWidgets.png'


    @Component
    export default class MonitorRelogin extends Vue {

        jumpToDashBoard() {
            this.$router.push({
                name: 'createLockPW'
            })
        }

        created() {
            this.$store.state.app.isInLoginPage = true
        }
    }
</script>
<style scoped lang="less">
  @import "NewLogin.less";
</style>
