# Lyc-Mall-Frontend

一个基于Vue2的电商秒杀系统前端项目，包含秒杀商品管理、订单管理等核心功能。

## 🛠️ 技术栈

- **框架**: Vue 2.6.14
- **路由**: Vue Router 3.5.3
- **UI组件**: Element UI 2.15.14
- **状态管理**: Vuex 3
- **HTTP请求**: Axios
- **构建工具**: Webpack 4.46.0
- **开发服务器**: Webpack Dev Server 3.11.3
- **语言**: JavaScript (ES6+)

## 📦 项目结构

```
lyc-mall-frontend/
├── src/
│   ├── api/           # API接口封装
│   │   ├── config.js      # API配置
│   │   ├── request.js     # 请求工具封装（带拦截器）
│   │   ├── product.js     # 商品相关API
│   │   ├── order.js       # 订单相关API
│   │   ├── seckill.js     # 秒杀相关API
│   │   └── login.js       # 登录相关API
│   ├── router/        # 路由配置
│   │   └── index.js
│   ├── store/         # Vuex状态管理
│   │   └── index.js
│   ├── views/         # 页面组件
│   │   ├── Login.vue          # 登录页面
│   │   ├── Dashboard.vue      # 主布局页面
│   │   ├── seckill/           # 秒杀商品模块
│   │   │   ├── SeckillList.vue      # 秒杀商品列表（卡片式展示）
│   │   │   ├── SeckillDetail.vue    # 秒杀商品详情
│   │   │   └── SeckillAdd.vue       # 添加秒杀商品
│   │   └── orders/            # 订单模块
│   │       ├── OrdersList.vue       # 订单列表
│   │       ├── OrderDetail.vue      # 订单详情
│   │       └── Pay.vue              # 待支付页面
│   ├── App.vue        # 根组件
│   └── main.js        # 入口文件
├── dist/              # 构建输出目录
├── webpack.config.js  # Webpack配置
├── package.json       # 项目依赖
└── README.md          # 项目说明文档
```

## 🚀 快速开始

### 环境要求

- Node.js >= 14.17.5
- npm >= 6.x

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

启动后访问: http://localhost:8888

### 生产构建

```bash
npm run build
```

构建产物输出到 `dist/` 目录。

## 📋 功能模块

### 1. 登录模块
- 用户登录验证
- Token存储与管理
- 路由守卫控制

### 2. 秒杀商品模块
- **商品列表**: 卡片式展示，类似淘宝/京东首页风格
- **商品详情**: 多图片轮播、秒杀倒计时、立即抢购
- **添加商品**: 完整表单，支持多图上传（OSS云存储）

### 3. 订单模块
- **订单列表**: 状态筛选、订单概览
- **待支付**: 商品信息、收货地址、支付方式选择
- **订单详情**: 商品信息、物流信息、收货确认

## 🔌 API接口说明

### 基础配置

```javascript
// src/api/config.js
BASE_URL = 'http://localhost:8010/api'
```

### 接口列表

| 模块 | 接口 | 方法 | 说明 |
|------|------|------|------|
| 商品 | `/product/list` | GET | 获取商品列表 |
| 商品 | `/product/detail/:id` | GET | 获取商品详情 |
| 商品 | `/product/manage/addSeckillProduct` | POST | 添加秒杀商品 |
| 订单 | `/order/list` | GET | 获取订单列表 |
| 订单 | `/order/detail/:id` | GET | 获取订单详情 |
| 订单 | `/order/pay/:id` | POST | 支付订单 |
| 地址 | `/address/default` | GET | 获取默认地址 |

### 请求拦截器

自动为所有请求添加Authorization头：

```javascript
Authorization: Bearer ${token}
```

## 🎨 页面预览

### 登录页面
- 简洁的登录表单
- 用户名密码验证
- 登录成功后跳转首页

### Dashboard布局
- Element UI专业后台布局
- 左侧菜单栏（秒杀商品、商品管理、订单管理）
- 顶部导航栏（Logo、用户信息）

### 秒杀商品列表
- 响应式卡片网格布局
- 商品图片、价格、库存展示
- 秒杀状态标识（进行中/即将开始/已结束）

### 秒杀商品详情
- 多图片轮播切换
- 秒杀价格、原价对比
- 库存实时显示
- 立即抢购按钮

### 待支付页面
- 订单信息展示
- 收货地址选择
- 支付方式选择（微信/支付宝/银行卡）
- 取消订单功能

### 订单详情页面
- 订单基本信息
- 商品信息
- 物流时间线
- 订单状态操作

## 🔧 开发指南

### 路由配置

```javascript
// src/router/index.js
{
  path: '/seckill',           // 秒杀商品列表
  path: '/seckill/detail/:id', // 商品详情
  path: '/orders',            // 订单列表
  path: '/orders/pay/:id',    // 待支付
  path: '/orders/detail/:id', // 订单详情
}
```

### 状态管理

Vuex存储用户信息：
- `token`: 用户登录令牌
- `username`: 用户名

### 图片上传

使用阿里云OSS进行图片存储：
- 自动获取STS临时凭证
- 支持多图上传
- 图片预览与删除

## 📝 代码规范

- 使用ES6+语法
- 组件命名采用PascalCase
- 变量命名采用camelCase
- 函数命名采用camelCase
- 注释清晰，便于维护

## 🚀 部署说明

### 开发环境

```bash
npm run dev    # 启动开发服务器
```

### 生产环境

```bash
npm run build  # 构建生产版本
```

### Nginx配置示例

```nginx
server {
  listen 80;
  server_name your-domain.com;
  root /path/to/dist;
  
  location / {
    try_files $uri $uri/ /index.html;
  }
  
  # API代理
  location /api/ {
    proxy_pass http://localhost:8010/api/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

## 📄 License

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request！

---

**注意**: 本项目为前端项目，需要配合后端服务使用。请确保后端服务已启动并配置正确的API地址。
