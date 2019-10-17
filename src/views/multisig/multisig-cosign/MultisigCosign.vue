<template>
  <div>
    <div>{{privatekey}}</div>
    <div>
      privatekey cosigner
      <input type="text" v-model="privatekey">
    </div>

    <div>
      publicKey
      <input v-model="publicKey" type="text">

      <div @click="getCosignTransactions" style="width: 60px;height: 30px ; background-color: #4DC2BF">search</div>

      <div>
        <div v-for="(a,index) in aggregatedTransactionList" :key="index">
          <div v-for="(value,key,index) in a" :key="`a${index}`">{{key}}:{{value}} <br> <br></div>
          <div @click="cosignTransaction(index)" style="width: 60px;height: 30px ; background-color: #4DC2BF">cosign</div>
          <br>
          <hr>
        </div>
      </div>
    </div>
  </div>  
</template>

<script lang="ts">
    import {MultisigCosignTs} from './MultisigCosignTs'
    export default class MultisigCosign extends MultisigCosignTs {}
</script>
<style scoped lang="less">
  @import "MultisigCosign.less";
</style>
