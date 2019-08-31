import {Component, Vue} from 'vue-property-decorator'
import {settingNetworkPointList, settingNetworkColorList} from '@/config/index.ts'

@Component
export class SettingNetworkTs extends Vue {
    pointList = settingNetworkPointList
    currentPoint = {}
    pointerColorList = settingNetworkColorList

    selectPoint(index) {

        let list = this.pointList
        list.map((item) => {
            item.isSelected = false
            return item
        })
        list[index].isSelected = true
        this.currentPoint = list[index]
        this.pointList = list
    }

    created() {
        this.currentPoint = this.pointList[0]
    }

}
