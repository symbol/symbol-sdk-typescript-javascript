import {
    Mosaic, MosaicId, UInt64, Address, NamespaceId,
    MultisigAccountInfo, TransferTransaction,
    Message as Msg,
    Deadline,
    PlainMessage,
} from 'nem2-sdk'
import {mapState} from "vuex"
import {DEFAULT_FEES, FEE_GROUPS, formDataConfig} from "@/config"
import {Component, Provide, Vue, Watch} from 'vue-property-decorator'
import {getAbsoluteMosaicAmount, getRelativeMosaicAmount, formatAddress, cloneData} from "@/core/utils"
import {validation} from "@/core/validation"
import {signAndAnnounce} from '@/core/services/transactions'
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
import {validateAddress} from '@/core/validation'
import ErrorTooltip from '@/components/other/forms/errorTooltip/ErrorTooltip.vue'
import SignerSelector from '@/components/forms/inputs/signer-selector/SignerSelector.vue'

@Component({
    components: {ErrorTooltip, SignerSelector},
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app'
        })
    },
})
export class TransferTs extends Vue {
    @Provide() validator: any = this.$validator
    activeAccount: StoreAccount
    app: AppInfo
    isShowPanel = true
    transactionList = []
    transactionDetail = {}
    isShowSubAlias = false
    currentCosignatoryList = []
    selectedMosaicHex: string = ''
    currentAmount: number = null
    isAddressMapNull = true
    formItems = cloneData(formDataConfig.transferForm)
    validation = validation
    getRelativeMosaicAmount = getRelativeMosaicAmount
    formatAddress = formatAddress
    maxMosaicAbsoluteAmount = 0

    get selectedMosaic() {
        const {mosaics, selectedMosaicHex} = this
        if (!mosaics || !selectedMosaicHex) return null
        return mosaics[selectedMosaicHex] || null
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

    get wallet(): AppWallet {
        return this.activeAccount.wallet
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
        return this.app.NetworkProperties.height
    }

    get currentAccount() {
        return this.activeAccount.currentAccount
    }

    get recipient(): Address | NamespaceId {
        const {recipient} = this.formItems
        if (validateAddress(this.formItems.recipient).valid) {
            return Address.createFromRawAddress(recipient)
        }
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

    get lockParams(): LockParams {
        const {announceInLock, feeAmount, feeDivider} = this
        return new LockParams(announceInLock, feeAmount / feeDivider)
    }

    initForm() {
        this.selectedMosaicHex = null
        this.currentAmount = null
        this.formItems = cloneData(formDataConfig.transferForm)
        this.formItems.multisigPublicKey = this.wallet.publicKey
        this.resetFields()
    }

    addMosaic() {
        const {selectedMosaicHex, mosaics, currentAmount} = this
        if (!currentAmount) return
        if (this.$validator.errors.has('currentAmount') || !selectedMosaicHex) return
        this.maxMosaicAbsoluteAmount = 0
        const {divisibility} = mosaics[selectedMosaicHex].properties

        const duplicateMosaicIndex = this.formItems.mosaicTransferList
            .findIndex((mosaic: Mosaic) => mosaic.id.toHex() === selectedMosaicHex)

        if (duplicateMosaicIndex > -1) {
            this.formItems.mosaicTransferList.splice(duplicateMosaicIndex, 1)
        }

        this.formItems.mosaicTransferList.push(
            new Mosaic(
                new MosaicId(selectedMosaicHex),
                UInt64.fromUint(
                    getAbsoluteMosaicAmount(currentAmount, divisibility)
                )
            )
        )
        this.sortMosaics()
        this.clearAssetData()
        const fieldToReset = this.$validator.fields.find({name: 'currentAmount'});
        if (fieldToReset) this.$validator.reset(fieldToReset);
    }

    clearAssetData() {
        this.selectedMosaicHex = null
        this.currentAmount = null
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

    async confirmViaTransactionConfirmation() {
        if (this.activeMultisigAccount) {
            this.sendMultisigTransaction()
        } else {
            this.sendTransaction()
        }
        const {success} = await signAndAnnounce({
            transaction: this.transactionList[0],
            store: this.$store,
            lockParams: this.lockParams
        })
        if (success) this.initForm()
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

    resetFields() {
        this.$nextTick(() => this.$validator.reset())
    }

    @Watch('wallet', {deep: true})
    onWalletChange(newVal, oldVal) {
        if (!newVal.publicKey) return
        if (newVal.publicKey !== oldVal.publicKey) {
            this.initForm()
        }
    }

    @Watch('selectedMosaicHex', {immediate: true})
    onSelectedMosaicHexChange() {
        /** Makes currentAmount validation reactive */
        this.$validator.validate('currentAmount', this.currentAmount).catch(e => e)
    }

    async mounted() {
        this.initForm()
    }
}
