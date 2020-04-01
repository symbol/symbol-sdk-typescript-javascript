<template>
  <div class="asset-form-main-container">
    <div class="form-section">
      <slot name="form-section" />
    </div>
    <Icon type="ios-help-circle-outline" size="20" @click="hasHelpModal = true" />
    <div class="container">
      <Modal v-model="hasHelpModal" :footer-hide="true" :transfer="false">
        <h1 slot="header">
          {{ $t('rules_describe') }}
        </h1>
        <p>
          <slot name="form-description" />
        </p>
      </Modal>
    </div>
  </div>
</template>

<script lang="ts">
import {AssetFormPageWrapTs} from './AssetFormPageWrapTs'
export default class AssetFormPageWrap extends AssetFormPageWrapTs { }
</script>

<style lang="less" scoped>
@import './AssetFormPageWrap.less';
</style>
