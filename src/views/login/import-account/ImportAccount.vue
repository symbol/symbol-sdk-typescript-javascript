<template>
  <div class="import-account-wrapper radius">
    <div class="inner-container">
      <p class="create-account-box">{{$t('Import_an_old_account')}}</p>
      <div class="step-bar-container">
        <img :src="$route.meta.icon">
        <div class="step-text-container">
          <span v-for="(text,index) in stepBarTitleList" :class="getStepTextClassName(index)">{{text}}</span>
        </div>
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
    import ImportAccountTs from "./ImportAccountTs";
    import "./ImportAccount.less";

    export default class CreatAccount extends ImportAccountTs {
    }
</script>
<style lang="less">
</style>
