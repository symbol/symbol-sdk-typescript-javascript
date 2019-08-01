<template>
  <div class="market_board_container" @click="hideSearchDetail()">

    <div class="top_network_info">
      <div class="left_echart radius">
        <span class="trend">{{$t('XEM_market_trend_nearly_7_days')}}</span>
        <span class="price_info right">
          <span class="price_item">
            <span>{{$t('highest_price')}}</span><span class="black">${{highestPrice}}</span>
          </span>
          <span class="price_item">
            <span>{{$t('lowest_price')}}</span><span class="black">${{lowestPrice}}</span>
          </span>
          <span class="price_item">
            <span>{{$t('average_price')}}</span><span class="black">${{averagePrice}}</span><span
                  :class="riseRange < 0 ? 'red':'green'">{{riseRange}}%</span>
          </span>
        </span>
        <LineChart></LineChart>
      </div>
      <div class="right_net_txs radius">
        <div class="top_select_conditions">
          <span class="left">{{$t('whole_network_transaction')}}</span>
          <div class="right" v-show="!isShowSearchDetail">
            <!--            <span class="search_input" @click.stop="showSearchDetail">-->
            <!--              <img class="pointer" src="../../../assets/images/monitor/market/marketSearch.png" alt="">-->
            <!--            </span>-->
          </div>
          <div v-show="isShowSearchDetail" class="search_expand">
            <span class="search_container">
              <img src="../../../assets/images/monitor/market/marketSearch.png" alt="">
              <input @click.stop v-model="assetType" type="text" class="absolute"
                     :placeholder="$t('please_enter_the_asset_type')">
            </span>
            <span class="search_btn pointer" @click.stop="searchByasset">{{$t('search')}}</span>
          </div>
        </div>
        <div class="bottom_new_transactions  scroll">

          <Spin size="large" class="absolute" fix
                v-if="recentTransactionList.length <= 0 && !noTransactionRecord"></Spin>

          <span v-if="noTransactionRecord"
                class="no_record absolute">{{$t('no_such_currency_transaction_record_yet')}}</span>


          <div class="transaction_item" v-for="r in recentTransactionList">
            <img v-if="r.type == 'XEM'" src="../../../assets/images/monitor/market/marketAssetLogo.png" alt="">
            <img v-if="r.type == 'BTC'" src="../../../assets/images/monitor/market/marketCoinBTC.png" alt="">
            <img v-if="r.type == 'ETH'" src="../../../assets/images/monitor/market/marketCoinETH.png" alt="">
            <div>
              <div class="top overflow_ellipsis ">{{r.type}}</div>
              <div class="bottom">{{r.time}}</div>
            </div>
            <div class="right">
              <div class="top coin_amount">{{r.direction === 'sell'? '+':'-'}}{{r.amount.toFixed(6)}}</div>
              <div class="bottom coin_cost">USD {{r.result}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bottom_transactions radius">
      <div class="left_buy radius scroll ">
        <div class="transfer_action">
          Buy XEM
        </div>
        <div class="setAmount">
          <div class="left">
            <span class="title">{{$t('price')}}</span>
            <span class="value">{{currentPrice}}</span>
            <span>USD</span>
          </div>
          <div class="right">
            <span class="title">{{$t('quantity')}}</span>
            <span class="value">
              <input v-model.number="purchaseAmount" type="number">
            </span>
            <span class="update_arrow">
              <img @click="addPurchaseAmount " class="pointer"
                   src="../../../assets/images/monitor/market/marketAmountUpdateArrow.png"/>
              <img @click="cutPurchaseAmount" class="pointer"
                   src="../../../assets/images/monitor/market/marketAmountUpdateArrow.png"/>
            </span>
            <span>XEM</span>
          </div>
        </div>
        <div v-show="purchaseAmount > 0" class="clear conversion ">
          <span>XEM
            <span class="bigger">{{Number(purchaseAmount).toFixed(2)}}</span>
            ≈ ${{currentPrice * purchaseAmount}}</span>
        </div>
        <div class="purchase_XEM right un_click ">
          <span>buy</span>
        </div>
      </div>

      <div class="right_sell radius scroll">
        <div class="transfer_action">
          Sell XEM
        </div>
        <div class="setAmount">
          <div class="left">
            <span class="title">{{$t('price')}}</span>
            <span class="value">{{currentPrice}}</span>
            <span>USD</span>
          </div>
          <div class="right">
            <span class="title">{{$t('quantity')}}</span>
            <span class="value">
              <input v-model="sellAmount">
            </span>
            <span class="update_arrow">
              <img @click="addSellAmount " class="pointer"
                   src="../../../assets/images/monitor/market/marketAmountUpdateArrow.png"/>
              <img @click="cutSellAmount" class="pointer"
                   src="../../../assets/images/monitor/market/marketAmountUpdateArrow.png"/>
            </span>
            <span>XEM</span>
          </div>
        </div>
        <div v-if="sellAmount > 0" class="clear conversion ">
          <span>XEM <span
                  class="bigger">{{Number(sellAmount).toFixed(2)}}</span> ≈ ${{currentPrice * sellAmount}}</span>
        </div>
        <div class="purchase_XEM right un_click">
          <span>sell</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import axios from 'axios'
    import LineChart from '../../../components/LineChartByDay.vue'
    import {
        isRefreshData,
        localSave,
        localRead,
        formatDate
    } from '@/utils/util.js'
    import {formatNumber} from '../../../utils/tools.js'

    @Component({
        components: {
            LineChart
        }
    })
    export default class Market extends Vue {
        purchaseAmount = 10
        sellAmount = 10
        isShowSearchDetail = false
        highestPrice = 0
        lowestPrice = 0
        averagePrice: any = 0
        currentMonth = (new Date()).getFullYear() + '-' + ((new Date()).getMonth() + 1)
        riseRange: any = 0
        currentPrice: any = 0
        recentTransactionList = []
        assetType = ''
        noTransactionRecord = false

        showSearchDetail() {
            this.isShowSearchDetail = true
        }

        hideSearchDetail() {
            this.isShowSearchDetail = false
        }

        resetTransactionList() {
            this.recentTransactionList = []

        }

        async searchByasset() {
            this.resetTransactionList()
            const upperCase = this.assetType.toLocaleUpperCase()
            let lowerCase = upperCase.toLowerCase() + 'usdt'
            const that = this
            let recentTransactionList = []
            const url = `${this.$store.state.app.marketUrl}/trade/${lowerCase}/50`
            await axios.get(url).then(function (response) {
                let result = response.data.data
                result.map((item) => {
                    item.data.map((i) => {
                        i.type = upperCase
                        i.time = that.formatDate(i.ts)
                        recentTransactionList.push(i)
                    })
                    return item
                })
            }).catch(function (error) {
                console.log(error);
            });
            if (recentTransactionList.length == 0) {
                this.noTransactionRecord = true
            } else {
                this.noTransactionRecord = false
                that.recentTransactionList = recentTransactionList
            }
        }

        formatDate(timestamp) {
            return formatDate(timestamp).replace(/-/g, '/')
        }

        addPurchaseAmount() {
            this.purchaseAmount += 1
        }

        cutPurchaseAmount() {
            this.purchaseAmount = this.purchaseAmount >= 1 ? this.purchaseAmount - 1 : this.purchaseAmount
        }

        addSellAmount() {
            this.sellAmount += 1
        }


        cutSellAmount() {
            this.sellAmount = this.sellAmount >= 1 ? this.sellAmount - 1 : this.sellAmount
        }

        changeCurrentMonth(e) {
            this.currentMonth = e
        }

        async getMarketPrice() {
            if (!isRefreshData('oneWeekPrice', 1000 * 60 * 60 * 24, new Date().getHours())) {
                const oneWeekPrice = JSON.parse(localRead('oneWeekPrice'))
                this.highestPrice = oneWeekPrice.highestPrice
                this.lowestPrice = oneWeekPrice.lowestPrice
                this.averagePrice = oneWeekPrice.averagePrice
                this.riseRange = oneWeekPrice.riseRange
                return
            }

            const that = this
            const url = this.$store.state.app.marketUrl + '/kline/xemusdt/1day/14'
            await axios.get(url).then(function (response) {
                const result = response.data.data
                const currentWeek = result.slice(0, 7)
                const preWeek = result.slice(7, 14)

                currentWeek.sort((a, b) => {
                    return a.high < b.high ? 1 : -1;
                })
                that.highestPrice = currentWeek[0].high

                currentWeek.sort((a, b) => {
                    return a.low < b.low ? -1 : 1;
                })
                that.lowestPrice = currentWeek[0].low

                let average = 0
                currentWeek.forEach((item) => {
                    average += item.high + item.low
                })
                that.averagePrice = (average / 14).toFixed(4)

                let preAverage: any = 0
                preWeek.forEach((item) => {
                    preAverage += item.high + item.low
                })
                preAverage = (preAverage / 14).toFixed(4)
                that.riseRange = (((that.averagePrice - preAverage) / preAverage) * 100).toFixed(2)
                const oneWeekPrice = {
                    averagePrice: that.averagePrice,
                    lowestPrice: that.lowestPrice,
                    highestPrice: that.highestPrice,
                    riseRange: that.riseRange,
                    timestamp: new Date().getTime()
                }
                localSave('oneWeekPrice', JSON.stringify(oneWeekPrice))
            }).catch(function (error) {
                that.getMarketPrice()
                console.log(error);
            });
        }

        async getMarketOpenPrice() {
            if (!isRefreshData('openPriceOneMinute', 1000 * 60, new Date().getSeconds())) {
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
                console.log(error);
                that.getMarketOpenPrice()
            });
        }

        async getRecentTransactionList() {

            if (!isRefreshData('transactionsOverNetwork', 1000 * 60 * 3, 1)) {
                const transactionsOverNetwork = JSON.parse(localRead('transactionsOverNetwork'))
                this.recentTransactionList = transactionsOverNetwork.recentTransactionList
                return
            }
            const that = this
            const xemUrl = this.$store.state.app.marketUrl + '/trade/xemusdt/50'
            let recentTransactionList = []
            await axios.get(xemUrl).then(function (response) {
                let result = response.data.data
                result.map((item) => {
                    item.data.map((i) => {
                        i.type = 'XEM'
                        i.time = that.formatDate(i.ts)
                        i.result = (i.amount * i.price).toFixed(2)
                        recentTransactionList.push(i)
                    })
                    return item
                })
            }).catch(function (error) {
                console.log(error);
            });

            recentTransactionList.sort((a, b) => {
                return a.ts > b.ts ? -1 : 1
            })
            if (recentTransactionList.length == 0) {
                this.noTransactionRecord = true
            } else {
                this.noTransactionRecord = false
                that.recentTransactionList = recentTransactionList
                const transactionsOverNetwork = {
                    timestamp: new Date().getTime(),
                    recentTransactionList: recentTransactionList
                }
                localSave('transactionsOverNetwork', JSON.stringify(transactionsOverNetwork))
            }
        }

        async created() {
            this.getMarketPrice()
            this.getMarketOpenPrice()
            this.getRecentTransactionList()

        }

    }
</script>
<style scoped lang="less">
  @import "MonitorMarket.less";
</style>
