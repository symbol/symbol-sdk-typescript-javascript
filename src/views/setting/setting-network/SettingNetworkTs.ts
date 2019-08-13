import {Component, Vue} from 'vue-property-decorator';

@Component
export class SettingNetworkTs extends Vue {
    pointList = [
        {
            name: 'NEM_PRIVATE_1',
            rpcUrl: 'Https://12.10.0.10',
            chainId: 1,
            symbol: 'XEM',
            exploerUrl: 'https://nodeexplorer.com/',
            isSelected: true
        }, {
            name: 'NEM_MAIN',
            rpcUrl: 'Https://12.10.0.10',
            chainId: 2,
            symbol: 'XEM',
            exploerUrl: 'https://nodeexplorer.com/',
            isSelected: false
        },
        {
            name: 'NEM_MAIN_NET',
            rpcUrl: 'Https://12.10.0.10',
            chainId: 2,
            symbol: 'XEM',
            exploerUrl: 'https://nodeexplorer.com/',
            isSelected: false
        }
    ]
    currentPoint = {}
    pointerColorList = ['green_point', 'pink_point', 'purple_point', 'yellow_point']

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
