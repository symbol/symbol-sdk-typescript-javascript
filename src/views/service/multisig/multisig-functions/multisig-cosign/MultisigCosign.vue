<template>
  <div>


    <div>{{privatekey}}</div>
    <div>
      privatekey cosigner
      <input type="text" v-model="privatekey">
    </div>

    <div>
      publickey
      <input v-model="publickey" type="text">
    </div>


    <div @click="getCosignTransactions" style="width: 60px;height: 30px ; background-color: #4DC2BF">查询</div>

    <div>
      <div v-for="(a,index) in aggregatedTransactionList">
        <div v-for="(value,key,index) in a">{{key}}:{{value}} <br> <br></div>
        <div @click="cosignTransaction(index)" style="width: 60px;height: 30px ; background-color: #4DC2BF">cosign</div>
        <br>
        <hr>
      </div>
    </div>
  </div>


</template>

<script lang="ts">
    import {MultisigCosignTs} from './MultisigCosignTs'

    export default class MultisigCosign extends MultisigCosignTs {

    }
</script>
<style scoped lang="less">
  @import "MultisigCosign.less";
</style>
