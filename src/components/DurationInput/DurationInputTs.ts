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
import {Component, Vue, Prop} from 'vue-property-decorator'

// internal dependencies
import {ValidationRuleset} from '@/core/validation/ValidationRuleset'

// child components
import {ValidationProvider} from 'vee-validate'
// @ts-ignore
import ErrorTooltip from '@/components/ErrorTooltip/ErrorTooltip.vue'
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue'

import { TimeHelpers } from '@/core/utils/TimeHelpers' 
@Component({
  components: {
    ValidationProvider,
    ErrorTooltip,
    FormRow,
  },
})
export class DurationInputTs extends Vue {
  @Prop({ default: '' }) value: string

  /**
   * Asset type
   * @type {('mosaic' | 'namespace')}
   */
  @Prop({ default: 'mosaic' }) targetAsset: 'mosaic' | 'namespace'

  /**
   * Field label
   * @type {string}
   */
  @Prop({ default: 'form_label_duration' }) label: string

  /**
   * Validation rules
   * @var {ValidationRuleset}
   */
  public validationRules = ValidationRuleset

  /**
   * the toggle for the display of realativeTime
   * @type boolean
   */
  @Prop({ default: false }) showRelativeTime: boolean
  /**
   * relativeTime example: 56d 21h 18m
   * @var {string}
   */
  public relativeTime=TimeHelpers.durationToRelativeTime(parseInt(this.value))

  /// region computed properties getter/setter
  public get chosenValue(): string {
    return this.value
  }

  public set chosenValue(amount: string) {
    // toSetTheRelative
    this.relativeTime = TimeHelpers.durationToRelativeTime(parseInt(amount))
    this.$emit('input', amount)
  }
   
  public get validationRule(): string {
    return this.targetAsset === 'mosaic'
      ? this.validationRules.duration : this.validationRules.namespaceDuration
  }
/// end-region computed properties getter/setter
}
