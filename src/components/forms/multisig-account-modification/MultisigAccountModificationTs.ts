import {
    MultisigAccountModificationTransaction,
    PublicAccount,
    Deadline,
    UInt64,
    MultisigAccountInfo,
    Address,
    AccountHttp,
    AggregateTransaction,
} from 'nem2-sdk'
import {mapState} from "vuex"
import {Component, Vue, Watch, Prop, Provide} from 'vue-property-decorator'
import {timeout, finalize} from 'rxjs/operators'
import {Message, DEFAULT_FEES, FEE_GROUPS, formDataConfig, networkConfig} from "@/config/index.ts"
import {
    StoreAccount, DefaultFee, AppWallet, ANNOUNCE_TYPES, MULTISIG_FORM_MODES,
    LockParams, AddOrRemove, CosignatoryModifications,
} from "@/core/model"
import {getAbsoluteMosaicAmount, formatAddress, cloneData} from "@/core/utils"
import {createBondedMultisigTransaction, createCompleteMultisigTransaction, signAndAnnounce} from '@/core/services'
import DisabledForms from '@/components/disabled-forms/DisabledForms.vue'
import MultisigTree from '@/views/multisig/multisig-tree/MultisigTree.vue'
import ErrorTooltip from '@/components/other/forms/errorTooltip/ErrorTooltip.vue'
import SignerSelector from '@/components/forms/inputs/signer-selector/SignerSelector.vue'

const {EMPTY_PUBLIC_KEY} = networkConfig

const formLabels = {
    [MULTISIG_FORM_MODES.CONVERSION]: {
        approvalFieldName: 'min_approval',
        approvalFieldDescription: 'Min_signatures_to_sign_a_transaction_or_to_add_a_cosigner',
        removalFieldName: 'min_removal',
        removalFieldDescription: 'Min_signatures_required_to_remove_a_cosigner',
    },
    [MULTISIG_FORM_MODES.MODIFICATION]: {
        approvalFieldName: 'min_approval_delta',
        approvalFieldDescription: 'min_approval_delta_field_description',
        removalFieldName: 'min_removal_delta',
        removalFieldDescription: 'min_removal_delta_field_description',
    },
}

@Component({
    components: {
        DisabledForms,
        MultisigTree,
        ErrorTooltip,
        SignerSelector,
    },
    computed: {
        ...mapState({
            activeAccount: 'account',
        })
    }
})
export class MultisigAccountModificationTs extends Vue {
    @Provide() validator: any = this.$validator
    activeAccount: StoreAccount
    MULTISIG_FORM_MODES = MULTISIG_FORM_MODES
    signAndAnnounce = signAndAnnounce
    AddOrRemove = AddOrRemove
    Address = Address
    formItems = {...this.defaultFormItems}
    cosignerToAdd = ''
    cosignatoryModifications = new CosignatoryModifications([])
    formLabels = formLabels

    @Prop() mode: string

    get wallet(): AppWallet {
        return this.activeAccount.wallet
    }

    get defaultFormItems() {
        return this.mode === MULTISIG_FORM_MODES.CONVERSION
            ? cloneData(formDataConfig.multisigConversionForm)
            : cloneData(formDataConfig.multisigModificationForm)
    }
    get currentAccountMultisigInfo(): MultisigAccountInfo {
        const { address } = this.wallet
        return this.activeAccount.multisigAccountInfo[address]
    }

    get hasMultisigAccounts(): boolean {
        if (!this.currentAccountMultisigInfo) return false
        return this.currentAccountMultisigInfo.multisigAccounts.length > 0
    }

    get multisigPublicKeyList(): {publicKey: string, address: string}[] {
        if (!this.hasMultisigAccounts) return null
        const { publicKey, address } = this.wallet

        const selfPublicKeyItem = {
            publicKey,
            address: `(self) ${formatAddress(address)}`,
        }

        const list = this.currentAccountMultisigInfo.multisigAccounts
            .map(({ publicKey }) => ({
                publicKey,
                address: formatAddress(Address.createFromPublicKey(publicKey, this.networkType).plain())
            }))

        return this.hasCosignatories ? [selfPublicKeyItem, ...list] : list
    }

