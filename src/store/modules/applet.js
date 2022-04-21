import { getVersion } from "@/api/user";
let appId = process.env.VUE_APP_APPID
const version = process.env.VUE_APP_VERSION

const applet = {
  state: {
    appInfo: {},
    appid: null
  },
  mutations: {
    SET_INFO(state, data) {
      state.appInfo = data
    },
    SET_APPID(state, appid) {
      state.appid = appid
    }
  },
  actions: {
    async getAppInfo({ commit, dispatch, state }, { appid, debug }) {
      appId = appid || state.appid
      commit('SET_APPID', appid)
      const data = { appId, version, debug }; // debug 用于审核模式时登录
      const res = await getVersion(data);
      if (res.coode === 0) commit('SET_INFO', res.data);
      // 审核模式
      if (res.data.debug) dispatch('setUserInfo', res.data.user_info, { root: true });
    },
    setAppInfo({ commit }, data) {
      commit(data)
    }
  }
}
export default applet