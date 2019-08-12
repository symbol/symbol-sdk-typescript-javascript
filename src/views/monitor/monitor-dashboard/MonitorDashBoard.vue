<template>
  <div class="dash_board_container">
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

    <div class="top_network_info">
      <div class="left_echart radius">
        <span class="trend">{{$t('XEM_market_trend_nearly_7_days')}}</span>
        <span class="right">
          <span>{{$t('The_total_market_capitalization')}}（USD）</span>
          <span class="black">{{currentPrice}}</span>
        </span>
        <LineChart></LineChart>
      </div>
      <div class="right_net_status radius">
        <div class="panel_name">{{$t('network_status')}}</div>

        <div class="network_item radius" v-for="(n,index) in networkStatusList">
          <img :src="n.icon" alt="">
          <span class="descript">{{$t(n.descript)}}</span>
          <span :class="['data','overflow_ellipsis', updateAnimation]">
            <numberGrow v-if="index !== 4" :value="$store.state.app.chainStatus[n.variable]"></numberGrow>
            <span v-else>...{{$store.state.app.chainStatus[n.variable].substr(-5,5)}}</span>
          </span>
        </div>
      </div>
    </div>

    <div class="bottom_transactions radius scroll" ref="bottomTransactions">
      <div class="splite_page">
        <span>{{$t('total')}}：{{currentDataAmount}} {{$t('data')}}</span>
        <Page @on-change="changePage" :total="currentDataAmount" class="page_content"/>
      </div>

      <div class="label_page">
        <span @click="switchTransactionPanel(true)"
              :class="['pointer',showConfirmedTransactions?'selected':'','page_title']">
          {{$t('confirmed_transaction')}} ({{confirmedDataAmount}})
        </span>
        <span class="line">|</span>
        <span @click="switchTransactionPanel(false)"
              :class="['pointer',showConfirmedTransactions?'':'selected','page_title']">
          {{$t('unconfirmed_transaction')}} ({{unconfirmedDataAmount}})
        </span>
      </div>

      <div class="all_transaction">
        <div class="table_head">
          <span class="account">{{$t('account')}}</span>
          <span class="transfer_type">{{$t('transaction_type')}}</span>
          <span class="amount">{{$t('the_amount')}}</span>
          <span class="date">{{$t('date')}}</span>
        </div>
        <div class="confirmed_transactions" v-if="showConfirmedTransactions">
          <Spin v-if="isLoadingConfirmedTx" size="large" fix class="absolute"></Spin>
          <div class="table_body hide_scroll" ref="confirmedTableBody">
            <div class="table_item pointer" @click="showDialog(c)" v-for="c in currentTransactionList">
              <img class="mosaic_action" v-if="!c.isReceipt"
                   src="@/common/img/monitor/dash-board/dashboardMosaicOut.png" alt="">
              <img class="mosaic_action" v-else src="@/common/img/monitor/dash-board/dashboardMosaicIn.png"
                   alt="">
              <span class="account">{{c.oppositeAddress}}</span>
              <span class="transfer_type">{{c.isReceipt ? $t('gathering'):$t('payment')}}</span>
              <span class="mosaicId">{{c.mosaic?c.mosaic.id.toHex().toUpperCase():null}}</span>
              <span class="amount" v-if="c.mosaic">{{c.isReceipt ? '+':'-'}}{{c.mosaic.amount.compact()}}</span>
              <span v-else class="amount"> 0</span>
              <span class="date">{{c.time}}</span>
              <img src="@/common/img/monitor/dash-board/dashboardExpand.png"
                   class="radius expand_mosaic_info">
            </div>
            <div class="no_data" v-if="confirmedTransactionList.length == 0">
              {{$t('no_confirmed_transactions')}}
            </div>
          </div>
        </div>

        <div class="unconfirmed_transactions" v-if="!showConfirmedTransactions">
          <Spin v-if="isLoadingUnconfirmedTx" size="large" fix class="absolute"></Spin>
          <div class="table_body hide_scroll" ref="unconfirmedTableBody">
            <div class="table_item pointer" @click="showDialog(u)" v-for="(u,index) in unconfirmedTransactionList"
                 :key="index">
              <img class="mosaic_action" v-if="u.isReceipt"
                   src="@/common/img/monitor/dash-board/dashboardMosaicOut.png" alt="">
              <img class="mosaic_action" v-else src="@/common/img/monitor/dash-board/dashboardMosaicIn.png"
                   alt="">
              <span class="account">{{u.oppositeAddress}}</span>
              <span class="transfer_type">{{u.isReceipt ? $t('gathering'):$t('payment')}}</span>
              <span class="amount">{{u.isReceipt ? '+':'-'}}{{u.mosaic.amount.compact()}}</span>
              <span class="date">{{u.time}}</span>
              <img src="@/common/img/monitor/dash-board/dashboardExpand.png"
                   class="radius expand_mosaic_info">
            </div>
            <div class="no_data" v-if="unconfirmedTransactionList.length == 0">
              {{$t('no_unconfirmed_transactions')}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
    import {market} from "@/interface/restLogic"
    import {KlineQuery} from "@/query/klineQuery"
    import LineChart from '@/common/vue/line-chart/LineChart.vue'
    import {PublicAccount, NetworkType} from 'nem2-sdk'
    import numberGrow from '@/common/vue/number-grow/NumberGrow.vue'
    import {Component, Vue, Watch} from 'vue-property-decorator'
    import {blockchainInterface} from '@/interface/sdkBlockchain'
    import {transactionInterface} from '@/interface/sdkTransaction'
    import {isRefreshData, localSave, localRead, formatTransactions} from '@/help/help.ts'
    import dashboardBlockTime from '@/common/img/monitor/dash-board/dashboardBlockTime.png'
    import dashboardPublickey from '@/common/img/monitor/dash-board/dashboardPublickey.png'
    import dashboardBlockHeight from '@/common/img/monitor/dash-board/dashboardBlockHeight.png'
    import dashboardPointAmount from '@/common/img/monitor/dash-board/dashboardPointAmount.png'
    import dashboardTransactionAmount from '@/common/img/monitor/dash-board/dashboardTransactionAmount.png'


    @Component({
        components: {
            LineChart,
            numberGrow
        }
    })
    export default class DashBoard extends Vue {
        node = ''
        currentXem = ''
        accountAddress = ''
        updateAnimation = ''
        isShowDialog = false
        accountPublicKey = ''
        currentDataAmount = 0
        currentPrice: any = 0
        accountPrivateKey = ''
        confirmedDataAmount = 0
        unconfirmedDataAmount = 0
        currentTransactionList = []
        xemNum: number = 8999999999
        isLoadingConfirmedTx = true
        confirmedTransactionList = []
        isLoadingUnconfirmedTx = false
        unconfirmedTransactionList = []
        showConfirmedTransactions = true
        networkStatusList = [
            {
                icon: dashboardBlockHeight,
                descript: 'block_height',
                data: 1978365,
                variable: 'currentHeight'

            }, {
                icon: dashboardBlockTime,
                descript: 'average_block_time',
                data: 12,
                variable: 'currentGenerateTime'
            }, {
                icon: dashboardPointAmount,
                descript: 'point',
                data: 4,
                variable: 'nodeAmount'
            }, {
                icon: dashboardTransactionAmount,
                descript: 'number_of_transactions',
                data: 0,
                variable: 'numTransactions'
            }, {
                icon: dashboardPublickey,
                descript: 'Harvester',
                data: 0,
                variable: 'signerPublicKey'
            }
        ]
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

        get getWallet() {
            return this.$store.state.account.wallet
        }

        get ConfirmedTxList() {
            return this.$store.state.account.ConfirmedTx
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


        async getMarketOpenPrice() {
            if (!isRefreshData('openPriceOneMinute', 1000 * 60, new Date().getSeconds())) {
                const openPriceOneMinute = JSON.parse(localRead('openPriceOneMinute'))
                this.currentPrice = openPriceOneMinute.openPrice * this.xemNum
                return
            }
            const that = this
            const rstStr = await market.kline({period: "1min", symbol: "xemusdt", size: "1"});
            const rstQuery: KlineQuery = JSON.parse(rstStr.rst);
            const result = rstQuery.data[0].close
            that.currentPrice = result * that.xemNum
            const openPriceOneMinute = {
                timestamp: new Date().getTime(),
                openPrice: result
            }
            localSave('openPriceOneMinute', JSON.stringify(openPriceOneMinute))

        }

        switchTransactionPanel(flag) {
            this.showConfirmedTransactions = flag
            this.currentDataAmount = flag ? this.confirmedDataAmount : this.unconfirmedDataAmount
            this.changePage(1)
        }

        getPointInfo() {
            const that = this
            const node = this.$store.state.account.node
            const {currentBlockInfo, preBlockInfo} = this.$store.state.app.chainStatus
            blockchainInterface.getBlockchainHeight({
                node
            }).then((result) => {
                result.result.blockchainHeight.subscribe((res) => {
                    const height = Number.parseInt(res.toHex(), 16)
                    that.$store.state.app.chainStatus.currentHeight = height
                    blockchainInterface.getBlockByHeight({
                        node,
                        height: height
                    }).then((blockInfo) => {
                        blockInfo.result.Block.subscribe((block) => {
                            that.$store.state.app.chainStatus.numTransactions = block.numTransactions ? block.numTransactions : 0   //num
                            that.$store.state.app.chainStatus.signerPublicKey = block.signer.publicKey
                            that.$store.state.app.chainStatus.currentHeight = block.height.compact()    //height
                            that.$store.state.app.chainStatus.currentBlockInfo = block
                            that.$store.state.app.chainStatus.currentGenerateTime = 12
                        })
                    })
                })
            })
        }


        getConfirmedTransactions() {
            const that = this
            let {accountPrivateKey, accountPublicKey, currentXem, accountAddress, node} = this
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
                    that.changeCurrentTransactionList(transferTransaction.slice(0, 10))
                    that.confirmedDataAmount = transferTransaction.length
                    that.currentDataAmount = transferTransaction.length
                    that.confirmedTransactionList = transferTransaction
                    that.isLoadingConfirmedTx = false
                })
            })
        }

        getUnconfirmedTransactions() {
            const that = this
            let {accountPrivateKey, accountPublicKey, currentXem, accountAddress, node} = this
            const publicAccount = PublicAccount.createFromPublicKey(accountPublicKey, NetworkType.MIJIN_TEST)
            transactionInterface.unconfirmedTransactions({
                publicAccount,
                node,
                queryParams: {
                    pageSize: 100
                }
            }).then((transactionsResult) => {
                transactionsResult.result.unconfirmedTransactions.subscribe((unconfirmedtransactionsInfo) => {
                    let transferTransaction = formatTransactions(unconfirmedtransactionsInfo, accountAddress)
                    that.changeCurrentTransactionList(transferTransaction.slice(0, 10))
                    that.currentDataAmount = transferTransaction.length
                    that.unconfirmedDataAmount = transferTransaction.length
                    that.unconfirmedTransactionList = transferTransaction
                    that.isLoadingUnconfirmedTx = false
                })
            })
        }

        initData() {
            this.accountPrivateKey = this.getWallet.privateKey
            this.accountPublicKey = this.getWallet.publicKey
            this.accountAddress = this.getWallet.address
            this.node = this.$store.state.account.node
            this.currentXem = this.$store.state.account.currentXem
        }

        changeCurrentTransactionList(list: Array<any>) {
            this.currentTransactionList = list
        }

        changePage(page) {
            const pageSize = 10
            const {showConfirmedTransactions} = this
            const start = (page - 1) * pageSize
            const end = page * pageSize
            if (showConfirmedTransactions) {
                //confirmed
                this.changeCurrentTransactionList(this.confirmedTransactionList.slice(start, end))
                return
            }
            this.changeCurrentTransactionList(this.unconfirmedTransactionList.slice(start, end))
        }

        @Watch('getWallet')
        onGetWalletChange() {
            this.initData()
            this.getUnconfirmedTransactions()
            this.getConfirmedTransactions()
            this.getMarketOpenPrice()
            this.getPointInfo()
        }

        @Watch('ConfirmedTxList')
        onConfirmedTxChange() {
            this.getUnconfirmedTransactions()
            this.getConfirmedTransactions()
        }

        get currentHeight() {
            return this.$store.state.app.chainStatus.currentHeight
        }

        @Watch('currentHeight')
        onChainStatus() {
            this.updateAnimation = 'appear'
            setTimeout(() => {
                this.updateAnimation = 'appear'
            }, 500)
        }

        created() {
            this.initData()
            this.getMarketOpenPrice()
            this.getConfirmedTransactions()
            this.getUnconfirmedTransactions()
            this.getPointInfo()

        }
    }
</script>

<style scoped lang="less">
  @import "MonitorDashBoard.less";
</style>
