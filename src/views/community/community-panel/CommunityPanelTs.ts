import {Component, Vue} from 'vue-property-decorator'


@Component
export class CommunityPanelTs extends Vue {
    walletList = []
    navList = [
        {name: 'news', to: '/information', active: true},
        {name: 'vote', to: '/vote', active: false,},
    ]

    get nowWalletList() {
        return this.$store.state.app.walletList
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

    created() {
        this.$router.push({
            name: 'information'
        })
    }
}
