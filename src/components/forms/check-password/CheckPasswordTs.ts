import {Component, Prop, Provide, Vue, Watch} from 'vue-property-decorator'
import {StoreAccount} from '@/store/account/StoreAccount'
import {validation} from '@/core/validation'
import {mapState, mapGetters} from 'vuex'
import ErrorTooltip from '@/components/other/forms/errorTooltip/ErrorTooltip.vue'

@Component({
  computed: {
    ...mapState({activeAccount: 'account'}),
    ...mapGetters({
      currentAccount: 'account/currentAccount'
    })
  },
  components:{
    ErrorTooltip,
  },
})
export default class extends Vue {
  @Provide() validator: any = this.$validator

  /// region properties
  activeAccount: StoreAccount
  validation = validation
  password = ''

  @Prop({default: false})
  returnPassword: boolean
  /// end-region properties

  get accountPassword() {
    return this.activeAccount.currentAccount.password
  }

  submit() {
    this.$validator
      .validate()
      .then((valid) => {
        const response = valid && this.returnPassword ? this.password : valid
        this.$emit('passwordValidated', response)
      })
  }
}
