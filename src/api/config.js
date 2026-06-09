export const BASE_URL = 'http://localhost:8010/api'

export const API_PATH = {
  product: {
    addSeckill: '/product/manage/addSeckillProduct',
    list: '/product/list',
    detail: '/product/detail',
    update: '/product/update',
    delete: '/product/delete'
  },
  order: {
    list: '/order/list',
    detail: '/order/detail',
    updateStatus: '/order/updateStatus',
    pay: '/order/pay',
    cancel: '/order/cancel',
    confirmReceipt: '/order/confirmReceipt'
  },
  address: {
    default: '/address/default'
  }
}
