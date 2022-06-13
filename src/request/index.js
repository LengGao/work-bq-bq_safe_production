import MiniService from './miniapp'
import { GLOBAL } from './config'
import { isObject } from './utils'
import store from '../store'


const service = new MiniService()

const userInfo = uni.getStorageSync('userInfo')
const orgInfo = uni.getStorageSync('orgInfo')

if (userInfo || orgInfo) {
  service.setHeader({ token: userInfo.token, 'org-id': orgInfo.id })
}

const interactiveMap = {
  loading: { open: GLOBAL.showLoading, close: GLOBAL.hideLoading, option: { title: '加载中' } },
  toast: { open: GLOBAL.showToast, class: GLOBAL.hideToast, option: { title: '', icon: 'none', position: 'center' } },
  modal: { open: GLOBAL.showModal, option: { title: '', content: '' } },
}

const handlerError = {
  1000: () => {
    console.log('$config', service.$config, store);
    uni.showToast({ title: '请登录', icon: 'none' })
  },
  1001: () => {
    console.log('$config', service.$config, store);
    uni.showToast({ title: '请选择登录机构', icon: 'none' })
  },
  1008: () => {
    console.log('$config', service.$config);
    uni.showToast({ title: '您的账号已在其他设备登录', icon: 'none' })
    store.dispatch('loginout')
  },
  1009: async () => {
    console.log('$config', service.$config);
    await store.dispatch('renewal')
    service.request.call(service, { ...service.$config })
  }
}

service.useRequestInterceptor((config) => {
  try {
    let { loading, toast, modal } = config
    let actions = { loading, toast, modal } // 同时控制着交互触发顺序
    for (let k in actions) {
      let action = actions[k]
      if (action && interactiveMap.hasOwnProperty(k)) {
        let interactive = interactiveMap[k]
        isObject(action)
          ? interactive.open(Object.assign(interactive.option, action))
          : interactive.open(interactive.option)
      }
    }
  } catch (e) {
    service.$requestTask.abort()
    throw new Error(e)
  }
  return config
})

service.useResponseInterceptor((response) => {
  let { data } = response
  for (let k in interactiveMap) {
    interactiveMap[k].close && interactiveMap[k].close()
  }
  return data
})

service.useResponseInterceptor((response) => {
  let body = response.data
  // console.log('response', service);
  if (body.code === 1 && !service.$config.nocatch) {
    uni.showToast({ icon: 'none', title: `${body.message}` })
  } else if (body.code === 1000) {
    // handlerError[body.code](body)
    store.commit('SET_LOGIN_STATUS', body.code)
    // store.dispatch('loginout', body.code)
  } else if (body.code === 1008) {
    store.commit('SET_LOGIN_STATUS', body.code)
    // store.dispatch('loginout', body.code)
  }
  return response
})



export { service }

export default service.request.bind(service)