import request from './request'
import { API_PATH } from './config'

export default {
  addSeckillProduct(data) {
    return request.post(API_PATH.product.addSeckill, data)
  },
  
  getAddProductPolicy() {
    return request.get('/product/manage/getAddProductPolicy')
  },

  getSeckillProductList() {
    return request.get('/product/manage/getSeckillProductList')
  },

  getSeckillProductDetail(params = {}) {
    return request.get('/product/manage/getSeckillProductDetail', params)
  }
}
