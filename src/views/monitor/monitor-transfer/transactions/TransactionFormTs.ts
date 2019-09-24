import {Mosaic, MosaicId, UInt64, Address, NamespaceId, AliasType} from 'nem2-sdk'
import {mapState} from "vuex"
import {Message} from "@/config"
import {MultisigApiRxjs} from '@/core/api/MultisigApiRxjs.js'
import {Component, Provide, Vue, Watch} from 'vue-property-decorator'
import CheckPWDialog from '@/common/vue/check-password-dialog/CheckPasswordDialog.vue'
import {
    getAbsoluteMosaicAmount
} from "@/core/utils"
import {TransactionApiRxjs} from "@/core/api/TransactionApiRxjs"
import {MessageType} from "nem2-sdk/dist/src/model/transaction/MessageType"
import {NamespaceApiRxjs} from "@/core/api/NamespaceApiRxjs"
import {standardFields} from "@/core/validation"
import ErrorTooltip from '@/views/other/forms/errorTooltip/ErrorTooltip.vue'
import {formDataConfig} from '@/config/view/form'
import {
    createBondedMultisigTransaction,
    createCompleteMultisigTransaction,
} from "@/core/model"
import {buildMosaicList, getMosaicList} from "@/core/services/mosaics"

@Component({
    components: {
        CheckPWDialog,
        ErrorTooltip
    },
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app'
        })
    },
})
export class TransactionFormTs extends Vue {
    @Provide() validator: any = this.$validator
    activeAccount: any
    isShowPanel = true
    transactionList = []
    transactionDetail = {}
    currentMinApproval = 0
    isShowSubAlias = false
    showCheckPWDialog = false
    otherDetails: any = {}
    isCompleteForm = true
    currentCosignatoryList = []
    currentMosaic: string = ''
    currentAmount: number = 0
    multisigPublickeyList: any = []
    isAddressMapNull = true
    formItem = formDataConfig.multisigTransferForm
    standardFields: object = standardFields
    app: any
    isMultisig = false
    multisigMosaicList = []

    get addressAliasMap() {
        const addressAliasMap = this.activeAccount.addressAliasMap
        for (let item in addressAliasMap) {
            this.isAddressMapNull = false
            return addressAliasMap
        }
        this.isAddressMapNull = true
        return addressAliasMap
    }

    get generationHash() {
        return this.activeAccount.generationHash
    }

    get currentXem() {
        return this.activeAccount.currentXem
    }

    get accountAddress() {
        return this.activeAccount.wallet.address
    }

    get accountPublicKey() {
        return this.activeAccount.wallet.publicKey
    }

    get currentXEM1() {
        return this.activeAccount.currentXEM1
    }

    get getWallet() {
        return this.activeAccount.wallet
    }

    get node() {
        return this.activeAccount.node
    }

    get networkType() {
        return this.activeAccount.wallet.networkType
    }

    get mosaicsLoading() {
        return this.app.mosaicsLoading
    }

    get mosaics() {
        return this.activeAccount.mosaics
    }

    get currentHeight() {
        return this.app.chainStatus.currentHeight
    }

    get xemDivisibility() {
        return this.activeAccount.xemDivisibility
    }

    get mosaicList() {
        // @TODO: would be better to return a loading indicator
        // instead of an empty array ([] = "no matching data" in the select dropdown)
        const {mosaics, currentHeight, multisigMosaicList, isMultisig} = this

        if (isMultisig) {
            return multisigMosaicList
        }

        if (this.mosaicsLoading || !mosaics) return []

        const mosaicList: any = Object.values(this.mosaics)
        return [...mosaicList]
            .filter(mosaic => mosaic.balance && mosaic.balance > 0
                && (mosaic.expirationHeight === 'Forever'
                    || currentHeight < mosaic.expirationHeight))
            .map(({name, balance, hex}) => ({
                label: `${name || hex} (${balance.toLocaleString()})`,
                value: hex,
            }))
    }


    initForm() {
        const multisigPublickey = this.getWallet.publicKey

        this.formItem = {
            address: '',
            mosaicTransferList: [],
            remark: '',
            multisigPublickey,
            innerFee: 1,
            lockFee: 10,
            isEncrypted: true,
            aggregateFee: 1,
        }
        this.resetFields()
    }

