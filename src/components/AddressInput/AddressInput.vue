<template>
  <div class="form-line-container">
    <FormLabel>{{ $t(label) }}</FormLabel>
    <ValidationProvider
      v-slot="{ errors }"
      mode="lazy"
      vid="recipient"
      :name="$t('recipient')"
      :rules="`address:${networkType}`"
      tag="div"
      class="inline-container"
    >
      <ErrorTooltip :errors="errors">
        <div class="full-width-item-container">
          <input
            v-model="rawValue"
            v-focus
            class="full-width-item-container input-size input-style"
            :placeholder="$t('placeholder_address')"
            type="text"
            @blur="$emit('blur', rawValue)"
          >
        </div>
      </ErrorTooltip>
    </ValidationProvider>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import { NetworkType } from 'nem2-sdk'

// internal dependencies
import { ValidationRuleset } from '@/core/validation/ValidationRuleset'

// child components
import { ValidationProvider } from 'vee-validate'
// @ts-ignore
import ErrorTooltip from '@/components/ErrorTooltip/ErrorTooltip.vue'
// @ts-ignore
import FormLabel from '@/components/FormLabel/FormLabel.vue'

@Component({
  components: {
    ValidationProvider,
    ErrorTooltip,
    FormLabel,
  },
  computed: {
    ...mapGetters({
      networkType: 'network/networkType',
    }),
  },
})
export default class AddressInput extends Vue {
  /**
   * Value bound to parent v-model
   * @type {string}
   */
  @Prop({ default: '' }) value: string

  /**
   * Field label
   * @type {string}
   */
  @Prop({ default: null }) label: string

  /**
   * Current network type
   * @var {NetworkType}
   */
  public networkType: NetworkType

  /**
   * Validation rules
   * @var {ValidationRuleset}
   */
  public validationRules = ValidationRuleset

  /// region computed properties getter/setter
  public get rawValue(): string {
    return this.value
  }

  public set rawValue(input: string) {
    this.$emit('input', input)
  }
  /// end-region computed properties getter/setter
}
</script>
