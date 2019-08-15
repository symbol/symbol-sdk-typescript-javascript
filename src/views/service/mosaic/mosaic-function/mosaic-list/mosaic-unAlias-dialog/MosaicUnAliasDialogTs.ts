import {Message} from "@/config/index"
import {decryptKey} from "@/core/utils/wallet"
import {walletApi} from "@/core/api/walletApi"
import {namespaceApi} from "@/core/api/namespaceApi"
import {transactionApi} from "@/core/api/transactionApi"
import {Component, Vue, Prop, Watch} from 'vue-property-decorator'
import {Account, AliasActionType, NamespaceId, MosaicId} from "nem2-sdk"

@Component
export class MosaicUnAliasDialogTs extends Vue {
    show = false
    isCompleteForm = false
    aliasNameList: any[] = []
    mosaic = {
        fee: 50000,
        password: ''
    }

    @Prop()
    showMosaicUnAliasDialog: boolean
    @Prop()
    itemMosaic: any

    get getWallet () {
        return this.$store.state.account.wallet
    }

    get generationHash () {
        return this.$store.state.account.generationHash
    }

    get node () {
        return this.$store.state.account.node
    }

    mosaicAliasDialogCancel() {
        this.initForm()
        this.$emit('closeMosaicUnAliasDialog')
    }
    updateMosaicAlias () {
        this.checkNamespaceForm()
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
        return true
    }

    checkNamespaceForm() {
        if (!this.isCompleteForm) return
        if (!this.checkInfo()) return
        this.decryptKey()
    }
    decryptKey () {
        this.checkPrivateKey(decryptKey(this.getWallet, this.mosaic.password))
    }
    checkPrivateKey (DeTxt) {
        const that = this
        walletApi.getWallet({
            name: this.getWallet.name,
            networkType: this.getWallet.networkType,
            privateKey: DeTxt.length === 64 ? DeTxt : ''
        }).then(async (Wallet: any) => {
            this.updateMosaic(DeTxt)
        }).catch(() => {
            that.$Notice.error({
                title: this.$t('password_error') + ''
            })
        })
    }
    async updateMosaic (key) {
        const that =this
        const account = Account.createFromPrivateKey(key, this.getWallet.networkType);
        namespaceApi.mosaicAliasTransaction({
            actionType:AliasActionType.Unlink,
            namespaceId: new NamespaceId(that.mosaic['name']),
            mosaicId: new MosaicId(that.mosaic['hex']),
            networkType: this.getWallet.networkType,
            maxFee:that.mosaic.fee
        }).then((aliasTransaction)=>{
            let transaction
            transaction = aliasTransaction.result.aliasMosaicTransaction
            const signature = account.sign(transaction, this.generationHash)
            transactionApi.announce({signature, node: this.node}).then((announceResult) => {
                // get announce status
                console.log(signature)
                announceResult.result.announceStatus.subscribe((announceInfo: any) => {
                    that.$Notice.success({
                        title: this.$t(Message.SUCCESS) + ''
                    })
                    that.initForm()
                    that.updatedMosaicAlias()
                })
            })
        })

    }
    updatedMosaicAlias() {
        this.show = false
        this.mosaicAliasDialogCancel()
    }

    initForm () {
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
