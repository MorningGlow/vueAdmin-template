import fetch from '../../../utils/fetch'

export function page(query) {
  return fetch({
    url: '/api/yun-gg/globalt/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return fetch({
    url: '/api/yun-gg/globalt',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return fetch({
    url: '/api/yun-gg/globalt/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/api/yun-gg/globalt/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/yun-gg/globalt/' + id,
    method: 'put',
    data: obj
  })
}
