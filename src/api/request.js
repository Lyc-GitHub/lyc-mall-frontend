import axios from 'axios'
import store from '@/store'
import { BASE_URL } from './config'

const service = axios.create({
  baseURL: BASE_URL,
  timeout: 30000
})

service.interceptors.request.use(
  config => {
    const token = store.getters.token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          store.dispatch('clearToken')
          window.location.href = '/login'
          break
        case 403:
          error.message = '没有权限访问'
          break
        case 404:
          error.message = '请求的资源不存在'
          break
        case 500:
          error.message = '服务器错误'
          break
        default:
          error.message = error.response.data.message || '请求失败'
      }
    } else if (error.request) {
      error.message = '网络错误，请检查网络连接'
    } else {
      error.message = '请求配置错误'
    }
    return Promise.reject(error)
  }
)

export default {
  get(url, params = {}) {
    return service.get(url, { params })
  },
  
  post(url, data = {}) {
    return service.post(url, data)
  },
  
  postForm(url, formData) {
    return service.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  
  put(url, data = {}) {
    return service.put(url, data)
  },
  
  delete(url, params = {}) {
    return service.delete(url, { params })
  }
}