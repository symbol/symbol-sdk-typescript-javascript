import {Account} from "nem2-sdk"
import {Message} from "@/config/index"
import {formatAddress} from '@/help/help'
import {Component, Vue, Watch} from 'vue-property-decorator'
import {aliasInterface} from "@/interface/sdkNamespace"
import {transactionInterface} from "@/interface/sdkTransaction"
import {bandedNamespace as BandedNamespaceList} from '@/config/index'
import CheckPWDialog from '@/common/vue/check-password-dialog/CheckPasswordDialog.vue'

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
    form = {
        rootNamespaceName: '',
        subNamespaceName: '',
        multisigPublickey: '',
        maxFee: 50000
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
        return !this.$store.state.account.namespace || !this.$store.state.account.namespace.length ? [{
            label: 'no data',
            value: 'no data',
            levels: '0'
        }] : this.$store.state.account.namespace.length
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

    async checkEnd(key) {
        let transaction;
        const that = this;
        const account = Account.createFromPrivateKey(key, this.getWallet.networkType);

        await this.createSubNamespace().then((subNamespaceTransaction) => {
            transaction = subNamespaceTransaction
        })
        const signature = account.sign(transaction, this.generationHash)
        transactionInterface.announce({signature, node: this.node}).then((announceResult) => {
            // get announce status
            announceResult.result.announceStatus.subscribe((announceInfo: any) => {
                that.$emit('createdNamespace')
                that.$Notice.success({
                    title: this.$t(Message.SUCCESS) + ''
                })
                that.initForm()
            })
        })
    }

    showErrorMessage(message) {
        this.$Notice.destroy()
        this.$Notice.error({
            title: message
        })
    }

    checkForm(): boolean {
        const {rootNamespaceName, maxFee, subNamespaceName, multisigPublickey} = this.form

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
        if ((!Number(maxFee) && Number(maxFee) !== 0) || Number(maxFee) < 0) {
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
        return aliasInterface.createdSubNamespace({
            parentNamespace: this.form.rootNamespaceName,
            namespaceName: this.form.subNamespaceName,
            networkType: this.getWallet.networkType,
            maxFee: this.form.maxFee
        }).then((transaction) => {
            return transaction.result.subNamespaceTransaction
        })
    }

    initForm() {
        this.form = {
            rootNamespaceName: '',
            subNamespaceName: '',
            multisigPublickey: '',
            maxFee: 50000
        }
    }

    closeCheckPWDialog() {
        this.showCheckPWDialog = false
    }

    createTransaction() {
        if (!this.checkForm()) return
        this.showCheckPWDialog = true
    }

    @Watch('form', {immediate: true, deep: true})
    onFormItemChange() {
        const {rootNamespaceName, maxFee, subNamespaceName, multisigPublickey} = this.form

        // isCompleteForm
        if (this.typeList[0].isSelected) {
            this.isCompleteForm = maxFee + '' !== '' && rootNamespaceName !== '' && subNamespaceName !== ''
            return
        }
        this.isCompleteForm = maxFee + '' !== '' && rootNamespaceName !== '' && subNamespaceName !== '' && multisigPublickey && multisigPublickey.length === 64
    }


}
