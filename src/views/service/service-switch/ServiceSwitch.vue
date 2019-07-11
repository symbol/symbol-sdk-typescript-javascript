<template>
    <div class="serviceSwitchWrap">
        <div class="serviceSwitchHead">
            <p class="tit">服务</p>
        </div>
        <div class="serviceList">
            <div :class="['serviceItem', item.active?'active':'']" v-for="(item,index) in serviceFnList" @click="toPage(item)" :key="index">
                <div class="serviceName"><i><img :src="nowIcon(item)"></i> <span>{{item.name}}</span></div>
                <p class="serviceTxt" v-if="item.active">{{item.introduce}}</p>
            </div>
        </div>
    </div>
</template>

<script>
    import {Component, Vue} from 'vue-property-decorator';
    import './ServiceSwitch.less'
    import multisign1Icon from '../../../assets/images/service/multisign1.png'
    import multisign2Icon from '../../../assets/images/service/multisign2.png'
    import namespace1Icon from '../../../assets/images/service/namespace1.png'
    import namespace2Icon from '../../../assets/images/service/namespace2.png'
    import mosaic1Icon from '../../../assets/images/service/mosaic1.png'
    import mosaic2Icon from '../../../assets/images/service/mosaic2.png'
    import harvest1Icon from '../../../assets/images/service/harvest1.png'
    import harvest2Icon from '../../../assets/images/service/harvest2.png'
    import apostille1Icon from '../../../assets/images/service/apostille1.png'
    import apostille2Icon from '../../../assets/images/service/apostille2.png'
    import address1Icon from '../../../assets/images/service/address1.png'
    import address2Icon from '../../../assets/images/service/address2.png'
    import exchange1Icon from '../../../assets/images/service/exchange1.png'
    import exchange2Icon from '../../../assets/images/service/exchange2.png'

    @Component
    export default class serviceSwitch extends Vue {
        serviceFnList = [
            {
                name:'多重签名',
                to:'/onDev',
                iconDefault:multisign1Icon,
                iconActive:multisign2Icon,
                introduce:'多重签名账户中提供可编辑的链上协议，是存储资金，实现共有账户的最佳实现方式。',
                active:true
            },  {
                name:'命名空间',
                to:'/onDev',
                iconDefault:namespace1Icon,
                iconActive:namespace2Icon,
                introduce:'命名空间是存储马赛克的域名，每个命名空间在区块链中唯一，可在多层子命名空间上定义和认证马赛克。',
                active:false
            },  {
                name:'马赛克',
                to:'/onDev',
                iconDefault:mosaic1Icon,
                iconActive:mosaic2Icon,
                introduce:'NEM马赛克是具备丰富属性和功能的智能资产。如需创建马赛克，必须为账户置备根命名空间。',
                active:false
            },
            // {
            //     name:'委托收获',
            //     to:'/onDev',
            //     iconDefault:harvest1Icon,
            //     iconActive:harvest2Icon,
            //     introduce:'多重签名账户中提供可编辑的链上协议，是存储资金，实现共有账户的最佳实现方式',
            //     active:false
            // },
            {
                name:'公证',
                to:'/onDev',
                iconDefault:apostille1Icon,
                iconActive:apostille2Icon,
                introduce:'多重签名账户中提供可编辑的链上协议，是存储资金，实现共有账户的最佳实现方式',
                active:false
            },  {
                name:'地址簿',
                to:'/onDev',
                iconDefault:address1Icon,
                iconActive:address2Icon,
                introduce:'多重签名账户中提供可编辑的链上协议，是存储资金，实现共有账户的最佳实现方式',
                active:false
            },{
                name:'Instant Exchanges',
                to:'/onDev',
                iconDefault:exchange1Icon,
                iconActive:exchange2Icon,
                introduce:'多重签名账户中提供可编辑的链上协议，是存储资金，实现共有账户的最佳实现方式',
                active:false
            },
        ]

        nowIcon (item) {
            return item.active?item.iconActive:item.iconDefault
        }

        toPage (item) {
            for(let i in this.serviceFnList){
                if(this.serviceFnList[i].name == item.name){
                    this.serviceFnList[i].active = true
                }else {
                    this.serviceFnList[i].active = false
                }
            }
            this.$router.push({path:item.to})
        }

        created () {
            this.toPage(this.serviceFnList[0])
        }
    }
</script>

<style scoped>

</style>
