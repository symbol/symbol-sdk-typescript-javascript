<template>
  <div class="copy-button-container" @click="copyToClipboard">
    <slot>
      <Button type="text">
        {{ $t('mnemonic_copy') }}
      </Button>
    </slot>
  </div>
</template>
<script lang="ts">
import { ButtonCopyToClipboardTs } from './ButtonCopyToClipboardTs'
export default class ButtonCopyToClipboard extends ButtonCopyToClipboardTs {}
</script>
<style lang="less" scoped>
@import './ButtonCopyToClipboard.less';
</style>
