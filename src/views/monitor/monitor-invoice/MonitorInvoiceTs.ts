import {Message} from "@/config/index.ts"
import {QRCodeGenerator} from 'nem2-qr-library'
import {copyTxt} from '@/core/utils/utils.ts'
import {Component, Vue, Watch} from 'vue-property-decorator'
import CollectionRecord from '@/common/vue/collection-record/CollectionRecord.vue'
import {mapState} from "vuex"
import { MosaicId, NamespaceId, AliasType} from "nem2-sdk"
import {NamespaceApiRxjs} from "@/core/api/NamespaceApiRxjs"
import {TransferType} from "@/model/TransferType";
import {monitorRecaeiptTransferTypeConfig} from "@/config/view/monitor";

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
    result = ''
    activeAccount: any
    assetType = ''
    assetAmount = 0
    assetAmounts = 0
    note = ''
    notes = ''
    QRCode: string = ''
    transactionHash = ''
    TransferType = TransferType
    isShowDialog = false
    transferTypeList = monitorRecaeiptTransferTypeConfig
    app: any
    qrInfo = {
        mosaicHex: '-',
        mosaicAmount: 0,
        remarks: '',
    }
    formItem = {
        mosaicHex: '',
        mosaicAmount: 0,
        remarks: '',
    }

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
        const that = this
        const {node} = this
        let {mosaicAmount, mosaicHex} = this.formItem
        mosaicAmount = Number(mosaicAmount)
        if ((!Number(mosaicAmount) && Number(mosaicAmount) !== 0) || Number(mosaicAmount) < 0) {
            this.showErrorMessage(this.$t(Message.AMOUNT_LESS_THAN_0_ERROR))
            return false
        }
        if (mosaicHex.indexOf('@') === -1) {
            try {
                new MosaicId(mosaicHex)
            } catch (e) {
                this.showErrorMessage(this.$t(Message.MOSAIC_HEX_FORMAT_ERROR))
                return false
            }
        } else {
            const namespaceId = new NamespaceId(mosaicHex.substring(1))
            let flag = false
            try {
                const namespaceInfo: any = await new NamespaceApiRxjs().getNamespace(namespaceId, node).toPromise()
                if (namespaceInfo.alias.type === AliasType.Mosaic) {
                    //@ts-ignore
                    that.formItem.mosaicHex = new MosaicId(namespaceInfo.alias.mosaicId).toHex()
                }
            } catch (e) {
                this.showErrorMessage(this.$t(Message.MOSAIC_ALIAS_NOT_EXIST_ERROR))
                return false
            }
        }
        return true
    }

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
        let {mosaicAmount} = this.formItem
        var reg = /^(0|[1-9][0-9]*)(\.\d+)?$/
        if (!reg.test(`${mosaicAmount}`)) {
            this.showErrorMessage(this.$t(Message.PLEASE_ENTER_THE_CORRECT_NUMBER))
        }
    }

    checkLength() {
        let {remarks} = this.formItem
        if (remarks.length > 25) {
            this.showErrorMessage(this.$t(Message.NOTES_SHOULD_NOT_EXCEED_25_CHARACTER))
        }
    }

    async generateQR() {
        const flag = await this.checkForm()
        if (!flag) {
            return
        }
        this.notes = this.note
        const {generationHash, networkType} = this
        const {mosaicHex, mosaicAmount, remarks} = this.formItem
        const QRCodeData = {
            type: 1002,
            address: this.accountAddress,
            mosiacHex: mosaicHex,
            mosaicAmount: mosaicAmount,
            remarks: remarks
        }
        this.QRCode = QRCodeGenerator
            .createExportObject(QRCodeData, networkType, generationHash)
            .toBase64()

        this.qrInfo = this.formItem
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
