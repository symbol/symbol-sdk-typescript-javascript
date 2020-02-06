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
      <Button class="prev left" type="default" @click="$emit('canceled')">
        {{ $t('previous') }}
      </Button>
      <Button
        v-focus class="next right" type="success"
        @click="processVerification()"
      >
        {{ $t('next') }}
      </Button>
    </div>
  </div>
</template>

<script lang="ts">
import {MnemonicVerificationTs} from './MnemonicVerificationTs'
import './MnemonicVerification.less'

export default class MnemonicVerification extends MnemonicVerificationTs {}
</script>
