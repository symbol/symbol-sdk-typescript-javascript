<template>
  <div class="import-profile-wrapper radius">
    <div class="inner-container">
      <p class="create-profile-box">
        {{ $t('profile_import') }}
      </p>
      <div class="step-bar-container">
        <img :src="$route.meta.icon" />
        <div class="step-text-container">
          <span v-for="(text, index) in StepBarTitleList" :key="index" :class="getStepClassName(index)">{{
            $t(text)
          }}</span>
        </div>
      </div>
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import ImportProfileTs from './ImportProfileTs'
export default class ImportProfile extends ImportProfileTs {}
</script>
<style lang="less" scoped>
@import './ImportProfile.less';
</style>
