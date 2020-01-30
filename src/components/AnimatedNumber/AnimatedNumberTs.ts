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

@Component
export class AnimatedNumberTs extends Vue {

  @Prop({
    default: 2
  }) time: number

  @Prop({
    default: 0
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
      this.animate(this.$refs.animee)
    }
  }

  /**
   * Animate the element by adding intervals
   * between incremental steps.
   * @param {Vue.Refs} ref
   */
  protected animate(ref) {
    const step = (this.value * 10) / (this.time * 1000)
    let current = 0
    let start = 0
    let t = setInterval(function () {
      start += step
      if (start > this.value) {
        clearInterval(t)
        start = this.value
        t = null
        this.$emit('done')
      }
      if (current === start) {
        return
      }
      current = Number(Number(start).toFixed(0))
      ref.innerHTML = current.toString().replace(/(\d)(?=(?:\d{3}[+]?)+$)/g, '$1,')
    }, 10)
  }
}
