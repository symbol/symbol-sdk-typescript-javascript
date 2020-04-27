import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import {mapGetters} from 'vuex'
import {TransactionGroup} from '@/store/Transaction'
import {Signer} from '@/store/Wallet'


@Component({
  computed: {
    ...mapGetters({
      currentSigner: 'wallet/currentSigner',
    }),
  },
})
export class TransactionStatusFilterTs extends Vue {
  @Prop({default: TransactionGroup.all}) defaultStatus: TransactionGroup

  public currentSigner: Signer

  public selectedStatus: TransactionGroup = this.defaultStatus

  public onStatusChange() {
    this.$emit('status-change', this.selectedStatus)
  }

  @Watch('currentSigner')
  onCurrentSignerChange() {
    this.selectedStatus = TransactionGroup.all
    this.$emit('status-change', this.selectedStatus)
  }

  @Watch('defaultStatus')
  onDefaultStatus(newVal: TransactionGroup) {
    this.selectedStatus = newVal
  }
}
