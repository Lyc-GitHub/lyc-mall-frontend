<template>
  <el-container class="dashboard-container">
    <el-aside width="240px" class="sidebar">
      <div class="logo">
        <h2>Lyc Mall</h2>
      </div>
      <el-menu 
        :default-active="activeMenu" 
        class="sidebar-menu"
        mode="vertical"
        background-color="#2f4050"
        text-color="#a7b1c2"
        active-text-color="#fff"
        @select="doRouterview"
      >
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-goods"></i>
            <span>商品管理</span>
          </template>
          <el-menu-item index="/seckill">秒杀商品</el-menu-item>
          <el-menu-item index="/seckillProductList">商品列表</el-menu-item>
          <el-menu-item index="/seckillProduct/add">添加秒杀商品</el-menu-item>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-shopping-cart-full"></i>
            <span>订单管理</span>
          </template>
          <el-menu-item index="/orders">订单列表</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="top-header">
        <div class="header-left">
          <button class="menu-toggle" @click="toggleSidebar">
            <i class="el-icon-menu"></i>
          </button>
          <span class="title">管理后台</span>
        </div>
        <div class="header-right">
          <el-dropdown>
            <span class="user-info">
              <i class="el-icon-user"></i>
              {{ username }}
              <i class="el-icon-arrow-down"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handleLogout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      activeMenu: '',
      sidebarCollapsed: false
    }
  },
  computed: {
    username() {
      return this.$store.getters.username || '管理员'
    }
  },
  created() {
    this.setActiveMenu()
  },
  watch: {
    $route() {
      this.setActiveMenu()
    }
  },
  methods: {
    setActiveMenu() {
      this.activeMenu = this.$route.path
    },
    handleLogout() {
      this.$store.dispatch('clearToken')
      this.$router.push('/login')
    },
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },
    doRouterview(index) {
      this.$router.push(index)
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  height: 100vh;
}

.sidebar {
  background: #2f4050;
  color: #fff;
}

.logo {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #1f2d3d;
}

.logo h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.sidebar-menu {
  border-right: none;
  height: calc(100% - 60px);
}

.top-header {
  background: #fff;
  border-bottom: 1px solid #e7eaec;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.menu-toggle {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #666;
  padding: 8px 12px;
}

.main-content {
  background: #f3f3f4;
}
</style>