<template>
  <div class="page-container">
    <div class="page-header">
      <h2>商品列表</h2>
      <el-button type="primary" @click="goToAdd">添加商品</el-button>
    </div>
    <el-table :data="goodsList" border>
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="name" label="商品名称"></el-table-column>
      <el-table-column prop="category" label="分类"></el-table-column>
      <el-table-column prop="price" label="价格" formatter="formatPrice"></el-table-column>
      <el-table-column prop="stock" label="库存"></el-table-column>
      <el-table-column prop="sales" label="销量"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 'on' ? 'success' : 'danger'">
            {{ scope.row.status === 'on' ? '上架' : '下架' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="editGoods(scope.row)">编辑</el-button>
          <el-button type="text" @click="deleteGoods(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'GoodsList',
  data() {
    return {
      goodsList: [
        { id: 1, name: 'iPhone 15 Pro', category: '手机数码', price: 8999, stock: 500, sales: 2340, status: 'on' },
        { id: 2, name: 'MacBook Pro 14寸', category: '电脑办公', price: 14999, stock: 200, sales: 892, status: 'on' },
        { id: 3, name: 'AirPods Pro 2', category: '音频设备', price: 1899, stock: 800, sales: 5670, status: 'on' },
        { id: 4, name: 'iPad Pro 12.9寸', category: '平板设备', price: 9999, stock: 300, sales: 1230, status: 'off' }
      ]
    }
  },
  methods: {
    goToAdd() {
      this.$router.push('/seckillProduct/add')
    },
    editGoods(row) {
      this.$message.info(`编辑商品: ${row.name}`)
    },
    deleteGoods(row) {
      this.$confirm(`确定删除商品 ${row.name}?`, '提示', {
        type: 'warning'
      }).then(() => {
        this.$message.success('删除成功')
      })
    },
    formatPrice(row, column) {
      return '¥' + row[column.prop]
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
