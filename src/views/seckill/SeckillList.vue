<template>
  <div class="seckill-container">
    <div class="page-header">
      <h2>秒杀商品</h2>
    </div>
    <div class="seckill-grid">
      <el-card 
        v-for="item in seckillList" 
        :key="item.id" 
        class="seckill-card"
      >
        <div class="card-image">
          <img :src="item.image" :alt="item.productName" />
          <div class="seckill-badge">秒杀</div>
        </div>
        <div class="card-content">
          <h3 class="card-title">{{ item.productName }}</h3>
          <p class="card-desc">{{ item.summary }}</p>
          <div class="price-row">
            <span class="seckill-price">¥{{ item.seckillPrice }}</span>
            <span class="original-price">¥{{ item.originalPrice }}</span>
            <span class="discount">{{ item.discount }}折</span>
          </div>
          <div class="time-info">
            <i class="el-icon-clock"></i>
            <span>{{ item.startTime }} - {{ item.endTime }}</span>
          </div>
          <el-button type="danger" class="buy-btn" :disabled="item.status !== 'active'" @click="goToDetail(item.id)">
            {{ item.status === 'active' ? '立即抢购' : (item.status === 'upcoming' ? '即将开始' : '已结束') }}
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import productApi from '@/api/product'
export default {
  name: 'SeckillList',
  data() {
    return {
      seckillList: []
    }
  },
  created() {
    this.getSecKillList()
  },
  methods: {
    goToDetail(id) {
      this.$router.push(`/seckill/detail/${id}`)
    },
    getSecKillList() {
      this.$loading({ text: '努力查询中...' })
      productApi.getSeckillProductList().then(res => {
        this.$loading().close()
        if (res.code === 200) {
          this.seckillList = res.data
        } else {
          this.$message.error(res.msg)
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
.seckill-container {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.countdown {
  display: flex;
  align-items: center;
  gap: 10px;
}

.countdown .label {
  color: #666;
}

.countdown-time {
  font-size: 16px;
  padding: 8px 16px;
}

.seckill-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.seckill-card {
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.seckill-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.card-image {
  position: relative;
  overflow: hidden;
  height: 200px;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.seckill-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: linear-gradient(135deg, #ff4757, #ff6b81);
  color: #fff;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.card-content {
  padding: 15px;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.card-desc {
  font-size: 13px;
  color: #999;
  margin: 0 0 12px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.price-row {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 10px;
}

.seckill-price {
  font-size: 24px;
  font-weight: bold;
  color: #ff4757;
}

.original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

.discount {
  background: #fff0f0;
  color: #ff4757;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 12px;
  color: #666;
}

.time-info {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #999;
  margin-bottom: 15px;
}

.buy-btn {
  width: 100%;
  height: 40px;
  font-size: 15px;
}

.buy-btn[disabled] {
  background: #ccc;
  border-color: #ccc;
}
</style>
