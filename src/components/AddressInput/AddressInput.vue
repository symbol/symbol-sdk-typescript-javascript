<template>
  <FormRow>
    <template v-slot:label>
      {{ $t(label) }}:
    </template>
    <template v-slot:inputs>
      <ValidationProvider
        v-slot="{ errors }"
        vid="recipient"
        :name="$t('recipient')"
        :rules="`required|address:${networkType}`"
        tag="div"
        class="inputs-container"
      >
        <ErrorTooltip :errors="errors">
          <input
            v-model="rawValue"
            v-focus
            class="input-size input-style"
            :placeholder="$t('placeholder_address')"
            type="text"
          >
        </ErrorTooltip>
      </ValidationProvider>
    </template>
  </FormRow>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import { NetworkType } from 'symbol-sdk'

// internal dependencies
import { ValidationRuleset } from '@/core/validation/ValidationRuleset'

// child components
import { ValidationProvider } from 'vee-validate'
// @ts-ignore
import ErrorTooltip from '@/components/ErrorTooltip/ErrorTooltip.vue'
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue'

@Component({
  components: {
    ValidationProvider,
    ErrorTooltip,
    FormRow,
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
