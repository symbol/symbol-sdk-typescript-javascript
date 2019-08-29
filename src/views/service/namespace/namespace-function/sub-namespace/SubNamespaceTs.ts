
import {Message, bandedNamespace as BandedNamespaceList} from "@/config/index.ts"
import {formatAddress} from '@/core/utils/utils.ts'
import {Component, Vue, Watch} from 'vue-property-decorator'
import {NamespaceApiRxjs} from "@/core/api/NamespaceApiRxjs.ts"
import CheckPWDialog from '@/common/vue/check-password-dialog/CheckPasswordDialog.vue'
import {MultisigApiRxjs} from "@/core/api/MultisigApiRxjs.ts"

@Component({
    components: {
        CheckPWDialog
    }
})
export class SubNamespaceTs extends Vue {
    durationIntoDate = 0
    multisigPublickey = ''
    isCompleteForm = false
    showCheckPWDialog = false
    otherDetails: any = {}
    transactionDetail = {}
    transactionList = []
    form = {
        rootNamespaceName: '',
        subNamespaceName: '',
        multisigPublickey: '',
        innerFee: 50000,
        bondedFee: 50000,
        lockFee: 50000,
    }
    multisigPublickeyList = [
        {
            value: 'no data',
            label: 'no data'
        },
    ]

    typeList = [
        {
            name: 'ordinary_account',
            isSelected: true
        }, {
            name: 'multi_sign_account',
            isSelected: false
        }
    ]

    get getWallet() {
        return this.$store.state.account.wallet
    }

    get generationHash() {
        return this.$store.state.account.generationHash
    }

    get node() {
        return this.$store.state.account.node
    }

    get namespaceList() {
        console.log(this.$store.state.account.namespace)
        return this.$store.state.account.namespace ? this.$store.state.account.namespace : [{
            label: 'no data',
            value: 'no data',
            levels: '0'
        }]
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

    checkForm(): boolean {
        const {rootNamespaceName, innerFee, subNamespaceName, multisigPublickey} = this.form

        if (!rootNamespaceName || !rootNamespaceName.trim()) {
            this.showErrorMessage(this.$t(Message.NAMESPACE_NULL_ERROR))
            return false
        }
        if (rootNamespaceName.length > 16) {
            this.showErrorMessage(this.$t(Message.SUB_NAMESPACE_LENGTH_LONGER_THAN_64_ERROR))
            return false
        }
        //^[a-z].*
        if (!rootNamespaceName.match(/^[a-z].*/)) {
            this.showErrorMessage(this.$t(Message.NAMESPACE_STARTING_ERROR))
            return false
        }
        //^[0-9a-zA-Z_-]*$
        if (!rootNamespaceName.match(/^[0-9a-zA-Z_-]*$/g)) {
            this.showErrorMessage(this.$t(Message.NAMESPACE_FORMAT_ERROR))
            return false
        }
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
        return new NamespaceApiRxjs().createdSubNamespace(
            this.form.subNamespaceName,
            this.form.rootNamespaceName,
            this.getWallet.networkType,
            this.form.innerFee
        )
    }

    initForm() {
        this.form = {
            rootNamespaceName: '',
            subNamespaceName: '',
            multisigPublickey: '',
            innerFee: 50000,
            bondedFee: 50000,
            lockFee: 50000,
        }
    }

    closeCheckPWDialog() {
        this.showCheckPWDialog = false
    }

    createTransaction() {
        if (!this.isCompleteForm) return
        if (!this.checkForm()) return
        const {rootNamespaceName, innerFee, subNamespaceName, multisigPublickey} = this.form
        this.transactionDetail = {
            "namespace": rootNamespaceName,
            "innerFee": innerFee,
            "sub_namespace": subNamespaceName,
            "fee": innerFee
        }
        this.transactionList = [this.createSubNamespace()]
        this.showCheckPWDialog = true
    }

    getMultisigAccountList() {
        const that = this
        if (!this.$store.state.account.wallet) return
        const {address} = this.$store.state.account.wallet
        const {node} = this.$store.state.account
        new MultisigApiRxjs().getMultisigAccountInfo(address, node).subscribe((multisigInfo) => {
            that.multisigPublickeyList = multisigInfo.multisigAccounts.map((item: any) => {
                item.value = item.publicKey
                item.label = item.publicKey
                return item
            })
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
    }

    created() {
        this.getMultisigAccountList()
    }

}
