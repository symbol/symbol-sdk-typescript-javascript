import {Component, Vue} from 'vue-property-decorator'
import {settingNetworkPointList, settingNetworkColorList} from '@/config/view'

@Component
export class SettingNetworkTs extends Vue {
    pointList = settingNetworkPointList
    currentEndpoint = {}
    pointerColorList = settingNetworkColorList

    selectPoint(index) {

        let list = this.pointList
        list.map((item) => {
            item.isSelected = false
            return item
        })
        list[index].isSelected = true
        this.currentEndpoint = list[index]
        this.pointList = list
    }

    mounted() {
        this.currentEndpoint = this.pointList[0]
    }

}
