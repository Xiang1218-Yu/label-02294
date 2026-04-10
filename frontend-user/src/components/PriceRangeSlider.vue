<template>
  <div class="price-range-slider">
    <div class="slider-header">
      <span class="slider-title">价格筛选</span>
      <el-button
        v-if="hasFiltered"
        text
        size="small"
        class="clear-btn"
        @click="handleClear"
      >
        清除
      </el-button>
    </div>

    <div class="slider-content">
      <div class="price-inputs">
        <div class="price-input-wrapper">
          <span class="currency">¥</span>
          <el-input
            v-model.number="localMinPrice"
            type="number"
            :min="minPriceLimit"
            :max="localMaxPrice - 1"
            placeholder="最低价"
            @change="handleMinInputChange"
          />
        </div>
        <span class="separator">-</span>
        <div class="price-input-wrapper">
          <span class="currency">¥</span>
          <el-input
            v-model.number="localMaxPrice"
            type="number"
            :min="localMinPrice + 1"
            :max="maxPriceLimit"
            placeholder="最高价"
            @change="handleMaxInputChange"
          />
        </div>
      </div>

      <div class="slider-wrapper">
        <el-slider
          v-model="sliderValue"
          range
          :min="minPriceLimit"
          :max="maxPriceLimit"
          :step="1"
          :format-tooltip="formatTooltip"
          @change="handleSliderChange"
        />
      </div>

      <div class="price-range-display">
        <span>¥{{ formatPrice(localMinPrice) }}</span>
        <span> - </span>
        <span>¥{{ formatPrice(localMaxPrice) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

/**
 * 定义组件props
 * @property {number} minPriceLimit - 价格范围下限（来自搜索结果商品的最小价格）
 * @property {number} maxPriceLimit - 价格范围上限（来自搜索结果商品的最大价格）
 * @property {number|null} currentMinPrice - 当前选中的最低价格
 * @property {number|null} currentMaxPrice - 当前选中的最高价格
 */
const props = defineProps({
  minPriceLimit: {
    type: Number,
    required: true,
    default: 0
  },
  maxPriceLimit: {
    type: Number,
    required: true,
    default: 10000
  },
  currentMinPrice: {
    type: Number,
    default: null
  },
  currentMaxPrice: {
    type: Number,
    default: null
  }
})

/**
 * 定义emit事件
 * @event update:currentMinPrice - 更新当前最低价格
 * @event update:currentMaxPrice - 更新当前最高价格
 * @event change - 价格范围变化事件
 */
const emit = defineEmits(['update:currentMinPrice', 'update:currentMaxPrice', 'change'])

// 滑块值 - 使用数组表示范围 [最小值, 最大值]
const sliderValue = ref([props.minPriceLimit, props.maxPriceLimit])

// 输入框绑定的值
const localMinPrice = ref(props.minPriceLimit)
const localMaxPrice = ref(props.maxPriceLimit)

/**
 * 监听价格范围限制变化（当搜索结果变化时）
 * 当搜索关键词变化导致商品价格范围变化时，重置滑块到新的范围
 */
watch(() => [props.minPriceLimit, props.maxPriceLimit], ([newMinLimit, newMaxLimit]) => {
  // 更新滑块的范围限制
  sliderValue.value = [newMinLimit, newMaxLimit]
  // 同步更新输入框的值
  localMinPrice.value = newMinLimit
  localMaxPrice.value = newMaxLimit
  // 清除之前的筛选条件
  emit('update:currentMinPrice', null)
  emit('update:currentMaxPrice', null)
  emit('change', { minPrice: null, maxPrice: null })
}, { immediate: true })

/**
 * 监听外部传入的当前价格值变化
 */
watch(() => [props.currentMinPrice, props.currentMaxPrice], ([newMin, newMax]) => {
  const min = newMin !== null && newMin !== undefined ? newMin : props.minPriceLimit
  const max = newMax !== null && newMax !== undefined ? newMax : props.maxPriceLimit
  sliderValue.value = [min, max]
  localMinPrice.value = min
  localMaxPrice.value = max
})

/**
 * 监听滑块值变化，同步更新输入框
 */
watch(sliderValue, (newValue) => {
  localMinPrice.value = newValue[0]
  localMaxPrice.value = newValue[1]
})

/**
 * 判断是否已经设置了筛选条件
 * @returns {boolean} 是否有价格筛选
 */
const hasFiltered = computed(() => {
  return localMinPrice.value > props.minPriceLimit || localMaxPrice.value < props.maxPriceLimit
})

/**
 * 格式化价格显示
 * @param {number} value - 价格值
 * @returns {string} 格式化后的价格字符串
 */
function formatPrice(value) {
  if (value >= 10000) {
    return (value / 10000).toFixed(1) + '万'
  }
  return value.toString()
}

/**
 * 格式化滑块tooltip显示
 * @param {number} value - 价格值
 * @returns {string} 格式化后的tooltip文本
 */
function formatTooltip(value) {
  return `¥${formatPrice(value)}`
}

/**
 * 处理滑块变化
 * @param {Array} value - 滑块值数组 [最小值, 最大值]
 */
function handleSliderChange(value) {
  localMinPrice.value = value[0]
  localMaxPrice.value = value[1]
  emit('update:currentMinPrice', value[0])
  emit('update:currentMaxPrice', value[1])
  emit('change', { minPrice: value[0], maxPrice: value[1] })
}

/**
 * 处理最小价输入框变化
 * @param {number|string} value - 输入的值
 */
function handleMinInputChange(value) {
  if (value === '' || value === null) {
    localMinPrice.value = props.minPriceLimit
  } else {
    // 确保最小价不超过最大价减1
    if (value >= localMaxPrice.value) {
      localMinPrice.value = localMaxPrice.value - 1
    } else if (value < props.minPriceLimit) {
      localMinPrice.value = props.minPriceLimit
    }
  }
  sliderValue.value = [localMinPrice.value, localMaxPrice.value]
  emit('update:currentMinPrice', localMinPrice.value)
  emit('change', { minPrice: localMinPrice.value, maxPrice: localMaxPrice.value })
}

/**
 * 处理最大价输入框变化
 * @param {number|string} value - 输入的值
 */
function handleMaxInputChange(value) {
  if (value === '' || value === null) {
    localMaxPrice.value = props.maxPriceLimit
  } else {
    // 确保最大价不小于最小价加1
    if (value <= localMinPrice.value) {
      localMaxPrice.value = localMinPrice.value + 1
    } else if (value > props.maxPriceLimit) {
      localMaxPrice.value = props.maxPriceLimit
    }
  }
  sliderValue.value = [localMinPrice.value, localMaxPrice.value]
  emit('update:currentMaxPrice', localMaxPrice.value)
  emit('change', { minPrice: localMinPrice.value, maxPrice: localMaxPrice.value })
}

/**
 * 清除筛选条件，重置为当前搜索结果的价格范围
 */
function handleClear() {
  localMinPrice.value = props.minPriceLimit
  localMaxPrice.value = props.maxPriceLimit
  sliderValue.value = [props.minPriceLimit, props.maxPriceLimit]
  emit('update:currentMinPrice', null)
  emit('update:currentMaxPrice', null)
  emit('change', { minPrice: null, maxPrice: null })
}
</script>

<style lang="scss" scoped>
.price-range-slider {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  .slider-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .slider-title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }

    .clear-btn {
      color: #FF5000;
      font-size: 12px;
    }
  }

  .slider-content {
    .price-inputs {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;

      .price-input-wrapper {
        flex: 1;
        display: flex;
        align-items: center;
        background: #f5f5f5;
        border-radius: 4px;
        padding: 0 8px;

        .currency {
          color: #666;
          font-size: 14px;
        }

        :deep(.el-input) {
          .el-input__wrapper {
            background: transparent;
            box-shadow: none;
          }

          .el-input__inner {
            text-align: center;
          }
        }
      }

      .separator {
        color: #999;
        flex-shrink: 0;
      }
    }

    .slider-wrapper {
      padding: 0 8px;

      :deep(.el-slider) {
        .el-slider__runway {
          height: 4px;
        }

        .el-slider__bar {
          height: 4px;
          background: #FF5000;
        }

        .el-slider__button {
          width: 16px;
          height: 16px;
          border: 2px solid #FF5000;
          background: #fff;
        }
      }
    }

    .price-range-display {
      text-align: center;
      margin-top: 12px;
      font-size: 14px;
      color: #666;
    }
  }
}
</style>
