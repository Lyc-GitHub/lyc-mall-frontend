<template>
  <div class="login-container">
    <div class="login-wrapper">
      <div class="login-header">
        <h1>Lyc Mall 管理系统</h1>
        <p>欢迎登录后台管理系统</p>
      </div>
      <el-form ref="loginForm" :model="loginForm" class="login-form">
        <el-form-item label="用户名" prop="username">
          <el-input 
            v-model="loginForm.username" 
            placeholder="请输入用户名"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input 
            v-model="loginForm.password" 
            type="password" 
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin" class="login-btn">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import loginApi from '@/api/login'
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async handleLogin() {
      if (this.loginForm.username && this.loginForm.password) {
        const data = {
          username: this.loginForm.username,
          rawPassword: this.loginForm.password
        }
        const res = await loginApi.loginByPassword(data)
        if (res.code !== 200) {
          this.$message.error(res.message)
        } else {
          const token = res.data
          this.$store.dispatch('setToken', token)
          this.$store.dispatch('setUsername', this.loginForm.username)
          this.$router.push('/')
        }
      } else {
        this.$message.error('请输入用户名和密码')
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-wrapper {
  width: 400px;
  background: #fff;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h1 {
  font-size: 28px;
  color: #333;
  margin-bottom: 10px;
}

.login-header p {
  color: #999;
  font-size: 14px;
}

.login-form {
  padding: 0 20px;
}

.login-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
}
</style>