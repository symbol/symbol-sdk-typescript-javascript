import {Component, Vue, Provide, Watch} from 'vue-property-decorator'
import {Message} from "@/config"
import {localRead} from '@/core/utils'
import {standardFields} from '@/core/validation'
import {AppLock} from '@/core/utils/appLock'
import FormInput from '@/views/other/forms/input/FormInput.vue'
import {mapState} from "vuex"
import {StoreAccount} from "@/core/model"

@Component(
    {
        components: {FormInput},
        computed: {
            ...mapState({
                activeAccount: 'account',
            })
        }
    }
)
export class SettingLockTs extends Vue {
    @Provide() validator: any = this.$validator
    activeAccount: StoreAccount
    errors: any
    cypher: string
    submitDisabled: boolean = false
    formModel = {
        previousPassword: standardFields.previousPassword.default,
        newPassword: standardFields.previousPassword.default,
        confirmPassword: standardFields.previousPassword.default,
        cipher: '',
        hint: standardFields.hint.default,
    }

    @Watch('errors')
    onErrorsChanged() {
        this.submitDisabled = this.errors.items.length > 0
    }

    get accountName() {
        return this.activeAccount.accountName
    }

    get mnemonic() {
        const {accountName} = this
        return JSON.parse(localRead('accountMap'))[accountName].seed
    }


    resetFields() {
        const {accountName} = this
        this.formModel = {
            previousPassword: standardFields.previousPassword.default,
            newPassword: standardFields.previousPassword.default,
            confirmPassword: standardFields.previousPassword.default,
            cipher: new AppLock().getCipherPassword(accountName) + '',
            hint: standardFields.hint.default,
        }
    }

    submit() {
        const {previousPassword, newPassword, hint} = this.formModel
        const {accountName, mnemonic} = this
        const that = this
        this.$validator
            .validate()
            .then((valid) => {
                if (!valid) return
                const newCipherPassword = AppLock.encryptString(newPassword, newPassword)
                const encryptedMnemonic = AppLock.encryptString(AppLock.decryptString(mnemonic, previousPassword), newPassword)
                // refresh password localstorage  and jump to start page
                new AppLock().saveNewPassword(encryptedMnemonic, newCipherPassword, accountName)
                this.resetFields()
                this.$Notice.success({
                    title: this.$t(Message.SUCCESS) + ''
                })
            })
    }

    created() {
        this.resetFields()
    }
}
