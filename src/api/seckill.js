import request from './request'

export default {
    secKillProduct(productId) {
        return request.post("/secKill/secKillProduct/" + productId)
    }
}