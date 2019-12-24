import {Component, Vue} from 'vue-property-decorator'
import {NetworkType} from 'nem2-sdk'
import {mapState} from 'vuex'
import {asyncScheduler} from 'rxjs'
import {throttleTime} from 'rxjs/operators'
import {isWindows, APP_PARAMS} from '@/config'
import {
  setMarketOpeningPrice, OnWalletChange,
  OnActiveMultisigAccountChange, Endpoints,
} from '@/core/services'

import {
  AppInfo, StoreAccount, Notice,
  NetworkManager, Listeners, NetworkProperties,
} from '@/core/model'

import DisabledUiOverlay from '@/components/disabled-ui-overlay/DisabledUiOverlay.vue'
import TransactionConfirmation from '@/components/transaction-confirmation/TransactionConfirmation.vue'
import LoadingOverlay from '@/components/loading-overlay/LoadingOverlay.vue'
import {checkInstall} from '@/core/utils'

const {EVENTS_THROTTLING_TIME} = APP_PARAMS

@Component({
  computed: {
    ...mapState({activeAccount: 'account', app: 'app'}),
  },
  components: {
    DisabledUiOverlay,
    TransactionConfirmation,
    LoadingOverlay,
  },
})
export class AppTs extends Vue {
  isWindows = isWindows
  activeAccount: StoreAccount
  app: AppInfo
  Listeners: Listeners
  NetworkManager: NetworkManager

  get showLoadingOverlay() {
    return (this.app.loadingOverlay && this.app.loadingOverlay.show) || false
  }

  get node() {
    return this.activeAccount.node
  }

  get wallet() {
    return this.activeAccount.wallet
  }

  get networkType(): NetworkType {
    return this.wallet.networkType
  }

  get address() {
    if (!this.wallet) return null
    return this.wallet.address
  }

  async created() {
    this.initializeNetwork()
    if (isWindows) checkInstall()
  }

  async mounted() {
    this.initializeNotice()
    this.initializeEventsHandlers()
    setMarketOpeningPrice(this)
    if (!this.activeAccount.wallet) this.$router.push('/login')
  }

  async initializeNetwork() {
    try {
      const networkProperties = NetworkProperties.create(this.$store)
      this.$store.commit('INITIALIZE_NETWORK_PROPERTIES', networkProperties)
      this.Listeners = Listeners.create(this.$store, networkProperties)
      this.NetworkManager = NetworkManager.create(
        this.$store, networkProperties, this.Listeners,
      )
      await Endpoints.initialize(this.$store)
    } catch (error) {
      console.error("AppTs -> initializeNetwork -> error", error)
    }
  }

  initializeNotice() {
    this.$Notice.config({ duration: 4 })
    const messageTranslator = message => `${this.$t(message)}`

    this.$store.subscribe(async (mutation) => {
      if (mutation.type === 'TRIGGER_NOTICE') {
        const notice: Notice = mutation.payload
        this.$Notice.destroy()
        this.$Notice[notice.type]({title: messageTranslator(notice.message)})
      }
    })
  }

  initializeEventsHandlers() {
    /**
     * ON ADDRESS CHANGE
     */
    this.$watchAsObservable('address', {immediate: true})
      .pipe(
        throttleTime(EVENTS_THROTTLING_TIME, asyncScheduler, {leading: true, trailing: true})
      )
      .subscribe(async ({newValue, oldValue}) => {
        if (!newValue) return

        if ((!oldValue && newValue) || (oldValue && newValue !== oldValue)) {
          await OnWalletChange.trigger(this.$store, this.Listeners, this.wallet)
        }
      })

    /**
     * ON ACTIVE MULTISIG ACCOUNT CHANGE
     */
    this.$watchAsObservable('activeAccount.activeMultisigAccount')
      .pipe(
        throttleTime(EVENTS_THROTTLING_TIME, asyncScheduler, {leading: true, trailing: true})
      )
      .subscribe(({newValue, oldValue}) => {
        if (!newValue) return

        if (oldValue !== newValue) {
          OnActiveMultisigAccountChange.trigger(newValue, this.node, this.networkType, this.$store)
        }
      })

    /**
     * ON ENDPOINT CHANGE
     */
    this.$watchAsObservable('node', { immediate: true })
      .pipe(
        throttleTime(EVENTS_THROTTLING_TIME, asyncScheduler, {leading: true, trailing: true})
      )
      .subscribe(({newValue, oldValue}) => {
        if (newValue && oldValue !== newValue) {
          this.NetworkManager.switchEndpoint(newValue)
          this.Listeners.switchEndpoint(newValue)
        }
      })
  }
}