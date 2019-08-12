<template>
  <div class="transaction_content" @click="hideSearchDetail()">
    <div class="left_container radius ">
      <div class="top_transfer_type">
        <span
                @click="swicthTransferType(index)"
                :class="['transaction_btn',t.isSelect?'selected_button':'', t.disabled?'disabled_button':'pointer']"
                v-for="(t,index) in transferTypeList">{{$t(t.name)}}
        </span>
      </div>
      <div class="bottom_transfer_info scroll ">
        <div class="transfer" v-if="transferTypeList[0].isSelect">
          <TransferTransaction></TransferTransaction>
        </div>

        <div class="multisig" v-if="transferTypeList[1].isSelect">
          <MultisigTransferTransaction></MultisigTransferTransaction>
        </div>
      </div>
    </div>
    <CollectionRecord :transactionType="0"></CollectionRecord>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator'
    import CollectionRecord from '@/common/vue/collection-record/CollectionRecord.vue'
    import TransferTransaction from './transactions/transfer-transaction/TransferTransaction.vue'
    import MultisigTransferTransaction from './transactions/multisig-transfer-transaction/MultisigTransferTransaction.vue'

    @Component({
        components: {
            TransferTransaction,
            CollectionRecord,
            MultisigTransferTransaction
        }
    })
    export default class Transfer extends Vue {
        accountPublicKey = ''
        accountAddress = ''
        node = ''
        transferTypeList = [
            {
                name: 'ordinary_transfer',
                isSelect: true,
                disabled: false
            }, {
                name: 'Multisign_transfer',
                isSelect: false,
                disabled: false
            }, {
                name: 'crosschain_transfer',
                isSelect: false,
                disabled: true
            }, {
                name: 'aggregate_transfer',
                isSelect: false,
                disabled: true
            }
        ]
        currentPrice = 0

        get getWallet () {
            return this.$store.state.account.wallet
        }

        showSearchDetail() {
            // this.isShowSearchDetail = true
        }

        hideSearchDetail() {

        }
        swicthTransferType(index) {
            const list: any = this.transferTypeList
            if (list[index].disabled) {
                return
            }
            list.map((item) => {
                item.isSelect = false
                return item
            })
            list[index].isSelect = true
            this.transferTypeList = list
        }


        initData() {
            this.accountPublicKey = this.getWallet.publicKey
            this.accountAddress = this.getWallet.address
            this.node = this.$store.state.account.node
        }


        created() {
            this.initData()
        }
    }
</script>
<style scoped lang="less">
  @import "MonitorTransfer.less";
</style>
