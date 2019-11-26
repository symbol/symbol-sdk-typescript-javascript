import {Component, Vue} from 'vue-property-decorator'
import {mapState} from "vuex"
import {communityPanelNavConfig} from "@/config/view/community";
import {AppInfo} from '@/core/model'

@Component({
    computed: {
        ...mapState({
            app: 'app',
        })
    }
})
export class CommunityTs extends Vue {
    walletList = []
    app: AppInfo
    navList = communityPanelNavConfig

    get nowWalletList() {
        return this.app.walletList
    }

    goToPage(item) {
        if (item.disabled) {
            return
        }
        for (let i in this.navList) {
            if (this.navList[i].to == item.to) {
                this.navList[i].active = true
                continue
            }
            this.navList[i].active = false
        }
        this.$router.push({path: item.to})
    }
}
