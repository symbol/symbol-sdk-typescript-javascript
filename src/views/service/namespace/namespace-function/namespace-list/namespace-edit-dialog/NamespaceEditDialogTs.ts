import './NamespaceEditDialog.less'
import {Message} from "@/config"
import {Account} from 'nem2-sdk'
import {walletApi} from "@/core/api/walletApi"
import {formatSeconds} from '@/core/utils/utils'
import {transactionApi} from "@/core/api/transactionApi"
import {Component, Vue, Prop, Watch} from 'vue-property-decorator'
import {createRootNamespace, decryptKey} from "@/core/utils/wallet";

@Component
export class NamespaceEditDialogTs extends Vue {
    show = false
    isCompleteForm = false
    stepIndex = 0
    durationIntoDate = 0
    namespace = {
        name: '',
        duration: 0,
        fee: 50000,
        password: ''
    }

    @Prop()
    showNamespaceEditDialog: boolean


    @Prop()
    currentNamespace: any

    get getWallet () {
        return this.$store.state.account.wallet
    }

    get generationHash () {
        return this.$store.state.account.generationHash
    }

    get node () {
        return this.$store.state.account.node
    }

    namespaceEditDialogCancel() {
        this.initForm()
        this.$emit('closeNamespaceEditDialog')
    }

    updateNamespace() {
        this.checkNamespaceForm()
    }

    changeXEMRentFee() {
        const duration = Number(this.namespace.duration)
        if (Number.isNaN(duration)) {
            this.namespace.duration = 0
            this.durationIntoDate = 0
            return
        }
        if (duration * 12 >= 60 * 60 * 24 * 365) {
            this.$Message.error(Message.DURATION_MORE_THAN_1_YEARS_ERROR)
            this.namespace.duration = 0
        }
        this.durationIntoDate = Number(formatSeconds(duration * 12))
    }
    checkInfo() {
        const {namespace} = this

        if (namespace.fee === 0) {
            this.$Notice.error({
                title: '' + this.$t(Message.INPUT_EMPTY_ERROR)
            })
            return false
        }
        if (namespace.duration === 0) {
            this.$Notice.error({
                title: '' + this.$t(Message.INPUT_EMPTY_ERROR)
            })
            return false
        }
        if (namespace.password === '') {
            this.$Notice.error({
                title: '' + this.$t(Message.INPUT_EMPTY_ERROR)
            })
            return false
        }
        return true
    }
    checkNamespaceForm() {
        if (!this.isCompleteForm) return
        if (!this.checkInfo()) return
        this.checkPrivateKey(decryptKey(this.getWallet, this.namespace.password))
    }

    checkPrivateKey (DeTxt) {
        const that = this
        walletApi.getWallet({
            name: this.getWallet.name,
            networkType: this.getWallet.networkType,
            privateKey: DeTxt.length === 64 ? DeTxt : ''
        }).then(async (Wallet: any) => {
            this.updateMosaic(DeTxt)
        }).catch(() => {
            that.$Notice.error({
                title: this.$t('password_error') + ''
            })
        })
    }
    async updateMosaic (key) {
        const that =this
        let transaction
        const account = Account.createFromPrivateKey(key, this.getWallet.networkType);
        await createRootNamespace(this.currentNamespace.name, this.namespace.duration,
            this.getWallet.networkType, this.namespace.fee).then((rootNamespaceTransaction)=>{
            transaction = rootNamespaceTransaction
            const signature = account.sign(transaction, this.generationHash)
            transactionApi.announce({signature, node: this.node}).then((announceResult) => {
                // get announce status
                announceResult.result.announceStatus.subscribe((announceInfo: any) => {
                    that.$Notice.success({
                        title: this.$t(Message.SUCCESS) + ''
                    })
                    that.initForm()
                    that.updatedNamespace()
                })
            })
        })
    }

    updatedNamespace () {
        this.show = false
        this.namespaceEditDialogCancel()
    }

    initForm () {
        this.namespace = {
            name: '',
            duration: 0,
            fee: 50000,
            password: ''
        }
        this.durationIntoDate = 0
    }

    @Watch('showNamespaceEditDialog')
    onShowNamespaceEditDialogChange() {
        this.show = this.showNamespaceEditDialog
    }

    @Watch('namespace', {immediate: true, deep: true})
    onFormItemChange() {
        const {name, duration,fee, password} = this.namespace
        // isCompleteForm
        this.isCompleteForm = name !== ''&& duration > 0 && fee > 0 && password !== ''
    }
}
