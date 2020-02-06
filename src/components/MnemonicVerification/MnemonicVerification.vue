<template>
  <div class="mnemonic_container" @keyup.enter="processVerification()">
    <div class="mnemonicWordDiv clear scroll">
      <draggable v-model="selectedWords" ghost-class="ghost" @end="drag = false">
        <span v-for="(word, index) in selectedWords" :key="index">
          <Tag closable @on-close="removeWord(word)">
            {{ word }}
          </Tag>
        </span>
      </draggable>
    </div>
    <div class="wordDiv clear">
      <span
        v-for="(item,index) in shuffledWords"
        :key="index"
        :class="selectedWords.includes(item) ? 'confirmed_word' : ''"
        @click="addWord(item)"
      >
        {{ item }}
      </span>
    </div>
    <div class="buttons clear">
      <div class="flex-container mt-3">
        <button
          type="button"
          class="button-style back-button" 
          @click="$emit('cancelled')"
        >
          {{ $t('previous') }}
        </button>
        <button
          type="submit"
          class="button-style validation-button" 
          @click="processVerification()"
        >
          {{ $t('next') }}
        </button>   
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {MnemonicVerificationTs} from './MnemonicVerificationTs'
import './MnemonicVerification.less'
import '@/styles/forms.less'
export default class MnemonicVerification extends MnemonicVerificationTs {}
</script>
