<template>
  <div class="account-detail-row">
    <span class="label">{{ $t('importance') }}</span>
    <span class="value">{{ score }}</span>
  </div>
</template>

<script lang="ts">
import {ImportanceScoreDisplayTs} from './ImportanceScoreDisplayTs'

export default class ImportanceScoreDisplay extends ImportanceScoreDisplayTs {}
</script>
