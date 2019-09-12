import {Message} from "@/config/index.ts"
import {QRCodeGenerator} from 'nem2-qr-library'
import {copyTxt} from '@/core/utils/utils.ts'
import {Component, Vue, Watch} from 'vue-property-decorator'
import CollectionRecord from '@/common/vue/collection-record/CollectionRecord.vue'
import {TransferType} from '@/config/index.ts'
import {mapState} from "vuex"
import {monitorRecaeiptMosaicList,monitorRecaeiptTransferTypeList} from '@/config/index.ts'
@Component({
    components: {
        CollectionRecord
    },
    computed: {
        ...mapState({
            activeAccount: 'account',
        })
    }
})
export class MonitorReceiptTs extends Vue {
    activeAccount: any
    assetType = ''
    assetAmount = 0
    QRCode: string = ''
    transactionHash = ''
    TransferType = TransferType
    isShowDialog = false
    mosaicList = monitorRecaeiptMosaicList
    transferTypeList = monitorRecaeiptTransferTypeList

    get accountPublicKey() {
        return this.activeAccount.wallet.publicKey
    }

    get accountAddress() {
        return this.activeAccount.wallet.address
    }

    get node() {
        return this.activeAccount.node
    }

    get currentXem() {
        return this.activeAccount.currentXem
    }


    get getWallet() {
        return this.activeAccount.wallet
    }

    get generationHash() {
        return this.activeAccount.generationHash
    }

    get networkType() {
        return this.activeAccount.wallet.networkType
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

    generateQR() {
        if (!this.checkForm()) {
            return
        }
        const {generationHash, networkType} = this
        this.isShowDialog = false
        const QRCodeData = {
            type: 1002,
            address: this.accountAddress,
            timestamp: new Date().getTime().toString(),
            amount: this.assetAmount,
            amountId: '',
            reason: ''
        }
        this.QRCode = QRCodeGenerator
            .createExportObject(QRCodeData, networkType, generationHash)
            .toBase64()
    }

    downloadQR() {
        const {address} = this.getWallet
        var oQrcode: any = document.querySelector('#qrImg')
        var url = oQrcode.src
        var a = document.createElement('a')
        var event = new MouseEvent('click')
        a.download = 'qr_receive_' + address
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

    createQRCode() {
        if (!this.getWallet.address) return
        const {generationHash, networkType} = this
        const QRCodeData = {publickKey: this.accountPublicKey}
        this.QRCode = QRCodeGenerator
            .createExportObject(QRCodeData, networkType, generationHash)
            .toBase64()
    }

    @Watch('getWallet.address')
    onGetWalletChange() {
        this.createQRCode()
    }

    mounted() {
        this.createQRCode()
    }
}
