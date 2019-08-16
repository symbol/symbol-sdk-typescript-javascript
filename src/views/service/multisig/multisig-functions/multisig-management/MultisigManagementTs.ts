import {Message} from "@/config"
import {Component, Vue, Watch} from 'vue-property-decorator'
import CheckPWDialog from '@/common/vue/check-password-dialog/CheckPasswordDialog.vue'
import {
    MultisigCosignatoryModificationType,
    MultisigCosignatoryModification,
    PublicAccount,
    Account,
    Listener,
    Address,
    Deadline,
    ModifyMultisigAccountTransaction,
    UInt64
} from 'nem2-sdk'
import {
    createBondedMultisigTransaction,
    createCompleteMultisigTransaction,
    multisigAccountInfo
} from "@/core/utils/wallet";
import {transactionApi} from "@/core/api/transactionApi";

@Component({
    components: {
        CheckPWDialog
    }
})
export class MultisigManagementTs extends Vue {
    isShowPanel = true
    currentPublickey = ''
    currentMinRemoval = 0
    currentMinApproval = 0
    hasAddCosigner = false
    isCompleteForm = false
    existsCosignerList = [{}]
    showCheckPWDialog = false
    currentCosignatoryList = []
    showSubpublickeyList = false
    MultisigCosignatoryModificationType = MultisigCosignatoryModificationType
    publickeyList = [{
        label: 'no data',
        value: 'no data'
    }]

    formItem = {
        minApprovalDelta: 0,
        minRemovalDelta: 0,
        bondedFee: 10000000,
        lockFee: 10000000,
        innerFee: 10000000,
        cosignerList: [],
        multisigPublickey: ''
    }


    addCosigner(flag) {
        const {currentPublickey} = this
        if (!currentPublickey || !currentPublickey.trim()) {
            this.showErrorMessage(this.$t(Message.INPUT_EMPTY_ERROR) + '')
            return
        }
        this.formItem.cosignerList.push({
            publickey: currentPublickey,
            type: flag
        })
        this.currentPublickey = ''
    }

    removeCosigner(index) {
        this.formItem.cosignerList.splice(index, 1)
    }

    closeCheckPWDialog() {
        this.showCheckPWDialog = false
    }

    confirmInput() {
        if (!this.isCompleteForm) return
        if (!this.checkForm()) return
        this.showCheckPWDialog = true
    }


    createCompleteModifyTransaction(privatekey) {
        const {multisigPublickey, cosignerList, innerFee, minApprovalDelta, minRemovalDelta} = this.formItem
        const {networkType} = this.$store.state.account.wallet
        const {generationHash, node} = this.$store.state.account
        const account = Account.createFromPrivateKey(privatekey, networkType)
        const multisigCosignatoryModificationList = cosignerList.map(cosigner => new MultisigCosignatoryModification(
            cosigner.type,
            PublicAccount.createFromPublicKey(cosigner.publickey, networkType),
        ))
        const modifyMultisigAccountTx = ModifyMultisigAccountTransaction.create(
            Deadline.create(),
            Number(minApprovalDelta),
            Number(minRemovalDelta),
            multisigCosignatoryModificationList,
            networkType,
            UInt64.fromUint(innerFee)
        )
        createCompleteMultisigTransaction(
            [modifyMultisigAccountTx],
            multisigPublickey,
            networkType,
            innerFee,
        ).then((aggregateTransaction) => {
            transactionApi._announce({
                transaction: aggregateTransaction,
                account,
                node,
                generationHash
            })
        })
    }

