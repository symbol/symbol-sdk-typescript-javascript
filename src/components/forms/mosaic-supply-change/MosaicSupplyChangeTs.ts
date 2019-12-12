import {Component, Vue, Prop, Provide, Watch} from 'vue-property-decorator'
import {mapState} from "vuex"
import {MosaicSupplyChangeTransaction, Deadline, UInt64, MosaicId, MosaicSupplyChangeAction} from 'nem2-sdk'
import {DEFAULT_FEES, FEE_GROUPS, formDataConfig} from "@/config"
import {cloneData, getAbsoluteMosaicAmount, formatNumber} from '@/core/utils'
import {AppWallet, AppMosaic, DefaultFee, StoreAccount} from "@/core/model"
import {signAndAnnounce} from '@/core/services'
import {validation} from '@/core/validation'
import DisabledForms from '@/components/disabled-forms/DisabledForms.vue'
import ErrorTooltip from '@/components/other/forms/errorTooltip/ErrorTooltip.vue'

@Component({
    computed: {
        ...mapState({activeAccount: 'account'})
    },
    components: {DisabledForms, ErrorTooltip}
})
export class MosaicSupplyChangeTs extends Vue {
    @Provide() validator: any = this.$validator
    signAndAnnounce = signAndAnnounce
    activeAccount: StoreAccount
    formatNumber = formatNumber
    validation = validation
    formItems = cloneData(formDataConfig.mosaicEditForm)

    @Prop()
    showMosaicEditDialog: boolean

    @Prop()
    itemMosaic: AppMosaic

    get show() {
        return this.showMosaicEditDialog
    }

    set show(val) {
        if (!val) {
            this.$emit('close')
        }
    }

    get supply(): number {
        return this.itemMosaic.mosaicInfo.supply.compact()
    }

    get newSupply(): number {
        const {supply} = this
        const {delta} = this.formItems
        if (!delta) return supply
        const _delta = parseInt(delta, 10)
        if (isNaN(_delta)) return supply

        const newSupply = this.formItems.supplyType === MosaicSupplyChangeAction.Increase
            ? supply + _delta : supply - _delta

        return isNaN(newSupply) ? supply : newSupply
    }

    get wallet(): AppWallet {
        return this.activeAccount.wallet
    }

    get networkCurrency() {
        return this.activeAccount.networkCurrency
    }

    get mosaicId(): string {
        return this.itemMosaic.hex
    }

    get defaultFees(): DefaultFee[] {
        return DEFAULT_FEES[FEE_GROUPS.SINGLE]
    }

    get feeAmount(): number {
        const {feeSpeed} = this.formItems
        const feeAmount = this.defaultFees.find(({speed}) => feeSpeed === speed).value
        return getAbsoluteMosaicAmount(feeAmount, this.networkCurrency.divisibility)
    }

    submit() {
        this.$validator
            .validate()
            .then((valid) => {
                if (!valid) return
                this.confirmViaTransactionConfirmation()
            })
    }

    get transaction() {
        const {feeAmount, mosaicId, wallet} = this
        const {delta, supplyType} = this.formItems

        return MosaicSupplyChangeTransaction.create(
            Deadline.create(),
            new MosaicId(mosaicId),
            supplyType,
            UInt64.fromUint(delta),
            wallet.networkType,
            UInt64.fromUint(feeAmount)
        )
    }

    async confirmViaTransactionConfirmation() {
        try {
            this.show = false;

            this.signAndAnnounce({
                transaction: this.transaction,
                store: this.$store,
            })
        } catch (error) {
            console.error("MosaicEditDialogTs -> confirmViaTransactionConfirmation -> error", error)
        }
    }

    @Watch('newSupply', {immediate: true})
    onSelectedMosaicHexChange() {
        /** Makes newSupply validation reactive */
        this.$validator.validate('newSupply', this.newSupply).catch(e => e)
    }
}
