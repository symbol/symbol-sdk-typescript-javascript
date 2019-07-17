<template>
  <div class="transaction_content" @click="hideSearchDetail()">
    <div class="left_container radius ">
      <div class="top_transfer_type">
        <span
                @click="swicthTransferType(index)"
                :class="['transaction_btn',t.isSelect?'selected_button':'', t.disabled?'disabled_button':'pointer']"
                v-for="(t,index) in transferTypeList">{{t.name}}
        </span>
      </div>
      <div class="bottom_transfer_info scroll ">
        <div class="transfer  " v-if="transferTypeList[0].isSelect">
          <div class="address flex_center">
            <span class="title">转账目标</span>
            <span class="value radius flex_center">
              <input type="text">
              <span class="pointer">@</span>
            </span>
          </div>
          <div class="asset flex_center">
            <span class="title">资产类型</span>
            <span class="value radius flex_center">
              <Select placeholder="XEM" v-model="assetType" class="asset_type">
              <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            </span>
          </div>
          <div class="amount flex_center">
            <span class="title">转账金额</span>
            <span class="value radius flex_center">
              <input type="text">
            </span>
          </div>
          <div class="remark flex_center">
            <span class="title">备注</span>
            <span class=" textarea_container flex_center value radius ">
              <textarea name="" id="" cols="70" rows="4"></textarea>
            </span>
          </div>
          <div class="fee right">
            <span>费用</span>
            <span>0.050000xem</span>
          </div>
          <div class="send_button pointer">
            发送
          </div>
        </div>

        <div class="multisig" v-if="transferTypeList[1].isSelect">
          MULTISIG
        </div>
      </div>

    </div>
    <div class="right_record radius">
      <div class="top_title">
        <span>转账记录</span>
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
          <span class="search_input" @click.stop="showSearchDetail">
              <img src="../../../assets/images/monitor/market/marketSearch.png" alt="">
              <span>搜索</span>
            </span>
        </div>

        <div v-show="isShowSearchDetail" class="search_expand">
            <span class="search_container">
              <img src="../../../assets/images/monitor/market/marketSearch.png" alt="">
              <input @click.stop type="text" class="absolute" placeholder="输入资产类型，别名或地址搜索">
            </span>
          <span class="search_btn" @click.stop="searchByasset">搜索</span>
        </div>


      </div>
      <div class="bottom_transfer_record_list">
        <div class="transaction_record_item" v-for="i in 5">
          <img src="../../../assets/images/monitor/transaction/transacrionAssetIcon.png" alt="">
          <div class="flex_content">
            <div class="left">
              <div class="top">Jane healy</div>
              <div class="bottom"> 2018/06/04 16:00</div>
            </div>
            <div class="right">
              <div class="top">xem 10.000</div>
              <div class="bottom">USD 69,254,125</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class Transfer extends Vue {
        currentMonth = (new Date()).getFullYear() + '-' + ((new Date()).getMonth() + 1)
        isShowSearchDetail = false
        cityList = [
            {
                value: 'xem',
                label: 'xem'
            },
            {
                value: 'etc',
                label: 'etc'
            }
        ]
        assetType = ''

        transferTypeList = [
            {
                name: '普通转账',
                isSelect: true,
                disabled: false
            }, {
                name: '多签转账',
                isSelect: false,
                disabled: false
            }, {
                name: '跨链转账',
                isSelect: false,
                disabled: true
            }, {
                name: '聚合转账',
                isSelect: false,
                disabled: true
            }
        ]

        showSearchDetail() {
            this.isShowSearchDetail = true
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
    }
</script>
<style scoped lang="less">
  @import "MonitorTransfer.less";
</style>
