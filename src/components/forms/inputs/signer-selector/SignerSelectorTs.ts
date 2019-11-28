import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import {Address, MultisigAccountInfo} from "nem2-sdk"
import {mapState} from "vuex"
import {StoreAccount, AppInfo, AppWallet} from "@/core/model"

@Component({computed: {...mapState({activeAccount: 'account', app: 'app'})}})
export class SignerSelectorTs extends Vue {
  activeAccount: StoreAccount
  app: AppInfo

  @Prop() value: string

  get inputValue(): string {
    return this.value
  }

  set inputValue(newPublicKey) {
    if (newPublicKey === this.wallet.publicKey) {
      this.$store.commit('SET_ACTIVE_MULTISIG_ACCOUNT', null)
    } else {
      this.$store.commit('SET_ACTIVE_MULTISIG_ACCOUNT', newPublicKey)
    }
    this.$emit('input', newPublicKey)
  }

  get accountPublicKey(): string {
    return this.activeAccount.wallet.publicKey
  }

  get wallet(): AppWallet {
    return this.activeAccount.wallet
  }

  get multisigInfo(): MultisigAccountInfo {
    const {address} = this.wallet
    return this.activeAccount.multisigAccountInfo[address]
  }

  getMultisigAccountLabel(publicKey: string): string {
    const address = Address.createFromPublicKey(publicKey, this.wallet.networkType)
    const walletFromList = this.app.walletList.find(wallet => wallet.address === address.plain())
    if (walletFromList === undefined) return address.pretty()
    return `${address.pretty()} (${walletFromList.name})`
  }

  get hasMultisigAccounts(): boolean {
    if (!this.multisigInfo) return false
    return this.multisigInfo.multisigAccounts.length > 0
  }

  get multisigPublicKeyList(): {publicKey: string, label: string}[] {
    if (!this.hasMultisigAccounts) return null
    return [
      {
        publicKey: this.accountPublicKey,
        label: this.getMultisigAccountLabel(this.accountPublicKey),
      },
      ...this.multisigInfo.multisigAccounts
        .map(({publicKey}) => ({
          publicKey,
          label: this.getMultisigAccountLabel(publicKey)
        })),
    ]
  }

  @Watch('wallet', {deep: true, immediate: true})
  onWalletChange(newVal, oldVal) {
    if (!newVal || !newVal.publicKey) return
    if (!oldVal || newVal.publicKey !== oldVal.publicKey) {
      this.inputValue = newVal.publicKey
    }
  }
}
