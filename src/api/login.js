import request from '@/utils/request'
import Qs from 'qs'

export function login(username, password) {
  return request({
    url: 'http://10.30.90.45:9991/api/auth/jwt/token',
    method: 'post',
    data: Qs.stringify({
      username,
      password
    })
  })
}

export function getInfo(token) {
  return request({
    url: 'http://10.30.90.45:9991/api/auth/jwt/userInfo',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: 'http://10.30.90.45:9991/api/auth/jwt/logout',
    method: 'post'
  })
}
