import {
    MultisigCosignatoryModification,
    MultisigCosignatoryModificationType,
    PublicAccount,
    ModifyMultisigAccountTransaction, Deadline, UInt64, MultisigAccountInfo,
} from 'nem2-sdk'
import {mapState} from "vuex"
import {Component, Vue, Watch} from 'vue-property-decorator'
import {Message, formDataConfig,DEFAULT_FEES, FEE_GROUPS, defaultNetworkConfig} from "@/config/index.ts"
import CheckPWDialog from '@/common/vue/check-password-dialog/CheckPasswordDialog.vue'
import {createBondedMultisigTransaction, StoreAccount, DefaultFee, AppWallet} from "@/core/model"
import {getAbsoluteMosaicAmount, formatAddress} from "@/core/utils"

@Component({
    components: {
        CheckPWDialog
    },
    computed: {
        ...mapState({
            activeAccount: 'account',
        })
    }
})
export class MultisigConversionTs extends Vue {
    activeAccount: StoreAccount
    currentAddress = ''
    isCompleteForm = false
    showCheckPWDialog = false
    transactionDetail = {}
    otherDetails = {}
    transactionList = []
    formItems = formDataConfig.multisigConversionForm
    XEM: string = defaultNetworkConfig.XEM
    formatAddress = formatAddress

    get wallet(): AppWallet {
        return this.activeAccount.wallet
    }

    get publicKey() {
        return this.activeAccount.wallet.publicKey
    }

    get currentXEM1() {
        return this.activeAccount.currentXEM1
    }

    get networkType() {
        return this.activeAccount.wallet.networkType
    }

    get multisigInfo(): MultisigAccountInfo {
        const {address} = this.wallet
        return this.activeAccount.multisigAccountInfo[address]
    }

    get isMultisig(): boolean {
        if (!this.multisigInfo) return false
        return this.multisigInfo.cosignatories.length > 0
    }

    get address(): string {
        return this.activeAccount.wallet.address
    }

    get xemDivisibility(): number {
        return this.activeAccount.xemDivisibility
    }

    get node(): string {
        return this.activeAccount.node
    }

    get defaultFees(): DefaultFee[] {
        return DEFAULT_FEES[FEE_GROUPS.TRIPLE]
    }

    get announceInLock(): boolean {
        return true
    }

    get feeAmount(): number {
        const {feeSpeed} = this.formItems
        const feeAmount = this.defaultFees.find(({speed})=>feeSpeed === speed).value
        return getAbsoluteMosaicAmount(feeAmount, this.xemDivisibility)
    }

    get feeDivider(): number {
        return 3
    }

    initForm() {
        this.formItems = formDataConfig.multisigConversionForm
    }

    addAddress() {
        const {currentAddress} = this
        if (!currentAddress || !currentAddress.trim()) {
            this.showErrorMessage(this.$t(Message.INPUT_EMPTY_ERROR) + '')
            return
        }
        this.formItems.publicKeyList.push(currentAddress)
        this.currentAddress = ''
    }

    deleteAddress(index) {
        this.formItems.publicKeyList.splice(index, 1)
    }

    confirmInput() {
        // check input data
        if (!this.isCompleteForm) return
        if (!this.checkForm()) return
        const {address} = this.wallet
        const {publicKeyList, minApproval, minRemoval} = this.formItems
        const {feeAmount} = this
        this.transactionDetail = {
            "address": address,
            "min_approval": minApproval,
            "min_removal": minRemoval,
            "cosigner": publicKeyList.join(','),
            "fee": feeAmount / Math.pow(10, this.xemDivisibility)
        }
        this.otherDetails = {
            lockFee: feeAmount
        }
        this.sendMultisigConversionTransaction()
        this.initForm()
        this.showCheckPWDialog = true
    }

    showErrorMessage(message: string) {
        this.$Notice.destroy()
        this.$Notice.error({
            title: message
        })
    }

    checkForm(): boolean {
        let {publicKeyList, minApproval, minRemoval} = this.formItems
        if (publicKeyList.length < 1) {
            this.showErrorMessage(this.$t(Message.CO_SIGNER_NULL_ERROR) + '')
            return false
        }

        if ((!Number(minApproval) && Number(minApproval) !== 0) || Number(minApproval) < 1) {
            this.showErrorMessage(this.$t(Message.MIN_APPROVAL_LESS_THAN_0_ERROR) + '')
            return false
        }

        if ((!Number(minRemoval) && Number(minRemoval) !== 0) || Number(minRemoval) < 1) {
            this.showErrorMessage(this.$t(Message.MIN_REMOVAL_LESS_THAN_0_ERROR) + '')
            return false
        }

        if (Number(minApproval) > 10) {
            this.showErrorMessage(this.$t(Message.MAX_APPROVAL_MORE_THAN_10_ERROR) + '')
            return false
        }

        if (Number(minRemoval) > 10) {
            this.showErrorMessage(this.$t(Message.MAX_REMOVAL_MORE_THAN_10_ERROR) + '')
            return false
        }

        const publicKeyFlag = publicKeyList.every((item) => {
            if (item.trim().length !== 64) {
                this.showErrorMessage(this.$t(Message.ILLEGAL_PUBLIC_KEY_ERROR) + '')
                return false
            }
            return true
        })
        return publicKeyFlag
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
    }

    sendMultisigConversionTransaction() {
        // here lock fee should be relative param
        let {publicKeyList, minApproval, minRemoval} = this.formItems
        const {feeAmount} = this
        const bondedFee = feeAmount/3
        const innerFee = feeAmount/3
        const {networkType, publicKey} = this
        const multisigCosignatoryModificationList = publicKeyList.map(cosigner => new MultisigCosignatoryModification(
            MultisigCosignatoryModificationType.Add,
            PublicAccount.createFromPublicKey(cosigner, networkType),
        ))

        const modifyMultisigAccountTransaction = ModifyMultisigAccountTransaction.create(
            Deadline.create(),
            minApproval,
            minRemoval,
            multisigCosignatoryModificationList,
            networkType,
            UInt64.fromUint(innerFee)
        )
        console.log(modifyMultisigAccountTransaction, 'modifyMultisigAccountTransaction')
        const aggregateTransaction = createBondedMultisigTransaction(
            [modifyMultisigAccountTransaction],
            publicKey,
            networkType,
            bondedFee,
        )
        this.otherDetails = {
            lockFee: feeAmount/3
        }
        this.transactionList = [aggregateTransaction]
    }

    @Watch('formItems', {immediate: true, deep: true})
    onFormItemChange() {
        const {publicKeyList, minApproval, minRemoval} = this.formItems
        const {feeAmount} = this
        // isCompleteForm
        this.isCompleteForm = publicKeyList.length !== 0 && minApproval + '' !== '' && minRemoval + '' !== '' && feeAmount + '' !== ''
        return
    }
}
