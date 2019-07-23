<template>
  <div class="qr_content" @click="hideSearchDetail">
    <Modal
            :title="$t('set_amount')"
            v-model="isShowDialog"
            :transfer="false"
            class-name="dash_board_dialog">
      <div class="asset flex_center">
        <span class="title">{{$t('asset_type')}}</span>
        <span class="value radius flex_center">
              <Select placeholder="XEM" v-model="assetType" class="asset_type">
              <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            </span>
      </div>
      <div class="amount flex_center">
        <span class="title">{{$t('transfer_amount')}}</span>
        <span class="value radius flex_center">
              <input type="text" v-model="assetAmount">
                  <span class="mosaic_type">xem</span>
        </span>
      </div>
      <div class="remark flex_center">
        <span class="title">{{$t('remarks')}}</span>
        <span class=" textarea_container flex_center value radius ">
              <textarea name="" id="" cols="70" rows="4"></textarea>
            </span>
      </div>
      <div @click="genaerateQR()" class="send_button pointer">
        {{$t('generate_QR_code')}}
      </div>
    </Modal>

    <div class="left_container radius">
      <div>{{assetAmount}}XEM</div>
      <img :src="QRCode" alt="">
      <div class="address_text" id="address_text">
        {{accountAddress}}
      </div>
      <div class="qr_button ">
        <span class="radius pointer" @click="copyAddress">{{$t('copy_address')}}</span>
        <span class="radius pointer" @click="showAssetSettingDialog()">{{$t('set_amount')}}</span>
        <span class="radius pointer">{{$t('copy_QR_code')}}</span>
      </div>
    </div>


    <div class="right_record radius">
      <div class="top_title">
        <span>{{$t('collection_record')}}</span>
        <div class="right" v-show="!isShowSearchDetail">
            <span class="select_date pointer">
              <div class="month_value">
                <img src="../../../assets/images/monitor/market/marketCalendar.png" alt="">
              <span>{{currentMonth}}</span>
              </div>
              <div class="date_selector">
                <DatePicker @on-change="changeCurrentMonth" type="month" placeholder="" :value="currentMonth"
                            style="width: 70px"></DatePicker>
              </div>
            </span>
          <span class="search_input pointer" @click.stop="showSearchDetail">
              <img src="../../../assets/images/monitor/market/marketSearch.png" alt="">
              <span>{{$t('search')}}</span>
            </span>
        </div>

        <div v-show="isShowSearchDetail" class="search_expand">
            <span class="search_container">
              <img src="../../../assets/images/monitor/market/marketSearch.png" alt="">
              <input @click.stop type="text" class="absolute"
                     :placeholder="$t('enter_asset_type_alias_or_address_search')">
            </span>
          <span class="search_btn pointer" @click.stop="searchByasset">{{$t('search')}}</span>
        </div>


      </div>
      <div class="bottom_transfer_record_list scroll">
        <div v-show="c.date  " class="transaction_record_item" v-for="c in confirmedTransactionList">
          <img src="../../../assets/images/monitor/transaction/transacrionAssetIcon.png" alt="">
          <div class="flex_content">
            <div class="left left_components">
              <div class="top">{{c.oppositeAddress}}</div>
              <div class="bottom"> {{c.time}}</div>
            </div>
            <div class="right right_components">
              <div class="top">{{c.mosaic?c.mosaic.amount.compact():0}}</div>
              <div class="bottom">CNY
                {{c.mosaic && c.mosaic.id.toHex() == $store.state.account.currentXEM1 || c.mosaic.id.toHex() ==
                $store.state.account.currentXEM2?c.mosaic.amount.compact() * currentPrice:0}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
    import {PublicAccount, NetworkType, TransactionType} from 'nem2-sdk';
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {createQRCode, copyTxt} from '@/utils/tools'
    import {transactionInterface} from '@/interface/sdkTransaction';
    import {
        formatNemDeadline,
        addZero,
        formatTransactions,
        getCurrentMonthFirst,
        getCurrentMonthLast
    } from '@/utils/util.js'
    import axios from 'axios'

    @Component
    export default class MonitorReceipt extends Vue {
        currentMonth = ''
        isShowSearchDetail = false
        QRCode: string = ''
        isShowDialog = false
        copyBtn: any = false
        assetAmount = 0
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
        monthFlag = new Date()
        transferTypeList = [
            {
                name: 'ordinary_transfer',
                isSelect: true,
                disabled: false
            }, {
                name: 'Multisign_transfer',
                isSelect: false,
                disabled: false
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

        accountPrivateKey = ''
        accountPublicKey = ''
        accountAddress = ''
        node = ''
        currentXem = ''
        confirmedTransactionList = []
        unconfirmedTransactionList = []
        confirmedDataAmount = 0
        currentPrice = 0
        currentMonthFirst = ''
        currentMonthLast = ''

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
            const QRCodeData = {
                type: 1002,
                address: this.accountAddress,
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
                    that.$Message.error(that['$t']('QR_code_generation_failed'))
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
            copyTxt(this.accountAddress).then(() => {
                that.$Message.success(that['$t']('successful_copy'))
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

                    let transferTransaction = formatTransactions(transactionsInfo, accountPublicKey)
                    that.confirmedDataAmount = transferTransaction.length
                    that.confirmedTransactionList = transferTransaction
                    console.log(transferTransaction)
                })
            })
        }

        initData() {
            this.accountPrivateKey = this.$store.state.account.accountPrivateKey
            this.accountPublicKey = this.$store.state.account.accountPublicKey
            this.accountAddress = this.$store.state.account.accountAddress
            this.node = this.$store.state.account.node
            this.currentXem = this.$store.state.account.currentXem
            this.currentMonth = (new Date()).getFullYear() + '-' + ((new Date()).getMonth() + 1)
        }

        createQRCode() {
            createQRCode(this.accountPublicKey).then((data) => {
                this.QRCode = data.url
            })
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

        @Watch('currentMonth')
        onCurrentMonthChange() {
            const currentMonth = new Date(this.currentMonth)
            this.currentMonthFirst = getCurrentMonthFirst(currentMonth);
            this.currentMonthLast = getCurrentMonthLast(currentMonth)
        }

        created() {
            this.initData()
            this.createQRCode()
            this.getConfirmedTransactions()
            this.getMarketOpenPrice()


        }


    }
</script>
<style scoped lang="less">
  @import "MonitorReceipt.less";
</style>
