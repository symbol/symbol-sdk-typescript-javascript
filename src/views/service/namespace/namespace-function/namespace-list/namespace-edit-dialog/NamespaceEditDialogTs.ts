import './NamespaceEditDialog.less'
import {mapState} from "vuex"
import {Component, Vue, Prop, Watch} from 'vue-property-decorator'
import {Password} from 'nem2-sdk'
import {Message} from "@/config/index.ts"
import {getAbsoluteMosaicAmount,formatSeconds} from '@/core/utils'
import {formDataConfig} from "@/config/view/form";
import {AppWallet} from "@/core/model"
import {createRootNamespace} from "@/core/services/namespace"

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
    namespace = formDataConfig.namesapceEditForm

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

    get xemDivisibility() {
        return this.activeAccount.xemDivisibility
    }

    namespaceEditDialogCancel() {
        this.initForm()
        this.$emit('closeNamespaceEditDialog')
    }

    submit() {
        if (!this.isCompleteForm) return
        if (!this.checkInfo()) return
        this.updateMosaic()
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
            this.$Notice.error({
                title: '' + this.$t(Message.INPUT_EMPTY_ERROR)
            })
            return false
        }
        if (namespace.password.length < 8) {
            this.$Notice.error({
                title: '' + this.$t('password_error')
            })
            return false
        }

        const validPassword = new AppWallet(this.wallet).checkPassword(new Password(namespace.password))

        if (!validPassword) {
            this.$Notice.error({
                title: '' + this.$t('password_error')
            })
            return false
        }
        return true
    }

    async updateMosaic() {
        let {fee, duration} = this.namespace
        const {node, generationHash, xemDivisibility} = this
        const password = new Password(this.namespace.password)
        fee = getAbsoluteMosaicAmount(fee, xemDivisibility)
        const transaction = createRootNamespace(
            this.currentNamespace.name,
            duration,
            this.wallet.networkType,
            fee
        )
        new AppWallet(this.wallet)
            .signAndAnnounceNormal(password, node, generationHash, [transaction], this)
        this.initForm()
        this.updatedNamespace()
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
