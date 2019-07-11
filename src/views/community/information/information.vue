<template>
    <div class="informationWrap">
        <div class="content">

        </div>
        <div class="scrollWrap">
            <div class="scroll"></div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import './information.less';


    @Component({
        components: {},
    })
    export default class information extends Vue{
        walletList = []

    }
</script>

<style scoped>

</style>
