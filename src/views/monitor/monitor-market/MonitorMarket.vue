<template>
  <div class="market_board_container secondary_page_animate" @click="hideSearchDetail()">

    <div class="top_network_info">
      <div class="left_echart radius">
        <span class="trend">{{$t('XEM_market_trend_nearly_24_hours')}}</span>
        <span class="price_info right">
          <span class="price_item">
            <span>{{$t('highest_price')}}</span><span class="black">${{highestPrice}}</span>
          </span>
          <span class="price_item">
            <span>{{$t('lowest_price')}}</span><span class="black">${{lowestPrice}}</span>
          </span>
          <span class="price_item">
            <span>{{$t('average_price')}}</span><span class="black">${{averagePrice}} </span>
            <span>{{$t('pre_week')}}</span><span :class="riseRange < 0 ? 'red':'green'">{{riseRange}}%</span>
          </span>
        </span>
        <LineChart></LineChart>
      </div>
      <div class="right_net_txs radius">
        <div class="top_select_conditions">
          <span class="left">{{$t('whole_network_transaction')}}</span>
          <div class="right" v-show="!isShowSearchDetail">
            <!--            <span class="search_input" @click.stop="showSearchDetail">-->
            <!--              <img class="pointer" src="@/common/img/monitor/market/marketSearch.png" alt="">-->
            <!--            </span>-->
          </div>
          <div v-show="isShowSearchDetail" class="search_expand">
            <span class="search_container">
              <img src="@/common/img/monitor/market/marketSearch.png" alt="">
              <input @click.stop v-model="assetType" type="text" class="absolute"
                     :placeholder="$t('please_enter_the_asset_type')">
            </span>
            <span class="search_btn pointer" @click.stop="searchByAsset">{{$t('search')}}</span>
          </div>
        </div>
        <div class="bottom_new_transactions  scroll">

          <Spin size="large" class="absolute" fix
                v-if="recentTransactionList.length <= 0 && !noTransactionRecord"></Spin>

          <span v-if="noTransactionRecord"
                class="no_record absolute">{{$t('no_such_currency_transaction_record_yet')}}</span>


          <div class="transaction_item" v-for="r in recentTransactionList">
            <img v-if="r.type == 'XEM'" src="@/common/img/monitor/market/marketAssetLogo.png"
                 alt="">
            <div>
              <div class="top overflow_ellipsis ">{{r.type}}</div>
              <div class="bottom">{{r.time}}</div>
            </div>
            <div class="right">
              <div class="top coin_amount">{{r.direction === 'sell'? '+':'-'}}{{formatNumber(r.amount.toFixed(6))}}
              </div>
              <div class="bottom coin_cost">USD {{r.result}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

<!--    <div class="bottom_transactions radius">-->
<!--      <div class="left_buy radius scroll ">-->
<!--        <div class="transfer_action">-->
<!--          Buy XEM-->
<!--        </div>-->
<!--        <div class="setAmount">-->
<!--          <div class="left">-->
<!--            <span class="title">{{$t('price')}}</span>-->
<!--            <span class="value">{{currentPrice}}</span>-->
<!--            <span>USD</span>-->
<!--          </div>-->
<!--          <div class="right">-->
<!--            <span class="title">{{$t('quantity')}}</span>-->
<!--            <span class="value">-->
<!--              <input v-model.number="purchaseAmount" type="text">-->
<!--            </span>-->
<!--            <span class="update_arrow">-->
<!--              <img @click="addPurchaseAmount " class="pointer"-->
<!--                   src="@/common/img/monitor/market/marketAmountUpdateArrow.png"/>-->
<!--              <img @click="cutPurchaseAmount" class="pointer"-->
<!--                   src="@/common/img/monitor/market/marketAmountUpdateArrow.png"/>-->
<!--            </span>-->
<!--            <span>XEM</span>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div v-show="purchaseAmount > 0" class="clear conversion ">-->
<!--          <span>XEM-->
<!--            <span class="bigger">{{Number(purchaseAmount).toFixed(2)}}</span>-->
<!--            ≈ ${{(currentPrice * purchaseAmount).toFixed(4)}}</span>-->
<!--        </div>-->
<!--        <div class="purchase_XEM right un_click ">-->
<!--          <span>buy</span>-->
<!--        </div>-->
<!--      </div>-->

<!--      <div class="right_sell radius scroll">-->
<!--        <div class="transfer_action">-->
<!--          Sell XEM-->
<!--        </div>-->
<!--        <div class="setAmount">-->
<!--          <div class="left">-->
<!--            <span class="title">{{$t('price')}}</span>-->
<!--            <span class="value">{{currentPrice}}</span>-->
<!--            <span>USD</span>-->
<!--          </div>-->
<!--          <div class="right">-->
<!--            <span class="title">{{$t('quantity')}}</span>-->
<!--            <span class="value">-->
<!--              <input v-model="sellAmount">-->
<!--            </span>-->
<!--            <span class="update_arrow">-->
<!--              <img @click="addSellAmount " class="pointer"-->
<!--                   src="@/common/img/monitor/market/marketAmountUpdateArrow.png"/>-->
<!--              <img @click="cutSellAmount" class="pointer"-->
<!--                   src="@/common/img/monitor/market/marketAmountUpdateArrow.png"/>-->
<!--            </span>-->
<!--            <span>XEM</span>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div v-if="sellAmount > 0" class="clear conversion ">-->
<!--          <span>XEM <span-->
<!--                  class="bigger">{{Number(sellAmount).toFixed(2)}}</span> ≈ ${{(currentPrice * sellAmount).toFixed(4)}}</span>-->
<!--        </div>-->
<!--        <div class="purchase_XEM right un_click">-->
<!--          <span>sell</span>-->
<!--        </div>-->
<!--      </div>-->
    </div>

  </div>
</template>

<script lang="ts">
    // @ts-ignore
    import {MonitorMarketTs} from '@/views/monitor/monitor-market/MonitorMarketTs.ts'

    export default class MonitorMarket extends MonitorMarketTs {

    }
</script>
<style scoped lang="less">
  @import "MonitorMarket.less";
</style>
