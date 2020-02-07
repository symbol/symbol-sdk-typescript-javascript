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
import {ValidationObserver} from 'vee-validate'

// child components
// @ts-ignore
import FormWrapper from '@/components/FormWrapper/FormWrapper.vue'

@Component({
  components: {
    FormWrapper,
    ValidationObserver,
  },
})
export class ModalFormGenericTs extends Vue {
  @Prop({
    default: false
  }) visible: boolean

  @Prop({
    default: (formItems: any) => true
  }) onSubmit: (formItems: any) => boolean

  @Prop({
    default: () => true
  }) onCancel: () => boolean

  /**
   * Form items
   * @var {any}
   */
  public formItems: any = {}

  /// region computed properties
  /**
   * Visibility state
   * @type {boolean}
   */
  public get show(): boolean {
    return this.visible
  }

  /**
   * Emits close event
   */
  public set show(val) {
    if (!val) {
      this.$emit('close')
    }
  }
  /// end-region computed properties

  /**
   * Hook called when the child form is submitted
   * @return {void}
   */
  public submit() {
    this.$emit('submit', this.formItems)
    this.show = false
    return this.onSubmit(this.formItems)
  }

  /**
   * Hook called when the child form is cancelled
   * @return {void}
   */
  public cancel() {
    this.$emit('cancel')
    return this.onCancel()
  }
}
