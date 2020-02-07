<template>
  <div>
    <span class="wallet-detail-label">{{ $t('importance') }}</span>
    <span>
      <span>
        {{ score }}
      </span>
    </span>
  </div>
</template>

<script lang="ts">
import {ImportanceScoreDisplayTs} from './ImportanceScoreDisplayTs'

export default class ImportanceScoreDisplay extends ImportanceScoreDisplayTs {}
</script>
  
<style lang="less" scoped>
@import '../WalletDetails/WalletDetails.less';
</style>
