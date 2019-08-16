import {Message} from "@/config"
import {walletApi} from "@/core/api/walletApi"
import {namespaceApi} from "@/core/api/namespaceApi"
import {transactionApi} from "@/core/api/transactionApi"
import {Component, Vue, Prop, Watch} from 'vue-property-decorator'
import {EmptyAlias} from "nem2-sdk/dist/src/model/namespace/EmptyAlias"
import {Account, Crypto, AliasActionType, NamespaceId, MosaicId} from "nem2-sdk"
import {decryptKey} from "@/core/utils/wallet"

@Component
export class MosaicAliasDialogTs extends Vue {
    show = false
    isCompleteForm = false
    mosaic = {
        aliasName: '',
        fee: 50000,
        password: ''
    }
    aliasNameList: any[] = []

    @Prop()
    showMosaicAliasDialog: boolean
    @Prop()
    itemMosaic: any

    get getWallet() {
        return this.$store.state.account.wallet
    }

    get generationHash() {
        return this.$store.state.account.generationHash
    }

    get node() {
        return this.$store.state.account.node
    }

    get namespaceList() {
        return this.$store.state.account.namespace
    }

    mosaicAliasDialogCancel() {
        this.initForm()
        this.$emit('closeMosaicAliasDialog')
    }

    updateMosaicAlias() {
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
        if (mosaic.aliasName === '') {
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

    decryptKey() {
        this.checkPrivateKey(decryptKey(this.getWallet, this.mosaic.password))
    }

    checkPrivateKey(DeTxt) {
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

    async updateMosaic(key) {
        const that = this
        let transaction
        const account = Account.createFromPrivateKey(key, this.getWallet.networkType);
        namespaceApi.mosaicAliasTransaction({
            actionType: AliasActionType.Link,
            namespaceId: new NamespaceId(that.mosaic.aliasName),
            mosaicId: new MosaicId(that.mosaic['hex']),
            networkType: this.getWallet.networkType,
            maxFee: that.mosaic.fee
        }).then((aliasTransaction) => {
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

    initForm() {
        this.mosaic = {
            aliasName: '',
            fee: 50000,
            password: ''
        }
    }

    initData() {
        let list = []
        this.namespaceList.map((item, index) => {
            if (item.alias instanceof EmptyAlias) {
                list.push(item)
            }
        })
        this.aliasNameList = list
    }

    @Watch('showMosaicAliasDialog')
    onShowMosaicAliasDialogChange() {
        this.show = this.showMosaicAliasDialog
        Object.assign(this.mosaic, this.itemMosaic)
        this.initData()
    }

    @Watch('namespaceList')
    onNamespaceListChange() {
        this.initData()
    }

    @Watch('mosaic', {immediate: true, deep: true})
    onFormItemChange() {
        const {aliasName, fee, password} = this.mosaic
        // isCompleteForm
        this.isCompleteForm = aliasName !== '' && fee > 0 && password !== ''
    }
}
