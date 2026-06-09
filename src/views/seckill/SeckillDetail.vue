<template>
  <div class="detail-container">
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item><a href="/seckill">秒杀商品</a></el-breadcrumb-item>
      <el-breadcrumb-item>{{ product.productName }}</el-breadcrumb-item>
    </el-breadcrumb>
    
    <el-card class="detail-card">
      <div class="detail-content">
        <div class="product-image-container">
          <div class="image-carousel" @mouseenter="showControls = true" @mouseleave="showControls = false">
            <div class="carousel-main">
              <img 
                :src="currentImage" 
                :alt="product.productName" 
                class="main-image"
              />
              <div class="seckill-badge">限时秒杀</div>
            </div>
            
            <button 
              class="carousel-btn prev-btn" 
              :class="{ show: showControls || product.images && product.images.length > 1 }"
              @click="prevImage"
              :disabled="!hasPrev"
            >
              <i class="el-icon-arrow-left"></i>
            </button>
            
            <button 
              class="carousel-btn next-btn" 
              :class="{ show: showControls || product.images && product.images.length > 1 }"
              @click="nextImage"
              :disabled="!hasNext"
            >
              <i class="el-icon-arrow-right"></i>
            </button>
            
            <div class="image-indicators" v-if="product.images && product.images.length > 1">
              <span 
                v-for="(img, index) in product.images" 
                :key="index"
                class="indicator"
                :class="{ active: currentIndex === index }"
                @click="goToImage(index)"
              ></span>
            </div>
          </div>
          
          <div class="image-thumbs" v-if="product.images && product.images.length > 1">
            <div 
              v-for="(img, index) in product.images" 
              :key="index"
              class="thumb-item"
              :class="{ active: currentIndex === index }"
              @click="goToImage(index)"
            >
              <img :src="img" :alt="`图片${index + 1}`" />
            </div>
          </div>
        </div>
        
        <div class="product-info">
          <h1 class="product-name">{{ product.productName }}</h1>
          <p class="product-desc">{{ product.summary }}</p>
          
          <div class="price-section">
            <div class="price-row">
              <span class="seckill-price">¥{{ product.seckillPrice }}</span>
              <span class="original-price">¥{{ product.originalPrice }}</span>
            </div>
            <div class="save-info">
              <span>立省 ¥{{ product.originalPrice - product.seckillPrice }}</span>
              <el-tag type="danger" class="discount-tag">{{ product.discount }}折</el-tag>
            </div>
          </div>
          
          <div class="stock-section">
            <span class="label">库存：</span>
            <span :class="product.stock > 10 ? 'stock-high' : (product.stock > 0 ? 'stock-low' : 'stock-empty')">
              {{ product.stock > 0 ? `剩余 ${product.stock} 件` : '已抢光' }}
            </span>
            <span class="sales">已售 {{ product.sales }} 件</span>
          </div>
          
          <div class="time-section">
            <span class="label">秒杀时间：</span>
            <span class="time">{{ product.startTimeStr }} - {{ product.endTimeStr }}</span>
          </div>
          
          <div class="action-section">
            <div class="buttons">
              <el-button 
                type="danger" 
                class="buy-btn" 
                :disabled="product.status !== 'active' || product.stock === 0"
                @click="handleBuy"
              >
                {{ product.status === 'active' && product.stock > 0 ? '立即抢购' : (product.status === 'upcoming' ? '即将开始' : '已结束') }}
              </el-button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="product-detail">
        <el-tabs type="border-card">
          <el-tab-pane label="商品详情">
            <div class="detail-content-inner">
              <h3>产品特点</h3>
              <span>{{product.description}}</span>
            </div>
          </el-tab-pane>
          <el-tab-pane label="售后服务">
            <div class="service-content">
              <div class="service-item">
                <i class="el-icon-shield"></i>
                <span>正品保障</span>
              </div>
              <div class="service-item">
                <i class="el-icon-truck"></i>
                <span>顺丰包邮</span>
              </div>
              <div class="service-item">
                <i class="el-icon-refresh-left"></i>
                <span>7天无理由退换</span>
              </div>
              <div class="service-item">
                <i class="el-icon-headphones"></i>
                <span>24小时客服</span>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script>
import productApi from '@/api/product'
import seckillApi from '@/api/seckill'

