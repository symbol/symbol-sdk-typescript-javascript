<template>
  <Tooltip
    :always="errored"
    :disabled="!errored"
    :content="$t(displayedError)"
    :placement="placement"
  >
    <slot></slot>
  </Tooltip>
</template>
<script lang="ts">
  import {ErrorTooltipTs} from './ErrorTooltipTs'
  export default class ErrorTooltip extends ErrorTooltipTs {}
</script>
