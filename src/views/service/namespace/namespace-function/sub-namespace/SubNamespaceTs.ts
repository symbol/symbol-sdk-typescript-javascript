import {Message, bandedNamespace as BandedNamespaceList, subNamespaceTypeList} from "@/config/index.ts"
import {formatAddress} from '@/core/utils/utils.ts'
import {getNamespaces} from '@/core/utils/wallet.ts'
import {Component, Vue, Watch} from 'vue-property-decorator'
import {NamespaceApiRxjs} from "@/core/api/NamespaceApiRxjs.ts"
import CheckPWDialog from '@/common/vue/check-password-dialog/CheckPasswordDialog.vue'
import {MultisigApiRxjs} from "@/core/api/MultisigApiRxjs.ts"
import {Address} from "nem2-sdk"
import {createBondedMultisigTransaction, createCompleteMultisigTransaction} from "@/core/utils/wallet"
import {mapState} from "vuex"
import {getAbsoluteMosaicAmount} from "@/core/utils/utils"

@Component({
    components: {
        CheckPWDialog
    },
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app'
        })
    }
})
export class SubNamespaceTs extends Vue {
    activeAccount: any
    app: any
    durationIntoDate = 0
    isCompleteForm = true
    showCheckPWDialog = false
    otherDetails: any = {}
    transactionDetail = {}
    multisigNamespaceList = []
    transactionList = []
    currentMinApproval = -1
    form = {
        rootNamespaceName: '',
        subNamespaceName: '',
        multisigPublickey: '',
        innerFee: 50000,
        aggregateFee: 50000,
        lockFee: 50000,
    }
    multisigPublickeyList = []
    typeList = subNamespaceTypeList

    get wallet() {
        return this.activeAccount.wallet
    }

    get generationHash() {
        return this.activeAccount.generationHash
    }

    get node() {
        return this.activeAccount.node
    }

    get address() {
        return this.activeAccount.wallet.address
    }

    get namespaceList() {
        return this.activeAccount.namespace ? this.activeAccount.namespace : []
    }

    get xemDivisibility() {
        return this.activeAccount.xemDivisibility
    }

    formatAddress(address) {
        return formatAddress(address)
    }

    switchType(index) {
        let list = this.typeList
        list = list.map((item) => {
            item.isSelected = false
            return item
        })
        list[index].isSelected = true
        this.typeList = list
    }

    async checkEnd(isPasswordRight) {
        if (!isPasswordRight) {
            this.$Notice.destroy()
            this.$Notice.error({
                title: this.$t(Message.WRONG_PASSWORD_ERROR) + ''
            })
        }
    }

    showErrorMessage(message) {
        this.$Notice.destroy()
        this.$Notice.error({
            title: message
        })
    }

    createByMultisig() {
        const that = this
        let {aggregateFee, multisigPublickey} = this.form
        const {networkType} = this.wallet
        const {xemDivisibility} = this
        const rootNamespaceTransaction = this.createSubNamespace()
        aggregateFee = getAbsoluteMosaicAmount(aggregateFee, xemDivisibility)
        if (that.currentMinApproval > 1) {
            const aggregateTransaction = createBondedMultisigTransaction(
                [rootNamespaceTransaction],
                multisigPublickey,
                networkType,
                aggregateFee
            )

            this.transactionList = [aggregateTransaction]
            return
        }
        const aggregateTransaction = createCompleteMultisigTransaction(
            [rootNamespaceTransaction],
            multisigPublickey,
            networkType,
            aggregateFee
        )
        this.transactionList = [aggregateTransaction]
    }

