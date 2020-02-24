<template>
  <div class="form-label-container">
    <span class="form-label">
      <slot />
    </span>
  </div>
</template>

<script>
import {Component, Vue} from 'vue-property-decorator'

@Component
export default class FormLabel extends Vue {}
</script>
