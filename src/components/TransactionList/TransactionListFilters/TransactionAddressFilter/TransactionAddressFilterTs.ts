import {Component, Prop, Vue} from 'vue-property-decorator'
import {Signer} from '@/store/Wallet'


@Component
export class TransactionAddressFilterTs extends Vue {
  @Prop({default: []}) addresses: Signer[]
  public selectedAddress = this.addresses[0].publicKey

  /**
   * onAddressChange
   */
  public onAddressChange() {
    this.$emit('address-change', this.selectedAddress)
  }
}
