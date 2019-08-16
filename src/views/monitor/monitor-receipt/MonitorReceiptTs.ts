import {Message} from "@/config"
import {QRCodeGenerator} from 'nem2-qr-library'
import {copyTxt} from '@/core/utils/utils'
import {Component, Vue, Watch} from 'vue-property-decorator'
import CollectionRecord from '@/common/vue/collection-record/CollectionRecord.vue'

@Component({
    components: {
        CollectionRecord
    }
})
export class MonitorReceiptTs extends Vue {
    node = ''
    assetType = ''
    currentXem = ''
    assetAmount = 0
    accountAddress = ''
    QRCode: string = ''
    transactionHash = ''
    isShowDialog = false
    accountPublicKey = ''
    mosaicList = [
        {
            value: 'xem',
            label: 'xem'
        }
    ]


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


    get getWallet() {
        return this.$store.state.account.wallet
    }

    hideSetAmountDetail() {
        this.isShowDialog = false
    }

    checkForm() {
        let {assetAmount} = this
        assetAmount = Number(assetAmount)
        if ((!Number(assetAmount) && Number(assetAmount) !== 0) || Number(assetAmount) < 0) {
            this.showErrorMessage(this.$t(Message.AMOUNT_LESS_THAN_0_ERROR))
            return false
        }
        return true
    }

    showErrorMessage(message) {
        this.$Notice.destroy()
        this.$Notice.error({
            title: message
        })
    }

    genaerateQR() {
        if (!this.checkForm()) {
            return
        }

        this.isShowDialog = false
        const QRCodeData = {
            type: 1002,
            address: this.accountAddress,
            timestamp: new Date().getTime().toString(),
            amount: this.assetAmount,
            amountId: '321d45sa4das4d5ad',
            reason: '5454564d54as5d4a56d'
        }
        const {networkType} = this.getWallet
        const {generationHash} = this.$store.state.account
        this.QRCode = QRCodeGenerator
            .createExportObject(QRCodeData, networkType, generationHash)
            .toBase64()
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
            that.$Notice.success(
                {
                    title: this.$t(Message.COPY_SUCCESS) + ''
                }
            )
        })
    }

    initData() {
        this.accountPublicKey = this.getWallet.publicKey
        this.accountAddress = this.getWallet.address
        this.node = this.$store.state.account.node
        this.currentXem = this.$store.state.account.currentXem
    }

    createQRCode() {
        const QRCodeData = {publickKey: this.accountPublicKey}
        const {networkType} = this.getWallet
        const {generationHash} = this.$store.state.account
        this.QRCode = QRCodeGenerator
            .createExportObject(QRCodeData, networkType, generationHash)
            .toBase64()
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
