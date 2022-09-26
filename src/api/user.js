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
/** *
 * 获取用户资料的接口
 * **/
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'post',

  })
}
//根据用户的id获取头像
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}

export function logout() {
  return request({

  })
}
