<template>
  <div class="form-wrapper">
    <DisabledFormOverlay :whitelisted="whitelisted" />
    <slot />
  </div>
</template>

<script lang="ts">
// external dependencies
import {Component, Vue, Prop} from 'vue-property-decorator'

// child components
import DisabledFormOverlay from '@/components/DisabledFormOverlay/DisabledFormOverlay.vue'

@Component({ components: {DisabledFormOverlay} })
export default class FormWrapper extends Vue {
  /**
   * Overrides checks in disabled form overlay
   * @type{boolean}
   */
  @Prop({ default: false }) whitelisted: boolean
}
</script>
