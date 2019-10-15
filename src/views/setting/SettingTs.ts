import {Component, Vue} from 'vue-property-decorator'
import {settingPanelNavigationBarConfig} from "@/config/view/setting";

@Component
export class SettingTs extends Vue {
    navigatorList = settingPanelNavigationBarConfig
    currentHeadText = ''

    jumpToView(n, index) {
        if (this.navigatorList[index].disabled) return
        let list = this.navigatorList
        list.map((item) => {
            item.isSelected = false
            return item
        })
        list[index].isSelected = true
        this.navigatorList = list
        this.currentHeadText = n.navigatorTitle
        this.$router.push({
            name: n.name
        })
    }

    created() {
        this.jumpToView(this.navigatorList[0], 0)
    }

}
