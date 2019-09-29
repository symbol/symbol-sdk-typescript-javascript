import {Component, Vue} from 'vue-property-decorator'
import {AppLock, createMnemonic, localRead} from "@/core/utils"

@Component({
    components: {

    }
})
export class InitAccountTs extends Vue {

    jumpToOtherPage(initType) {
        this.$router.push(
            {
                name: 'initSeed',
                params: {
                    initType: initType
                }
            })
    }





}
