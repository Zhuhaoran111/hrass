import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login } from '@/api/user'
//状态
const state = {
  //设置token为共享状态
  token: getToken()//设置token为初始状态，初始化vuex时候，就先从缓存中读取
}
const mutations = {
  setToken(state, token) {
    state.token = token  //将数据设置给vuex
    //同步给缓存
    setToken(token)
  },
  removeToken(state) {
    state.token = null //将vuex中的数据置空
    removeToken() //vuex置空同同步到缓存也置空
  }
}
const actions = {
  //datas是接口所需要的参数
  async login(context, data) {
    const result = await login(data)    //拿到token
    //如果为true,则登录成功,把token值传给mutations中的setToken
    context.commit("setToken", result)  //设置token 

    //已经拿到token了
    setTimeStamp()  //设置当前时间戳

  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions,
}