    get announceType(): string {
        const {hasCosignatories, cosignatoryModifications, formItems} = this
        if (!hasCosignatories) return ANNOUNCE_TYPES.AGGREGATE_BONDED

        if (hasCosignatories && formItems.minApproval === 1
            && !cosignatoryModifications.publicKeysAdditions.length) {
            return ANNOUNCE_TYPES.AGGREGATE_BONDED
        }

        return ANNOUNCE_TYPES.AGGREGATE_COMPLETE
    }

    get announceInLock(): boolean {
        return this.announceType === ANNOUNCE_TYPES.AGGREGATE_BONDED
    }

    get hasCosignatories(): boolean {
        if (!this.currentAccountMultisigInfo) return false
        return this.currentAccountMultisigInfo.cosignatories.length > 0
    }

    get publicKey() {
        return this.mode === MULTISIG_FORM_MODES.CONVERSION
            ? this.activeAccount.wallet.publicKey
            : this.formItems.multisigPublicKey
    }

    get networkCurrency() {
        return this.activeAccount.networkCurrency
    }

    get networkType() {
        return this.activeAccount.wallet.networkType
    }

    get defaultFees(): DefaultFee[] {
        return this.announceInLock ? DEFAULT_FEES[FEE_GROUPS.TRIPLE] : DEFAULT_FEES[FEE_GROUPS.DOUBLE]
    }

    get feeDivider(): number {
        return this.announceInLock ? 3 : 2
    }

    get feeAmount(): number {
        const { feeSpeed } = this.formItems
        const feeAmount = this.defaultFees.find(({ speed }) => feeSpeed === speed).value
        return getAbsoluteMosaicAmount(feeAmount, this.networkCurrency.divisibility)
    }

    get displayForm(): boolean {
        const { mode, hasMultisigAccounts, hasCosignatories } = this
        if (hasCosignatories) return false
        if (mode === MULTISIG_FORM_MODES.MODIFICATION && !hasMultisigAccounts) return false
        return true
    }

    get formHeadline(): string {
        const { mode, hasMultisigAccounts, hasCosignatories } = this
        if (hasCosignatories) return 'this_account_is_already_converted'
        if (mode === MULTISIG_FORM_MODES.MODIFICATION && !hasMultisigAccounts) return 'this_account_is_not_a_cosignatory'
        if (mode === MULTISIG_FORM_MODES.CONVERSION) return 'Convert_to_multi_sign_account'
        if (mode === MULTISIG_FORM_MODES.MODIFICATION) return 'Edit_co_signers_and_signature_thresholds'
    }

    get initialPublicKey(): string {
        if (this.mode === MULTISIG_FORM_MODES.CONVERSION) return ''
        const { activeMultisigAccount } = this.activeAccount
        return activeMultisigAccount
            ? activeMultisigAccount
            : this.multisigPublicKeyList && this.multisigPublicKeyList[0].publicKey || ''
    }

    get lockParams(): LockParams {
        const {announceInLock, feeAmount, feeDivider} = this
        return new LockParams(announceInLock, feeAmount / feeDivider)
    }

    get validations(): {
        cosigners: string
        minApproval: string
        minRemoval: string
    } {
        const {mode} = this
        const {maxCosignatoriesPerAccount} = networkConfig

        const cosigners = mode === MULTISIG_FORM_MODES.CONVERSION
            ? `required|min_value:1|max_value:${maxCosignatoriesPerAccount}`
            : `min_value:-${maxCosignatoriesPerAccount}|max_value:${maxCosignatoriesPerAccount}`

        const minApproval = mode === MULTISIG_FORM_MODES.CONVERSION
            ? `required|min_value:1|max_value:${maxCosignatoriesPerAccount}`
            : `min_value:-${maxCosignatoriesPerAccount}|max_value:${maxCosignatoriesPerAccount}`

        const minRemoval = mode === MULTISIG_FORM_MODES.CONVERSION
            ? `required|min_value:1|max_value:${maxCosignatoriesPerAccount}`
            : `min_value:-${maxCosignatoriesPerAccount}|max_value:${maxCosignatoriesPerAccount}`

        return {
            cosigners,
            minApproval,
            minRemoval,
        }
    }

    initForm() {
        this.formItems = { ...this.defaultFormItems }
        this.formItems.multisigPublicKey = this.initialPublicKey
    }

