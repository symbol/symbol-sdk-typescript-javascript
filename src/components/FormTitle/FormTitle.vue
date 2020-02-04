<template>
  <div class="form-title-container">
    <span class="form-title">
      <slot />
    </span>
  </div>
</template>

<script>
import {Component, Vue} from 'vue-property-decorator'
import './FormTitle.less'

@Component
export default class FormTitle extends Vue {}
</script>
