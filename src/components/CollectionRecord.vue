<template>
  <div class="right_record radius">
    <div class="top_title">
      <span>{{$t('collection_record')}}</span>
      <div class="right" v-show="!isShowSearchDetail">
            <span class="select_date pointer">
              <div class="month_value">
                <img src="../assets/images/monitor/market/marketCalendar.png" alt="">
              <span>{{currentMonth}}</span>
              </div>
              <div class="date_selector">
                <DatePicker @on-change="changeCurrentMonth" type="month" placeholder="" :value="currentMonth"
                            style="width: 70px"></DatePicker>
              </div>
            </span>
        <span class="search_input un_click" @click.stop="showSearchDetail">
              <img src="../assets/images/monitor/market/marketSearch.png" alt="">
              <span>{{$t('search')}}</span>
            </span>
      </div>

      <div v-show="isShowSearchDetail" class="search_expand">
            <span class="search_container">
              <img src="../assets/images/monitor/market/marketSearch.png" alt="">
              <input @click.stop type="text" class="absolute" v-model="transactionHash"
                     :placeholder="$t('enter_asset_type_alias_or_address_search')">
            </span>
        <span class="search_btn pointer " @click.stop="searchByasset">{{$t('search')}}</span>
      </div>


    </div>
    <div class="bottom_transfer_record_list scroll">
      <Spin v-if="isLoadingTransactionRecord" size="large" fix></Spin>
      <div class="transaction_record_item"
           v-for="c in confirmedTransactionList">
        <img src="../assets/images/monitor/transaction/transacrionAssetIcon.png" alt="">
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

      <div class="no_data" v-if="confirmedTransactionList.length == 0 && !isLoadingTransactionRecord">
        {{$t('no_confirmed_transactions')}}
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
    } from '@/utils/util.js'
    import {transactionInterface} from '@/interface/sdkTransaction';
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import transacrionAssetIcon from '../assets/images/monitor/transaction/transacrionAssetIcon.png'
    import axios from 'axios'

    @Component
    export default class CollectionRecord extends Vue {
        transacrionAssetIcon = transacrionAssetIcon
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
        currentPrice = 0
        transactionHash = ''

        get getWallet () {
            return this.$store.state.account.wallet
        }

        searchByasset() {
            // let {transactionHash, accountPrivateKey, accountPublicKey, currentXem, accountAddress, node} = this
            // if (transactionHash.length < 64) {
            //     this.$Message.destroy()
            //     this.$Message.error(this['$t']('transaction_hash_error'))
            //     return
            // }
            // const that = this
            // console.log(transactionHash)
            // const url = `${node}/transaction/${transactionHash}`
            // axios.get(url).then(function (response) {
            //     let result = response.data.transaction
            // }).catch(() => {
            //     console.log('no this transaction')
            // })
        }

        async getMarketOpenPrice() {
            const that = this
            const url = this.$store.state.app.marketUrl + '/kline/xemusdt/1min/1'
            await axios.get(url).then(function (response) {
                const result = response.data.data[0]
                that.currentPrice = result.open
                console.log(that.currentPrice)
            }).catch(function (error) {
                console.log(error);
            });
        }

        showSearchDetail() {
            // this.isShowSearchDetail = true
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

        initData() {
            this.accountPrivateKey = this.getWallet.privateKey
            this.accountPublicKey = this.getWallet.publicKey
            this.accountAddress = this.getWallet.address
            this.node = this.$store.state.account.node
            this.currentMonth = (new Date()).getFullYear() + '-' + ((new Date()).getMonth() + 1)
        }

        @Watch('getWallet')
        onGetWalletChange(){
            this.initData()
            this.getConfirmedTransactions()
        }

        created() {
            this.initData()
            this.getConfirmedTransactions()
        }
    }
</script>
<style scoped lang="less">
  .right_record {
    width: 415px;
    height: 100%;
    float: right;
    background-color: white;

    .top_title {
      height: 120px;
      border-bottom: 2px solid #eee;
      display: flex;
      justify-content: center;
      flex-direction: column;
      justify-items: center;
      text-align: center;
      font-size: 20px;
      font-weight: 400;
      color: rgba(34, 34, 34, 1);

      .right {
        margin-top: 10px;
        font-size: 16px;
        font-weight: 400;
        color: rgba(32, 181, 172, 1);
        position: relative;
        right: 20px;

        .select_date {
          position: relative;

          .date_selector {
            display: inline-block;
            position: relative;
            right: 20px;
          }

          .month_value {
            display: inline-block;
            position: relative;
            left: 30px;
            bottom: 3px;

            img {
              position: relative;
              top: 2px;
            }
          }
        }

        .search_input {
          position: relative;

          span {
            position: relative;
            bottom: 2px;
          }
        }

        .search_input::before {
          content: '';
          display: block;
          width: 1px;
          height: 16px;
          background-color: #CCCCCC;
          position: absolute;
          left: -20px;
          bottom: 4px;
        }

        img {
          margin-right: 5px;
          position: relative;
          width: 18px;
          height: 18px;
        }
      }

      .search_expand {
        position: relative;
        top: 5px;

        .search_container {
          display: inline-block;
          width: 308px;
          height: 40px;
          border: 1px solid rgba(32, 181, 172, 1);
          border-radius: 20px;
          margin-left: 19px;
          position: relative;

          img {
            position: absolute;
            left: 10px;
            top: 10px;
            width: 18px;
            height: 18px;
          }

          input {
            width: 240px;
            outline: none;
            border: none;
            left: 10px;
            background-color: transparent;
          }

          input::placeholder {
            font-size: 12px;
            color: #999999;
          }
        }

        .search_btn {
          display: inline-block;
          margin-left: 15px;
          font-weight: 400;
          font-size: 16px;
          color: rgba(32, 181, 172, 1);
          position: relative;
          bottom: 15px;
        }
      }
    }

    .bottom_transfer_record_list {
      padding: 34px 42px;
      height: calc(100% - 130px);
      position: relative;

      .no_data {
        text-align: center;
        margin-top: 30px;
      }

      .transaction_record_item {
        padding: 14px 0;
        border-bottom: 1px solid rgba(238, 238, 238, 1);
        display: flex;
        flex-direction: row;
        align-items: center;

        .flex_content {
          margin-left: 20px;
          width: 300px;

          .right_components {
            padding-right: 40px;

          }

          .left_components,
          .right_components {
            width: 50%;

            div {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }

          .right_components {
            width: 50%;
          }

          .right {
            text-align: right;
          }
        }

        img {
          width: 32px;
          height: 32px;
        }

        .top {
          font-size: 14px;
          font-weight: 400;
          color: rgba(34, 34, 34, 1);
          display: block;
        }

        .bottom {
          display: block;
          font-size: 12px;
          font-weight: 400;
          color: rgba(153, 153, 153, 1);
        }
      }

    }
  }
</style>
