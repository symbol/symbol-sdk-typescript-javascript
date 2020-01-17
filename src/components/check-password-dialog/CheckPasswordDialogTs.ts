import {mapState} from 'vuex'
import {Component, Vue, Prop} from 'vue-property-decorator'
import {validation} from '@/core/validation'
import {StoreAccount} from '@/store/account/StoreAccount'
import CheckPassword from '@/components/forms/check-password/CheckPassword.vue'

@Component({
  computed: {...mapState({activeAccount: 'account'})},
  components: {CheckPassword},
})
export class CheckPasswordDialogTs extends Vue {
  activeAccount: StoreAccount
  validation = validation
  password = ''

  @Prop({default: false})
  visible: boolean

  @Prop({default: false})
  returnPassword: boolean

  @Prop({default:'confirm_information'})
  dialogTitle: string

  get show(): boolean {
    return this.visible
  }

  set show(val) {
    if (!val) {
      this.$emit('close')
    }
  }

  passwordValidated(value){
    this.$emit('passwordValidated',value)
    if(value) this.show = false
  }
}
