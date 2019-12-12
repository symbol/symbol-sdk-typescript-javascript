import {mapState} from "vuex"
import {Component, Vue, Prop, Provide} from 'vue-property-decorator'
import {validation} from '@/core/validation'
import {StoreAccount} from "@/core/model"
import ErrorTooltip from '@/components/other/forms/errorTooltip/ErrorTooltip.vue'

@Component({
    computed: {...mapState({activeAccount: 'account'})},
    components: {ErrorTooltip},
})
export class CheckPasswordDialogTs extends Vue {
    @Provide() validator: any = this.$validator
    activeAccount: StoreAccount
    validation = validation
    password = ''

    @Prop({default: false})
    visible: boolean

    @Prop({default: false})
    returnPassword: boolean

    get show(): boolean {
        return this.visible
    }

    set show(val) {
        if (!val) {
            this.$emit('close')
        }
    }

    get accountPassword() {
        return this.activeAccount.currentAccount.password
    }

    submit() {
        this.$validator
            .validate()
            .then((valid) => {
                const response = valid && this.returnPassword ? this.password : valid
                this.$emit('passwordValidated', response)
                this.show = false
            })
    }
}
