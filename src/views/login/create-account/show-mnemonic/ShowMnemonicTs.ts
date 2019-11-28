import {Vue, Component} from 'vue-property-decorator'
import {createMnemonic} from "@/core/utils"

@Component
export default class ShowMnemonicTs extends Vue {
    showMnemonic = false

    get mnemonicWords() {
        return createMnemonic()
    }

    get mnemonicWordsList() {
        return this.mnemonicWords.split(' ')
    }

    submit(name) {
        this.$store.commit('SET_TEMPORARY_MNEMONIC', this.mnemonicWords)
        this.$router.push(name)
    }
}
