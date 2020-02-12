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
// external dependencies
import {Component, Prop, Vue} from 'vue-property-decorator'

// child components
// @ts-ignore
import TableRow from '@/components/TableRow/TableRow.vue'
// @ts-ignore
import AmountDisplay from '@/components/AmountDisplay/AmountDisplay.vue'

@Component({
  components: {
    TableRow,
    AmountDisplay,
  },
})
export class TableRowTs extends Vue {
  /**
   * Type of assets shown in the table
   * @type {string}
   */
  @Prop({default: 'mosaic'}) assetType: string

  /**
   * Type of assets shown in the table
   * @type {any}
   */
  @Prop({default: []}) rowValues: any

  public async created() {
    await this.rowValues
  }
}
