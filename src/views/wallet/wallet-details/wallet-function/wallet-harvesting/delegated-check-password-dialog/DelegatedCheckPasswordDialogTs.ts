import {Component, Prop, Provide, Vue} from 'vue-property-decorator'
import ErrorTooltip from '@/components/other/forms/errorTooltip/ErrorTooltip.vue'
import {mapState} from "vuex"
import {StoreAccount} from "@/core/model"
import {validation} from "@/core/validation"

@Component({
    computed: {...mapState({activeAccount: 'account'})},
    components: {ErrorTooltip},
})
export default class extends Vue {
    @Provide() validator: any = this.$validator
    password = ''
    activeAccount: StoreAccount
    validation = validation
    @Prop()
    showDialog

    set visible(value) {
        this.$emit('closeDialog')
    }

    get visible() {
        return this.showDialog
    }

    get accountPassword() {
        return this.activeAccount.currentAccount.password
    }

    submit() {
        const {password} = this
        const that = this
        this.$validator
            .validate()
            .then((valid) => {
                if (!valid) return
                that.$store.commit('SET_TEMPORARY_PASSWORD', password)
                that.$emit('passwordCallBack')
                that.visible = false
            })
    }
}
