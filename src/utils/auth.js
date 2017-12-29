import Cookies from 'js-cookie'

const TokenKey = 'access-token'

export function getToken() {
  console.log('cookie get token:' + Cookies.get(TokenKey))
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  console.log('cookie write token:' + token)
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
