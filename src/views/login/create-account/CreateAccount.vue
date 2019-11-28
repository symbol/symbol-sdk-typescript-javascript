<template>
    <div class="create-account-wrapper radius">
      <div class="inner-container">
        <p class="create-account-box">{{$t('Generate_a_new_account')}}</p>
        <div class="step-bar-container">
          <img :src="$route.meta.icon">
          <div class="step-text-container">
            <span v-for="(text,index) in StepBarTitleList" :class="getStepTextClassName(index)">{{text}}</span>
          </div>
        </div>
        <router-view></router-view>
      </div>

    </div>
</template>

<script lang="ts">
    import CreateAccountTs from "./CreateAccountTs"
    import "./CreateAccount.less"

    export default class CreatAccount extends CreateAccountTs {
    }
</script>
<style lang="less">
</style>
