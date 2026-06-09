<template>
  <div class="page-container">
    <div class="page-header">
      <h2>订单列表</h2>
    </div>
    <el-table :data="ordersList" border>
      <el-table-column prop="orderNo" label="订单号"></el-table-column>
      <el-table-column prop="userName" label="用户"></el-table-column>
      <el-table-column prop="productName" label="商品名称"></el-table-column>
      <el-table-column prop="payAmount" label="金额" :formatter="formatPrice"></el-table-column>
      <el-table-column prop="quantity" label="数量"></el-table-column>
      <el-table-column prop="statusStr" label="状态">
        <template slot-scope="scope">
          <el-tag :type="getStatusType(scope.row.statusVal)">
            {{ getStatusText(scope.row.statusVal) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="viewOrder(scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import orderApi from '@/api/order'
export default {
  name: 'OrdersList',
  data() {
    return {
      ordersList: []
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      try {
        const res = await orderApi.queryOrderList()
        if (res.code === 200) {
          this.ordersList = res.data
        } else {
          this.$message.error(res.msg)
        }
      } catch (error) {
        this.$message.error(error.message || '订单信息加载失败')
      }
    },
    viewOrder(row) {
      if (row.status === 'pending' || row.status === 'pending_pay') {
        this.$router.push({path: '/orders/pay', query: {orderNo: row.orderNo, productId: row.productId}})
      } else {
        this.$router.push({path: '/orders/detail', query: {orderNo: row.orderNo}})
      }
    },
    getStatusType(status) {
      const types = {
        pending: 'warning',
        paid: 'primary',
        shipped: 'info',
        completed: 'success'
      }
      return types[status] || 'default'
    },
    getStatusText(status) {
      const texts = {
        pending: '待付款',
        paid: '已付款',
        shipped: '已发货',
        completed: '已完成'
      }
      return texts[status] || status
    },
    formatPrice(row, column) {
      return '¥' + row['payAmount']
    }
  }
}
</script>

<style scoped>
.page-container {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 18px;
}
</style>
