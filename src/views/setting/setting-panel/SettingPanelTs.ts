import {Component, Vue} from 'vue-property-decorator';

@Component
export class SettingPanelTs extends Vue {
    navagatorList = [
        {
            title: 'general_settings',
            name: 'settingNormal',
            isSelected: true
        }, {
            title: 'lock_password',
            name: 'settingLock',
            isSelected: false
        }, {
            title: 'network_settings',
            name: 'settingNetwork',
            isSelected: false,
            disabled: true
        }, {
            title: 'about',
            name: 'settingAbout',
            isSelected: false
        }
    ]
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
        this.currentHeadText = n.title
        this.$router.push({
            name: n.name
        })
    }

    created() {
        this.currentHeadText = this.navagatorList[0].title
    }

}
