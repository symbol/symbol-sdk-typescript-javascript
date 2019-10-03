import {AliasActionType, NamespaceId, MosaicId, Password} from "nem2-sdk"
import {EmptyAlias} from "nem2-sdk/dist/src/model/namespace/EmptyAlias"
import {mapState} from "vuex"
import {Message, formDataConfig,networkConfig, DEFAULT_FEES, FEE_GROUPS, defaultNetworkConfig} from "@/config"
import {NamespaceApiRxjs} from "@/core/api/NamespaceApiRxjs.ts"
import {Component, Vue, Prop, Watch} from 'vue-property-decorator'
import {getAbsoluteMosaicAmount} from '@/core/utils'
import {StoreAccount, AppInfo, AppWallet, AppMosaic, DefaultFee} from "@/core/model"

@Component({
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app',
        })
    }
})
export class MosaicAliasDialogTs extends Vue {
    activeAccount: StoreAccount
    app: AppInfo
    isCompleteForm = false
    formItems = formDataConfig.mosaicAliasForm
    namespaceGracePeriodDuration = networkConfig.namespaceGracePeriodDuration
    XEM: string = defaultNetworkConfig.XEM

    @Prop()
    showMosaicAliasDialog: boolean

    @Prop()
    itemMosaic: AppMosaic

    get show() {
        return this.showMosaicAliasDialog
    }

    set show(val) {
        if (!val) {
            this.$emit('close')
        }
    }

    get wallet() {
        return this.activeAccount.wallet
    }

    get generationHash() {
        return this.activeAccount.generationHash
    }

    get node() {
        return this.activeAccount.node
    }

    get NamespaceList() {
        return this.activeAccount.namespaces
    }

    get xemDivisibility() {
        return this.activeAccount.xemDivisibility
    }

    get currentHeight() {
        return this.app.chainStatus.currentHeight
    }

    get aliasNameList() {
        const {currentHeight, namespaceGracePeriodDuration} = this
        // @TODO handle namespace list loading state
        return this.NamespaceList
            .filter(({alias,endHeight}) => alias instanceof EmptyAlias && endHeight - currentHeight > namespaceGracePeriodDuration)
            .map(alias => ({label: alias.label, value: alias.label}))
    }

    get defaultFees(): DefaultFee[] {
        return DEFAULT_FEES[FEE_GROUPS.SINGLE]
    }

    get feeAmount(): number {
        const {feeSpeed} = this.formItems
        const feeAmount = this.defaultFees.find(({speed})=>feeSpeed === speed).value
        return getAbsoluteMosaicAmount(feeAmount, this.xemDivisibility)
    }

    mosaicAliasDialogCancel() {
        this.initForm()
        this.show = false
    }

    submit() {
        if (!this.isCompleteForm) return
        if (!this.checkInfo()) return
        this.updateMosaic()
    }

    checkInfo() {
        const {formItems} = this
        if (formItems.mosaicName === '') {
            this.$Notice.error({
                title: '' + this.$t(Message.INPUT_EMPTY_ERROR)
            })
            return false
        }
        if (formItems.password === '') {
            this.$Notice.error({
                title: '' + this.$t(Message.INPUT_EMPTY_ERROR)
            })
            return false
        }

        if (formItems.password.length < 8) {
            this.$Notice.error({
                title: '' + this.$t('password_error')
            })
            return false
        }

        const validPassword = new AppWallet(this.wallet).checkPassword(new Password(formItems.password))

        if (!validPassword) {
            this.$Notice.error({
                title: '' + this.$t('password_error')
            })
            return false
        }
        return true
    }

    async updateMosaic() {
        const {node, generationHash, itemMosaic, feeAmount} = this
        let {mosaicName} = this.formItems
        const {hex} = itemMosaic
        console.log(hex, mosaicName, 'hex, aliasNamehex, aliasNamehex, mosaicName')
        const {networkType} = this.wallet
        const password = new Password(this.formItems.password)
        let transaction = new NamespaceApiRxjs().mosaicAliasTransaction(
            AliasActionType.Link,
            new NamespaceId(mosaicName),
            new MosaicId(hex),
            networkType,
            feeAmount
        )
        // @TODO: should be in password dialog
        new AppWallet(this.wallet)
            .signAndAnnounceNormal(password, node, generationHash, [transaction], this)
        this.initForm()
        this.mosaicAliasDialogCancel()
    }


    initForm() {
        this.formItems = formDataConfig.mosaicAliasForm
    }

    // @TODO: use v-model
    @Watch('formItems', {immediate: true, deep: true})
    onFormItemChange() {
        const {mosaicName, password} = this.formItems
        this.isCompleteForm = mosaicName !== '' && password !== ''
    }
}
