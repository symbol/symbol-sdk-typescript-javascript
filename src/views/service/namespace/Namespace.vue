<template>
  <div class="namespace_container">
    <div class="top_navigator radius">
      <span class="button_list_item " v-for="(b,index) in buttonList">
        <span :class="['name',b.isSelected?'active':'','pointer']" @click="switchButton(index)">{{$t(b.name)}}</span>
        <span class="line" v-if="index !== (buttonList.length -1) ">|</span>
      </span>
    </div>

    <div class="sub_function_container scroll radius">

      <div class="right_panel">
        <!--<NamespaceTransaction v-if="buttonList[0].isSelected"></NamespaceTransaction>-->
        <RootNamespace v-if="buttonList[0].isSelected" @createdNamespace="getMyNamespaces"></RootNamespace>
        <SubNamespace v-if="buttonList[1].isSelected" @createdNamespace="getMyNamespaces"></SubNamespace>
        <NamespaceList v-if="buttonList[2].isSelected"></NamespaceList>
      </div>
    </div>


  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import NamespaceTransaction from './namespace-function/namespace-transacrion/NamespaceTransaction.vue'
    import RootNamespace from './namespace-function/rootNamespace/RootNamespace.vue'
    import SubNamespace from './namespace-function/subNamespace/SubNamespace.vue'
    import NamespaceList from './namespace-function/namespace-list/NamespaceList.vue'
    import {aliasInterface} from "../../../interface/sdkNamespace";
    import {Address} from "nem2-sdk";

    @Component({
        components: {
            RootNamespace,
            SubNamespace,
            NamespaceList,
        }
    })
    export default class Namespace extends Vue {
        buttonList = [
            {
                name: 'Create_namespace',
                isSelected: true
            }, {
                name: 'Create_subNamespace',
                isSelected: false
            }, {
                name: 'Namespace_list',
                isSelected: false
            }
        ]

        get node (){
            return this.$store.state.account.node
        }

        get getWallet () {
            return this.$store.state.account.wallet
        }

        switchButton(index) {
            let list = this.buttonList
            list = list.map((item) => {
                item.isSelected = false
                return item
            })
            list[index].isSelected = true
            this.buttonList = list
        }

        async getMyNamespaces () {
            await aliasInterface.getNamespacesFromAccount({
                address: Address.createFromRawAddress(this.getWallet.address),
                url: this.node
            }).then((namespacesFromAccount)=>{
                const list = namespacesFromAccount.result.namespaceList
                console.log(list)
                this.$store.commit('SET_NAMESPACE', list)
            })
        }

        created () {
            this.getMyNamespaces()
        }
    }
</script>

<style scoped lang="less">
  @import "Namespace.less";
</style>
