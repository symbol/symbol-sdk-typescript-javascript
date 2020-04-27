import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import {Signer} from '@/store/Wallet'
import {mapGetters} from 'vuex'


@Component({
  computed: {
    ...mapGetters({
      currentSigner: 'wallet/currentSigner',
    }),
  },
})
export class TransactionAddressFilterTs extends Vue {

  @Prop({default: []})
  public signers: Signer[]

  /**
   * Selected signer from the store
   * @protected
   * @type {string}
   */
  public currentSigner: Signer

  public selectedSigner = this.currentSigner && this.currentSigner.publicKey
    || this.signers.length && this.signers[0].publicKey || ''

  /**
   * onAddressChange
   */
  public onSignerChange() {
    this.$emit('signer-change', this.selectedSigner)
  }


  @Watch('currentSigner')
  onCurrentSignerChange() {
    this.selectedSigner = this.currentSigner.publicKey
  }
}
