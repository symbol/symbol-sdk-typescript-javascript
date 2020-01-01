import {Vue, Component, Provide} from 'vue-property-decorator'
import {mapState} from "vuex"
import {StoreAccount, AppWallet} from '@/core/model'
import DisabledForms from '@/components/disabled-forms/DisabledForms.vue'
import ErrorTooltip from '@/components/other/forms/errorTooltip/ErrorTooltip.vue'
import {validation} from '@/core/validation'

@Component({
  computed: {...mapState({activeAccount: 'account'})},
  components: {DisabledForms, ErrorTooltip}
})
export class ImportFormTs extends Vue {
  @Provide() validator: any = this.$validator
  activeAccount: StoreAccount
  importAccount: boolean = false
  password: string = ''
  privateKey: string = ''
  validation = validation

  get wallet(): AppWallet {
    return this.activeAccount.wallet
  }

  submit() {
    this.$validator
      .validate()
      .then((valid) => {
        if (!valid) return
        this.wallet.createAndStoreRemoteAccount(this.password, this.privateKey, this.$store)
        this.$emit('set-private-key', this.privateKey)
      })
  }
}
