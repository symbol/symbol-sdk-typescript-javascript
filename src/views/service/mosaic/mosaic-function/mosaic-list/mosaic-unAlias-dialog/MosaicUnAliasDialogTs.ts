import {Message, formData} from "@/config/index.ts"
import {AppWallet} from "@/core/utils/wallet.ts"
import {NamespaceApiRxjs} from "@/core/api/NamespaceApiRxjs.ts"
import {Component, Vue, Prop, Watch} from 'vue-property-decorator'
import {AliasActionType, NamespaceId, MosaicId, Password} from "nem2-sdk"
import {mapState} from "vuex"

@Component({
        computed: {...mapState({activeAccount: 'account'})},
    }
)
export class MosaicUnAliasDialogTs extends Vue {
    activeAccount: any
    show = false
    isCompleteForm = false
    aliasNameList: any[] = []
    mosaic = formData.mosaicUnaliasForm

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
                title: '' + this.$t('password_error')
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
        const {node, generationHash} = this
        const password = new Password(this.mosaic.password)

        const transaction = new NamespaceApiRxjs().mosaicAliasTransaction(
            AliasActionType.Unlink,
            new NamespaceId(this.mosaic['name']),
            new MosaicId(this.mosaic['hex']),
            this.getWallet.networkType,
            this.mosaic.fee
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
            fee: 50000,
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
