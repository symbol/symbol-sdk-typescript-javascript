import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import {randomizeMnemonicWordArray} from "@/core/utils"
import {Message} from "@/config"
import draggable from "vuedraggable";

@Component({
    components:{draggable}
})
export class MnemonicVerificationTs extends Vue {
    mnemonicRandomList = []
    confirmedIndexList = []

    @Prop({default: []})
    mnemonicWordsList: Array<string>

    wordClicked(index) {
        if (this.confirmedIndexList.includes(index)) {
            this.removeConfirmedWord(index)
            return
        }

        this.confirmedIndexList.push(index)
    }

    removeConfirmedWord(index) {
        this.confirmedIndexList = [
            ...this.confirmedIndexList.filter(confirmedIndex => confirmedIndex !== index),
        ]
    }

    get confirmedMnemonicList() {
        const {confirmedIndexList, mnemonicRandomList} = this
        if(confirmedIndexList.length !== confirmedIndexList.length) return
        return confirmedIndexList.map(confirmedIndex => mnemonicRandomList[confirmedIndex])
    }

    set confirmedMnemonicList(newValue) {
        this.confirmedMnemonicList = [...newValue]
    }

    checkMnemonic() {
        const {confirmedMnemonicList} = this
        if (JSON.stringify(confirmedMnemonicList) != JSON.stringify(this.mnemonicWordsList)) {
            this.$Notice.warning({
                title: '' + (this.$t(confirmedMnemonicList.length < 1 ?
                    Message.PLEASE_ENTER_MNEMONIC_INFO :
                    Message.MNEMONIC_INCONSISTENCY_ERROR))
            })
            return
        }
        this.$Notice.success({title: this.$t(Message.SUCCESS) + ''})
        this.$emit('verificationSuccess')
    }

    mounted() {
        this.mnemonicRandomList = randomizeMnemonicWordArray([...this.mnemonicWordsList])
    }

}
