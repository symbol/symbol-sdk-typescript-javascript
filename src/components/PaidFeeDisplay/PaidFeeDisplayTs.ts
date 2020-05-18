/*
 * Copyright 2020 NEM Foundation (https://nem.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
// external dependencies
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Transaction } from 'symbol-sdk'
// @ts-ignore
import MosaicAmountDisplay from '@/components/MosaicAmountDisplay/MosaicAmountDisplay.vue'
import { BlockInfoModel } from '@/core/database/entities/BlockInfoModel'
// configuration

@Component({
  components: { MosaicAmountDisplay },
})
export class PaidFeeDisplayTs extends Vue {
  @Prop() transaction: Transaction

  public amount = 0

  public isMaxFee = false

  public isLoading = false

  public async mounted() {
    this.amount = this.transaction.maxFee.compact()
    this.isMaxFee = true
    this.isLoading = true
    if (this.transaction.transactionInfo && this.transaction.transactionInfo.height) {
      try {
        const blockInfo: BlockInfoModel = await this.$store.dispatch(
          'block/GET_BLOCK',
          this.transaction.transactionInfo.height,
        )
        this.isLoading = false
        this.isMaxFee = false
        this.amount = blockInfo.feeMultiplier * this.transaction.size
      } catch (e) {
        this.isLoading = false
      }
    }
  }
}
