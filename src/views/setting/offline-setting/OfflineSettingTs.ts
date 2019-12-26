import {Component, Provide, Vue} from 'vue-property-decorator'
import {validation} from "@/core/validation"
import ErrorTooltip from '@/components/other/forms/errorTooltip/ErrorTooltip.vue'
import {Message, defaultNetworkConfig} from "@/config"
import {mapState} from "vuex"
import {StoreAccount, AppInfo, NetworkCurrency, Notice, NoticeType} from "@/core/model"

@Component({
    components: {
        ErrorTooltip
    },
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app',
        })
    }
})
export default class extends Vue {
    @Provide() validator: any = this.$validator
    activeAccount: StoreAccount
    app: AppInfo
    validation = validation
    generationHash: string = ''
    networkCurrency: NetworkCurrency = defaultNetworkConfig.defaultNetworkMosaic

    get NetworkProperties() {
        return this.app.NetworkProperties
    }

    submit() {
        this.$validator
            .validate()
            .then((valid) => {
                if (!valid) return
                this.setOfflineSettings()
            })
    }

    setOfflineSettings() {
        const {activeAccount, NetworkProperties, generationHash, networkCurrency} = this
        const {node} = activeAccount

        NetworkProperties.updateFromOfflineSettings({generationHash}, node)
        this.$store.commit('SET_NETWORK_CURRENCY', {...networkCurrency})
        Notice.trigger(Message.SUCCESS, NoticeType.success, this.$store)
    }

    mounted() {
        this.generationHash = `${this.NetworkProperties.generationHash}`
        this.networkCurrency = JSON.parse(
            JSON.stringify(this.activeAccount.networkCurrency)
        )
    }
}
