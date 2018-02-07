import fetch from '../../../utils/fetch'

export function page(query) {
  return fetch({
    url: '/api/yun-pollute/caretype/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return fetch({
    url: '/api/yun-pollute/caretype',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return fetch({
    url: '/api/yun-pollute/caretype/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/api/yun-pollute/caretype/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/yun-pollute/caretype/' + id,
    method: 'put',
    data: obj
  })
}
