<template>
  <Tooltip
    :content="displayedError"
    :placement="placementOverride"
    :always="errored"
    :disabled="!errored"
  >
    <slot />
  </Tooltip>
</template>
<script lang="ts">
import {ErrorTooltipTs} from './ErrorTooltipTs'
export default class ErrorTooltip extends ErrorTooltipTs {}
</script>
