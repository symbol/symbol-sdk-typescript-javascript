<template>
  <div class="main-container">
    <div class="inner-container xym-outline">
      <div class="top-container">
        <h1 class="page-title">
          {{ $t('news') }}
        </h1>
      </div>
      <div class="bottom-container">
        <Information />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// external dependencies
import {Component, Vue} from 'vue-property-decorator'

// child components
import Information from './information/Information.vue'

@Component({ components: {Information} })
export default class Community extends Vue {}
</script>

<style lang="less" scoped>
@import './Community.less';
</style>
