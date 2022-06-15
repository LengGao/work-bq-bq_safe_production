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
  '1000': () => {
    let keys = ['userInfo', 'orgInfo', 'questionBankInfo']
    store.commit('SET_LOGIN_STATUS', 1000)
    store.commit('SET_ORG_LIST', [])
    keys.forEach(key => { uni.removeStorage({ key: key}) })

    // uni.showToast({ title: '请登录', icon: 'none' })
  },
  '1008': () => {
    let keys = ['userInfo', 'orgInfo', 'questionBankInfo']
    store.commit('SET_LOGIN_STATUS', 1008)
    store.commit('SET_ORG_LIST', [])
    keys.forEach(key => { uni.removeStorage({ key: key}) })
    
    // uni.showToast({ title: '您的账号已在其他设备登录', icon: 'none' })
  },
  '1009': async () => {
    uni.showToast({ title: '登录信息已过期，请重新登录', icon: 'none' })
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
  if (body.code === 1 && !service.$config.nocatch) {
    uni.showToast({ icon: 'none', title: `${body.message}` })
  } else {
    if (handlerError[`${body.code}`]) {
      handlerError[`${body.code}`]()
    }
  }
  return response
})



export { service }

export default service.request.bind(service)