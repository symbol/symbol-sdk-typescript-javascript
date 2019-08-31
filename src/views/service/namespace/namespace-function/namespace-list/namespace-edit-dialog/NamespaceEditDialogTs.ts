import './NamespaceEditDialog.less'
import {Message, formData} from "@/config/index.ts"
import {Account} from 'nem2-sdk'
import {WalletApiRxjs} from "@/core/api/WalletApiRxjs.ts"
import {formatSeconds} from '@/core/utils/utils.ts'
import {Component, Vue, Prop, Watch} from 'vue-property-decorator'
import {createRootNamespace, decryptKey} from "@/core/utils/wallet.ts"
import {signAndAnnounceNormal} from "@/core/utils/wallet"
import {mapState} from "vuex"

@Component({
    computed: {
        ...mapState({
            activeAccount: 'account',
        })
    }
})
export class NamespaceEditDialogTs extends Vue {
    activeAccount: any
    show = false
    isCompleteForm = false
    stepIndex = 0
    durationIntoDate: string = '0'
    namespace = formData.namesapceEditForm

    @Prop({default: false})
    showNamespaceEditDialog: boolean


    @Prop({
        default: {
            name: '',
            duration: ''
        }
    })
    currentNamespace: any

    get wallet() {
        return this.activeAccount.wallet
    }

    get generationHash() {
        return this.activeAccount.generationHash
    }

    get node() {
        return this.activeAccount.node
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
            this.durationIntoDate = '0'
            return
        }
        if (duration * 12 >= 60 * 60 * 24 * 365) {
            this.$Message.error(Message.DURATION_MORE_THAN_1_YEARS_ERROR)
            this.namespace.duration = 0
        }
        this.durationIntoDate = formatSeconds(duration * 12) + ''
    }

    checkInfo() {
        const {namespace} = this
        if (namespace.password === '' || namespace.duration === 0 || namespace.fee === 0) {
            this.showErrorNotice(this.$t(Message.INPUT_EMPTY_ERROR))
            return false
        }
        return true
    }

    showErrorNotice(text) {
        this.$Notice.destroy()
        this.$Notice.error({
            title: '' + text
        })
    }

    checkNamespaceForm() {
        if (!this.isCompleteForm) return
        if (!this.checkInfo()) return
        this.checkPrivateKey(decryptKey(this.wallet, this.namespace.password))
    }

    checkPrivateKey(DeTxt) {
        const that = this
        try {
            new WalletApiRxjs().getWallet(this.wallet.name,
                DeTxt.length === 64 ? DeTxt : '',
                this.wallet.networkType,
            )
            this.updateMosaic(DeTxt)
        } catch (e) {
            that.$Notice.error({
                title: this.$t(Message.WRONG_PASSWORD_ERROR) + ''
            })
        }

    }

    async updateMosaic(key) {
        const that = this
        const {node, generationHash} = this
        const account = Account.createFromPrivateKey(key, this.wallet.networkType)
        const transaction = createRootNamespace(
            this.currentNamespace.name,
            this.namespace.duration,
            this.wallet.networkType,
            this.namespace.fee
        )
        signAndAnnounceNormal(account, node, generationHash, [transaction], this.showNotice())
        that.initForm()
        that.updatedNamespace()
    }

    showNotice() {
        this.$Notice.success({
            title: this.$t(Message.SUCCESS) + ''
        })
    }

    updatedNamespace() {
        this.show = false
        this.namespaceEditDialogCancel()
    }

    initForm() {
        this.namespace = {
            name: '',
            duration: 0,
            fee: 50000,
            password: ''
        }
        this.durationIntoDate = '0'
    }

    @Watch('showNamespaceEditDialog')
    onShowNamespaceEditDialogChange() {
        this.show = this.showNamespaceEditDialog
    }

    @Watch('namespace', {immediate: true, deep: true})
    onFormItemChange() {
        const {name, duration, fee, password} = this.namespace
        // isCompleteForm
        this.isCompleteForm = name !== '' && duration > 0 && fee > 0 && password !== ''
    }
}
