<template>
  <div class="form-wrapper">
    <slot />
  </div>
</template>

<script>
import {Component, Vue} from 'vue-property-decorator'
import './FormWrapper.less'

@Component
export default class FormWrapper extends Vue {}
</script>
