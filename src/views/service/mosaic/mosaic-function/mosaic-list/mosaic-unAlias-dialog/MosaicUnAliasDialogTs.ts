import {AliasActionType, Password, NamespaceId, MosaicId} from "nem2-sdk"
import {mapState} from "vuex"
import {Message, DEFAULT_FEES, FEE_GROUPS,formDataConfig, defaultNetworkConfig} from "@/config"
import {NamespaceApiRxjs} from "@/core/api/NamespaceApiRxjs.ts"
import {Component, Vue, Prop, Watch} from 'vue-property-decorator'
import {getAbsoluteMosaicAmount} from '@/core/utils'
import {AppWallet, StoreAccount, AppMosaic, DefaultFee} from "@/core/model"

@Component({
        computed: {...mapState({activeAccount: 'account'})},
    }
)
export class MosaicUnAliasDialogTs extends Vue {
    activeAccount: StoreAccount
    isCompleteForm = false
    aliasNameList: any[] = []
    formItems = formDataConfig.mosaicUnAliasForm
    XEM = defaultNetworkConfig.XEM

    @Prop()
    showMosaicUnAliasDialog: boolean

    @Prop()
    itemMosaic: AppMosaic

    get show() {
        return this.showMosaicUnAliasDialog
    }

    set show(val) {
        if (!val) {
            this.$emit('close')
        }
    }

    get getWallet() {
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
        if (formItems.password === '') {
            this.$Notice.error({
                title: '' + this.$t(Message.INPUT_EMPTY_ERROR)
            })
            return false
        }

        if (formItems.password.length < 8) {
            this.$Notice.error({
                title: '' + this.$t(Message.INPUT_EMPTY_ERROR)
            })
            return false
        }

        const validPassword = new AppWallet(this.getWallet).checkPassword(new Password(formItems.password))

        if (!validPassword) {
            this.$Notice.error({
                title: '' + this.$t('password_error')
            })
            return false
        }
        return true
    }

    async updateMosaic() {
        const {node, generationHash, feeAmount} = this
        const {networkType} = this.getWallet
        const password = new Password(this.formItems.password)
        const {hex, name} = this.itemMosaic
        const transaction = new NamespaceApiRxjs().mosaicAliasTransaction(
            AliasActionType.Unlink,
            new NamespaceId(name),
            new MosaicId(hex),
            networkType,
            feeAmount
        )
        new AppWallet(this.getWallet)
            .signAndAnnounceNormal(password, node, generationHash, [transaction], this)
        this.initForm()
        this.mosaicAliasDialogCancel()
    }

    initForm() {
        this.formItems = formDataConfig.mosaicUnAliasForm
    }

    @Watch('formItems', {immediate: true, deep: true})
    onFormItemChange() {
        const {password} = this.formItems
        this.isCompleteForm = password !== ''
    }
}