    addModification(publicAccount: PublicAccount, addOrRemove: AddOrRemove): void {
        this.cosignatoryModifications.add({cosignatory: publicAccount, addOrRemove})
        this.cosignerToAdd = ''
    }

    addCosigner(addOrRemove: AddOrRemove) {
        const {cosignerToAdd, networkType} = this
        if (this.$validator.errors.has('cosigner') || cosignerToAdd === '') return

        if (this.cosignerToAdd.length === networkConfig.PUBLIC_KEY_LENGTH) {
            const publicAccount = PublicAccount.createFromPublicKey(cosignerToAdd, networkType)
            this.addModification(publicAccount, addOrRemove)
            return
        }

        this.addCosignerFromAddress(addOrRemove)
    }

    async addCosignerFromAddress(addOrRemove: AddOrRemove) {
        const address = Address.createFromRawAddress(this.cosignerToAdd)
        this.$store.commit('SET_LOADING_OVERLAY', {
            show: true,
            message: `resolving address ${address.pretty()}...`
        })

        new AccountHttp(this.activeAccount.node)
            .getAccountInfo(address)
            .pipe(
                timeout(6000),
                finalize(() => {
                    // @ts-ignore
                    this.$Spin.hide()
                    this.$store.commit('SET_LOADING_OVERLAY', {
                        show: false,
                        message: ''
                    })
                }))
            .subscribe(
                (accountInfo) => {
                    if (accountInfo.publicKey === EMPTY_PUBLIC_KEY) {
                        this.showErrorMessage(`${this.$t(Message.ADDRESS_UNKNOWN)}`)
                        return
                    }
                    this.addModification(accountInfo.publicAccount, addOrRemove)
                },
                (error) => {
                    this.showErrorMessage(`${this.$t(Message.ADDRESS_UNKNOWN)}`)
                },
            )
    }

    removeCosigner(index) {
        this.cosignatoryModifications.modifications.splice(index, 1)
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
        const transaction = this.mode === MULTISIG_FORM_MODES.CONVERSION
            ? this.createMultisigConversionTransaction()
            : this.getMultisigModificationTransaction()

        const {success} = await this.signAndAnnounce({
            transaction,
            store: this.$store,
            lockParams: this.lockParams,
        })

        if (success) this.initForm()
    }

    showErrorMessage(message: string) {
        this.$Notice.destroy()
        this.$Notice.error({
            title: message
        })
    }

    get modifyMultisigAccountTransaction(): MultisigAccountModificationTransaction {
        const {feeAmount, feeDivider, networkType, cosignatoryModifications} = this
        const {minApproval, minRemoval} = this.formItems

        return MultisigAccountModificationTransaction.create(
            Deadline.create(),
            parseInt(minApproval, 10),
            parseInt(minRemoval, 10),
            cosignatoryModifications.publicKeysAdditions,
            cosignatoryModifications.publicKeysDeletions,
            networkType,
            UInt64.fromUint(feeAmount / feeDivider)
        )
    }

    createMultisigConversionTransaction(): AggregateTransaction {
        const {feeAmount, feeDivider, publicKey, networkType} = this

        return createBondedMultisigTransaction(
            [this.modifyMultisigAccountTransaction],
            publicKey,
            networkType,
            feeAmount / feeDivider,
        )
    }

    getMultisigModificationTransaction(): AggregateTransaction {
        return this.announceType === ANNOUNCE_TYPES.AGGREGATE_BONDED
            ? this.getBondedModifyTransaction()
            : this.getCompleteModifyTransaction()
    }

    getBondedModifyTransaction(): AggregateTransaction {
        const {networkType, publicKey, feeAmount, feeDivider} = this

        return createBondedMultisigTransaction(
            [this.modifyMultisigAccountTransaction],
            publicKey,
            networkType,
            feeAmount / feeDivider
        )
    }

    getCompleteModifyTransaction() {
        const {networkType, feeAmount, feeDivider, publicKey} = this

        return createCompleteMultisigTransaction(
            [this.modifyMultisigAccountTransaction],
            publicKey,
            networkType,
            feeAmount / feeDivider,
        )
    }

    mounted() {
        this.initForm()
    }
}
