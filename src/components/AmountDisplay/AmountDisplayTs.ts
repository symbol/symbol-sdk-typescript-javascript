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

@Component
export class AmountDisplayTs extends Vue {

  @Prop({
    default: 0
  }) amount: number

  @Prop({
    default: 0
  }) decimals: number

/// region computed properties getter/setter
  get parts() {
    const p1 = Math.floor(this.amount)
    const p2 = this.amount - p1
    return [p1, p2]
  }
/// end-region computed properties getter/setter
}
