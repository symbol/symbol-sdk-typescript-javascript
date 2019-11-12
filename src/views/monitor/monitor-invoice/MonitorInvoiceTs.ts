import { Message } from "@/config/index.ts"
import { QRCodeGenerator, TransactionQR } from 'nem2-qr-library'
import { copyTxt } from '@/core/utils'
import { Component, Vue, Provide } from 'vue-property-decorator'
import CollectionRecord from '@/components/collection-record/CollectionRecord.vue'
import { mapState } from "vuex"
import { MosaicId, TransferTransaction, Deadline, Address, Mosaic, UInt64, PlainMessage, Transaction, NamespaceId, NamespaceMosaicIdGenerator } from "nem2-sdk"
import { TransferType } from "@/core/model/TransferType"
import { monitorReceiptTransferTypeConfig } from "@/config/view/monitor"
import { AppInfo, MosaicNamespaceStatusType, StoreAccount } from "@/core/model"
import failureIcon from '@/common/img/monitor/failure.png'
import { pluck, concatMap } from 'rxjs/operators'
import { of } from 'rxjs'
import { validateMosaicId, validateAlias, standardFields } from '@/core/validation'
import ErrorTooltip from '@/components/other/forms/errorTooltip/ErrorTooltip.vue'

@Component({
    components: { CollectionRecord, ErrorTooltip },
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app'
        })
    },
    subscriptions() {
        const qrCode$ = this
            .$watchAsObservable('qrCodeArgs', { immediate: true })
            .pipe(pluck('newValue'),
                concatMap((args) => {
                    if (args instanceof TransactionQR) return args.toBase64()
                    return of(failureIcon)
                }))
        return { qrCode$ }
    }
})

export class MonitorInvoiceTs extends Vue {
    @Provide() validator: any = this.$validator
    activeAccount: StoreAccount
    app: AppInfo
    TransferType = TransferType
    transferTypeList = monitorReceiptTransferTypeConfig
    selectedMosaicHex: string = ""
    formItems = {
        mosaicAmount: 0,
        remarks: '',
    }

    QRCode: string = failureIcon
    standardFields = standardFields

    get networkCurrency() {
        return this.activeAccount.networkCurrency
    }

    get activeMosaic(): {
        name: string,
        hex: string,
        id: MosaicId | NamespaceId
    } {
        const { selectedMosaicHex } = this

        if (!selectedMosaicHex) return {
            name: null, hex: selectedMosaicHex, id: null
        }

        try {
            const selectedFromList = Object.values(this.mosaics)
                .find(({ name, hex }) => name === selectedMosaicHex || hex === selectedMosaicHex)

            if (selectedFromList !== undefined) {
                const { name, hex } = selectedFromList
                const id = name ? new NamespaceId(name) : new MosaicId(hex)
                return { name, hex, id }
            }

            const name = null
            const hex = selectedMosaicHex
            const id = validateMosaicId(hex).valid
                ? new MosaicId(hex) : new NamespaceId(hex.toLowerCase())

            return { name, hex, id }
        } catch (error) {
            console.error("MonitorInvoiceTs -> error", error)
            return {
                name: null, hex: selectedMosaicHex, id: null
            }
        }
    }

    get transferTransaction(): TransferTransaction {
        try {
            const { activeMosaic } = this
            const { networkType, address } = this.wallet

            if (!activeMosaic.id) return null
            const walletAddress = Address.createFromRawAddress(address)
            const { mosaicAmount, remarks } = this.formItems

            return TransferTransaction.create(
                Deadline.create(),
                walletAddress,
                [new Mosaic(activeMosaic.id, UInt64.fromUint(mosaicAmount))],
                PlainMessage.create(remarks),
                networkType
            )
        } catch (error) {
            console.error("MonitorInvoiceTs -> error", error)
            return null
        }
    }

    get qrCodeArgs(): TransactionQR {
        const { transferTransaction } = this
        if (!transferTransaction) return null
        try {
            return QRCodeGenerator.createTransactionRequest(transferTransaction)
        } catch (e) {
            return null
        }
    }

    get accountAddress() {
        return this.activeAccount.wallet.address
    }

    get wallet() {
        return this.activeAccount.wallet
    }

    get mosaics() {
        return this.activeAccount.mosaics
    }

    get mosaicList() {
        // @TODO: should be an AppMosaic method
        // @TODO: would be better to return a loading indicator
        // instead of an empty array ([] = "no matching data" in the select dropdown)
        const { mosaics } = this
        const { currentHeight } = this.app.chainStatus
        if (this.app.mosaicsLoading || !mosaics) return []

        const mosaicList: any = Object.values(mosaics)

        return [...mosaicList]
            .filter(({ expirationHeight }) => {
                return expirationHeight === MosaicNamespaceStatusType.FOREVER
                    || currentHeight < expirationHeight
            })
            .map(({ hex, name }) => ({ value: name || hex }))
    }

    filterMethod() {
        return 1
    }

    showErrorMessage(message) {
        this.$Notice.destroy()
        this.$Notice.error({
            title: message
        })
    }

    downloadQR() {
        const { address } = this.wallet
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

    mounted() {
        this.selectedMosaicHex = this.mosaicList[0] ? this.mosaicList[0].value : ''
    }
}
