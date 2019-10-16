<template>
  <div class="relogin_container radius scroll">
    <video muted="muted" src="@/common/img/login/cloudsVideo.mp4" loop="loop" autoplay="true"></video>

    <div class="switch_language">
      <i-select v-model="language">
        <i-option v-for="(item, index) in languageList" :value="item.value" :key="index">{{ item.label }}</i-option>
      </i-select>
    </div>
    <div class="create_account_container">
      <span class="line">|</span>
      <span class="create_account pointer" @click="$router.push('createAccount')">{{$t('create_or_import')}}</span>
    </div>
    <div class="fix_content">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
    // @ts-ignore
    import {LoginTs} from '@/views/login/login/LoginTs.ts'

    export default class Login extends LoginTs {

    }
</script>
<style scoped lang="less">
  @import "Login.less";
</style>
