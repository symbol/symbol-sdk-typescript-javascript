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
    import {Component, Vue} from 'vue-property-decorator';
    import {
        Account,
        AccountHttp,
        NetworkType,
        PublicAccount,
        TransactionHttp,
        CosignatureTransaction,
        AggregateTransaction
    } from "nem2-sdk";

    @Component
    export default class MultisigCosign extends Vue {
        privatekey = '864F29FB3C5B4F52C5351974CEFF35D59DB7EE433C4C01AEF8E20D0147FB0A69'
        publickey = '5FA48DA997E605323BCD579ABD6FC996B18DF3289A488A12E3C9CE27C10AAC41'
        aggregatedTransactionList: Array<AggregateTransaction> = []


        async getCosignTransactions() {
            const {publickey} = this
            const {networkType} = this.$store.state.account.wallet
            const {generationHash, node} = this.$store.state.account
            const accountHttp = new AccountHttp(node);

            const publicAccount = PublicAccount.createFromPublicKey(
                publickey,
                NetworkType.MIJIN_TEST,
            );
            this.aggregatedTransactionList = await accountHttp.aggregateBondedTransactions(publicAccount).toPromise();
        }

        cosignTransaction(index) {

            const {publickey, privatekey} = this
            const {networkType} = this.$store.state.account.wallet
            const {generationHash, node} = this.$store.state.account

            const endpoint = node;
            const account = Account.createFromPrivateKey(privatekey, NetworkType.MIJIN_TEST)
            const transactionHttp = new TransactionHttp(endpoint);
            const emitter = (type, value) => {
                this.$emit(type, value);
            };
            const cosignatureTransaction = CosignatureTransaction.create(this.aggregatedTransactionList[index]);
            const cosignedTx = account.signCosignatureTransaction(cosignatureTransaction);
            console.log(account, cosignatureTransaction)
            console.log(cosignedTx)
            transactionHttp.announceAggregateBondedCosignature(cosignedTx).subscribe((x) => {
                console.log(x)

            });
            this.getCosignTransactions();
        }

    }
</script>
<style scoped lang="less">
  @import "MultisigCosign.less";
</style>
