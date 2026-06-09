<template>
  <div class="detail-container">
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item><a href="/orders">订单管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>订单详情</el-breadcrumb-item>
    </el-breadcrumb>
    
    <el-card class="detail-card" v-if="order">
      <div class="card-header">
        <div class="order-info">
          <span class="order-no">订单编号：{{ order.orderNo }}</span>
          <el-tag :type="statusType" class="status-tag">{{ order.statusStr }}</el-tag>
        </div>
      </div>
      
      <div class="section-title">
        <i class="el-icon-goods"></i>
        <span>商品信息</span>
      </div>
      
      <div class="product-card" @click="goToProductDetail(product.id)">
        <img :src="product.productImage" :alt="product.productName" class="product-image" />
        <div class="product-info">
          <h3 class="product-name">{{ product.productName }}</h3>
          <p class="product-desc">{{ product.summary }}</p>
          <div class="product-meta">
            <span class="price">¥{{ order.productAmount }}</span>
            <span class="quantity">x{{ order.quantity }}</span>
          </div>
        </div>
      </div>
      
      <div class="section-title">
        <i class="el-icon-map-location"></i>
        <span>收货地址</span>
      </div>
      
      <div class="address-card" v-if="address">
        <div class="address-header">
          <span class="address-name">{{ address.receiverName }}</span>
          <span class="address-phone">{{ address.receiverPhone }}</span>
        </div>
        <p class="address-detail">{{ address.province }}{{ address.city }}{{ address.district }}{{ address.detail }}</p>
      </div>
      
      <div class="section-title">
        <i class="el-icon-truck"></i>
        <span>物流信息</span>
      </div>
      
      <div class="logistics-card" v-if="logistics">
        <div class="logistics-header">
          <span class="logistics-name">{{ logistics.company }}</span>
          <span class="logistics-no">{{ logistics.trackingNo }}</span>
        </div>
        <div class="logistics-timeline">
          <div 
            v-for="(item, index) in logistics.trackingList"
            :key="index"
            class="timeline-item"
            :class="{ active: index === 0 }"
          >
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <p class="timeline-time">{{ item.time }}</p>
              <p class="timeline-desc">{{ item.description }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="no-logistics" v-else>
        <div class="empty-icon">📦</div>
        <p>{{ order.status === 0 ? '订单待支付，暂无物流信息' : '物流信息暂未更新' }}</p>
      </div>
      
      <div class="section-title">
        <i class="el-icon-receipt"></i>
        <span>订单详情</span>
      </div>
      
      <div class="detail-info">
        <div class="detail-row">
          <span class="label">商品金额</span>
          <span class="value">¥{{ order.productAmount }}</span>
        </div>
        <div class="detail-row">
          <span class="label">运费</span>
          <span class="value">¥{{ order.shippingFee }}</span>
        </div>
        <div class="detail-row">
          <span class="label">优惠金额</span>
          <span class="value discount">-¥{{ 0 }}</span>
        </div>
        <div class="detail-row total">
          <span class="label">实付金额</span>
          <span class="value">¥{{ order.payAmount }}</span>
        </div>
        <div class="detail-row">
          <span class="label">支付方式</span>
          <span class="value">{{ getPaymentMethodName(order.paymentChannel) }}</span>
        </div>
        <div class="detail-row">
          <span class="label">创建时间</span>
          <span class="value">{{ order.createTime }}</span>
        </div>
        <div class="detail-row" v-if="order.payTime">
          <span class="label">支付时间</span>
          <span class="value">{{ order.payTime }}</span>
        </div>
        <div class="detail-row" v-if="order.shippingTime">
          <span class="label">发货时间</span>
          <span class="value">{{ order.shippingTime }}</span>
        </div>
        <div class="detail-row" v-if="order.completeTime">
          <span class="label">完成时间</span>
          <span class="value">{{ order.completeTime }}</span>
        </div>
      </div>
      
      <div class="action-section">
        <el-button v-if="order.status === 0" @click="goToPay">去支付</el-button>
        <el-button v-if="order.status === 0" type="danger" @click="cancelOrder">取消订单</el-button>
        <el-button v-if="order.status === 1" type="primary" @click="confirmReceipt">确认收货</el-button>
        <el-button v-if="order.status === 1" type="primary" @click="goToReview">去评价</el-button>
      </div>
    </el-card>
    
    <el-card class="detail-card" v-else>
      <div class="empty-state">
        <i class="el-icon-info"></i>
        <p>订单信息加载中...</p>
      </div>
    </el-card>
  </div>
</template>

<script>
import orderApi from '@/api/order'

export default {
  name: 'OrderDetail',
  data() {
    return {
      order: null,
      address: null,
      product: null,
      logistics: null
    }
  },
  computed: {
    statusType() {
      const types = {
        'pending_pay': 'warning',
        'paid': 'primary',
        'shipped': 'info',
        'completed': 'success',
        'cancelled': 'danger'
      }
      return types[this.order?.status] || 'default'
    }
  },
  created() {
    this.loadOrder()
  },
  methods: {
    async loadOrder() {
      const orderNo = this.$route.query.orderNo
      try {
        const res = await orderApi.getSeckillOrderDetail(orderNo)
        if (res.code === 200) {
          this.order = res.data.orderInfo
          this.address = res.data.userAddress
          this.product = res.data.productInfo
          this.logistics = res.data.logistics
        } else {
          this.$message.error(res.msg)
        }
      } catch (error) {
        this.$message.error(error.message || '订单信息加载失败')
      }
    },
    goToProductDetail(productId) {
      this.$router.push(`/seckill/detail/${productId}`)
    },
    goToPay() {
      this.$router.push(`/orders/pay/${this.order.id}`)
    },
    async cancelOrder() {
      this.$confirm('确定要取消该订单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(async () => {
        this.$loading({ text: '处理中...' })
        try {
          const response = await orderApi.cancelOrder(this.order.id)
          this.$loading().close()
          
          if (response.code === 200) {
            this.$message.success('订单已取消')
            this.order.status = 'cancelled'
            this.order.statusStr = '已取消'
          } else {
            this.$message.error(response.msg)
          }
        } catch (error) {
          this.$loading().close()
          this.$message.error(error.message || '取消失败')
        }
      }).catch(() => {
        this.$message.info('已取消操作')
      })
    },
    async confirmReceipt() {
      this.$confirm('确定已收到商品吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(async () => {
        this.$loading({ text: '处理中...' })
        try {
          const response = await orderApi.confirmReceipt(this.order.id)
          this.$loading().close()
          
          if (response.code === 200) {
            this.$message.success('已确认收货')
            this.order.status = 'completed'
            this.order.statusStr = '已完成'
          } else {
            this.$message.error(response.msg)
          }
        } catch (error) {
          this.$loading().close()
          this.$message.error(error.message || '确认失败')
        }
      }).catch(() => {
        this.$message.info('已取消操作')
      })
    },
    goToReview() {
      this.$message.info('评价功能开发中')
    },
    getPaymentMethodName(method) {
      const methods = {
        'wechat': '微信支付',
        'alipay': '支付宝',
        'bank': '银行卡支付'
      }
      return methods[method] || method
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
  padding: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
}

.order-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.order-no {
  font-size: 14px;
  color: #666;
}

.status-tag {
  font-size: 12px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 20px 0 15px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.section-title:first-child {
  margin-top: 0;
}

.product-card {
  display: flex;
  gap: 15px;
  padding: 15px;
  background: #fff5f5;
  border-radius: 8px;
  cursor: pointer;
  transition: box-shadow 0.3s ease;
}

.product-card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.product-desc {
  font-size: 14px;
  color: #666;
  margin: 5px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-meta {
  display: flex;
  align-items: center;
  gap: 15px;
}

.price {
  font-size: 20px;
  font-weight: bold;
  color: #ff4757;
}

.quantity {
  color: #999;
}

.address-card {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
}

.address-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.address-name {
  font-weight: 600;
  color: #333;
}

.address-phone {
  color: #666;
}

.address-detail {
  color: #666;
  margin: 0;
  line-height: 1.5;
}

.logistics-card {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
}

.logistics-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.logistics-name {
  font-weight: 600;
  color: #333;
}

.logistics-no {
  color: #666;
  font-size: 14px;
}

.logistics-timeline {
  position: relative;
  padding-left: 20px;
}

.logistics-timeline::before {
  content: '';
  position: absolute;
  left: 4px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #ddd;
}

.timeline-item {
  position: relative;
  padding-bottom: 20px;
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-dot {
  position: absolute;
  left: -17px;
  top: 2px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ddd;
}

.timeline-item.active .timeline-dot {
  background: #409eff;
}

.timeline-content {
  margin-left: 15px;
}

.timeline-time {
  font-size: 12px;
  color: #999;
  margin: 0 0 5px 0;
}

.timeline-desc {
  font-size: 14px;
  color: #333;
  margin: 0;
}

.no-logistics {
  text-align: center;
  padding: 30px;
  background: #f9f9f9;
  border-radius: 8px;
  color: #999;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.detail-info {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px dashed #eee;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row .label {
  color: #666;
}

.detail-row .value {
  color: #333;
}

.detail-row .value.discount {
  color: #ff4757;
}

.detail-row.total {
  font-weight: 600;
  font-size: 16px;
  border-bottom: none;
}

.detail-row.total .value {
  color: #ff4757;
  font-size: 20px;
}

.action-section {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.empty-state {
  text-align: center;
  padding: 50px;
  color: #999;
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 15px;
}
</style>
