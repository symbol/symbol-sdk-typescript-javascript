<template>
  <div v-click-focus class="show-mnemonic">
    <div v-for="(word,index) in wordsArray" :key="index" class="input-already">
      {{ word }}
    </div>
    <div class="mnemonic-input-container">
      <input
        v-model="userInput" class="mnemonic-input" type="text"
        maxlength="50" @paste.prevent="handlePaste($event)" @keyup.space="addWord"
        @keyup.delete="deleteWord"
      >
    </div>
    <div class="copy-button" @click="copyToClipboard">
      <Button type="text">
        {{ $t('mnemonic_copy') }}
      </Button>
    </div>
  </div>
</template>
<script lang="ts">
import { MnemonicInputTs } from './MnemonicInputTs'
export default class MnemonicInput extends MnemonicInputTs { }
</script>
<style lang="less" scoped>
@import "./MnemonicInput.less";
</style>
