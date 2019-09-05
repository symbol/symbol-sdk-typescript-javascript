import {Message, formData} from "@/config/index.ts"
import {Mosaic, MosaicId, UInt64} from 'nem2-sdk'
import {Component, Vue, Watch, Provide} from 'vue-property-decorator'
import {TransactionApiRxjs} from '@/core/api/TransactionApiRxjs.ts'
import CheckPWDialog from '@/common/vue/check-password-dialog/CheckPasswordDialog.vue'
import {cloneData, getRelativeMosaicAmount, getAbsoluteMosaicAmount} from '@/core/utils/utils'
import ErrorTooltip from '@/views/other/forms/errorTooltip/ErrorTooltip.vue'
import {standardFields} from '@/core/validation'
import {mapState} from 'vuex'
import {MessageType} from "nem2-sdk/dist/src/model/transaction/MessageType"

@Component({
    components: {CheckPWDialog, ErrorTooltip},
    computed: {...mapState({activeAccount: 'account'})},
})
export default class TransferTransactionTs extends Vue {
    @Provide() validator: any = this.$validator
    activeAccount: any
    isShowSubAlias = false
    standardFields: object = standardFields
    errors: any
    submitDisabled: boolean = false
    mosaicList = []
    transactionList = []
    transactionDetail = {}
    showCheckPWDialog = false
    isCompleteForm = false
    currentMosaic: string = ''
    currentAmount: number = 0
    isAddressMapNull = true
    formFields = formData.transferForm
    formModel = cloneData(this.formFields)

    get wallet() {
        return this.activeAccount.wallet
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

    get generationHash() {
        return this.activeAccount.generationHash
    }

    get mosaicMap() {
        return this.activeAccount.mosaicMap
    }

    get addresAliasMap() {
        const addresAliasMap = this.activeAccount.addresAliasMap
        for (let item in addresAliasMap) {
            this.isAddressMapNull = false
            return addresAliasMap
        }
        this.isAddressMapNull = true
        return addresAliasMap
    }


    get xemDivisibility() {
        return this.activeAccount.xemDivisibility
    }

    addMosaic() {
        const {currentMosaic, mosaicMap, currentAmount} = this
        this.formModel.mosaicTransferList.push(new Mosaic(new MosaicId(currentMosaic), UInt64.fromUint(getAbsoluteMosaicAmount(currentAmount, mosaicMap[currentMosaic].divisibility))))
    }

    removeMosaic(index) {
        this.formModel.mosaicTransferList.splice(index, 1)
    }

    resetFields() {
        this.formModel = cloneData(this.formFields)
        this.$nextTick(() => this.$validator.reset())
    }

    submit() {
        this.$validator
            .validate()
            .then((valid) => {
                if (!valid) return
                this.showDialog()
            })
    }

    showDialog() {
        const {address, mosaicTransferList, remark, fee, isEncrypted} = this.formModel
        this.transactionDetail = {
            "transaction_type": 'ordinary_transfer',
            "transfer_target": address,
            "mosaic": mosaicTransferList.map(item => {
                return item.id.id.toHex() + `(${item.amount.compact()})`
            }).join(','),
            "fee": fee + 'gas',
            "remarks": remark,
            "encryption": isEncrypted,
        }
        this.showCheckPWDialog = true
        this.generateTransaction()
    }

    generateTransaction() {
        const that = this
        let {address, remark, fee, mosaicTransferList, isEncrypted} = this.formModel
        const {networkType, xemDivisibility} = this.wallet
        fee = getAbsoluteMosaicAmount(fee, xemDivisibility)
        const transaction = new TransactionApiRxjs().transferTransaction(
            networkType,
            fee,
            address,
            mosaicTransferList,
            isEncrypted ? MessageType.EncryptedMessage : MessageType.PlainMessage,
            remark
        )
        this.transactionList = [transaction]
    }

    async initMosaic() {
        const {mosaicMap} = this
        for (let key in mosaicMap) {
            this.mosaicList.push({
                label: mosaicMap[key].name + `(${mosaicMap[key].amount})`,
                value: mosaicMap[key].hex,
            })
        }
    }

    closeCheckPWDialog() {
        this.showCheckPWDialog = false
    }

    checkEnd(isPasswordRight) {
        if (!isPasswordRight) {
            this.$Notice.error({
                title: this.$t(Message.WRONG_PASSWORD_ERROR) + ''
            })
        }
    }

    @Watch('accountAddress')
    onAcountAddressChange() {
        this.resetFields()
        this.initMosaic()
    }

    @Watch('errors.items')
    onErrorsChanged() {
        this.submitDisabled = this.errors.items.length > 0
    }

    created() {
        this.initMosaic()
    }

    mounted() {
        this.resetFields()
    }
}
