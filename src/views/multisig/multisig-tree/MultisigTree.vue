<template>
  <div>
    <div>
      <span class="green">{{$t('min_approval')}}:</span>
      {{currentAccountMultisigInfo?currentAccountMultisigInfo.minApproval:0}}
    </div>
    <div>
      <span class="green">{{$t('min_removal')}}:</span>{{currentAccountMultisigInfo?currentAccountMultisigInfo.minRemoval:0}}
    </div>
    <Tree
      v-if="multisigTreeData"
      :data="multisigTreeData"
      @on-select-change="treeClicked"
    />
    <Tree
      v-if="cosignatoryTreeData"
      :data="cosignatoryTreeData"
      @on-select-change="treeClicked"
    />
  </div>
</template>

<script lang="ts">
    import {MultisigTreeTs} from './MultisigTreeTs'
    export default class MultisigTree extends MultisigTreeTs {}
</script>
