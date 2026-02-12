<template>
  <div class="product-card" @click="goToProduct">
    <div class="product-image">
      <img :src="product.image" :alt="product.name" loading="lazy" />
      <div class="product-tag" v-if="discount > 0">{{ discount }}折</div>
    </div>
    <div class="product-info">
      <h3 class="product-name ellipsis-2">{{ product.name }}</h3>
      <div class="product-price">
        <span class="current-price price">{{ product.price }}</span>
        <span class="original-price" v-if="product.originalPrice > product.price">
          ¥{{ product.originalPrice }}
        </span>
      </div>
      <div class="product-meta">
        <span class="sales">{{ formatSales(product.sales) }}人付款</span>
        <span class="shop ellipsis">{{ product.shop }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const discount = computed(() => {
  if (props.product.originalPrice > props.product.price) {
    return Math.round((props.product.price / props.product.originalPrice) * 10)
  }
  return 0
})

function formatSales(sales) {
  if (sales >= 10000) {
    return (sales / 10000).toFixed(1) + '万'
  }
  return sales
}

function goToProduct() {
  router.push({ name: 'Product', params: { id: props.product.id } })
}
</script>

<style lang="scss" scoped>
.product-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
}

.product-image {
  position: relative;
  width: 100%;
  padding-top: 100%;
  background: #f5f5f5;

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .product-tag {
    position: absolute;
    top: 8px;
    left: 8px;
    padding: 4px 8px;
    background: #FF5000;
    color: #fff;
    font-size: 12px;
    border-radius: 4px;
  }
}

.product-info {
  padding: 12px;
}

.product-name {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
  height: 42px;
  margin-bottom: 8px;
  font-weight: normal;
}

.product-price {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 8px;

  .current-price {
    font-size: 18px;
  }

  .original-price {
    font-size: 12px;
    color: #999;
    text-decoration: line-through;
  }
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #999;

  .shop {
    max-width: 100px;
  }
}

.ellipsis-2 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
