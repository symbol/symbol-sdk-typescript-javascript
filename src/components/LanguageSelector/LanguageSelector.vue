<template>
  <div class="switch_language">
    <i-select v-model="language">
      <i-option v-for="(item, index) in languageList" :key="index" :value="item.value">
        {{ item.label }}
      </i-option>
    </i-select>
  </div>
</template>

<script lang="ts">
import {LanguageSelectorTs} from './LanguageSelectorTs'
import './LanguageSelector.less'

export default class LanguageSelector extends LanguageSelectorTs {}
</script>

