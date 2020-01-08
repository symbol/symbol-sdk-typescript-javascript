import {Component, Provide, Vue, Watch} from "vue-property-decorator";
import {NetworkType, NodeHttp} from "nem2-sdk"
import {mapState} from "vuex"
import {AppInfo, AppWallet, StoreAccount} from "@/core/model"
import {completeUrlWithHostAndProtocol, getAbsoluteMosaicAmount, localRead} from "@/core/utils"
import {DEFAULT_FEES, defaultNodeList, FEE_GROUPS, FEE_SPEEDS, Message} from "@/config"
import ErrorTooltip from '@/components/other/forms/errorTooltip/ErrorTooltip.vue'
import {validation} from "@/core/validation"

interface NodePublicKey {
    label: string
    value: string
}

@Component({
    components: {
        ErrorTooltip
    },
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app'
        })
    },
})
export class NetworkSettingTs extends Vue {
    @Provide() validator: any = this.$validator
    nodePublicKey: NodePublicKey = {label: 'N/A', value: null}
    activeAccount: StoreAccount
    app: AppInfo
    validation = validation
    chosenNode: string = ''
    feeSpeed = FEE_SPEEDS.NORMAL
    defaultFees = DEFAULT_FEES[FEE_GROUPS.SINGLE]
    feeDivider = 1

    get defaultNodeList() {
        const nodeListData = localRead('nodeList')
        if (nodeListData == '') return defaultNodeList
        return nodeListData ? JSON.parse(nodeListData).map(item => item.value) : defaultNodeList.map(item => item.value)
    }

    get feeAmount(): number {
        const {feeSpeed} = this
        const feeAmount = this.defaultFees.find(({speed}) => feeSpeed === speed).value
        return getAbsoluteMosaicAmount(feeAmount, this.networkCurrency.divisibility)
    }

    get wallet() {
        return new AppWallet(this.activeAccount.wallet)
    }

    get temporaryRemoteNodeConfig() {
        return this.activeAccount.wallet.temporaryRemoteNodeConfig
    }

    get networkCurrency() {
        return this.activeAccount.networkCurrency
    }

    resetNodePublicKey() {
        this.nodePublicKey = {label: 'N/A', value: null}
    }

    searchNodeInfo() {
        this.$validator
            .validate()
            .then((valid) => {
                if (!valid) return
                this.chosenNode = completeUrlWithHostAndProtocol(this.chosenNode)
                this.getNodePublicKey()
            })
    }

    async getNodePublicKey() {
        const {chosenNode} = this
        try {
            this.nodePublicKey = {label: `${this.$t('Loading')}`, value: null}
            const nodeInfo = await new NodeHttp(chosenNode).getNodeInfo().toPromise()
            this.nodePublicKey = {label: nodeInfo.publicKey, value: nodeInfo.publicKey}
        } catch (error) {
            this.nodePublicKey = {label: `${this.$t('Nothing_was_found_at_this_address')}`, value: null}

        }
    }

    submit() {
        const {chosenNode} = this
        if (!this.nodePublicKey.value) {
            this.$Notice.error({
                title: this.$t(Message.REMOTE_PUBLIC_KEY_MISSING) + ''
            })
            return
        }
        this.$store.commit('SET_TEMPORARY_REMOTE_NODE_CONFIG', {
            publicKey: this.nodePublicKey.value,
            node: chosenNode
        })
        this.$emit("nextClicked");
    }

    @Watch('chosenNode')
    onChosenNodeChange() {
        this.resetNodePublicKey()
    }

    @Watch('useDefaultNode')
    onUseDefaultNodeChange() {
        this.resetNodePublicKey()
    }

    mounted() {
        this.chosenNode = this.temporaryRemoteNodeConfig ? (this.temporaryRemoteNodeConfig.node || this.defaultNodeList[0]) : this.defaultNodeList[0]
        this.searchNodeInfo()
    }

}
