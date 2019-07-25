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
        <div class="transfer  " v-if="transferTypeList[0].isSelect">
          <TransferTransaction></TransferTransaction>
        </div>

        <div class="multisig" v-if="transferTypeList[1].isSelect">
          MULTISIG
        </div>
      </div>

    </div>
    <div class="right_record radius">
      <div class="top_title">
        <span>{{$t('transfer_record')}}</span>
        <div class="right" v-show="!isShowSearchDetail">
            <span class="select_date">
              <div class="month_value">
                <img src="../../../assets/images/monitor/market/marketCalendar.png" alt="">
              <span>{{currentMonth}}</span>
              </div>
              <div class="date_selector">
                <DatePicker @on-change="changeCurrentMonth" type="month" placeholder="" :value="currentMonth"
                            style="width: 70px"></DatePicker>
              </div>
            </span>
          <span class="search_input un_click" @click.stop="showSearchDetail">
              <img src="../../../assets/images/monitor/market/marketSearch.png" alt="">
              <span>{{$t('search')}}</span>
            </span>
        </div>
        <div v-show="isShowSearchDetail" class="search_expand">
            <span class="search_container">
              <img src="../../../assets/images/monitor/market/marketSearch.png" alt="">
              <input @click.stop type="text" class="absolute" placeholder="输入资产类型，别名或地址搜索">
            </span>
          <span class="search_btn" @click.stop="searchByasset">{{$t('search')}}</span>
        </div>

      </div>
      <div class="bottom_transfer_record_list scroll">

        <Spin v-if="isLoadingTransactionRecord" size="large" fix></Spin>

        <div v-show="c.date<=currentMonthLast && c.date>=currentMonthFirst" class="transaction_record_item"
             v-for="c in confirmedTransactionList">
          <img src="../../../assets/images/monitor/transaction/transacrionAssetIcon.png" alt="">
          <div class="flex_content">
            <div class="left left_components">
              <div class="top">{{c.oppositeAddress}}</div>
              <div class="bottom"> {{c.time}}</div>
            </div>
            <div class="right right_components">
              <div class="top">{{c.mosaic?c.mosaic.amount.compact():0}}</div>
              <div class="bottom">USD
                {{c.mosaic && c.mosaic.id.toHex() == $store.state.account.currentXEM1 || c.mosaic.id.toHex() ==
                $store.state.account.currentXEM2?c.mosaic.amount.compact() * currentPrice:0}}
              </div>
            </div>
          </div>
        </div>

        <div class="no_data" v-if="confirmedTransactionList.length == 0 && !isLoadingTransactionRecord">{{$t('no_confirmed_transactions')}}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
    import {
        PublicAccount,
        NetworkType
    } from 'nem2-sdk';
    import {
        formatTransactions,
        getCurrentMonthFirst,
        getCurrentMonthLast,
        isRefreshData,
        localSave,
        localRead
    } from '@/utils/util.js'
    import {transactionInterface} from '@/interface/sdkTransaction';
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import axios from 'axios'
    import TransferTransaction from './transactions/transfer-transaction/TransferTransaction.vue'


    @Component({
        components: {
            TransferTransaction,
        }
    })
    export default class Transfer extends Vue {
        isLoadingTransactionRecord = true
        currentMonth = ''
        isShowSearchDetail = false
        accountPrivateKey = ''
        accountPublicKey = ''
        accountAddress = ''
        node = ''
        confirmedTransactionList = []
        currentMonthFirst: number = 0
        currentMonthLast: number = 0
        localConfirmedTransactions = []
        transferTypeList = [
            {
                name: 'ordinary_transfer',
                isSelect: true,
                disabled: false
            }, {
                name: 'Multisign_transfer',
                isSelect: false,
                disabled: true
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

        showSearchDetail() {
            // this.isShowSearchDetail = true
        }

        hideSearchDetail() {
            this.isShowSearchDetail = false
        }

        changeCurrentMonth(e) {
            this.currentMonth = e
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

        getConfirmedTransactions() {
            const that = this
            let {accountPrivateKey, accountPublicKey, accountAddress, node} = this
            const publicAccount = PublicAccount.createFromPublicKey(accountPublicKey, NetworkType.MIJIN_TEST)
            transactionInterface.transactions({
                publicAccount,
                node,
                queryParams: {
                    pageSize: 100
                }
            }).then((transactionsResult) => {
                transactionsResult.result.transactions.subscribe((transactionsInfo) => {
                    let transferTransaction = formatTransactions(transactionsInfo, accountPublicKey)
                    that.confirmedTransactionList = transferTransaction
                    this.localConfirmedTransactions = transferTransaction
                    that.onCurrentMonthChange()
                    that.isLoadingTransactionRecord = false
                })
            })
        }

        async getMarketOpenPrice() {
            if(!isRefreshData('openPriceOneMinute', 1000*60, new Date().getSeconds())){
                const openPriceOneMinute = JSON.parse(localRead('openPriceOneMinute'))
                this.currentPrice = openPriceOneMinute.openPrice
                return
            }
            const that = this
            const url = this.$store.state.app.marketUrl + '/kline/xemusdt/1min/1'
            await axios.get(url).then(function (response) {
                const result = response.data.data[0].open
                that.currentPrice = result
                const openPriceOneMinute = {
                    timestamp: new Date().getTime(),
                    openPrice: result
                }
                localSave('openPriceOneMinute', JSON.stringify(openPriceOneMinute))
            }).catch(function (error) {
                console.log('transfer monitor');
            });
        }

        initData() {
            this.accountPrivateKey = this.$store.state.account.accountPrivateKey
            this.accountPublicKey = this.$store.state.account.accountPublicKey
            this.accountAddress = this.$store.state.account.accountAddress
            this.node = this.$store.state.account.node
            this.currentMonth = (new Date()).getFullYear() + '-' + ((new Date()).getMonth() + 1)
        }


        created() {
            this.initData()
            this.getMarketOpenPrice()
            this.getConfirmedTransactions()
        }
    }
</script>
<style scoped lang="less">
  @import "MonitorTransfer.less";
</style>
