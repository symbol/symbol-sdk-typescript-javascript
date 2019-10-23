
import {Component, Prop, Vue} from 'vue-property-decorator'
import {mapState} from "vuex"
import {Message} from '@/config';

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

    Message = Message

    get mosaics() {
        return this.activeAccount.mosaics
    }

    get publicKey() {
        return this.activeAccount.wallet.publicKey
    }

    judgeIfWalletIsMosaicCreator(mosaicHex): boolean {
        const {mosaics, publicKey} = this
        if (mosaics[mosaicHex] && mosaics[mosaicHex].mosaicInfo && mosaics[mosaicHex].mosaicInfo.owner.publicKey == publicKey) {
            return true
        }
        return false
    }

}
