import {Message} from "@/config"
import {Component, Vue, Watch} from 'vue-property-decorator'
import {multisigApi} from '@/core/api/multisigApi'
import {transactionApi} from '@/core/api/transactionApi'
import CheckPWDialog from '@/common/vue/check-password-dialog/CheckPasswordDialog.vue'
import {
    Account,
    Listener,
    MultisigCosignatoryModification,
    MultisigCosignatoryModificationType,
    PublicAccount,
    ModifyMultisigAccountTransaction, Deadline, UInt64
} from 'nem2-sdk';
import {createBondedMultisigTransaction} from "@/core/utils/wallet";

@Component({
    components: {
        CheckPWDialog
    }
})
export class MultisigConversionTs extends Vue {

    currentAddress = ''
    isMultisig = false
    isCompleteForm = false
    showCheckPWDialog = false
    transactionDetail = {}
    formItem = {
        publickeyList: [],
        minApproval: 1,
        minRemoval: 1,
        bondedFee: 10000000,
        lockFee: 10000000,
        innerFee: 10000000
    }

    get getWallet() {
        return this.$store.state.account.wallet
    }

    addAddress() {
        const {currentAddress} = this
        if (!currentAddress || !currentAddress.trim()) {
            this.showErrorMessage(this.$t(Message.INPUT_EMPTY_ERROR) + '')
            return
        }
        this.formItem.publickeyList.push(currentAddress)
        this.currentAddress = ''
    }

    deleteAdress(index) {
        this.formItem.publickeyList.splice(index, 1)
    }

    confirmInput() {
        // check input data
        if (!this.isCompleteForm) return
        if (!this.checkForm()) return
        const {address} = this.getWallet
        const {publickeyList, minApproval, minRemoval, bondedFee, lockFee, innerFee} = this.formItem
        this.transactionDetail = {
            "address": address,
            "min_approval": minApproval,
            "min_removal": minRemoval,
            "cosigner": publickeyList.join(','),
            "fee": innerFee

        }
        this.showCheckPWDialog = true
    }

    showErrorMessage(message: string) {
        this.$Notice.destroy()
        this.$Notice.error({
            title: message
        })
    }

    checkForm(): boolean {
        const {publickeyList, minApproval, minRemoval, bondedFee, lockFee, innerFee} = this.formItem

        if (publickeyList.length < 1) {
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
        if ((!Number(innerFee) && Number(innerFee) !== 0) || Number(innerFee) < 0) {
            this.showErrorMessage(this.$t(Message.FEE_LESS_THAN_0_ERROR) + '')
            return false
        }

        if ((!Number(bondedFee) && Number(bondedFee) !== 0) || Number(bondedFee) < 0) {
            this.showErrorMessage(this.$t(Message.FEE_LESS_THAN_0_ERROR) + '')
            return false
        }

        if ((!Number(lockFee) && Number(lockFee) !== 0) || Number(lockFee) < 0) {
            this.showErrorMessage(this.$t(Message.FEE_LESS_THAN_0_ERROR) + '')
            return false
        }

        const publickeyFlag = publickeyList.every((item) => {
            if (item.trim().length !== 64) {
                this.showErrorMessage(this.$t(Message.ILLEGAL_PUBLICKEY_ERROR) + '')
                return false;
            }
            return true;
        });
        return publickeyFlag
    }

    closeCheckPWDialog() {
        this.showCheckPWDialog = false
    }

    checkEnd(privatekey) {
        this.sendMultisignConversionTransaction(privatekey)
    }

    getMultisigAccountList() {
        const that = this
        const {address} = this.$store.state.account.wallet
        const {node} = this.$store.state.account

        multisigApi.getMultisigAccountInfo({
            address,
            node
        }).then((result) => {
            if (result.result.multisigInfo.cosignatories.length !== 0) {
                that.isMultisig = true
            }
        }).catch(e => console.log(e))
    }

    sendMultisignConversionTransaction(privatekey) {
        const {publickeyList, minApproval, minRemoval, lockFee, bondedFee, innerFee} = this.formItem
        const {networkType} = this.$store.state.account.wallet
        const {generationHash, node} = this.$store.state.account
        const account = Account.createFromPrivateKey(privatekey, networkType)
        const listener = new Listener(node.replace('http', 'ws'), WebSocket)
        const multisigCosignatoryModificationList = publickeyList.map(cosigner => new MultisigCosignatoryModification(
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
        );
        createBondedMultisigTransaction(
            [modifyMultisigAccountTransaction],
            account.publicKey,
            networkType,
            account,
            bondedFee,
        ).then(aggregateTransaction => {
            transactionApi.announceBondedWithLock({
                aggregateTransaction,
                account,
                listener,
                node,
                generationHash,
                networkType,
                fee: lockFee
            })
        })
    }

    @Watch('formItem', {immediate: true, deep: true})
    onFormItemChange() {
        const {publickeyList, minApproval, minRemoval, bondedFee, lockFee, innerFee} = this.formItem
        // isCompleteForm
        this.isCompleteForm = publickeyList.length !== 0 && minApproval + '' !== '' && minRemoval + '' !== '' && innerFee + '' !== '' && bondedFee + '' !== '' && lockFee + '' !== ''
        return
    }


    created() {
        this.getMultisigAccountList()
    }
}
