import './NamespaceRegistration.less'
import {mapState} from "vuex"
import {Component, Vue, Prop, Provide, Watch} from 'vue-property-decorator'
import {NamespaceRegistrationTransaction, Deadline, UInt64} from 'nem2-sdk'
import {DEFAULT_FEES, FEE_GROUPS, formDataConfig, networkConfig} from "@/config"
import {getAbsoluteMosaicAmount, cloneData, formatNumber, durationToRelativeTime} from '@/core/utils'
import {AppWallet, StoreAccount, DefaultFee, AppNamespace, AppInfo, NamespaceExpirationInfo} from "@/core/model"
import {signAndAnnounce} from '@/core/services'
import {validation} from '@/core/validation'
import DisabledForms from "@/components/disabled-forms/DisabledForms.vue"
import ErrorTooltip from '@/components/other/forms/errorTooltip/ErrorTooltip.vue'
import NumberFormatting from '@/components/number-formatting/NumberFormatting.vue'

const {namespaceGracePeriodDuration} = networkConfig

@Component({
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app',
        })
    },
    components: {DisabledForms, NumberFormatting,ErrorTooltip}
})
export class NamespaceRegistrationTs extends Vue {
    @Provide() validator: any = this.$validator
    activeAccount: StoreAccount
    app: AppInfo
    signAndAnnounce = signAndAnnounce
    namespaceGracePeriodDuration = namespaceGracePeriodDuration
    formatNumber = formatNumber
    validation = validation
    formItems = cloneData(formDataConfig.namespaceEditForm)

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

    get networkCurrency() {
        return this.activeAccount.networkCurrency
    }

    get defaultFees(): DefaultFee[] {
        return DEFAULT_FEES[FEE_GROUPS.SINGLE]
    }

    get feeAmount() {
        const {feeSpeed} = this.formItems
        const feeAmount = this.defaultFees.find(({speed}) => feeSpeed === speed).value
        return getAbsoluteMosaicAmount(feeAmount, this.networkCurrency.divisibility)
    }

    get transaction(): NamespaceRegistrationTransaction {
        const {duration} = this.formItems
        const {feeAmount} = this

        return NamespaceRegistrationTransaction
            .createRootNamespace(
                Deadline.create(),
                this.currentNamespace.name,
                UInt64.fromUint(duration),
                this.wallet.networkType,
                UInt64.fromUint(feeAmount),
            )
    }

    get currentHeight(): number {
        return this.app.NetworkProperties.height
    }

    get expirationInfo(): NamespaceExpirationInfo {
        return this.currentNamespace.expirationInfo(this.currentHeight)
    }

    get newExpirationBlock(): number {
        const {endHeight} = this.currentNamespace
        const expirationHeight = endHeight - namespaceGracePeriodDuration
        const {duration} = this.formItems
        const _duration = parseInt(duration, 10)
        if (isNaN(_duration)) return expirationHeight
        const expirationBlock = expirationHeight + _duration
        return isNaN(expirationBlock) ? expirationHeight : expirationBlock
    }

    get newExpiresIn(): string {
        const duration = this.newExpirationBlock - this.currentHeight
        return durationToRelativeTime(duration)
    }

    async confirmViaTransactionConfirmation() {
        try {
            this.show = false;

            this.signAndAnnounce({
                transaction: this.transaction,
                store: this.$store,
            })
        } catch (error) {
            console.error("NamespaceEditDialogTs -> confirmViaTransactionConfirmation -> error", error)
        }
    }

    submit() {
        this.$validator
            .validate()
            .then((valid) => {
                if (!valid) return
                this.confirmViaTransactionConfirmation()
            })
    }

    @Watch('newExpirationBlock', {immediate: true})
    onSelectedMosaicHexChange() {
        /** Makes newSupply validation reactive */
        this.$validator.validate('newDuration', this.newExpirationBlock).catch(e => e)
    }
}
