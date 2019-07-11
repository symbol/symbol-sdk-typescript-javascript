<template>
  <div class="qr_content">
    <Modal
            title="设置金额"
            v-model="isShowDialog"
            class-name="dash_board_dialog">
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
              <input type="text" v-model="assetAmount">
                  <span class="mosaic_type">xem</span>
        </span>
      </div>
      <div class="remark flex_center">
        <span class="title">备注</span>
        <span class=" textarea_container flex_center value radius ">
              <textarea name="" id="" cols="70" rows="4"></textarea>
            </span>
      </div>
      <div @click="genaerateQR()" class="send_button">
        生成二维码
      </div>
    </Modal>

    <div class="left_container radius">
      <div>{{assetAmount}}XEM</div>
      <img :src="QRCode" alt="">
      <div class="address_text" id="address_text">
        {{address}}
      </div>
      <div class="qr_button ">
        <span class="radius" @click="copyAddress">复制地址</span>
        <span class="radius" @click="showAssetSettingDialog()">设置金额</span>
        <span class="radius">复制二维码</span>
      </div>
    </div>


    <div class="right_record radius">
      <div class="top_title">
        <span>收款记录</span>
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
    import {createQRCode, copyTxt} from '@/utils/tools'

    @Component
    export default class MonitorReceipt extends Vue {
        currentMonth = (new Date()).getFullYear() + '-' + ((new Date()).getMonth() + 1)
        isShowSearchDetail = false
        QRCode: string = ''
        isShowDialog = true
        copyBtn: any = false
        assetAmount = 0
        address = 'TCTEXC-5TGXD7-OQCHBB-MNU3LS-2GFCB4-2KD75D-5VCN'
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

        hideSetAmountDetail() {
            this.isShowDialog = false
        }

        showSearchDetail() {
            this.isShowSearchDetail = true
        }

        hideSearchDetail() {
            this.isShowSearchDetail = false
        }
        genaerateQR() {
            const that = this
            this.isShowDialog = false
            const  QRCodeData = {
                type: 1002,
                address: this.address,
                timestamp: new Date().getTime().toString(),
                amount: this.assetAmount,
                amountId: '321d45sa4das4d5ad',
                reason: '5454564d54as5d4a56d'
            }
            const codeObj = createQRCode(JSON.stringify(QRCodeData))
            codeObj.then((codeObj) => {
                if (codeObj.created) {
                    this.QRCode = codeObj.url
                } else {
                    that.$Message.error('二维码生成失败')
                }
            })
        }
        showAssetSettingDialog() {
            this.isShowDialog = true
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


        copyAddress() {
            const that = this
            copyTxt(this.address).then(()=>{
                that.$Message.success('复制成功')
            })
        }

        created() {
            createQRCode('TCTEXC-5TGXD7-OQCHBB-MNU3LS-2GFCB4-2KD75D-5VCN').then((data) => {
                this.QRCode = data.url
            })
        }
    }
</script>
<style scoped lang="less">
  @import "MonitorReceipt.less";
</style>
