<template>
  <div class="banner-carousel">
    <el-carousel :interval="4000" height="400px">
      <el-carousel-item v-for="banner in banners" :key="banner.id">
        <div class="banner-item">
          <img :src="banner.image" :alt="banner.title" class="banner-image" />
          <div class="banner-title">{{ banner.title }}</div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup>
import { banners } from '@/api'
</script>

<style lang="scss" scoped>
.banner-carousel {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);

  :deep(.el-carousel__indicators) {
    .el-carousel__indicator {
      .el-carousel__button {
        width: 24px;
        height: 4px;
        border-radius: 2px;
        background: rgba(255, 255, 255, 0.5);
      }

      &.is-active .el-carousel__button {
        background: #fff;
      }
    }
  }
}

.banner-item {
  position: relative;
  width: 100%;
  height: 100%;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-title {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px 24px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
  color: #fff;
  font-size: 24px;
  font-weight: 500;
}
</style>
