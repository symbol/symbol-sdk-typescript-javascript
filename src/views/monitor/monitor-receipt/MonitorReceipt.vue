<template>
  <div class="qr_content">
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
      <div class="amount">{{assetAmount}}XEM</div>
      <img id="qrImg" :src="QRCode" alt="">
      <div class="address_text" id="address_text">
        {{accountAddress}}
      </div>
      <div class="qr_button ">
        <span class="radius pointer" @click="copyAddress">{{$t('copy_address')}}</span>
        <span class="radius pointer" @click="showAssetSettingDialog()">{{$t('set_amount')}}</span>
        <span class="radius pointer" @click="downloadQR">{{$t('copy_QR_code')}}</span>
      </div>
    </div>

    <CollectionRecord></CollectionRecord>
  </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {createQRCode, copyTxt} from '@/utils/tools'
    import CollectionRecord from '@/components/CollectionRecord.vue'
    import Message from "@/message/Message";

    @Component({
        components: {
            CollectionRecord
        }
    })
    export default class MonitorReceipt extends Vue {
        QRCode: string = ''
        isShowDialog = false
        assetAmount = 0
        transactionHash = ''
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

        accountPublicKey = ''
        accountAddress = ''
        node = ''
        currentXem = ''

        get getWallet() {
            return this.$store.state.account.wallet
        }

        hideSetAmountDetail() {
            this.isShowDialog = false
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
                    that.$Message.error(Message.QR_GENERATION_ERROR)
                }
            })
        }

        downloadQR() {
            const accountAddress = this.$store.state.account.accountAddress
            var oQrcode: any = document.querySelector('#qrImg')
            var url = oQrcode.src
            var a = document.createElement('a')
            var event = new MouseEvent('click')
            a.download = 'qr_receive_' + accountAddress
            a.href = url
            a.dispatchEvent(event)
        }

        showAssetSettingDialog() {
            this.isShowDialog = true
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
                that.$Message.success(Message.COPY_SUCCESS)
            })
        }


        initData() {
            this.accountPublicKey = this.getWallet.publicKey
            this.accountAddress = this.getWallet.address
            this.node = this.$store.state.account.node
            this.currentXem = this.$store.state.account.currentXem
        }

        createQRCode() {
            createQRCode(this.accountPublicKey).then((data) => {
                this.QRCode = data.url
            })
        }

        @Watch('getWallet')
        onGetWalletChange() {
            this.initData()
            this.createQRCode()
        }

        created() {
            this.initData()
            this.createQRCode()

        }
    }
</script>
<style scoped lang="less">
  @import "MonitorReceipt.less";
</style>
