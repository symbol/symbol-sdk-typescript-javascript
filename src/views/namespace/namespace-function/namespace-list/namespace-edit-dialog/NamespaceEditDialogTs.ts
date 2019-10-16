import './NamespaceEditDialog.less'
import {mapState} from "vuex"
import {Component, Vue, Prop, Watch} from 'vue-property-decorator'
import {Password, NamespaceRegistrationTransaction, Deadline, UInt64} from 'nem2-sdk'
import {Message, DEFAULT_FEES, FEE_GROUPS, formDataConfig} from "@/config"
import {getAbsoluteMosaicAmount,formatSeconds} from '@/core/utils'
import {AppWallet, StoreAccount, DefaultFee, AppNamespace} from "@/core/model"
import MultisigBanCover from "@/components/multisig-ban-cover/MultisigBanCover.vue"

@Component({
    computed: {
        ...mapState({
            activeAccount: 'account',
        })
    },
    components:{
        MultisigBanCover
    }
})
export class NamespaceEditDialogTs extends Vue {
    activeAccount: StoreAccount
    isCompleteForm = true
    stepIndex = 0
    durationIntoDate: string = '0'
    formItems = formDataConfig.namespaceEditForm

    @Prop({default: false})
    showNamespaceEditDialog: boolean

    @Prop()
    currentNamespace: AppNamespace

    get show() {
        return this.showNamespaceEditDialog
    }

    set show(val) {
        if (!val) {
            this.$emit('close')
        }
    }
    get wallet(): AppWallet {
        return this.activeAccount.wallet
    }

    get generationHash() {
        return this.activeAccount.generationHash
    }

    get node() {
        return this.activeAccount.node
    }

    get networkCurrency() {
        return this.activeAccount.networkCurrency
    }

    get defaultFees(): DefaultFee[] {
        return DEFAULT_FEES[FEE_GROUPS.SINGLE]
    }

    get feeAmount() {
        const {feeSpeed} = this.formItems
        const feeAmount = this.defaultFees.find(({speed})=>feeSpeed === speed).value
        return getAbsoluteMosaicAmount(feeAmount, this.networkCurrency.divisibility)
    }

    namespaceEditDialogCancel() {
        this.initForm()
        this.show = false
    }

    submit() {
        if (!this.isCompleteForm) return
        if (!this.checkInfo()) return
        this.updateMosaic()
    }

    changeXEMRentFee() {
        const duration = Number(this.formItems.duration)
        if (Number.isNaN(duration)) {
            this.formItems.duration = 0
            this.durationIntoDate = '0'
            return
        }
        if (duration * 12 >= 60 * 60 * 24 * 365) {
            this.$Message.error(Message.DURATION_MORE_THAN_1_YEARS_ERROR)
            this.formItems.duration = 0
        }
        this.durationIntoDate = formatSeconds(duration * 12) + ''
    }

    checkInfo() {
        const {formItems} = this
        if (formItems.password === '' || formItems.duration === 0) {
            this.$Notice.error({
                title: '' + this.$t(Message.INPUT_EMPTY_ERROR)
            })
            return false
        }
        if (formItems.password.length < 8) {
            this.$Notice.error({
                title: '' + this.$t('password_error')
            })
            return false
        }

        const validPassword = new AppWallet(this.wallet).checkPassword(new Password(formItems.password))

        if (!validPassword) {
            this.$Notice.error({
                title: '' + this.$t('password_error')
            })
            return false
        }
        return true
    }

    async updateMosaic() {
        const {duration} = this.formItems
        const {node, generationHash, feeAmount} = this
        const password = new Password(this.formItems.password)
        const transaction = NamespaceRegistrationTransaction
            .createRootNamespace(
                Deadline.create(),
                this.currentNamespace.name,
                UInt64.fromUint(duration),
                this.wallet.networkType,
                UInt64.fromUint(feeAmount),
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
        this.formItems = formDataConfig.namespaceEditForm
        this.durationIntoDate = '0'
    }

    @Watch('formItems', {deep: true})
    onFormItemChange() {
        const {duration, password} = this.formItems
        this.isCompleteForm = duration > 0 && password !== ''
    }
}
