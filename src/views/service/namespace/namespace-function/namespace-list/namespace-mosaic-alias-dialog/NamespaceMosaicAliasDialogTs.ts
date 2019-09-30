import {mapState} from "vuex"
import {AliasActionType, NamespaceId, MosaicId, Password} from "nem2-sdk"
import {Component, Vue, Prop, Watch} from 'vue-property-decorator'
import {Message, defaultNetworkConfig, formDataConfig, DEFAULT_FEES, FEE_GROUPS} from "@/config"
import {NamespaceApiRxjs} from "@/core/api/NamespaceApiRxjs.ts"
import {getAbsoluteMosaicAmount} from '@/core/utils'
import {AppMosaics} from '@/core/services/mosaics'
import {MosaicNamespaceStatusType} from "@/core/model/MosaicNamespaceStatusType";
import {AppWallet, StoreAccount, AppInfo, AppMosaic, DefaultFee, AppNamespace} from "@/core/model"

@Component({
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app',
        })
    }
})
export class NamespaceMosaicAliasDialogTs extends Vue {
    activeAccount: StoreAccount
    app: AppInfo
    isCompleteForm = false
    formItems = formDataConfig.mosaicAliasForm
    XEM: string = defaultNetworkConfig.XEM

    @Prop()
    showMosaicAliasDialog: boolean

    @Prop()
    activeNamespace: AppNamespace

    get show() {
        return this.showMosaicAliasDialog
    }

    set show(val) {
        if (!val) {
            this.$emit('close')
        }
    }

    get wallet(): AppWallet {
        return this.activeAccount.wallet
    }

    get generationHash() {
        return this.activeAccount.generationHash
    }

    get node() {
        return this.activeAccount.node
    }

    get xemDivisibility() {
        return this.activeAccount.xemDivisibility
    }

    get mosaics() {
        return this.activeAccount.mosaics
    }

    get currentHeight() {
        return this.app.chainStatus.currentHeight
    }

    get accountName(){
        return this.activeAccount.accountName
    }

    get unlinkMosaicList() {
        const {currentHeight} = this
        const {address} = this.wallet
        const availableToBeLinked = AppMosaics()
            .getAvailableToBeLinked(currentHeight, address, this.$store)
        if (!availableToBeLinked.length) return []
        return availableToBeLinked
            .filter((item) => currentHeight < item.expirationHeight || item.expirationHeight == MosaicNamespaceStatusType.FOREVER)
            .map((item:any) => {
                item.value = item.hex
                item.label = item.hex
                return item
            })
    }

    get defaultFees(): DefaultFee[] {
        return DEFAULT_FEES[FEE_GROUPS.SINGLE]
    }

    get feeAmount() {
        const {feeSpeed} = this.formItems
        const feeAmount = this.defaultFees.find(({speed})=>feeSpeed === speed).value
        return getAbsoluteMosaicAmount(feeAmount, this.xemDivisibility)
    }

    submit() {
        if (!this.isCompleteForm) return
        if (!this.checkInfo()) return
        this.updateMosaic()
    }

    checkInfo() {
        const {formItems} = this

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
        const {node, generationHash, xemDivisibility, feeAmount} = this
        const {networkType} = this.wallet
        const {name} = this.activeNamespace
        const {mosaicName, password} = this.formItems
        const transaction = new NamespaceApiRxjs().mosaicAliasTransaction(
            AliasActionType.Link,
            new NamespaceId(name),
            new MosaicId(mosaicName),
            networkType,
            feeAmount
        )
        new AppWallet(this.wallet)
            .signAndAnnounceNormal(new Password(password), node, generationHash, [transaction], this)
        this.initForm()
        this.show = false
    }

    initForm() {
        this.formItems = formDataConfig.mosaicAliasForm
    }

    @Watch('formItems', {deep: true})
    onFormItemsChange() {
        const {password} = this.formItems
        this.isCompleteForm = password !== ''
    }
}
