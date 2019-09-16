import {Message, formData} from "@/config/index.ts"
import {AppWallet} from "@/core/utils/wallet.ts"
import {NamespaceApiRxjs} from "@/core/api/NamespaceApiRxjs.ts"
import {Component, Vue, Prop, Watch} from 'vue-property-decorator'
import {AliasActionType, NamespaceId, MosaicId, Password, Address} from "nem2-sdk"
import {mapState} from "vuex"
import {getAbsoluteMosaicAmount} from "@/core/utils/utils"

@Component({
        computed: {...mapState({activeAccount: 'account'})},
    }
)
export class NamespaceUnAliasDialogTs extends Vue {
    activeAccount: any
    show = false
    isCompleteForm = false
    aliasNameList: any[] = []
    formItem: any = formData.mosaicUnaliasForm

    @Prop()
    showUnAliasDialog: boolean
    @Prop()
    unAliasItem: any

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

    mosaicAliasDialogCancel() {
        this.initForm()
        this.$emit('closeUnAliasDialog')
    }

    submit() {
        if (!this.isCompleteForm) return
        if (!this.checkInfo()) return
        this.updateMosaic()
    }

    checkInfo() {
        const {formItem} = this

        if (formItem.fee === 0) {
            this.$Notice.error({
                title: '' + this.$t(Message.INPUT_EMPTY_ERROR)
            })
            return false
        }
        if (formItem.password === '') {
            this.$Notice.error({
                title: '' + this.$t(Message.INPUT_EMPTY_ERROR)
            })
            return false
        }

        if (formItem.password.length < 8) {
            this.$Notice.error({
                title: '' + this.$t(Message.INPUT_EMPTY_ERROR)
            })
            return false
        }

        const validPassword = new AppWallet(this.getWallet).checkPassword(new Password(formItem.password))

        if (!validPassword) {
            this.$Notice.error({
                title: '' + this.$t('password_error')
            })
            return false
        }
        return true
    }

    async updateMosaic() {
        const {node, generationHash, xemDivisibility} = this
        const {networkType} = this.getWallet
        const password = new Password(this.formItem.password)
        let {fee, hex, name, aliasTarget} = this.formItem
        fee = getAbsoluteMosaicAmount(fee, xemDivisibility)
        
        const transaction = aliasTarget.length === 40 // quickfix
            ? new NamespaceApiRxjs().addressAliasTransaction(
                AliasActionType.Unlink,
                new NamespaceId(name),
                Address.createFromRawAddress(aliasTarget),
                networkType,
                fee)
            : new NamespaceApiRxjs().mosaicAliasTransaction(
                AliasActionType.Unlink,
                new NamespaceId(name),
                new MosaicId(hex),
                networkType,
                fee)
        new AppWallet(this.getWallet)
            .signAndAnnounceNormal(password, node, generationHash, [transaction], this)
        this.initForm()
        this.updatedMosaicAlias()
    }

    updatedMosaicAlias() {
        this.show = false
        this.mosaicAliasDialogCancel()
    }

    initForm() {
        this.formItem = {
            fee: .5,
            password: ''
        }
    }

    // @TODO: use v-model
    @Watch('showUnAliasDialog')
    onShowUnAliasDialogChange() {
        this.show = this.showUnAliasDialog
        Object.assign(this.formItem, this.unAliasItem)
    }

    @Watch('formItem', {immediate: true, deep: true})
    onFormItemChange() {
        const {fee, password} = this.formItem
        // isCompleteForm
        this.isCompleteForm = fee > 0 && password !== ''
    }
}
