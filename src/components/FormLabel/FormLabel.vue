<template>
  <div class="form-label-container clearfix">
    <div class="clearfix">
      <span class="form-label">
        <!-- default slot  -->
        <slot />
      </span>
    </div>
    <div class="clearfix">
      <span class="form-label-description">
        <slot name="label-description" />
      </span>
    </div>
  </div>
</template>

<script>
import {Component, Vue} from 'vue-property-decorator'
import './FormLabel.less'

@Component
export default class FormLabel extends Vue {}
</script>
