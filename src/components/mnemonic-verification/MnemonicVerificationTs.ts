import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import {randomizeMnemonicWordArray} from "@/core/utils"
import {Message} from "@/config"
import draggable from "vuedraggable";

@Component({
    components:{draggable}
})
export class MnemonicVerificationTs extends Vue {

    confirmedMnemonicList = []
    mnemonicRandomList = []
    confirmedIndexList = []

    @Prop({default: []})
    mnemonicWordsList: Array<string>

    verificationSuccess() {
        if (this.checkMnemonic())
            this.$emit('verificationSuccess')
    }

    toPreviousPage() {
        this.$emit('toPreviousPage')
    }

    removeConfirmedWord(index) {
        const removeWord = this.confirmedMnemonicList.splice(index, 1)[0]
        const mnemonicRandomIndex = this.mnemonicRandomList.findIndex(item=>removeWord== item)
        this.confirmedIndexList[mnemonicRandomIndex] = !this.confirmedIndexList[mnemonicRandomIndex]
    }

    sureWord(index) {
        const word = this.mnemonicRandomList[index]
        if (this.confirmedIndexList[index]) {
            const flagIndex = this.confirmedMnemonicList.findIndex(item => word == item)
            this.removeConfirmedWord(flagIndex)
            return
        }
        this.confirmedIndexList[index] = !this.confirmedIndexList[index]
        this.confirmedMnemonicList.push(word)
    }

    checkMnemonic() {
        const {confirmedMnemonicList} = this
        if (JSON.stringify(confirmedMnemonicList) != JSON.stringify(this.mnemonicWordsList)) {
            this.$Notice.warning({
                title: '' + (this.$t(confirmedMnemonicList.length < 1 ?
                    Message.PLEASE_ENTER_MNEMONIC_INFO :
                    Message.MNEMONIC_INCONSISTENCY_ERROR))
            })
            return false
        }
        this.$Notice.success({title: this.$t(Message.SUCCESS) + ''})
        return true
    }

    mounted() {
        this.mnemonicRandomList = randomizeMnemonicWordArray([...this.mnemonicWordsList])
    }

}
