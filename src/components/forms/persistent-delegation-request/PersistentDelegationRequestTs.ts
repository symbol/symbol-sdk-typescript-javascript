import { Vue, Component, Prop, Provide } from 'vue-property-decorator'
import { Account, PersistentDelegationRequestTransaction, Deadline, UInt64 } from 'nem2-sdk'
import { mapState } from "vuex"
import { StoreAccount, DefaultFee, AppWallet } from '@/core/model'
import { cloneData, getAbsoluteMosaicAmount } from '@/core/utils'
import { formDataConfig, DEFAULT_FEES, FEE_GROUPS } from '@/config'
import { standardFields } from '@/core/validation'
import { signTransaction } from '@/core/services/transactions'
import DisabledForms from '@/components/disabled-forms/DisabledForms.vue'
import ErrorTooltip from '@/components/other/forms/errorTooltip/ErrorTooltip.vue'
import GetNodePublicKey from '@/components/forms/get-node-public-key/GetNodePublicKey.vue'

@Component({
    computed: {
        ...mapState({
            activeAccount: 'account',
        })
    },
    components: { DisabledForms, ErrorTooltip, GetNodePublicKey }
})
export class PersistentDelegationRequestTs extends Vue {
    @Provide() validator: any = this.$validator
    activeAccount: StoreAccount
    formItems = cloneData(formDataConfig.remoteForm)
    showGetNodePublicKey = true
    newRemoteAccount: Account = null
    standardFields = standardFields
    recipientPublicKey: string = ""
    password: string = ""

    @Prop({ default: false })
    visible: boolean

    get show(): boolean {
        return this.visible
    }

    set show(val) {
        if (!val) {
            this.$emit('close')
        }
    }

    get wallet() {
        return new AppWallet(this.activeAccount.wallet)
    }

    get networkCurrency() {
        return this.activeAccount.networkCurrency
    }

    get linkedAccountKey() {
        return this.wallet.linkedAccountKey
    }

    get defaultFees(): DefaultFee[] {
        return DEFAULT_FEES[FEE_GROUPS.SINGLE]
    }

    get feeAmount(): number {
        const { feeSpeed } = this.formItems
        const feeAmount = this.defaultFees.find(({ speed }) => feeSpeed === speed).value
        return getAbsoluteMosaicAmount(feeAmount, this.activeAccount.networkCurrency.divisibility)
    }

    initForm() {
        this.formItems = cloneData(formDataConfig.remoteForm)
    }

    close(): void {
        this.initForm()
        this.show = false
    }

    getTransaction(): PersistentDelegationRequestTransaction {
        return this.wallet.createPersistentDelegationRequestTransaction(
            Deadline.create(),
            this.recipientPublicKey,
            UInt64.fromUint(this.feeAmount),
            this.password,
        )
    }

    async signAndAnnounce() {
        try {
            this.$emit('close')
            const transaction = this.getTransaction()

            const {
                success,
                signedTransaction,
            } = await signTransaction({
                transaction,
                store: this.$store,
            })

            if (success) {
                const { node } = this.activeAccount
                new AppWallet(this.wallet).announceTransaction(signedTransaction, node, this.$root)
            }
        } catch (error) {
            console.error("AccountLinkTransactionTs -> submit -> error", error)
        }
    }

    submit() {
        this.$validator
        .validate()
        .then((valid) => {
          if (!valid) return
          this.signAndAnnounce()
        })
    }
}