export default {
  name: 'SeckillDetail',
  data() {
    return {
      quantity: 1,
      selectedSpec: '',
      product: {},
      currentIndex: 0,
      showControls: false,
      productId: 0
    }
  },
  computed: {
    currentImage() {
      if (this.product.images && this.product.images.length > 0) {
        return this.product.images[this.currentIndex]
      }
      return this.product.image || ''
    },
    hasPrev() {
      return this.currentIndex > 0
    },
    hasNext() {
      if (!this.product.images || this.product.images.length === 0) return false
      return this.currentIndex < this.product.images.length - 1
    }
  },
  created() {
    this.productId = this.$route.params.id
    this.loadProduct()
  },
  methods: {
    loadProduct() {
      this.$loading({ text: '努力查询中...' })
      productApi.getSeckillProductDetail({productId: this.productId}).then(res => {
        this.$loading().close()
        if (res.code === 200) {
          this.product = res.data
          this.currentIndex = 0
        } else {
          this.$message.error(res.msg)
        }
      }).catch(error => {
        this.$loading().close()
        this.$message.error(error.message || '查询失败')
      })
    },
    prevImage() {
      if (this.hasPrev) {
        this.currentIndex--
      }
    },
    nextImage() {
      if (this.hasNext) {
        this.currentIndex++
      }
    },
    goToImage(index) {
      this.currentIndex = index
    },
    handleBuy() {
      this.$loading({ text: '抢购中...' })
      const that = this
      seckillApi.secKillProduct(this.productId).then(res => {
        this.$loading().close()
        if (res.code === 200) {
          // 跳转到待支付页面
          const orderNo = res.data
          this.$router.push({path: '/orders/pay', query: {orderNo: orderNo, productId: that.productId}})
        } else {
          this.$message.warning(res.msg)
        }
      }).catch(error => {
        this.$loading().close()
        this.$message.error(error.message || '查询失败')
      })
    }
  }
}
</script>

<style scoped>
.detail-container {
  padding: 20px;
}

.breadcrumb {
  margin-bottom: 20px;
}

.detail-card {
  padding: 0;
}

.detail-content {
  display: flex;
  gap: 40px;
  padding: 30px;
  border-bottom: 1px solid #eee;
}

.product-image-container {
  width: 400px;
  flex-shrink: 0;
}

.image-carousel {
  position: relative;
  width: 100%;
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
}

.carousel-main {
  position: relative;
  width: 100%;
  height: 100%;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.seckill-badge {
  position: absolute;
  top: 20px;
  left: 20px;
  background: linear-gradient(135deg, #ff4757, #ff6b81);
  color: #fff;
  padding: 8px 20px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  z-index: 10;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-btn.show {
  opacity: 1;
}

.carousel-btn:hover {
  background: rgba(0, 0, 0, 0.7);
}

.carousel-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.prev-btn {
  left: 10px;
}

.next-btn {
  right: 10px;
}

.image-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 10;
}

.indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: background 0.3s ease;
}

.indicator.active {
  background: #fff;
}

.image-thumbs {
  display: flex;
  gap: 10px;
  margin-top: 15px;
  overflow-x: auto;
}

.thumb-item {
  width: 80px;
  height: 80px;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.3s ease;
  flex-shrink: 0;
}

.thumb-item:hover {
  border-color: #ff4757;
}

.thumb-item.active {
  border-color: #ff4757;
}

.thumb-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  flex: 1;
}

.product-name {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 15px 0;
}

.product-desc {
  font-size: 14px;
  color: #666;
  margin: 0 0 20px 0;
  line-height: 1.6;
}

.price-section {
  background: #fff5f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.price-row {
  display: flex;
  align-items: baseline;
  gap: 15px;
}

.seckill-price {
  font-size: 36px;
  font-weight: bold;
  color: #ff4757;
}

.original-price {
  font-size: 18px;
  color: #999;
  text-decoration: line-through;
}

.save-info {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.save-info span:first-child {
  color: #ff4757;
  font-weight: 500;
}

.discount-tag {
  font-size: 12px;
}

.stock-section {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.stock-section .label {
  color: #666;
}

.stock-high {
  color: #67c23a;
}

.stock-low {
  color: #e6a23c;
}

.stock-empty {
  color: #f56c6c;
}

.sales {
  color: #999;
  font-size: 14px;
}

.time-section {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  color: #666;
}

.action-section {
  display: flex;
  align-items: center;
  gap: 30px;
}

.buttons {
  display: flex;
  gap: 15px;
}

.buy-btn {
  width: 150px;
  height: 44px;
  font-size: 16px;
}

.buy-btn[disabled] {
  background: #ccc;
  border-color: #ccc;
}

.product-detail {
  padding: 30px;
}

.detail-content-inner {
  padding: 20px;
}

.detail-content-inner h3 {
  font-size: 16px;
  color: #333;
  margin: 0 0 15px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.service-content {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  padding: 20px;
}

.service-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #666;
}

.service-item i {
  font-size: 24px;
  color: #409eff;
}
</style>