    checkForm(): boolean {
        const {rootNamespaceName, innerFee, subNamespaceName} = this.form

        if (!rootNamespaceName || !rootNamespaceName.trim()) {
            this.showErrorMessage(this.$t(Message.NAMESPACE_NULL_ERROR))
            return false
        }
        // if (rootNamespaceName.length > 16) {
        //     this.showErrorMessage(this.$t(Message.SUB_NAMESPACE_LENGTH_LONGER_THAN_64_ERROR))
        //     return false
        // }
        //^[a-z].*
        // if (!rootNamespaceName.match(/^[a-z].*/)) {
        //     this.showErrorMessage(this.$t(Message.NAMESPACE_STARTING_ERROR))
        //     return false
        // }
        //^[0-9a-zA-Z_-]*$
        // if (!rootNamespaceName.match(/^[0-9a-zA-Z_-]*$/g)) {
        //     this.showErrorMessage(this.$t(Message.NAMESPACE_FORMAT_ERROR))
        //     return false
        // }
        if (!subNamespaceName || !subNamespaceName.trim()) {
            this.showErrorMessage(this.$t(Message.NAMESPACE_NULL_ERROR))
            return false
        }
        if (subNamespaceName.length > 64) {
            this.showErrorMessage(this.$t(Message.SUB_NAMESPACE_LENGTH_LONGER_THAN_64_ERROR))
            return false
        }
        //^[a-z].*
        if (!subNamespaceName.match(/^[a-z].*/)) {
            this.showErrorMessage(this.$t(Message.NAMESPACE_STARTING_ERROR))
            return false
        }
        //^[0-9a-zA-Z_-]*$
        if (!subNamespaceName.match(/^[0-9a-zA-Z_-]*$/g)) {
            this.showErrorMessage(this.$t(Message.NAMESPACE_FORMAT_ERROR))
            return false
        }
        if ((!Number(innerFee) && Number(innerFee) !== 0) || Number(innerFee) < 0) {
            this.showErrorMessage(this.$t(Message.FEE_LESS_THAN_0_ERROR))
            return false
        }

        //BandedNamespaceList
        const subflag = BandedNamespaceList.every((item) => {
            if (item == subNamespaceName) {
                this.showErrorMessage(this.$t(Message.NAMESPACE_USE_BANDED_WORD_ERROR))
                return false
            }
            return true
        })
        return subflag
    }

    createSubNamespace() {
        let {rootNamespaceName, subNamespaceName, innerFee} = this.form
        const {xemDivisibility} = this
        innerFee = getAbsoluteMosaicAmount(innerFee, xemDivisibility)
        const {networkType} = this.wallet
        return new NamespaceApiRxjs().createdSubNamespace(
            subNamespaceName,
            rootNamespaceName,
            networkType,
            innerFee
        )
    }

    initForm() {
        this.form = {
            rootNamespaceName: '',
            subNamespaceName: '',
            multisigPublickey: '',
            innerFee: 50000,
            aggregateFee: 50000,
            lockFee: 50000,
        }
    }

    closeCheckPWDialog() {
        this.showCheckPWDialog = false
    }

    createTransaction() {
        if (!this.isCompleteForm) return
        if (!this.checkForm()) return
        const {rootNamespaceName, innerFee, subNamespaceName} = this.form
        this.transactionDetail = {
            "namespace": rootNamespaceName,
            "innerFee": innerFee,
            "sub_namespace": subNamespaceName,
            "fee": innerFee
        }
        if (this.typeList[0].isSelected) {
            this.createBySelf()
        } else {
            this.createByMultisig()
        }
        this.showCheckPWDialog = true
    }

    createBySelf() {
        let transaction = this.createSubNamespace()
        this.transactionList = [transaction]
    }

    getMultisigAccountList() {
        const that = this
        if (!this.wallet) return
        const {address, node} = this
        new MultisigApiRxjs().getMultisigAccountInfo(address, node).subscribe((multisigInfo) => {
            that.multisigPublickeyList = multisigInfo.multisigAccounts.map((item: any) => {
                item.value = item.publicKey
                item.label = item.publicKey
                return item
            })
        })
    }

    @Watch('form.multisigPublickey')
    async onMultisigPublickeyChange() {
        const {node} = this
        const {networkType} = this.wallet
        const {multisigPublickey} = this.form
        const address = Address.createFromPublicKey(multisigPublickey, networkType).toDTO().address
        if (multisigPublickey.length !== 64) {
            return
        }
        this.multisigNamespaceList = await getNamespaces(address, node)

        const that = this
        new MultisigApiRxjs().getMultisigAccountInfo(address, node).subscribe((multisigInfo) => {
            that.currentMinApproval = multisigInfo.minApproval
        })

    }


    @Watch('form', {immediate: true, deep: true})
    onFormItemChange() {
        const {rootNamespaceName, innerFee, subNamespaceName, multisigPublickey} = this.form

        // isCompleteForm
        if (this.typeList[0].isSelected) {
            this.isCompleteForm = innerFee + '' !== '' && rootNamespaceName !== '' && subNamespaceName !== ''
            return
        }
        this.isCompleteForm = innerFee + '' !== '' && rootNamespaceName !== '' && subNamespaceName !== '' && multisigPublickey && multisigPublickey.length === 64
        this.isCompleteForm = true
    }

    created() {
        this.getMultisigAccountList()
    }

}
