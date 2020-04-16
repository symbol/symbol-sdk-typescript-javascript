import {Component, Vue, Prop, Watch} from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import { WalletsModel } from '@/core/database/entities/WalletsModel'


@Component({
  computed:{
    ...mapGetters({
      currentWallet: 'wallet/currentWallet',
    }),
  },
})
export class TransactionStatusFilterTs extends Vue{
  @Prop({default:''}) defaultStatus: string
  public currentWallet: WalletsModel
  public selectedStatus: string=this.defaultStatus
  public onStatusChange(){
    this.$emit('status-change',this.selectedStatus)
  }

  @Watch('currentWallet')
  onCurrentWalletChange(){
    this.selectedStatus = 'all'
    this.$emit('status-change',this.currentWallet.values.get('publicKey'))
  }
  @Watch('defaultStatus')
  onDefaultStatus(newVal){
    this.selectedStatus = newVal
  }
}
