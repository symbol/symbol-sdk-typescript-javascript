<template>
  <Carousel
          class="banner_img"
          autoplay
          v-model="currentBanner"
          :radius-dot="true"
          arrow="never"
          loop>
    <CarouselItem v-for="i in 3">
      <img class="banner_img" src="../../assets/images/login/loginBanner.png" alt="">
    </CarouselItem>
  </Carousel>
</template>
<script>
  export default {
    data() {
      return {
        currentBanner: 0
      }
    }
  }
</script>
<style scoped lang="less">
  .banner_img {
    width: 1120px;
    height: 100%;
  }
</style>
