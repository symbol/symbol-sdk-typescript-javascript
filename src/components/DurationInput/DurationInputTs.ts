/**
 * Copyright 2020 NEM Foundation (https://nem.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {Component, Prop, Vue} from 'vue-property-decorator'
// internal dependencies
import {ValidationRuleset} from '@/core/validation/ValidationRuleset'
// child components
import {ValidationProvider} from 'vee-validate'
// @ts-ignore
import ErrorTooltip from '@/components/ErrorTooltip/ErrorTooltip.vue'
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue'

import {TimeHelpers} from '@/core/utils/TimeHelpers'
import {mapGetters} from 'vuex'
import {NetworkConfigurationModel} from '@/core/database/entities/NetworkConfigurationModel'

@Component({
  components: {
    ValidationProvider,
    ErrorTooltip,
    FormRow,
  },
  computed: {
    ...mapGetters({
      networkConfiguration: 'network/networkConfiguration',
    }),
  },
})
export class DurationInputTs extends Vue {
  @Prop({default: ''}) value: string

  /**
   * Asset type
   * @type {('mosaic' | 'namespace')}
   */
  @Prop({default: 'mosaic'}) targetAsset: 'mosaic' | 'namespace'

  /**
   * Field label
   * @type {string}
   */
  @Prop({default: 'form_label_duration'}) label: string

  /**
   * Validation rules
   * @var {ValidationRuleset}
   */
  public validationRules = ValidationRuleset

  /**
   * Injected network configuration.
   */
  private networkConfiguration: NetworkConfigurationModel

  /**
   * the toggle for the display of realativeTime
   * @type boolean
   */
  @Prop({default: false}) showRelativeTime: boolean

  /// region computed properties getter/setter
  public get chosenValue(): string {
    return this.value
  }

  public set chosenValue(amount: string) {
    this.$emit('input', amount)
  }

  /**
   * @return relativeTime example: 56d 21h 18m
   */
  public get relativeTime() {
    return TimeHelpers.durationToRelativeTime(parseInt(this.value),
      this.networkConfiguration.blockGenerationTargetTime)
  }

  public get validationRule(): string {
    return this.targetAsset === 'mosaic'
      ? this.validationRules.duration : this.validationRules.namespaceDuration
  }

/// end-region computed properties getter/setter
}
