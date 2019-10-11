import {Message} from "@/config/index.ts"
import {QRCodeGenerator} from 'nem2-qr-library'
import {copyTxt} from '@/core/utils/utils.ts'
import {Component, Vue} from 'vue-property-decorator'
import CollectionRecord from '@/common/vue/collection-record/CollectionRecord.vue'
import {mapState} from "vuex"
import {MosaicId, TransferTransaction, Deadline, Address, Mosaic, UInt64, PlainMessage, Transaction} from "nem2-sdk"
import {TransferType} from "@/core/model/TransferType"
import {monitorReceiptTransferTypeConfig} from "@/config/view/monitor"
import {AppInfo, StoreAccount} from "@/core/model"

@Component({
    components: {
        CollectionRecord
    },
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app'
        })
    }
})

export class MonitorInvoiceTs extends Vue {
    activeAccount: StoreAccount
    app: AppInfo
    transactionHash = ''
    TransferType = TransferType
    isShowDialog = false
    transferTypeList = monitorReceiptTransferTypeConfig
    formItems = {
        mosaicHex: '',
        mosaicAmount: 0,
        remarks: '',
    }

    get networkCurrency() {
        return this.activeAccount.networkCurrency
    }
    get transferTransaction(): any { // @QR
        const {networkType, address} = this.wallet
        const walletAddress = Address.createFromRawAddress(address)
        const {mosaicHex, mosaicAmount, remarks} = this.formItems
        const mosaic = mosaicHex !== ''
            ? new MosaicId(mosaicHex) : new MosaicId(this.networkCurrency.hex)

        return TransferTransaction.create(
            Deadline.create(),
            walletAddress,
            [new Mosaic(mosaic, UInt64.fromUint(mosaicAmount))],
            PlainMessage.create(remarks),
            networkType
        );
    }

    get QRCode(): string {
        return QRCodeGenerator
            .createTransactionRequest(this.transferTransaction)
            .toBase64()
    }

    get accountAddress() {
        return this.activeAccount.wallet.address
    }

    get node() {
        return this.activeAccount.node
    }

    get wallet() {
        return this.activeAccount.wallet
    }

    get mosaics() {
        return this.activeAccount.mosaics
    }

    get currentHeight() {
        return this.app.chainStatus.currentHeight
    }

    get mosaicsLoading() {
        return this.app.mosaicsLoading
    }

    get mosaicList() {
        // @TODO: would be better to return a loading indicator
        // instead of an empty array ([] = "no matching data" in the select dropdown)
        const {mosaics, currentHeight} = this
        if (this.mosaicsLoading || !mosaics) return []

        const mosaicList: any = Object.values(this.mosaics)
        return [...mosaicList]
            .filter(({expirationHeight}) => expirationHeight === 'Forever' || currentHeight < expirationHeight)
            .map(({name, balance, hex}) => ({
                label: `${name || hex} (${balance ? balance.toLocaleString() : 0})`,
                value: hex,
            }))
    }

    async checkForm() {
        let {mosaicAmount, mosaicHex} = this.formItems
        mosaicAmount = Number(mosaicAmount)
        if ((!Number(mosaicAmount) && Number(mosaicAmount) !== 0) || Number(mosaicAmount) < 0) {
            this.showErrorMessage(this.$t(Message.AMOUNT_LESS_THAN_0_ERROR))
            return false
        }
        if (mosaicHex === '') {
            this.showErrorMessage(this.$t(Message.MOSAIC_LIST_NULL_ERROR))
            return false
        }
        return true
    }

    // @TODO: does not work
    filterMethod(value, option) {
        return 1
    }

    showErrorMessage(message) {
        this.$Notice.destroy()
        this.$Notice.error({
            title: message
        })
    }

    onChange() {
        let {mosaicAmount} = this.formItems
        var reg = /^(0|[1-9][0-9]*)(\.\d+)?$/
        if (!reg.test(`${mosaicAmount}`)) {
            this.showErrorMessage(this.$t(Message.PLEASE_ENTER_A_CORRECT_NUMBER))
        }
    }

    checkLength() {
        let {remarks} = this.formItems
        if (remarks.length > 25) {
            this.showErrorMessage(this.$t(Message.NOTES_SHOULD_NOT_EXCEED_25_CHARACTER))
        }
    }

    downloadQR() {
        const {address} = this.wallet
        var QRCode: any = document.querySelector('#qrImg')
        var url = QRCode.src
        var a = document.createElement('a')
        var event = new MouseEvent('click')
        a.download = 'qr_receive_' + address
        a.href = url
        a.dispatchEvent(event)
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
}
