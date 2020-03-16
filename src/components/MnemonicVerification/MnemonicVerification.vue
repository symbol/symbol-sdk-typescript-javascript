<template>
  <div class="mnemonic_container" @keyup.enter="processVerification()">
    <div class="mnemonicWordDiv clear scroll">
      <draggable v-model="selectedWordIndexes" ghost-class="ghost" @end="drag = false">
        <span v-for="index in selectedWordIndexes" :key="index">
          <Tag closable @on-close="removeWord(index)">
            {{ shuffledWords[index] }}
          </Tag>
        </span>
      </draggable>
    </div>
    <div class="wordDiv clear">
      <span
        v-for="index in shuffledWordsIndexes"
        :key="index"
        :class="selectedWordIndexes.includes(index) ? 'confirmed_word' : ''"
        @click="onWordClicked(index)"
      >
        {{ shuffledWords[index] }}
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
export default class MnemonicVerification extends MnemonicVerificationTs {}
</script>
