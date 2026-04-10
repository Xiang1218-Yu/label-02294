// 模拟 API 数据

// 轮播图数据 - 电商主题图片
export const banners = [
  { id: 1, image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop', title: '双十一狂欢节' },
  { id: 2, image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=400&fit=crop', title: '时尚女装新品' },
  { id: 3, image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop', title: '品牌特卖' },
  { id: 4, image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&h=400&fit=crop', title: '限时秒杀' }
]

// 推荐商品数据 - 使用贴合商品主题的固定图片
export const recommendProducts = [
  { id: 1, name: '2024新款春季连衣裙女装气质显瘦中长款', price: 199, originalPrice: 399, sales: 5234, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=300&fit=crop', shop: '时尚女装旗舰店' },
  { id: 2, name: 'Apple iPhone 15 Pro Max 256GB 原色钛金属', price: 9999, originalPrice: 10999, sales: 12890, image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop', shop: 'Apple官方旗舰店' },
  { id: 3, name: 'Apple iPhone 15 128GB 蓝色', price: 5999, originalPrice: 6299, sales: 15678, image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop', shop: 'Apple官方旗舰店' },
  { id: 4, name: 'Apple iPhone 15 Pro 128GB 白色钛金属', price: 7999, originalPrice: 8299, sales: 9876, image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop', shop: 'Apple官方旗舰店' },
  { id: 5, name: 'Apple iPhone SE 2024 64GB 星光色', price: 3499, originalPrice: 3799, sales: 7654, image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop', shop: 'Apple官方旗舰店' },
  { id: 6, name: '小米14 Ultra 徕卡光学镜头 骁龙8Gen3', price: 6499, originalPrice: 6999, sales: 8765, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop', shop: '小米官方旗舰店' },
  { id: 7, name: '华为MateBook X Pro 2024款超轻薄笔记本', price: 11999, originalPrice: 12999, sales: 3456, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop', shop: '华为官方旗舰店' },
  { id: 8, name: '耐克Air Jordan 1 High OG 复刻运动鞋篮球鞋', price: 1299, originalPrice: 1599, sales: 9876, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop', shop: 'Nike官方旗舰店' },
  { id: 9, name: '香氛精华香味清新持久 30ml', price: 88, originalPrice: 280, sales: 15678, image: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=300&h=300&fit=crop', shop: '花漾官方旗舰店' },
  { id: 10, name: '戴森V15 Detect无绳吸尘器 激光探测', price: 4990, originalPrice: 5490, sales: 4567, image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=300&h=300&fit=crop', shop: '戴森官方旗舰店' },
  { id: 11, name: '索尼WH-1000XM5头戴式无线降噪耳机', price: 2499, originalPrice: 2999, sales: 7890, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop', shop: 'Sony官方旗舰店' }
]

// 热门搜索
export const hotSearches = ['iPhone', '连衣裙', '运动鞋', '笔记本', '耳机']

// 获取商品详情
export function getProductById(id) {
  return recommendProducts.find(p => p.id === Number(id)) || null
}

// 获取所有商品中的最低价格
export function getMinPrice(products = recommendProducts) {
  return Math.min(...products.map(p => p.price))
}

// 获取所有商品中的最高价格
export function getMaxPrice(products = recommendProducts) {
  return Math.max(...products.map(p => p.price))
}

// 搜索商品 - 支持关键词和价格范围过滤
export function searchProducts(keyword, minPrice = 0, maxPrice = 0) {
  let results = recommendProducts

  // 关键词过滤
  if (keyword && keyword.trim()) {
    const lowerKeyword = keyword.toLowerCase().trim()
    results = results.filter(p => 
      p.name.toLowerCase().includes(lowerKeyword) || 
      p.shop.toLowerCase().includes(lowerKeyword)
    )
  }

  // 价格范围过滤
  if (minPrice > 0 || maxPrice > 0) {
    results = results.filter(p => {
      const price = p.price
      if (minPrice > 0 && maxPrice > 0) {
        return price >= minPrice && price <= maxPrice
      } else if (minPrice > 0) {
        return price >= minPrice
      } else if (maxPrice > 0) {
        return price <= maxPrice
      }
      return true
    })
  }

  return results
}
