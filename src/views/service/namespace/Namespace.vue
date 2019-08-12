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
        <RootNamespace v-if="buttonList[0].isSelected" @createdNamespace="getMyNamespaces"></RootNamespace>
        <SubNamespace v-if="buttonList[1].isSelected" @createdNamespace="getMyNamespaces"></SubNamespace>
        <NamespaceList v-if="buttonList[2].isSelected"></NamespaceList>
      </div>
    </div>


  </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator'
    import SubNamespace from './namespace-function/sub-namespace/SubNamespace.vue'
    import RootNamespace from './namespace-function/root-namespace/RootNamespace.vue'
    import NamespaceList from './namespace-function/namespace-list/NamespaceList.vue'
    import {getNamespaces} from "@/help/appUtil"

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

        get node() {
            return this.$store.state.account.node
        }

        get getWallet() {
            return this.$store.state.account.wallet
        }

        get ConfirmedTxList() {
            return this.$store.state.account.ConfirmedTx
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

        async getMyNamespaces() {
            const list = await getNamespaces(this.getWallet.address, this.node)
            this.$store.commit('SET_NAMESPACE', list)
        }

        @Watch('ConfirmedTxList')
        onConfirmedTxChange() {
            this.getMyNamespaces()
        }

        @Watch('getWallet')
        onGetWalletChange() {
            this.getMyNamespaces()
        }

        created() {
            this.getMyNamespaces()
        }
    }
</script>

<style scoped lang="less">
  @import "Namespace.less";
</style>
