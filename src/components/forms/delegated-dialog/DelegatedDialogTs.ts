import {mapState} from 'vuex'
import {Component, Vue, Prop} from 'vue-property-decorator'
import DelegateRequests from '@/components/forms/delegated-dialog/delegate-requests/DelegateRequests.vue'
import NetworkSetting from '@/components/forms/delegated-dialog/network-setting/NetworkSetting.vue'
import ProxySetting from '@/components/forms/delegated-dialog/proxy-setting/ProxySetting.vue'
import {threeStepsPictureList, harvestingTitleList, harvestingStepList} from '@/config'
import {harvestingSteps} from '@/config/view/wallet.ts'
import {StoreAccount} from '@/core/model'

@Component({
  computed: {...mapState({activeAccount: 'account'})},
  components: {
    DelegateRequests,
    NetworkSetting,
    ProxySetting,
  },
})
export class DelegatedDialogTs extends Vue {
  activeAccount: StoreAccount
  harvestingStepBarList = threeStepsPictureList
  harvestingStepList = harvestingStepList
  harvestingSteps = harvestingSteps
  harvestingTitleList = harvestingTitleList
  @Prop()
  showDialog: boolean

  @Prop()
  currentDelegatedStep: number

  get currentTabIndex() {
    return this.currentDelegatedStep
  }

  set currentTabIndex(value) {
    this.$emit('setCurrentDelegatedStep', value)
  }

  get linkedAccountKey() {
    return this.wallet.linkedAccountKey
  }

  get wallet() {
    return this.activeAccount.wallet
  }

  get show() {
    return this.showDialog
  }

  set show(val) {
    if (!val) {
      this.$emit('closeDialog')
    }
  }

  get showTopStepBar() {
    return !this.linkedAccountKey || this.currentTabIndex !== harvestingSteps.AccountLink
  }

  getStepTextClassName(index) {
    return Number(this.currentTabIndex) >= index ? 'white' : 'gray'
  }
}
