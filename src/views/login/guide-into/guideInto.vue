<template>
    <div class="guideIntoWrap">
        <h1 class="pageTit">开始NEM之旅</h1>
        <div class="methodDiv">
            <Row>
                <Col span="12">
                    <div class="importDiv">
                        <div class="importIcon">
                            <img src="">
                        </div>
                        <p class="importTit">已有钱包</p>
                        <p class="importTxt">可以使用私钥、记助词或KeyStore等信息 导入已有钱包到本程序</p>
                        <Button @click="toImportPage">导入钱包</Button>
                    </div>
                </Col>
                <Col span="12">
                    <div class="createDiv">
                        <div class="createIcon">
                            <img src="">
                        </div>
                        <p class="createTit">立即创建</p>
                        <p class="createTxt">这将会创建一个新的钱包和新的种子文件</p>
                        <Button @click="toCreatePage">创建钱包</Button>
                    </div>
                </Col>
            </Row>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component({})
    export default class guideIntoWrap extends Vue{
        toImportPage () {

        }
        toCreatePage () {

        }
    }
</script>

<style scoped>

</style>
