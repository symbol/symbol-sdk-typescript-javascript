<template>
  <div :class="['form-row', className ]">
    <div class="form-row-inner-container">
      <div class="label-container">
        <FormLabel>
          <slot name="label" />
        </FormLabel>
      </div>
      <div class="inputs-container">
        <slot name="inputs" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Prop} from 'vue-property-decorator'

// child components
import FormLabel from '@/components/FormLabel/FormLabel.vue'

@Component({ components: { FormLabel }})
export default class FormRow extends Vue {
  @Prop({ default: '' }) className: 'emphasis'
}
</script>
