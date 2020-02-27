<template>
  <div class="form-wrapper">
    <DisabledFormOverlay />
    <slot />
  </div>
</template>

<script lang="ts">
// external dependencies
import {Component, Vue} from 'vue-property-decorator'

// child components
import DisabledFormOverlay from '@/components/DisabledFormOverlay/DisabledFormOverlay.vue'

@Component({ components: {DisabledFormOverlay} })
export default class FormWrapper extends Vue { }
</script>
