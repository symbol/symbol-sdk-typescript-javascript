<template>
    <div class="servicePanelWrap clear">
        <div class="left serviceSwitch">
            <ServiceSwitch></ServiceSwitch>
        </div>
        <div class="left serviceFn">
            <router-view/>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import ServiceSwitch from '@/views/service/service-switch/ServiceSwitch.vue';
    import './ServicePanel.less';

    @Component({
        components: {
            ServiceSwitch
        },
    })
    export default class ServicePanel extends Vue{

    }
</script>

<style scoped>

</style>
