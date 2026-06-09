import request from './request'

export default {
    loginByPassword(data) {
        return request.post('/auth/login/loginInByPassword', data)
    }
}