    addMosaic() {
        const {currentMosaic, mosaics, currentAmount} = this
        const {divisibility} = mosaics[currentMosaic].properties
        const {mosaicTransferList} = this.formItem
        // TODO check if mosaic exsted

        // if (
        //     mosaicTransferList.find((item, index, array) => {
        //         if (item.id.toHex() == currentMosaic) {
        //
        //         }
        //         return item.id.toHex() == currentMosaic
        //     })
        // )
        //     return
        mosaicTransferList.push(
            new Mosaic(
                new MosaicId(currentMosaic),
                UInt64.fromUint(
                    getAbsoluteMosaicAmount(currentAmount, divisibility)
                )
            )
        )
    }

    removeMosaic(index) {
        this.formItem.mosaicTransferList.splice(index, 1)
    }

    async submit() {
        // get alias
        let {address} = this.formItem
        await this.getAddressByAlias()
        const that = this
        if (!address || address.length < 40) {
            this.$Notice.error({
                title: that.$t(Message.ADDRESS_ALIAS_NOT_EXIST_ERROR) + ''
            })
            return
        }
        if (!this.checkForm()) return

        this.$validator
            .validate()
            .then((valid) => {
                if (!valid) return
                this.showDialog()
            })
        // if (!this.isCompleteForm) return
    }

    showDialog() {
        const {accountPublicKey, isMultisig} = this
        let {address, remark, mosaicTransferList, isEncrypted, innerFee, lockFee, aggregateFee} = this.formItem
        const publicKey = isMultisig ? accountPublicKey : '(self)' + accountPublicKey

        this.transactionDetail = {
            "transaction_type": isMultisig ? 'Multisig_transfer' : 'ordinary_transfer',
            "Public_account": publicKey,
            "transfer_target": address,
            "mosaic": mosaicTransferList.map(item => {
                return item.id.id.toHex() + `(${item.amount.compact()})`
            }).join(','),
            "fee": isMultisig ? innerFee + lockFee + aggregateFee + 'XEM' : innerFee + 'XEM',
            "remarks": remark,
            "encryption": isEncrypted,
        }
        this.otherDetails = {
            lockFee: lockFee
        }
        if (isMultisig) {
            this.sendMultisigTransaction()
            this.showCheckPWDialog = true
            return
        }
        this.sendTransaction()
        this.showCheckPWDialog = true
    }

    sendTransaction() {
        let {address, remark, innerFee, mosaicTransferList, isEncrypted} = this.formItem
        const {xemDivisibility, networkType} = this
        innerFee = getAbsoluteMosaicAmount(innerFee, xemDivisibility)

        const transaction = new TransactionApiRxjs().transferTransaction(
            networkType,
            innerFee,
            address,
            mosaicTransferList,
            isEncrypted ? MessageType.EncryptedMessage : MessageType.PlainMessage,
            remark
        )
        this.transactionList = [transaction]
    }

    sendMultisigTransaction() {
        if (this.currentMinApproval == 0) {
            return
        }
        const {networkType, xemDivisibility} = this
        let {address, innerFee, aggregateFee, mosaicTransferList, isEncrypted, remark, multisigPublickey} = this.formItem
        innerFee = getAbsoluteMosaicAmount(innerFee, xemDivisibility)
        aggregateFee = getAbsoluteMosaicAmount(aggregateFee, xemDivisibility)
        const transaction = new TransactionApiRxjs().transferTransaction(
            networkType,
            innerFee,
            address,
            mosaicTransferList,
            isEncrypted ? MessageType.EncryptedMessage : MessageType.PlainMessage,
            remark
        )

        if (this.currentMinApproval > 1) {
            const aggregateTransaction = createBondedMultisigTransaction(
                [transaction],
                multisigPublickey,
                networkType,
                innerFee
            )
            this.transactionList = [aggregateTransaction]
            return
        }
        const aggregateTransaction = createCompleteMultisigTransaction(
            [transaction],
            multisigPublickey,
            networkType,
            aggregateFee
        )
        this.transactionList = [aggregateTransaction]
    }

    async getMultisigAccountList() {
        try {
            if (!this.getWallet.address) return
            const {address} = this.getWallet
            const {node} = this

            const multisigInfo = await new MultisigApiRxjs()
                .getMultisigAccountInfo(address, node).toPromise()

            if (multisigInfo.multisigAccounts.length == 0) {
                this.isShowPanel = false
                return
            }
            this.multisigPublickeyList.push(...multisigInfo.multisigAccounts.map((item: any) => {
                item.value = item.publicKey
                item.label = item.publicKey
                return item
            }))
        } catch (error) {
            console.error("getMultisigAccountList -> error", error)
        }
    }

