import { login } from '@/api/user'
import store from '@/store'
import axios from 'axios'
import router from '@/router'
import { Message } from 'element-ui'
import { getTimeStamp } from '@/utils/auth'
const TimeOut = 3600 // 定义超时时间
const service = axios.create({
  //dev-api    prod-api    触发不了代理
  //当执行npm run dev  =>env.developemnt=>/api
  //当执行npm run bulid时  /prod-api
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000 //超时时间
})
service.interceptors.request.use(config => {
  //config是请求的配置信息
  //注入token
  if (store.getters.token) {
    // 只有在有token的情况下 才有必要去检查时间戳是否超时
    if (IsCheckTimeOut()) {
      // 如果它为true表示 过期了
      // token没用了 因为超时了
      store.dispatch('user/logout') // 登出操作
      // 跳转到登录页
      router.push('/login')
      return Promise.reject(new Error('token超时了'))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})


//设置响应拦截器
service.interceptors.response.use(response => {
  //axios默认加了一层data,所以要解构数据
  const { success, message, data } = response.data   //这里时解构数据
  //要根据success成功与否决定下面的操作
  if (success) {
    return data
  } else {
    //业务已经错了，不能进then，应该进catch
    Message.error(message)  //提示错误信息
    return Promise.reject(new Error(message))  //没有错误对象返回一个错误对象
  }

}, error => {
  // error 信息 里面 response的对象
  if (error.response && error.response.data && error.response.data.code === 10002) {
    // 当等于10002的时候 表示 后端告诉我token超时了
    store.dispatch('user/logout') // 登出action 删除token
    router.push('/login')
  } else {
    Message.error(error.message) // 提示错误信息
  }
  //返回执行错误，让当前执行链跳出成功，直接进入catch
  return Promise.reject(error)


})
// 超时逻辑  (当前时间  - 缓存中的时间) 是否大于 时间差
function IsCheckTimeOut() {
  var currentTime = Date.now() // 当前时间戳
  var timeStamp = getTimeStamp() // 缓存时间戳
  return (currentTime - timeStamp) / 1000 > TimeOut  //(currentTime - timeStamp) / 1000得到是秒
}
export default service

