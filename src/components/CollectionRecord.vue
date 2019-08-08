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
                <img src="@/assets/images/monitor/market/marketCalendar.png" alt="">
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
      <div class="transaction_record_item pointer" @click="showDialog(c)" v-for="c in confirmedTransactionList">
        <img src="../assets/images/monitor/transaction/transacrionAssetIcon.png" alt="">
        <div class="flex_content">
          <div class="left left_components">
            <div class="top">{{c.oppositeAddress}}</div>
            <div class="bottom"> {{c.time}}</div>
          </div>
          <div class="right right_components">
            <div class="top">{{c.mosaic?c.mosaic.amount.compact():0}}</div>
            <div class="bottom" v-if="c.mosaic">USD
              {{c.mosaic && c.mosaic.id.toHex() == $store.state.account.currentXEM1 || c.mosaic.id.toHex() ==
              $store.state.account.currentXEM2?c.mosaic.amount.compact() * currentPrice:0}}
            </div>
            <div v-else> 0</div>
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
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import transacrionAssetIcon from '../assets/images/monitor/transaction/transacrionAssetIcon.png'
    import axios from 'axios'

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
        currentMonthLast: number = 0
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
            const publicAccount = PublicAccount.createFromPublicKey(accountPublicKey, NetworkType.MIJIN_TEST)
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
          display: block;
          width: 32px;
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


    .dash_board_dialog {
      .value {
        border: none;
      }

      display: flex;
      align-items: center;
      justify-content: center;

      .title {
        display: inline-block;
        width: 100px;
        margin-right: 60px;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
        text-align: right;

      }

      span {
        margin-top: 8px;
        font-size: 16px;
      }

      .value {
        font-size: 16px;
        font-weight: 400;
        color: rgba(34, 34, 34, 1);
      }

      .other_info:nth-of-type(odd) {
        margin-top: 20px;
      }

      .transfer_type {
        .value {
          font-size: 20px;
          font-weight: bold;
          color: rgba(241, 95, 35, 1);
        }
      }

    }
  }
</style>
