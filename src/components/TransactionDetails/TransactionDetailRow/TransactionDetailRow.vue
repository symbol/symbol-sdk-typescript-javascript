<template>
  <div class="transaction-row-inner-container">
    <div class="transaction-details-row-label-container">
      <span>
        {{ $t(label) }}:
      </span>
    </div>
    <div class="transaction-details-row-value-container">
      <span v-if="label === 'hash' || label === 'inner_transaction_hash'">
        <a
          class="url_text"
          target="_blank"
          :href="(explorerBaseUrl + '/transaction/' + value)"
        >{{ value }}</a>
      </span>
      <span v-else-if="isMosaic">
        <MosaicAmountDisplay
          :id="value.id"
          :relative-amount="value.amount"
          :show-ticker="true"
          :ticker="value.mosaicHex"
        />
      </span>
      <span v-else>
        {{ value }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
// external dependencies
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Mosaic } from 'symbol-sdk'

// configuration
import networkConfig from '@/../config/network.conf.json'

// child components
import MosaicAmountDisplay from '@/components/MosaicAmountDisplay/MosaicAmountDisplay.vue'

@Component({ components: { MosaicAmountDisplay }})
export default class TransactionDetailRow extends Vue {
  @Prop({ default: '', required: true }) label: string
  @Prop({ default: '', required: true }) value: string | boolean | number | Mosaic
  @Prop({ default: false, required: false }) isMosaic: boolean
  
  /**
   * Explorer base path
   * @var {string}
   */
  protected explorerBaseUrl: string = networkConfig.explorerUrl
}
</script>

<style lang="less" >
@import '../TransactionDetails.less';
</style>
