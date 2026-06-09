import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue')
    },
    {
      path: '/',
      name: 'Dashboard',
      component: () => import('@/views/Dashboard.vue'),
      redirect: '/seckill',
      children: [
        {
          path: 'seckill',
          name: 'Seckill',
          component: () => import('@/views/seckill/SeckillList.vue')
        },
        {
          path: 'seckillProductList',
          name: 'SeckillProductList',
          component: () => import('@/views/seckill/seckillProductList.vue')
        },
        {
          path: '/seckillProduct/add',
          name: 'AddSeckill',
          component: () => import('@/views/seckill/SeckillAdd.vue')
        },
        {
          path: 'seckill/detail/:id',
          name: 'SeckillDetail',
          component: () => import('@/views/seckill/SeckillDetail.vue')
        },
        {
          path: 'orders',
          name: 'Orders',
          component: () => import('@/views/orders/OrdersList.vue')
        },
        {
          path: 'orders/pay',
          name: 'Pay',
          component: () => import('@/views/orders/Pay.vue')
        },
        {
          path: 'orders/detail',
          name: 'OrderDetail',
          component: () => import('@/views/orders/OrderDetail.vue')
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const token = store.getters.token
  if (to.path === '/login') {
    next()
  } else {
    if (token) {
      next()
    } else {
      next('/login')
    }
  }
})

export default router