    async checkForm() {
        const {address, innerFee, mosaicTransferList, lockFee, aggregateFee, multisigPublickey} = this.formItem

        // multisig check
        if (multisigPublickey.length < 64) {
            this.showErrorMessage(this.$t(Message.ILLEGAL_PUBLICKEY_ERROR))
            return false
        }
        if (address.length < 40) {
            this.showErrorMessage(this.$t(Message.ADDRESS_FORMAT_ERROR))
            return false
        }

        if ((!Number(aggregateFee) && Number(aggregateFee) !== 0) || Number(aggregateFee) < 0) {
            this.showErrorMessage(this.$t(Message.FEE_LESS_THAN_0_ERROR))
            return false
        }

        if ((!Number(innerFee) && Number(innerFee) !== 0) || Number(innerFee) < 0) {
            this.showErrorMessage(this.$t(Message.FEE_LESS_THAN_0_ERROR))
            return false
        }
        if ((!Number(lockFee) && Number(lockFee) !== 0) || Number(lockFee) < 0) {
            this.showErrorMessage(this.$t(Message.FEE_LESS_THAN_0_ERROR))
            return false
        }
        if (mosaicTransferList.length < 1) {
            this.showErrorMessage(this.$t(Message.MOSAIC_LIST_NULL_ERROR))
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

    async initMultisigAccountMosaic(accountAddress: string) {
        const {currentXEM1, node, currentXem} = this
        const mosaicList: Mosaic[] = await getMosaicList(accountAddress, node)
        this.multisigMosaicList = await buildMosaicList(mosaicList, currentXEM1, currentXem)
    }


    async getAddressByAlias() {
        const {node} = this
        const that = this
        let addressAlias = this.formItem.address
        if (addressAlias.indexOf('@') == -1) {
            return
        }
        const namespaceId = new NamespaceId(addressAlias.substring(1))
        let flag = false
        try {
            const namespaceInfo: any = await new NamespaceApiRxjs().getNamespace(namespaceId, node).toPromise()
            if (namespaceInfo.alias.type === AliasType.Address) {
                //@ts-ignore
                that.formModel.address = Address.createFromEncoded(namespaceInfo.alias.address).address
            }
        } catch (e) {
            console.log(e)
        }
    }

    closeCheckPWDialog() {
        this.showCheckPWDialog = false
    }

    checkEnd(isPasswordRight) {
        if (!isPasswordRight) {
            this.$Notice.destroy()
            this.$Notice.error({
                title: this.$t(Message.WRONG_PASSWORD_ERROR) + ''
            })
        }
        this.initForm()
    }


    @Watch('formItem.multisigPublickey')
    async onMultisigPublickeyChange(newPublicKey) {
        if (!newPublicKey) return
        this.multisigMosaicList = []

        if (newPublicKey == this.accountPublicKey) {
            this.isMultisig = false
            return
        }

        this.isMultisig = true
        const that = this
        const {node, networkType} = this
        const address = Address.createFromPublicKey(newPublicKey, networkType).toDTO().address

        await this.initMultisigAccountMosaic(address)
        new MultisigApiRxjs().getMultisigAccountInfo(address, node).subscribe((multisigInfo) => {
            that.currentMinApproval = multisigInfo.minApproval
            that.currentCosignatoryList = multisigInfo.cosignatories
        })
    }

    setMainPublicKey() {
        const multisigPublickey = this.activeAccount.wallet.publicKey
        this.multisigPublickeyList = [{
            value: multisigPublickey,
            label: '(self)' + multisigPublickey
        }]
    }

    @Watch('getWallet', {deep: true})
    async onWalletChange(newVal, oldVal) {
        if (!newVal.publicKey) return
        const multisigPublickey = newVal.publicKey
        if (multisigPublickey !== oldVal.publicKey) {
            this.setMainPublicKey()
            this.initForm()
            this.getMultisigAccountList()
        }
    }

    resetFields() {
        this.$nextTick(() => this.$validator.reset())
    }

    // @TODO: set this function at a higher level and put the multisig wallet list in the store
    async mounted() {
        this.setMainPublicKey()
        this.getMultisigAccountList()
        this.initForm()
    }
}
