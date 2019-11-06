import {
    Mosaic, MosaicId, UInt64, Address, NamespaceId,
    MultisigAccountInfo, TransferTransaction,
    Message as Msg,
    Deadline,
    PlainMessage,
    TransactionType
} from 'nem2-sdk'
import {mapState} from "vuex"
import {DEFAULT_FEES, FEE_GROUPS, formDataConfig} from "@/config"
import {Component, Provide, Vue, Watch} from 'vue-property-decorator'
import {getAbsoluteMosaicAmount, getRelativeMosaicAmount, formatAddress, cloneData} from "@/core/utils"
import {standardFields, isAddress, NETWORK_PARAMS} from "@/core/validation"
import {signTransaction} from '@/core/services/transactions'
import {
    AppMosaic,
    AppWallet,
    AppInfo,
    StoreAccount,
    DefaultFee,
    MosaicNamespaceStatusType,
    LockParams
} from "@/core/model"
import {createBondedMultisigTransaction, createCompleteMultisigTransaction} from '@/core/services'
import ErrorTooltip from '@/components/other/forms/errorTooltip/ErrorTooltip.vue'

@Component({
    components: {
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
    activeAccount: StoreAccount
    app: AppInfo
    isShowPanel = true
    transactionList = []
    transactionDetail = {}
    isShowSubAlias = false
    isCompleteForm = true
    currentCosignatoryList = []
    currentMosaic: string = ''
    currentAmount: number = 0
    isAddressMapNull = true
    formItems = cloneData(formDataConfig.transferForm)
    standardFields: object = standardFields
    getRelativeMosaicAmount = getRelativeMosaicAmount
    formatAddress = formatAddress
    maxMosaicAbsoluteAmount = 0


    get addressAliasMap() {
        const addressAliasMap = this.activeAccount.addressAliasMap
        for (let item in addressAliasMap) {
            this.isAddressMapNull = false
            return addressAliasMap
        }
        this.isAddressMapNull = true
        return addressAliasMap
    }

    get announceInLock(): boolean {
        const {activeMultisigAccount, networkType} = this
        if (!this.activeMultisigAccount) return false
        const address = Address.createFromPublicKey(activeMultisigAccount, networkType).plain()
        // @TODO: Do a loading system
        const multisigInfo = this.activeAccount.multisigAccountInfo[address]
        if (!multisigInfo) return false
        return multisigInfo.minApproval > 1
    }

    get defaultFees(): DefaultFee[] {
        if (!this.activeMultisigAccount) return DEFAULT_FEES[FEE_GROUPS.SINGLE]
        if (!this.announceInLock) return DEFAULT_FEES[FEE_GROUPS.DOUBLE]
        if (this.announceInLock) return DEFAULT_FEES[FEE_GROUPS.TRIPLE]
    }

    get networkCurrency() {
        return this.activeAccount.networkCurrency
    }

    get feeAmount(): number {
        const {feeSpeed} = this.formItems
        const feeAmount = this.defaultFees.find(({speed}) => feeSpeed === speed).value
        return getAbsoluteMosaicAmount(feeAmount, this.networkCurrency.divisibility)
    }

    get feeDivider(): number {
        if (!this.activeMultisigAccount) return 1
        if (!this.announceInLock) return 2
        if (this.announceInLock) return 3
    }

    get isSelectedAccountMultisig(): boolean {
        return this.activeAccount.activeMultisigAccount ? true : false
    }

    get activeMultisigAccount(): string {
        return this.activeAccount.activeMultisigAccount
    }

    get activeMultisigAccountAddress(): string {
        const {activeMultisigAccount} = this
        return activeMultisigAccount
            ? Address.createFromPublicKey(activeMultisigAccount, this.wallet.networkType).plain()
            : null
    }

    get address(): string {
        return this.activeAccount.wallet.address
    }

    get multisigMosaicList(): Record<string, AppMosaic> {
        const {activeMultisigAccountAddress} = this
        const {multisigAccountsMosaics} = this.activeAccount
        if (!activeMultisigAccountAddress) return {}
        return multisigAccountsMosaics[activeMultisigAccountAddress] || {}
    }

    get multisigInfo(): MultisigAccountInfo {
        const {address} = this.wallet
        return this.activeAccount.multisigAccountInfo[address]
    }

    get hasMultisigAccounts(): boolean {
        if (!this.multisigInfo) return false
        return this.multisigInfo.multisigAccounts.length > 0
    }

    get multisigPublicKeyList(): { publicKey: string, address: string }[] {
        if (!this.hasMultisigAccounts) return null
        return [
            {
                publicKey: this.accountPublicKey,
                address: `(self) ${formatAddress(this.address)}`,
            },
            ...this.multisigInfo.multisigAccounts
                .map(({publicKey}) => ({
                    publicKey,
                    address: formatAddress(Address.createFromPublicKey(publicKey, this.networkType).plain())
                })),
        ]
    }

    get generationHash() {
        return this.activeAccount.generationHash
    }

    get accountAddress() {
        return this.activeAccount.wallet.address
    }

    get accountPublicKey(): string {
        return this.activeAccount.wallet.publicKey
    }

    get wallet(): AppWallet {
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
        const {mosaicsLoading} = this
        return mosaicsLoading ? [] : this.activeAccount.mosaics
    }

    get currentHeight() {
        return this.app.chainStatus.currentHeight
    }

    get recipient(): Address | NamespaceId {
        const {recipient} = this.formItems
        if (isAddress(this.formItems.recipient)) return Address.createFromRawAddress(recipient)
        return new NamespaceId(recipient)
    }

    get mosaicList() {
        // @TODO: would be better to return a loading indicator
        // instead of an empty array ([] = "no matching data" in the select dropdown)
        const {mosaics, currentHeight, multisigMosaicList, isSelectedAccountMultisig} = this

        const mosaicList = isSelectedAccountMultisig
            ? Object.values(multisigMosaicList).map(mosaic => {
                if (mosaics[mosaic.hex]) return {...mosaic, name: mosaics[mosaic.hex].name || null}
                return mosaic
            })
            : Object.values(mosaics)

        // @TODO: refactor, make it an AppMosaic method
        return [...mosaicList]
            .filter(mosaic => mosaic.balance && mosaic.balance >= 0
                && (mosaic.expirationHeight === MosaicNamespaceStatusType.FOREVER
                    || currentHeight < mosaic.expirationHeight))
            .map(({name, balance, hex}) => ({
                label: `${name || hex} (${balance.toLocaleString()})`,
                value: hex,
            }))
    }

    get currentMosaicAbsoluteAmount() {
        const {mosaics, currentMosaic, currentAmount} = this
        return mosaics[currentMosaic] ? getAbsoluteMosaicAmount(currentAmount, mosaics[currentMosaic].properties.divisibility) : 0

    }

    initForm() {
        this.currentMosaic = null
        this.currentAmount = 0
        this.formItems = cloneData(formDataConfig.transferForm)
        this.formItems.multisigPublicKey = this.accountPublicKey
        this.resetFields()
    }

    addMosaic() {
        this.maxMosaicAbsoluteAmount = 0
        const {currentMosaic, mosaics, currentAmount} = this
        const {divisibility} = mosaics[currentMosaic].properties
        const mosaicTransferList = [...this.formItems.mosaicTransferList]
        const that = this
        let resultAmount = currentAmount
        mosaicTransferList.every((item, index) => {
                if (item.id.toHex() == currentMosaic) {
                    resultAmount = Number(getRelativeMosaicAmount(item.amount.compact(), divisibility)) + Number(resultAmount)
                    that.formItems.mosaicTransferList.splice(index, 1)
                    // Verify additional conditions :if resultAmount > MAX_MOSAIC_ATOMIC_UNITS, do not add mosaic amount
                    const absoluteAmount = getAbsoluteMosaicAmount(resultAmount, divisibility)
                    if (absoluteAmount > NETWORK_PARAMS.MAX_MOSAIC_ATOMIC_UNITS) {
                        that.maxMosaicAbsoluteAmount = absoluteAmount
                        resultAmount = Number(getRelativeMosaicAmount(item.amount.compact(), divisibility))
                        return true
                    }
                    return false
                }
                // get max amount in mosaic list
                that.maxMosaicAbsoluteAmount = that.maxMosaicAbsoluteAmount > resultAmount ? that.maxMosaicAbsoluteAmount : resultAmount
                return true
            }
        )
        // Verify direct additions: if resultAmount > MAX_MOSAIC_ATOMIC_UNITS, do not add mosaic amount
        const absoluteAmount = getAbsoluteMosaicAmount(resultAmount, divisibility)
        if (absoluteAmount > NETWORK_PARAMS.MAX_MOSAIC_ATOMIC_UNITS) {
            that.maxMosaicAbsoluteAmount = absoluteAmount
            return
        }
        this.formItems.mosaicTransferList.unshift(
            new Mosaic(
                new MosaicId(currentMosaic),
                UInt64.fromUint(
                    getAbsoluteMosaicAmount(resultAmount, divisibility)
                )
            )
        )
        this.sortMosaics()
        this.clearAssetData()

    }

    clearAssetData() {
        this.currentMosaic = ''
        this.currentAmount = 0
    }

    sortMosaics() {
        this.formItems.mosaicTransferList = this.formItems.mosaicTransferList.sort((a, b) => {
            if (Number(a.id.toDTO()[1]) > b.id.toDTO()[1]) {
                return 1
            } else if (a.id.toDTO()[1] < b.id.toDTO()[1]) {
                return -1
            }
            return 0
        })
    }

    removeMosaic(index) {
        this.formItems.mosaicTransferList.splice(index, 1)
    }

    submit() {
        this.$validator
            .validate()
            .then((valid) => {
                if (!valid) return
                this.confirmViaTransactionConfirmation()
            })
    }

    get lockParams(): LockParams {
        const {announceInLock, feeAmount, feeDivider} = this
        return new LockParams(announceInLock, feeAmount / feeDivider)
    }

    async confirmViaTransactionConfirmation() {
        if (this.activeMultisigAccount) {
            this.sendMultisigTransaction()
        } else {
            this.sendTransaction()
        }

        // delegate the signing to the TransactionConfirmation workflow
        // the resolve value of this promise will contain the signed transaction
        // if the user confirms successfullly
        const {
            success,
            signedTransaction,
            signedLock,
        } = await signTransaction({
            transaction: this.transactionList[0],
            store: this.$store,
            lockParams: this.lockParams
        })

        if (success) {
            const {node} = this.activeAccount
            new AppWallet(this.wallet).announceTransaction(signedTransaction, node, this, signedLock)
            this.initForm()
        }
    }

    sendTransaction() {
        const {remark, mosaicTransferList} = this.formItems
        const {feeAmount, networkType, recipient} = this
        const message: Msg = PlainMessage.create(remark)
        const transaction = TransferTransaction
            .create(Deadline.create(),
                recipient,
                mosaicTransferList,
                message,
                networkType,
                UInt64.fromUint(feeAmount))
        this.transactionList = [transaction]
    }

    sendMultisigTransaction() {
        const {networkType, feeAmount, recipient, feeDivider} = this
        let {mosaicTransferList, remark, multisigPublicKey} = this.formItems
        const message: Msg = PlainMessage.create(remark)
        const innerFee = feeAmount / feeDivider
        const aggregateFee = feeAmount / feeDivider

        const transaction = TransferTransaction
            .create(Deadline.create(),
                recipient,
                mosaicTransferList,
                message,
                networkType,
                UInt64.fromUint(feeAmount))

        if (this.announceInLock) {
            const aggregateTransaction = createBondedMultisigTransaction(
                [transaction],
                multisigPublicKey,
                networkType,
                innerFee
            )
            this.transactionList = [aggregateTransaction]
            return
        }
        const aggregateTransaction = createCompleteMultisigTransaction(
            [transaction],
            multisigPublicKey,
            networkType,
            aggregateFee
        )
        this.transactionList = [aggregateTransaction]
    }

    @Watch('formItems.multisigPublicKey')
    onMultisigPublicKeyChange(newPublicKey, oldPublicKey) {
        if (!newPublicKey || newPublicKey === oldPublicKey) return
        this.$store.commit('SET_ACTIVE_MULTISIG_ACCOUNT', newPublicKey)
    }

    // @TODO: probably not the best way
    @Watch('wallet', {deep: true})
    onWalletChange(newVal, oldVal) {
        if (!newVal.publicKey) return
        const multisigPublicKey = newVal.publicKey
        if (multisigPublicKey !== oldVal.publicKey) {
            this.initForm()
        }
    }

    resetFields() {
        this.$nextTick(() => this.$validator.reset())
    }

    async mounted() {
        this.initForm()
    }
}
