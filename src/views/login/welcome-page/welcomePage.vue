<template>
    <div class="welcomePage">
        <div class="logo">
            <img src="">
        </div>
        <p class="welcomeTxt1">欢迎使用CATAPULT-NANO-Wallet测试版</p>
        <p class="welcomeTxt2">现在你已经是一个NEMBER了，快来探索CATAPULT精彩之旅吧</p>
        <div class="methodWrap">
            <div class="methods clear">
                <div class="methodImgDiv left">
                    <img src="">
                </div>
            </div>
            <p class="remindTxt"></p>
        </div>
        <Button @click="toPage">Get Started</Button>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component({
        components: {}
    })
    export default class welcomePage extends Vue{
        methodTxt:any = [
            {img:'', txt:'只需1分钟的时间，几乎立即发送和接收XEM !'},
        ]
        methodIndex = 0

        changeMethodShow () {

        }

        toPage () {

        }
    }
</script>
