import request from '@/utils/request'

/** *
 * 登录接口
 * **/
export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({

  })
}

export function logout() {
  return request({

  })
}
