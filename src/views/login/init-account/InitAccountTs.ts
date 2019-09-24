import {Component, Vue} from 'vue-property-decorator'
@Component
export class InitAccountTs extends Vue {
    jumpToOtherPage(initType) {
        this.$router.push(
            {
                name: 'initSeed',
                params: {
                    initType:initType
                }
            })
    }
}
