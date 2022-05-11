import Vue from 'vue'
import Vuex from 'vuex'
import { getVersion } from "@/api/user";

const userInfo = uni.getStorageSync('userInfo') || {}
const questionBankInfo = uni.getStorageSync('questionBankInfo') || {}
const version = process.env.VUE_APP_VERSION
let appId = process.env.VUE_APP_APPID

Vue.use(Vuex)

const state = {
    // 程序
    applet: {
        appInfo: {},
        appid: null
    },
    // 用户
    user: {
        userInfo: userInfo,
        questionBankInfo: questionBankInfo
    },
    // 题库
    questionList: {
        list: [] // 存收藏夹，错题集的答题卡数据
    }
}

const getters = {
    // 小程序信息
    appInfo: state => state.applet.appInfo,
    // 用户机构
    organization_id: state => state.applet.appInfo.organization_id,

    // 用户信息
    userInfo: state => state.user.userInfo,
    // 用户token
    token: state => state.user.userInfo.token,


    // 用户题库
    questionBankInfo: state => state.user.questionBankInfo,
    // 用户题库id
    question_bank_id: state => state.user.questionBankInfo.question_bank_id,

    // 习题列表 （存收藏夹，错题集的答题卡数据）
    questionList: state => state.questionList.list
}

const mutations = {
    // Applet
    SET_INFO(state, data) {
        state.appInfo = data
    },
    // 设置applec信息
    SET_APPID(state, appid) {
        state.appid = appid
    },

    // // 设置用户信息
    SET_USER_INFO(state, data) {
        state.userInfo = data
    },

    // 设置题库信息
    SET_QUESTION_BANK_INFO(state, data) {
        state.questionBankInfo = data
    },
    // 设置题目列表 
    SET_LIST(state, list) {
        state.list = list
    },
}

const actions = {
    // 获取小恒徐信息
    async getAppInfo({ commit, dispatch, state }, { appid, debug }) {
        appId = appid || state.appid
        commit('SET_APPID', appid)
        const data = { appId, version, debug }; // debug 用于审核模式时登录
        const res = await getVersion(data);
        if (res.coode === 0) commit('SET_INFO', res.data);
        // 审核模式
        if (res.data.debug) dispatch('setUserInfo', res.data.user_info, { root: true });
    },
    // 设置applec信息
    setAppInfo({ commit }, data) {
        commit(data)
    },

    // 设置用户信息
    setUserInfo({ commit }, data) {
        commit('SET_USER_INFO', data)
        uni.setStorage({ key: 'userInfo', data })
    },

    // 设置题库信息
    setQuestionBankInfo({ commit }, data) {
        commit('SET_QUESTION_BANK_INFO', data)
        uni.setStorage({ key: 'questionBankInfo', data })
    },
    // 设置题目列表
    setQusetionList({ commit }, list) {
        commit('SET_LIST', list)
    }
}

const store = new Vuex.Store({ state, getters, mutations, actions })

export default store

