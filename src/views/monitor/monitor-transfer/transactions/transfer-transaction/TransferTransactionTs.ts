import {Message} from "@/config/index.ts"
import {Mosaic, MosaicId, Address, NamespaceId, UInt64} from 'nem2-sdk'
import {Component, Vue, Watch, Provide} from 'vue-property-decorator'
import {TransactionApiRxjs} from '@/core/api/TransactionApiRxjs.ts'
import CheckPWDialog from '@/common/vue/check-password-dialog/CheckPasswordDialog.vue'
import {cloneData, getAbsoluteMosaicAmount} from '@/core/utils'
import ErrorTooltip from '@/views/other/forms/errorTooltip/ErrorTooltip.vue'
import {standardFields} from '@/core/validation'
import {mapState} from 'vuex'
import {NamespaceApiRxjs} from '@/core/api/NamespaceApiRxjs.ts'
import {MessageType} from "nem2-sdk/dist/src/model/transaction/MessageType"
import {formData} from "@/config/formDto";
import {aliasType} from "@/config/types";

@Component({
    components: {CheckPWDialog, ErrorTooltip},
        computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app',
        })
    },
})
export default class TransferTransactionTs extends Vue {
    @Provide() validator: any = this.$validator
    app: any
    activeAccount: any
    isShowSubAlias = false
    standardFields: object = standardFields
    errors: any
    submitDisabled: boolean = false
    transactionList = []
    transactionDetail = {}
    showCheckPWDialog = false
    isCompleteForm = false
    currentMosaic: string = ''
    currentAmount: number = 0
    isAddressMapNull = true
    isAddressAliasExist = false
    formFields = formData.transferForm
    formModel = cloneData(this.formFields)

    get wallet() {
        return this.activeAccount.wallet
    }

    get mosaicsLoading() {
        return this.app.mosaicsLoading
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

    get mosaics() {
        return this.activeAccount.mosaics
    }

    get currentHeight() {
        return this.app.chainStatus.currentHeight
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
            label: `${name||hex} (${balance.toLocaleString()})`,
            value: hex,
        }))
    }

    get addressAliasMap() {
        const addressAliasMap = this.activeAccount.addressAliasMap
        for (let item in addressAliasMap) {
            this.isAddressMapNull = false
            return addressAliasMap
        }
        this.isAddressMapNull = true
        return addressAliasMap
    }

    get xemDivisibility() {
        return this.activeAccount.xemDivisibility
    }

    addMosaic() {
        const {currentMosaic, mosaics, currentAmount} = this
        const {divisibility} = mosaics[currentMosaic].mosaicInfo.properties
        this.formModel.mosaicTransferList
            .push(
                new Mosaic(
                    new MosaicId(currentMosaic),
                    UInt64.fromUint(
                        getAbsoluteMosaicAmount(currentAmount, divisibility)
                    )
                )
            )
    }

    removeMosaic(index) {
        this.formModel.mosaicTransferList.splice(index, 1)
    }

    resetFields() {
        this.formModel = cloneData(this.formFields)
        this.$nextTick(() => this.$validator.reset())
    }

    async submit() {
        await this.getAddressByAlias()
        const that = this
        let {address} = this.formModel
        if (!address || address.length < 40) {
            this.$Notice.error({
                title: that.$t(Message.ADDRESS_ALIAS_NOT_EXIST_ERROR) + ''
            })
            return
        }
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
            "fee": fee + 'XEM',
            "remarks": remark,
            "encryption": isEncrypted,
        }
        this.generateTransaction()
        this.showCheckPWDialog = true
    }

    async getAddressByAlias() {
        const {node} = this
        const that = this
        let addressAlias = this.formModel.address
        if (addressAlias.indexOf('@') == -1) {
            return
        }
        const namespaceId = new NamespaceId(addressAlias.substring(1))
        let flag = false
        try {
            const namespaceInfo: any = await new NamespaceApiRxjs().getNamespace(namespaceId, node).toPromise()
            if (namespaceInfo.alias.type === aliasType.addressAlias) {
                //@ts-ignore
                that.formModel.address = Address.createFromEncoded(namespaceInfo.alias.address).address
            }
        } catch (e) {
            console.log(e)
        }
    }

    async generateTransaction() {
        // TODO address alias
        let {address, remark, fee, mosaicTransferList, isEncrypted} = this.formModel
        const {xemDivisibility} = this
        const {networkType} = this.wallet
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
    }

    @Watch('errors.items')
    onErrorsChanged() {
        this.submitDisabled = this.errors.items.length > 0
    }

    mounted() {
        this.resetFields()
    }
}
