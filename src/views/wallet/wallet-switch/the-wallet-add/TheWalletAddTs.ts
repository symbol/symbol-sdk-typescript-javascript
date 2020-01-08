import {mapState} from "vuex"
import {Component, Vue, Prop, Provide} from 'vue-property-decorator'
import {validation} from '@/core/validation'
import {AppInfo, AppWallet, StoreAccount, Notice, NoticeType} from "@/core/model"
import CheckPassword from '@/components/forms/check-password/CheckPassword.vue'
import {seedWalletTitle, APP_PARAMS, Message} from "@/config"
import {Password} from "nem2-sdk"
import ErrorTooltip from '@/components/other/forms/errorTooltip/ErrorTooltip.vue'

@Component({
  computed: {...mapState({activeAccount: 'account', app: 'app', })},
  components: {CheckPassword, ErrorTooltip},
})
export class TheWalletAddTs extends Vue {
  @Provide() validator: any = this.$validator
  activeAccount: StoreAccount
  validation = validation
  walletName = ''
  app: AppInfo

  @Prop({default: false})
  visible: boolean

  get show(): boolean {
    return this.visible
  }

  get walletList() {
    return this.app.walletList
  }

  set show(val) {
    if (!val) {
      this.$emit('close')
    }
  }

  get currentAccount() {
    return this.activeAccount.currentAccount
  }

  get pathToCreate() {
    const seedPathList = this.walletList.filter(item => item.path).map(item => item.path[item.path.length - 8]).sort()
    const numberOfSeedPath = seedPathList.length
    if (numberOfSeedPath >= APP_PARAMS.MAX_SEED_WALLETS_NUMBER) {
      Notice.trigger(Message.SEED_WALLET_OVERFLOW_ERROR, NoticeType.error, this.$store)
      this.show = false
      return
    }

    if (!numberOfSeedPath) return 0

    const jumpedPath = seedPathList
      .map(a => Number(a))
      .sort()
      .map((element, index) => {
        if (element !== index) return index
      })
      .filter(x => x !== undefined)
    return jumpedPath.length ? jumpedPath[0] : numberOfSeedPath
  }


  passwordValidated(password) {
    if (!password) return
    const {pathToCreate, walletName, currentAccount} = this
    const networkType = currentAccount.networkType
    this.$validator
      .validate()
      .then((valid) => {
        if (!valid) return
        try {
          new AppWallet().createFromPath(
            walletName,
            new Password(password),
            pathToCreate,
            networkType,
            this.$store,
          )
          this.show = false
        } catch (error) {
          throw new Error(error)
        }
      })
  }

  mounted() {
    this.walletName = seedWalletTitle + this.pathToCreate
  }
}
