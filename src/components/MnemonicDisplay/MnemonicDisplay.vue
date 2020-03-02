<template>
  <div class="mnemonic_container">
    <div class="mnemonicWordDiv clear">
      <span v-for="(word, index) in words" :key="index" class="ghost">
        <Tag closable @on-close="removeWord(word)">
          {{ word }}
        </Tag>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import {MnemonicDisplayTs} from './MnemonicDisplayTs'
import './MnemonicDisplay.less'
export default class MnemonicDisplay extends MnemonicDisplayTs {}
</script>
