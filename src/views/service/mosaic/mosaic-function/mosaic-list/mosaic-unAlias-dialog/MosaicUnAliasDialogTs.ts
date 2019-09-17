import {AliasActionType, Password} from "nem2-sdk"
import {mapState} from "vuex"
import {Message, formData} from "@/config/index.ts"
import {NamespaceApiRxjs} from "@/core/api/NamespaceApiRxjs.ts"
import {Component, Vue, Prop, Watch} from 'vue-property-decorator'
import {getAbsoluteMosaicAmount, AppWallet} from '@/core/utils'

@Component({
        computed: {...mapState({activeAccount: 'account'})},
    }
)
export class MosaicUnAliasDialogTs extends Vue {
    activeAccount: any
    show = false
    isCompleteForm = false
    aliasNameList: any[] = []
    mosaic: any = formData.mosaicUnaliasForm

    @Prop()
    showMosaicUnAliasDialog: boolean
    @Prop()
    itemMosaic: any

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
        this.$emit('closeMosaicUnAliasDialog')
    }

    submit() {
        if (!this.isCompleteForm) return
        if (!this.checkInfo()) return
        this.updateMosaic()
    }

    checkInfo() {
        const {mosaic} = this

        if (mosaic.fee === 0) {
            this.$Notice.error({
                title: '' + this.$t(Message.INPUT_EMPTY_ERROR)
            })
            return false
        }
        if (mosaic.password === '') {
            this.$Notice.error({
                title: '' + this.$t(Message.INPUT_EMPTY_ERROR)
            })
            return false
        }

        if (mosaic.password.length < 8) {
            this.$Notice.error({
                title: '' + this.$t(Message.INPUT_EMPTY_ERROR)
            })
            return false
        }

        const validPassword = new AppWallet(this.getWallet).checkPassword(new Password(mosaic.password))

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
        const password = new Password(this.mosaic.password)
        let {fee, hex, name} = this.mosaic
        fee = getAbsoluteMosaicAmount(fee, xemDivisibility)
        const transaction = new NamespaceApiRxjs().mosaicAliasTransaction(
            AliasActionType.Unlink,
            name,
            hex,
            networkType,
            fee
        )
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
        this.mosaic = {
            fee: .5,
            password: ''
        }
    }

    @Watch('showMosaicUnAliasDialog')
    onShowMosaicAliasDialogChange() {
        this.show = this.showMosaicUnAliasDialog
        Object.assign(this.mosaic, this.itemMosaic)
    }

    @Watch('mosaic', {immediate: true, deep: true})
    onFormItemChange() {
        const {fee, password} = this.mosaic
        // isCompleteForm
        this.isCompleteForm = fee > 0 && password !== ''
    }
}
