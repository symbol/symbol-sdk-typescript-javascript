<template>
    <div class="servicePanelWrap clear">
<!--        <div class="white_wrap">{{$t('not_yet_open')}}</div>-->
        <div class="left serviceSwitch">
            <ServiceSwitch></ServiceSwitch>
        </div>
        <div class="left serviceFn">
            <router-view/>
        </div>
    </div>
</template>

<script lang="ts">
    import './ServicePanel.less'
    import {Component, Vue} from 'vue-property-decorator'
    import ServiceSwitch from '@/views/service/service-switch/ServiceSwitch.vue'

    @Component({
        components: {
            ServiceSwitch
        },
    })
    export default class ServicePanel extends Vue{
        created(){
            this.$store.state.app.isInLoginPage = false
        }
    }
</script>

<style scoped>

</style>
