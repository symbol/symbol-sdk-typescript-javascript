import {Component, Vue} from 'vue-property-decorator'
import MosaicList from './mosaic-function/mosaic-list/MosaicList.vue'
import MosaicTransaction from './mosaic-function/mosaic-transaction/MosaicTransaction.vue'
import {mosaicButtonList} from "@/config/view";

@Component({
    components: {
        MosaicTransaction,
        MosaicList
    }
})
export class MosaicTs extends Vue {
    buttonList = mosaicButtonList

    switchButton(index) {
        let list = this.buttonList
        list = list.map((item) => {
            item.isSelected = false
            return item
        })
        list[index].isSelected = true
        this.buttonList = list
    }
}
