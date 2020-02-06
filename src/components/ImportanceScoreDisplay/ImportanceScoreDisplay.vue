<template>
  <div>
    <span class="tit">{{ $t('importance') }}</span>
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
