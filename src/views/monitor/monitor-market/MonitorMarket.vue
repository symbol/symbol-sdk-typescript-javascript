<template>
  <div class="market_board_container" @click="hideSearchDetail()">

    <div class="top_network_info">
      <div class="left_echart radius">
        <span class="trend">XEM行情走势（近7天）</span>
        <span class="price_info right">
          <span class="price_item">
            <span>最高价格</span><span class="black">￥0.7540</span>
          </span>
          <span class="price_item">
            <span>最低价格</span><span class="black">￥0.5945</span>
          </span>
          <span class="price_item">
            <span>平均价格</span><span class="black">￥0.5945</span><span class="red">-4.903%</span>
          </span>
        </span>
        <LineChart></LineChart>
      </div>
      <div class="right_net_txs radius">
        <div class="top_select_conditions">
          <span class="left">全网交易</span>
          <div class="right" v-show="!isShowSearchDetail">
            <span class="select_date">
              <div class="month_value">
                <img src="../../../assets/images/monitor/market/marketCalendar.png" alt="">
              <span>{{currentMonth}}</span>
              </div>

              <DatePicker @on-change="changeCurrentMonth" type="month" placeholder="" :value="currentMonth"
                          style="width: 70px"></DatePicker>
            </span>
            <span class="search_input" @click.stop="showSearchDetail">
              <img src="../../../assets/images/monitor/market/marketSearch.png" alt="">
            </span>
          </div>
          <div v-show="isShowSearchDetail" class="search_expand">
            <span class="search_container">
              <img src="../../../assets/images/monitor/market/marketSearch.png" alt="">
              <input @click.stop type="text" class="absolute" placeholder="请输入资产类型">
            </span>
            <span class="search_btn" @click.stop="searchByasset">搜索</span>
          </div>
        </div>
        <div class="bottom_new_transactions  hide_scroll">
          <div class="transaction_item" v-for="i in 7">
            <img src="../../../assets/images/monitor/market/marketAssetLogo.png" alt="">
            <div>
              <div class="top">XEM</div>
              <div class="bottom">2019/06/04 16:00</div>
            </div>
            <div class="right">
              <div class="top">-1000.000</div>
              <div class="bottom">CNY 69,15874.12</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bottom_transactions radius">
      <div class="left_buy radius">
        <div class="transfer_action">
          buy xem
        </div>
        <div class="setAmount">
          <div class="left">
            <span class="title">价格</span>
            <span class="value">0.654</span>
            <span>CNY</span>
          </div>
          <div class="right">
            <span class="title">数量</span>
            <span class="value">
              <input :value="purchaseAmount" type="text">
            </span>
            <span class="update_arrow">
              <img @click="cutPurchaseAmount" src="../../../assets/images/monitor/market/marketAmountUpdateArrow.png"/>
              <img @click="addPurchaseAmount" src="../../../assets/images/monitor/market/marketAmountUpdateArrow.png"/>
            </span>
            <span>XEM</span>
          </div>
        </div>
        <div class="clear conversion ">
          <span>xem <span class="bigger">10.000</span> ≈ ￥68.3500</span>
        </div>
        <div class="purchase_XEM right">
          <span>buy</span>
        </div>
      </div>
      <div class="right_sell radius">
        <div class="transfer_action">
          sell xem
        </div>
        <div class="setAmount">
          <div class="left">
            <span class="title">价格</span>
            <span class="value">0.654</span>
            <span>CNY</span>
          </div>
          <div class="right">
            <span class="title">数量</span>
            <span class="value">
              <input :value="sellAmount" type="text">
            </span>
            <span class="update_arrow">
              <img @click="cutSellAmount" src="../../../assets/images/monitor/market/marketAmountUpdateArrow.png"/>
              <img @click="addSellAmount" src="../../../assets/images/monitor/market/marketAmountUpdateArrow.png"/>
            </span>
            <span>XEM</span>
          </div>
        </div>
        <div class="clear conversion ">
          <span>xem <span class="bigger">10.000</span> ≈ ￥68.3500</span>
        </div>
        <div class="purchase_XEM right">
          <span>sell</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import LineChart from '../../../components/LineChart.vue'

    @Component({
        components: {
            LineChart
        }
    })
    export default class Market extends Vue {
        purchaseAmount = 10
        sellAmount = 10
        isShowSearchDetail = false
        currentMonth = (new Date()).getFullYear() + '-' + ((new Date()).getMonth() + 1)

        showSearchDetail() {
            this.isShowSearchDetail = true
        }

        hideSearchDetail() {
            this.isShowSearchDetail = false
        }

        searchByasset() {

        }

        addPurchaseAmount() {
            if (this.purchaseAmount >= 1) {
                this.purchaseAmount--
            }
        }

        cutPurchaseAmount() {
            this.purchaseAmount++
        }

        changeCurrentMonth(e) {
            this.currentMonth = e
        }

        cutSellAmount() {
            this.sellAmount--
        }

        addSellAmount() {
            this.sellAmount++
        }

    }
</script>
<style scoped lang="less">
  @import "MonitorMarket.less";
</style>
