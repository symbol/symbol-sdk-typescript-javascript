import {Component, Vue} from 'vue-property-decorator'
import {settingPanelNavigationBar} from '@/config/view'

@Component
export class SettingPanelTs extends Vue {
    navagatorList = settingPanelNavigationBar
    currentHeadText = ''

    jumpToView(n, index) {
        if (this.navagatorList[index].disabled) return
        let list = this.navagatorList
        list.map((item) => {
            item.isSelected = false
            return item
        })
        list[index].isSelected = true
        this.navagatorList = list
        this.currentHeadText = n.navigatorTitle
        this.$router.push({
            name: n.name
        })
    }

    created() {
        this.jumpToView(this.navagatorList[0], 0)
    }

}
