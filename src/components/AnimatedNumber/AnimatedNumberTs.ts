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
import {Formatters} from '@/core/utils/Formatters'

// child components
import VueNumber from 'vue-number-animation'

@Component({components: {VueNumber}})
export class AnimatedNumberTs extends Vue {

  @Prop({
    default: 2,
  }) time: number

  @Prop({
    default: 0,
  }) value: number

  /**
   * Formatters instance
   * @var {Formatters}
   */
  public formatters = Formatters

  /**
   * Hook called when the component is mounted
   * @return {void}
   */
  public mounted() {
    if (this.value) {
      (this.$refs.animee as VueNumber).play()
    }
  }
}
