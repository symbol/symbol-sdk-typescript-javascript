<template>
  <FormRow>
    <template v-slot:label>
      {{ $t('fee') }}:
    </template>
    <template v-slot:inputs>
      <div class="row-75-25 inputs-container">
        <MaxFeeSelector v-model="maxFee" />
        <div v-if="!disableSubmit" class="pl-2">
          <button
            type="submit"
            class="centered-button button-style validation-button submit-button"
            @click="$emit('button-clicked')"
          >
            {{ $t('send') }}
          </button>
        </div>
      </div>
    </template>
  </FormRow>
</template>

<script lang="ts">
// extenal dependencies
import {Component, Vue, Prop} from 'vue-property-decorator'

// child components
import MaxFeeSelector from '@/components/MaxFeeSelector/MaxFeeSelector.vue'
import FormRow from '@/components/FormRow/FormRow.vue'

@Component({ components: { MaxFeeSelector, FormRow } })
export default class MaxFeeAndSubmit extends Vue {
  /**
   * Max fee value, bound to parent v-model
   * @type {number}
   */
  @Prop({ default: 0, required: true }) value: number

  /**
   * Whether form submission is disabled
   * @type {boolean}
   */
  @Prop({ default: false }) disableSubmit: boolean

  /**
   * Get max fee value from the value prop
   * @readonly
   * @protected
   * @type {number}
   */
  protected get maxFee(): number {
    return this.value
  }

  /**
   * Emit chosen max fee value to the parent component
   * @protected
   */
  protected set maxFee(chosenMaxFee) {
    this.$emit('input', chosenMaxFee)
  }
}
</script>

<style lang="less">
@import './MaxFeeAndSubmit.less';
</style>
