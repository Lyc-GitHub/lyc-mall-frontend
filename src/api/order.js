import request from './request'
import { API_PATH } from './config'

export default {

  getSeckillOrderPayInfo(params) {
    return request.get("/secKillOrder/order/getSeckillOrderPayInfo", params)
  },

  getSeckillOrderDetail(orderNo) {
    return request.get("/secKillOrder/order/getSeckillOrderDetail/" + orderNo)
  },

  queryOrderList() {
    return request.get("/secKillOrder/order/queryOrderList")
  },
  
  getOrderDetail(id) {
    return request.get(`${API_PATH.order.detail}/${id}`)
  },

  getPayForm(id, data) {
    return request.post(`/secKillOrder/order/getPayForm/${id}`, data)
  },
  
  cancelOrder(id) {
    return request.put(`${API_PATH.order.cancel}/${id}`)
  },
  
  confirmReceipt(id) {
    return request.put(`${API_PATH.order.confirmReceipt}/${id}`)
  }
}
