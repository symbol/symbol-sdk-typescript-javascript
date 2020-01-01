import {Vue, Component, Prop, Provide} from 'vue-property-decorator'
import {mapState} from "vuex"
import {StoreAccount, AppWallet} from '@/core/model'
import {validation} from '@/core/validation'
import CreationForm from './creation-form/CreationForm.vue'
import ImportForm from './import-form/ImportForm.vue'
import ErrorTooltip from '@/components/other/forms/errorTooltip/ErrorTooltip.vue'

@Component({
  computed: {...mapState({activeAccount: 'account'})},
  components: {CreationForm, ImportForm, ErrorTooltip}
})
export class CreateRemoteAccountTs extends Vue {
  @Provide() validator: any = this.$validator
  activeAccount: StoreAccount
  validation = validation
  importAccount: boolean = false
  showPrivateKey: boolean = false
  showPasswordPrompt = false
  hideForms: boolean = false
  privateKey: string = ''
  password: string = ''

  @Prop({default: false})
  visible: boolean

  @Prop({default: false})
  viewAccountPropertiesOnly: boolean

  get show(): boolean {
    return this.visible
  }

  set show(val) {
    if (!val) {
      this.$emit('close')
    }
  }

  get wallet(): AppWallet {
    return this.activeAccount.wallet
  }

  get remoteAccountPublicKey(): string {
    const {remoteAccount} = this.wallet
    if (!remoteAccount) return null
    return remoteAccount.publicKey
  }

  get modalTitle(): string {
    if (this.viewAccountPropertiesOnly) return 'Remote_account_details'
    if (this.importAccount) return 'Import_remote_account'
    return 'Create_remote_account'
  }

  setPrivateKey(privateKey) {
    this.privateKey = privateKey
    this.hideForms = true
  }

  showPrivateKeyClicked(bool: boolean): void {
    if (!bool) {
      this.showPrivateKey = false
      return
    }

    if (this.privateKey === '') {
      this.showPasswordPrompt = true
      return
    }

    this.showPrivateKey = true
  }

  getRemoteAccountPrivateKey() {
    this.$validator
      .validate()
      .then((valid) => {
        if (!valid) return
        this.privateKey = this.wallet.getRemoteAccountPrivateKey(this.password)
        this.showPasswordPrompt = false
        this.showPrivateKey = true
      })
  }

  created() {
    if (this.wallet.linkedAccountKey) this.importAccount = true
  }
}
