<template>
  <div class="form-wrapper">
    <slot />
  </div>
</template>

<script>
import {Component, Vue} from 'vue-property-decorator'

@Component
export default class FormWrapper extends Vue {}
</script>
