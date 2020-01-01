import {Vue, Component, Provide} from 'vue-property-decorator'
import {mapState} from "vuex"
import {StoreAccount, AppWallet} from '@/core/model'
import {validation} from '@/core/validation'
import DisabledForms from '@/components/disabled-forms/DisabledForms.vue'
import ErrorTooltip from '@/components/other/forms/errorTooltip/ErrorTooltip.vue'

@Component({
  computed: {...mapState({activeAccount: 'account'})},
  components: {DisabledForms, ErrorTooltip}
})
export class CreationFormTs extends Vue {
  @Provide() validator: any = this.$validator
  activeAccount: StoreAccount
  importAccount: boolean = false
  password: string = ''
  privateKey: string = ''
  validation = validation

  get wallet(): AppWallet {
    return this.activeAccount.wallet
  }

  get remoteAccountPublicKey(): string {
    const {remoteAccount} = this.wallet
    if (!remoteAccount) return null
    return remoteAccount.publicKey
  }

  submit() {
    this.$validator
      .validate()
      .then((valid) => {
        if (!valid) return
        this.privateKey = this.wallet.createAndStoreRemoteAccount(this.password, false, this.$store)
        this.$emit('set-private-key', this.privateKey)
      })
  }
}
