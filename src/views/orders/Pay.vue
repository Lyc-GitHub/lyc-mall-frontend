<template>
  <div class="pay-container">
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item><a href="/orders">订单管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>待支付</el-breadcrumb-item>
    </el-breadcrumb>
    
    <el-card class="pay-card" v-if="order">
      <div class="section-title">
        <i class="el-icon-suitcase"></i>
        <span>订单信息</span>
      </div>
      
      <div class="order-info">
        <div class="order-row">
          <span class="label">订单编号</span>
          <span class="value">{{ order.orderNo }}</span>
        </div>
        <div class="order-row">
          <span class="label">创建时间</span>
          <span class="value">{{ order.createTime }}</span>
        </div>
        <div class="order-row">
          <span class="label">订单状态</span>
          <el-tag type="warning" class="status-tag">{{ order.statusStr }}</el-tag>
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
          <div class="price-row">
            <span class="seckill-price">¥{{ order.productAmount }}</span>
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
          <el-tag type="primary" v-if="address.isDefault === 1" size="small">默认</el-tag>
        </div>
        <p class="address-detail">{{ address.province }}{{ address.city }}{{ address.district }}{{ address.detailAddress }}</p>
      </div>
      
      <div class="no-address" v-else>
        <el-button type="primary" plain @click="goToAddress">添加收货地址</el-button>
      </div>
      
      <div class="section-title">
        <i class="el-icon-wallet"></i>
        <span>支付方式</span>
      </div>
      
      <div class="payment-methods">
        <div 
          v-for="method in paymentMethods" 
          :key="method.id"
          class="payment-item"
          :class="{ active: selectedPayment === method.id }"
          @click="selectedPayment = method.id"
        >
          <div class="payment-icon">{{ method.icon }}</div>
          <span class="payment-name">{{ method.name }}</span>
          <el-radio v-model="selectedPayment" :value="method.id"></el-radio>
        </div>
      </div>
      
      <div class="total-section">
        <div class="total-row">
          <span class="label">商品金额</span>
          <span class="value">¥{{ order.productAmount }}</span>
        </div>
        <div class="total-row">
          <span class="label">运费</span>
          <span class="value">¥{{ shippingFee }}</span>
        </div>
        <div class="total-row total">
          <span class="label">应付金额</span>
          <span class="value">¥{{ order.productAmount + shippingFee }}</span>
        </div>
      </div>
      
      <div class="action-section">
        <el-button class="cancel-btn" @click="cancelOrder">取消订单</el-button>
        <el-button type="primary" class="pay-btn" @click="handlePay" :disabled="!address || order.status !== 0">
          立即支付 ¥{{ order.payAmount }}
        </el-button>
      </div>
    </el-card>
    
    <el-card class="pay-card" v-else>
      <div class="empty-state">
        <i class="el-icon-info"></i>
        <p>订单信息加载中...</p>
      </div>
    </el-card>
    <div v-html="payFormHtml" style="display: none;"></div>
  </div>
</template>

<script>
import orderApi from '@/api/order'

export default {
  name: 'Pay',
  data() {
    return {
      order: null,
      address: null,
      product: null,
      selectedPayment: 'alipay',
      paymentMethods: [
        // { id: 'wechat', name: '微信支付', icon: '💳' },
        { id: 'alipay', name: '支付宝', icon: '📱' }
        // { id: 'bank', name: '银行卡支付', icon: '🏦' }
      ],
      payFormHtml: '',
      // 运费8
      shippingFee: 8
    }
  },
  created() {
    this.loadOrder()
  },
  methods: {
    async loadOrder() {
      const orderNo = this.$route.query.orderNo
      const productId = this.$route.query.productId
      try {
        const res = await orderApi.getSeckillOrderPayInfo({orderNo, productId})
        if (res.code === 200) {
          this.order = res.data.orderInfo
          this.address = res.data.userAddress
          this.product = res.data.productInfo
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
    goToAddress() {
      this.$router.push('/address')
    },
    async handlePay() {
      if (!this.address) {
        this.$message.warning('请先添加收货地址')
        return
      }
      
      this.$loading({ text: '支付处理中...' })
      try {
        const res = await orderApi.getPayForm(this.order.orderNo, {
          paymentMethod: this.selectedPayment,
          addressId: this.address.id,
          shippingFee: this.shippingFee,
          productName: this.product.productName,
        })
        this.$loading().close()
        
        if (res.code === 200) {
          this.payFormHtml = res.msg;
          // 等待Vue更新DOM
          await this.$nextTick();
          // 获取表单并提交
          const form = document.querySelector('form[name="punchout_form"]');
          if (form) {
            form.submit();
          } else {
            console.error('未找到支付表单');
          }
        } else {
          this.$message.error(res.msg)
        }
      } catch (error) {
        this.$loading().close()
        this.$message.error(error.message || '支付失败')
      }
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
            this.$router.push('/orders')
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
    }
  }
}
</script>

<style scoped>
.pay-container {
  padding: 20px;
}

.breadcrumb {
  margin-bottom: 20px;
}

.pay-card {
  padding: 24px;
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

.order-info {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
}

.order-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.order-row .label {
  color: #666;
}

.order-row .value {
  color: #333;
  font-weight: 500;
}

.status-tag {
  font-size: 12px;
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

.price-row {
  display: flex;
  align-items: center;
  gap: 15px;
}

.seckill-price {
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

.no-address {
  text-align: center;
  padding: 30px;
  background: #f9f9f9;
  border-radius: 8px;
}

.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.payment-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.payment-item:hover {
  border-color: #409eff;
}

.payment-item.active {
  border-color: #409eff;
  background: #e8f4fd;
}

.payment-icon {
  font-size: 24px;
}

.payment-name {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.total-section {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.total-row .label {
  color: #666;
}

.total-row .value {
  color: #333;
}

.total-row.total {
  font-weight: 600;
  font-size: 16px;
  border-top: 1px dashed #ddd;
  margin-top: 8px;
  padding-top: 15px;
}

.total-row.total .value {
  color: #ff4757;
  font-size: 20px;
}

.action-section {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 20px;
}

.cancel-btn {
  width: 120px;
}

.pay-btn {
  width: 200px;
  height: 44px;
  font-size: 16px;
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
