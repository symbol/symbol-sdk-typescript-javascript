<template>
  <div>
    <slot>
      <div class="mnemonic-container">
        <div class="mnemonic-list">
          <span v-for="(word, index) in words" :key="index">{{ word }}</span>
        </div>
        <ButtonCopyToClipboard v-model="waitingCopyString" class="copy-button" />
      </div>
    </slot>
  </div>
</template>

<script lang="ts">
import { MnemonicDisplayTs } from './MnemonicDisplayTs'
export default class MnemonicDisplay extends MnemonicDisplayTs {}
</script>
<style lang="less" scoped>
@import './MnemonicDisplay.less';
</style>
