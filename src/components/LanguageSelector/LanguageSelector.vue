<template>
  <div class="switch_language">
    <i-select v-model="language" :class="{'select-size select-style': defaultFormStyle}">
      <i-option v-for="({label, value}, index) in languageList" :key="index" :value="value">
        {{ label }}
      </i-option>
    </i-select>
  </div>
</template>

<script lang="ts">
import {LanguageSelectorTs} from './LanguageSelectorTs'
import './LanguageSelector.less'

export default class LanguageSelector extends LanguageSelectorTs {}
</script>

