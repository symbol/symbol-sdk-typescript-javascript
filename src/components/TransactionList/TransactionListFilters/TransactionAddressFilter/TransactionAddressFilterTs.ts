import { Component, Vue, Prop } from 'vue-property-decorator'


@Component
export class TransactionAddressFilterTs extends Vue {
  @Prop({ default: [] }) addresses
  public selectedAddress= this.addresses[0].publicKey
  
  /**
   * onAddressChange
   */
  public onAddressChange() {
    this.$emit('address-change', this.selectedAddress)
  }
}
