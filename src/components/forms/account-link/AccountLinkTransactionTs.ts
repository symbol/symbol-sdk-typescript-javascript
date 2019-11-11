import {Vue, Component, Prop} from 'vue-property-decorator'
import {AccountLinkTransaction, Deadline, LinkAction, UInt64, Account} from 'nem2-sdk'
import {mapState} from "vuex"
import {StoreAccount, DefaultFee, AppWallet} from '@/core/model'
import {cloneData, getAbsoluteMosaicAmount} from '@/core/utils'
import {formDataConfig, DEFAULT_FEES, FEE_GROUPS} from '@/config'
import {signTransaction} from '@/core/services/transactions'
import DisabledForms from '@/components/disabled-forms/DisabledForms.vue'
import CheckPasswordDialog from '@/components/check-password-dialog/CheckPasswordDialog.vue'

@Component({
    computed: {
      ...mapState({
        activeAccount: 'account',
      })
    },
    components:{ DisabledForms, CheckPasswordDialog }
  })
export class AccountLinkTransactionTs extends Vue {
    activeAccount: StoreAccount
    formItems = cloneData(formDataConfig.remoteForm)
    showCheckPWDialog = false
    newRemoteAccount: Account = null

    @Prop({default: false})
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

    get remotePublicKey(): string {
        return this.wallet.isLinked() ? this.linkedAccountKey : this.wallet.remoteAccount.publicKey
    }

    get defaultFees(): DefaultFee[] {
        return DEFAULT_FEES[FEE_GROUPS.SINGLE]
    }

    get feeAmount(): number {
        const {feeSpeed} = this.formItems
        const feeAmount = this.defaultFees.find(({speed}) => feeSpeed === speed).value
        return getAbsoluteMosaicAmount(feeAmount, this.activeAccount.networkCurrency.divisibility)
    }

    initForm() {
        this.formItems = cloneData(formDataConfig.remoteForm)
    }

    close(): void {
        this.initForm()
        this.show = false
    }

    getTransaction(): AccountLinkTransaction {
        const {feeAmount, remotePublicKey, wallet} = this

        return AccountLinkTransaction.create(
            Deadline.create(),
            remotePublicKey,
            wallet.isLinked() ? LinkAction.Unlink : LinkAction.Link,
            this.wallet.networkType,
            UInt64.fromUint(feeAmount)
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
