import {Component, Vue, Prop, Watch} from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import {WalletModel} from '@/core/database/entities/WalletModel'


@Component({
  computed:{
    ...mapGetters({
      currentWallet: 'wallet/currentWallet',
    }),
  },
})
export class TransactionStatusFilterTs extends Vue{
  @Prop({default:''}) defaultStatus: string
  public currentWallet: WalletModel
  public selectedStatus: string=this.defaultStatus
  public onStatusChange(){
    this.$emit('status-change',this.selectedStatus)
  }

  @Watch('currentWallet')
  onCurrentWalletChange(){
    this.selectedStatus = 'all'
    this.$emit('status-change',this.currentWallet.publicKey)
  }
  @Watch('defaultStatus')
  onDefaultStatus(newVal){
    this.selectedStatus = newVal
  }
}
