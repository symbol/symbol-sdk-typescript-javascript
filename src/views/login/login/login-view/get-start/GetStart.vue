<template>
  <div class="text_container">
    <div class="top">
      <img src="@/common/img/login/loginNewLogo.png" alt="">
    </div>

    <div class="middle_text">
      {{$t('WELCOME_TO_CATAPULT_NANO_WALLET')}}
    </div>

    <div class="bottom_text">
      {{$t('This_is_a_distributed_desktop_wallet_based_on_catapult_come_and_explore_the_wonderful_journey_of_catapult')}}
    </div>

    <div @click="showIndexView" class="getStart pointer">
      GET START
    </div>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator'

    @Component
    export default class MonitorRelogin extends Vue {
        showStartContent = false
        showCreateLockContent = true
        showInputLockContent = false

        showIndexView() {
            this.$emit('showIndexView', 1)
        }

        created() {
            this.$store.state.app.isInLoginPage = true
        }
    }
</script>
<style scoped lang="less">
  @import "GetStart.less";
</style>
