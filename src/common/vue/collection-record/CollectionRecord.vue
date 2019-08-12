<template>
  <div class="right_record radius">

    <Modal
            :title="$t('transaction_detail')"
            v-model="isShowDialog"
            :transfer="false"
            class-name="dash_board_dialog">
      <div class="transfer_type">
        <span class="title">{{$t(transactionDetails[0].key)}}</span>
        <span class="value">{{$t(transactionDetails[0].value)}}</span>
      </div>
      <div>
        <div v-if="index !== 0" v-for="(t,index) in transactionDetails" class="other_info">
          <span class="title">{{$t(t.key)}}</span>
          <span class="value">{{t.value}}</span>
        </div>
      </div>
    </Modal>


    <div class="top_title">
      <span>{{transactionType == 1 ?$t('collection_record'):$t('transfer_record')}}</span>
      <div class="right" v-show="!isShowSearchDetail">
            <span class="select_date pointer">
              <div class="month_value">
                <img src="@/common/img/monitor/market/marketCalendar.png" alt="">
              <span>{{currentMonth}}</span>
              </div>
              <div class="date_selector">
                <DatePicker @on-change="changeCurrentMonth" type="month" placeholder="" :value="currentMonth"
                            style="width: 70px"></DatePicker>
              </div>
            </span>
        <span class="search_input un_click" @click.stop="showSearchDetail">
              <img src="@/common/img/monitor/market/marketSearch.png" alt="">
              <span>{{$t('search')}}</span>
            </span>
      </div>

      <div v-show="isShowSearchDetail" class="search_expand">
            <span class="search_container">
              <img src="@/common/img/monitor/market/marketSearch.png" alt="">
              <input @click.stop type="text" class="absolute" v-model="transactionHash"
                     :placeholder="$t('enter_asset_type_alias_or_address_search')">
            </span>
        <span class="search_btn pointer " @click.stop="searchByasset">{{$t('search')}}</span>
      </div>


    </div>
    <div class="bottom_transfer_record_list scroll">
      <Spin v-if="isLoadingTransactionRecord" size="large" fix></Spin>
      <div class="transaction_record_item pointer" @click="showDialog(c)" v-for="c in confirmedTransactionList">
        <img src="@/common/img/monitor/transaction/txConfirmed.png" alt="">
        <div class="flex_content">
          <div class="left left_components">
            <div class="top">{{c.mosaic.id ? c.mosaic.id.id.toHex().toUpperCase().slice(0,8)+'...': "&nbsp;"}}</div>
            <div class="bottom"> {{c.time.slice(0, c.time.length - 3)}}</div>
          </div>
          <div class="right">
            <div class="top">{{c.mosaic?c.mosaic.amount.compact():0}}</div>
            <div class="bottom">
              {{c.transactionInfo && c.transactionInfo.height.compact()}}
            </div>
          </div>
        </div>
      </div>

      <div class="no_data" v-if="confirmedTransactionList.length == 0 && !isLoadingTransactionRecord">
        {{$t('no_confirmed_transactions')}}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
    import {PublicAccount} from 'nem2-sdk'
    import {transactionInterface} from '@/interface/sdkTransaction'
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
    import transacrionAssetIcon from '@/common/img/monitor/transaction/txConfirmed.png'
    import {formatTransactions, getCurrentMonthFirst, getCurrentMonthLast,} from '@/help/help'

    @Component
    export default class CollectionRecord extends Vue {
        node = ''
        currentPrice = 0
        currentMonth = ''
        accountAddress = ''
        transactionHash = ''
        isShowDialog = false
        accountPublicKey = ''
        accountPrivateKey = ''
        isShowSearchDetail = false
        currentMonthLast: any = 0
        confirmedTransactionList = []
        currentMonthFirst: number = 0
        localConfirmedTransactions = []
        isLoadingTransactionRecord = true
        transacrionAssetIcon = transacrionAssetIcon
        transactionDetails = [
            {
                key: 'transfer_type',
                value: 'gathering'
            },
            {
                key: 'from',
                value: 'TCTEXC-5TGXD7-OQCHBB-MNU3LS-2GFCB4-2KD75D-5VCN'
            },
            {
                key: 'aims',
                value: 'Test wallet'
            },
            {
                key: 'the_amount',
                value: '10.000000XEM'
            },
            {
                key: 'fee',
                value: '0.050000000XEM'
            },
            {
                key: 'block',
                value: '1951249'
            },
            {
                key: 'hash',
                value: '9BBCAECDD5E2D04317DE9873DC99255A9F8A33FA5BB570D1353F65CB31A44151'
            },
            {
                key: 'message',
                value: 'message test this'
            }
        ]

        @Prop({
            default: () => {
                return 0
            }
        })
        transactionType

        get getWallet() {
            return this.$store.state.account.wallet
        }

        hideSearchDetail() {
            this.isShowSearchDetail = false
        }

        changeCurrentMonth(e) {
            this.currentMonth = e
        }


        // month filter
        @Watch('currentMonth')
        onCurrentMonthChange() {
            this.confirmedTransactionList = []
            const that = this
            const currentMonth = new Date(this.currentMonth)
            this.currentMonthFirst = getCurrentMonthFirst(currentMonth)
            this.currentMonthLast = getCurrentMonthLast(currentMonth)
            const {currentMonthFirst, currentMonthLast, localConfirmedTransactions} = this
            localConfirmedTransactions.forEach((item) => {
                if (item.date <= currentMonthLast && item.date >= currentMonthFirst) {
                    that.confirmedTransactionList.push(item)
                }
            })
        }

        showDialog(transaction) {
            this.isShowDialog = true
            this.transactionDetails = [
                {
                    key: 'transfer_type',
                    value: transaction.isReceipt ? 'gathering' : 'payment'
                },
                {
                    key: 'from',
                    value: transaction.signerAddress
                },
                {
                    key: 'aims',
                    value: transaction.recipientAddress
                },
                {
                    key: 'mosaic',
                    value: transaction.mosaic ? transaction.mosaic.id.toHex().toUpperCase() : null
                },
                {
                    key: 'the_amount',
                    value: transaction.mosaic ? transaction.mosaic.amount.compact() : 0
                },
                {
                    key: 'fee',
                    value: transaction.maxFee.compact()
                },
                {
                    key: 'block',
                    value: transaction.transactionInfo.height.compact()
                },
                {
                    key: 'hash',
                    value: transaction.transactionInfo.hash
                },
                {
                    key: 'message',
                    value: transaction.message.payload
                }
            ]
        }

        getConfirmedTransactions() {
            const that = this
            let {accountPrivateKey, accountPublicKey, accountAddress, node, transactionType} = this
            const publicAccount = PublicAccount.createFromPublicKey(accountPublicKey, this.getWallet.networkType)
            transactionInterface.transactions({
                publicAccount,
                node,
                queryParams: {
                    pageSize: 100
                }
            }).then((transactionsResult) => {
                transactionsResult.result.transactions.subscribe((transactionsInfo) => {
                    let transferTransaction = formatTransactions(transactionsInfo, accountAddress)
                    let list = []
                    // get transaction by choose recript tx or send
                    if (that.transactionType == 1) {
                        transferTransaction.forEach((item) => {
                            if (item.isReceipt) {
                                list.push(item)
                            }
                        })
                        that.confirmedTransactionList = list
                        this.localConfirmedTransactions = list
                        that.onCurrentMonthChange()
                        that.isLoadingTransactionRecord = false
                        return
                    }

                    transferTransaction.forEach((item) => {
                        if (!item.isReceipt) {
                            list.push(item)
                        }
                    })
                    that.confirmedTransactionList = list
                    this.localConfirmedTransactions = list
                    that.onCurrentMonthChange()
                    that.isLoadingTransactionRecord = false
                    return

                })
            })
        }

        initData() {
            this.accountPrivateKey = this.getWallet.privateKey
            this.accountPublicKey = this.getWallet.publicKey
            this.accountAddress = this.getWallet.address
            this.node = this.$store.state.account.node
            this.currentMonth = (new Date()).getFullYear() + '-' + ((new Date()).getMonth() + 1)
        }

        @Watch('getWallet')
        onGetWalletChange() {
            this.initData()
            this.getConfirmedTransactions()
        }

        @Watch('ConfirmedTxList')
        onConfirmedTxChange() {
            this.isLoadingTransactionRecord = true
            this.getConfirmedTransactions()
        }

        created() {
            this.initData()
            this.getConfirmedTransactions()
        }
    }
</script>
<style scoped lang="less">
  @import "CollectionRecord.less";
</style>
