import {Component, Prop, Vue} from 'vue-property-decorator'
import {mapState} from "vuex"


@Component({
    computed: {...mapState({activeAccount: 'account', app: 'app'})},
})
export class MosaicTableTs extends Vue {
    activeAccount: any
    @Prop(({
        default: () => {
            return {
                head: ['name', 'amount'],
                data: [
                    {
                        name: '',
                        amount: 0,
                        hex: ''
                    }
                ]
            }
        }
    }))
    tableData

    get msoaics() {
        return this.activeAccount.mosaics
    }

    get publicKey() {
        return this.activeAccount.wallet.publicKey
    }

    judgeIfWalletIsMosaicCreator(mosaicHex): boolean {
        const {msoaics, publicKey} = this
        if (msoaics[mosaicHex] && msoaics[mosaicHex].mosaicInfo && msoaics[mosaicHex].mosaicInfo.owner.publicKey == publicKey) {
            return true
        }
        return false
    }

}