    createBondedModifyTransaction(privatekey) {
        const {cosignerList, bondedFee, lockFee, innerFee, minApprovalDelta, minRemovalDelta} = this.formItem
        const {networkType} = this.$store.state.account.wallet
        const {generationHash, node} = this.$store.state.account
        const account = Account.createFromPrivateKey(privatekey, networkType)
        const multisigCosignatoryModificationList = cosignerList.map(cosigner => new MultisigCosignatoryModification(
            cosigner.type,
            PublicAccount.createFromPublicKey(cosigner.publickey, networkType),
        ))
        const listener = new Listener(node.replace('http', 'ws'), WebSocket)
        const modifyMultisigAccountTransaction = ModifyMultisigAccountTransaction.create(
            Deadline.create(),
            Number(minApprovalDelta),
            Number(minRemovalDelta),
            multisigCosignatoryModificationList,
            networkType,
            UInt64.fromUint(innerFee)
        );
        createBondedMultisigTransaction(
            [modifyMultisigAccountTransaction],
            account.publicKey,
            networkType,
            account, bondedFee
        ).then((aggregateTransaction) => {
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


    checkEnd(privatekey) {
        const {hasAddCosigner} = this
        const {cosignerList} = this.formItem
        if (this.currentMinApproval == 0) {
            return
        }
        if (this.currentMinApproval > 1 || hasAddCosigner) {
            console.log('bonded')
            this.createBondedModifyTransaction(privatekey);
            return
        }
        console.log('complete')
        this.createCompleteModifyTransaction(privatekey);
        return

    }


    showErrorMessage(message: string) {
        this.$Notice.destroy()
        this.$Notice.error({
            title: message
        })
    }

    checkForm(): boolean {
        const {multisigPublickey, cosignerList, bondedFee, lockFee, innerFee, minApprovalDelta, minRemovalDelta} = this.formItem
        const {currentMinApproval, currentMinRemoval} = this

        if ((!Number(minRemovalDelta) && Number(minRemovalDelta) !== 0) || Number(minRemovalDelta) + currentMinRemoval < 1) {
            this.showErrorMessage(this.$t(Message.MIN_REMOVAL_LESS_THAN_0_ERROR) + '')
            return false
        }

        if ((!Number(minApprovalDelta) && Number(minApprovalDelta) !== 0) || Number(minApprovalDelta) + currentMinApproval < 1) {
            this.showErrorMessage(this.$t(Message.MIN_APPROVAL_LESS_THAN_0_ERROR) + '')
            return false
        }

        if (Number(minApprovalDelta) + currentMinApproval > 10) {
            this.showErrorMessage(this.$t(Message.MAX_APPROVAL_MORE_THAN_10_ERROR) + '')
            return false
        }

        if (Number(minRemovalDelta) + currentMinRemoval > 10) {
            this.showErrorMessage(this.$t(Message.MAX_REMOVAL_MORE_THAN_10_ERROR) + '')
            return false
        }

        if (multisigPublickey.length !== 64) {
            this.$Notice.error({title: this.$t(Message.ILLEGAL_PUBLICKEY_ERROR) + ''})
            return false;
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

        if (cosignerList.length < 1) {
            return true
        }
        const publickeyFlag = cosignerList.every((item) => {
            if (item.type == MultisigCosignatoryModificationType.Add) {
                this.hasAddCosigner = true
            }

            if (item.publickey.trim().length !== 64) {
                this.$Notice.error({title: this.$t(Message.ILLEGAL_PUBLICKEY_ERROR) + ''})
                return false;
            }
            return true;
        });
        return publickeyFlag
    }

    async getMultisigAccountList() {
        const that = this
        const {address} = this.$store.state.account.wallet
        const {node} = this.$store.state.account
        const multisigInfo = await multisigAccountInfo(address, node)
        if (multisigInfo['multisigAccounts'].length == 0) {
            that.isShowPanel = false
            return
        }
        that.publickeyList = multisigInfo['multisigAccounts'].map((item) => {
            item.value = item.publicKey
            item.label = item.publicKey
            return item
        })
    }

    @Watch('formItem.multisigPublickey')
    async onMultisigPublickeyChange() {
        const that = this
        const {multisigPublickey} = this.formItem
        if (multisigPublickey.length !== 64) {
            return
        }
        const {networkType} = this.$store.state.account.wallet
        const {node} = this.$store.state.account
        let address = Address.createFromPublicKey(multisigPublickey, networkType)['address']
        const multisigInfo = await multisigAccountInfo(address, node)
        that.existsCosignerList = multisigInfo['cosignatories'].map((item) => {
            item.value = item.publicKey
            item.label = item.publicKey
            return item
        })
        that.currentMinApproval = multisigInfo['minApproval']
        that.currentMinRemoval = multisigInfo['minRemoval']
        that.currentCosignatoryList = multisigInfo['cosignatories']
    }

    @Watch('formItem', {immediate: true, deep: true})
    onFormItemChange() {
        const {multisigPublickey, cosignerList, bondedFee, lockFee, innerFee, minApprovalDelta, minRemovalDelta} = this.formItem
        // isCompleteForm
        this.isCompleteForm = multisigPublickey.length === 64 && cosignerList.length !== 0 && bondedFee + '' !== '' && lockFee + '' !== '' && innerFee + '' !== '' && minApprovalDelta + '' !== '' && minRemovalDelta + '' !== ''
    }

    created() {
        this.getMultisigAccountList()
    }
}
