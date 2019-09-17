import {Component, Vue} from 'vue-property-decorator'
import {mapState} from "vuex"
import {communityPanelNavList} from '@/config/view'


@Component({
    computed: {
        ...mapState({
            app: 'app',
        })
    }
})
export class CommunityPanelTs extends Vue {
    walletList = []
    app: any
    navList = communityPanelNavList

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

    mounted() {
        this.goToPage(this.navList[0])
        this.$router.push({
            name: 'information'
        })
    }
}
