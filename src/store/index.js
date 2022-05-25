import Vue from 'vue'
import Vuex from 'vuex'
import { service } from '@/request/index'
import {
    systemRegion
} from '@/api/index'
import {
    getVersion,
    login,
    loginout
} from "@/api/user";
import {
    courseCommentHotWord
} from '@/api/course'

const userInfo = uni.getStorageSync('userInfo') || {}
const questionBankInfo = uni.getStorageSync('questionBankInfo') || {}
const organizationCurrent = uni.getStorageSync('orgInfo') || {}
const region = uni.getStorageSync('region') || {}
const version = process.env.VUE_APP_VERSION
let appId = process.env.VUE_APP_APPID


// console.log('mapGetters', store);
// const header = {
//   // 'org-id': 3,
//   // Qin
//   // token: 'eyJvcmdhbml6YXRpb25faWQiOjM0NiwiYXV0b2dyYXBoIjoiTitqOEpEZThUWVJkb0hhYXV6WDRCQlljSlNaRmM1eU5CeTdjeGszdW5mbjdYVytZazd0SUxIdGIzYUt0NWNMRWVFaFFtdXdxRnZpUjNuK0lScXZpUmFCYitmZndUSEtYRmVTY2lCajBSc0U9IiwicHJpdmF0ZV9rZXkiOiIyODQ4MTUxNTQxNTEwNzE4IiwidWlkIjo0NTkwMCwib3JpZ2luYWxfdXNlcl9rZXkiOiIyODQ4MTUxNTQxNTEwNzE4In0=',
//   // Xie
//   // token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzYWZldHkiLCJhdWQiOiIxNzIuMTYuMjM3LjkwIiwiaWF0IjoxNjUyNjgyOTU0LCJleHAiOjE2NTI3NjkzNTQsImRhdGEiOiJrRTBIOTY3KzArcDRLMml6OERHcDVhOUtyN3ErNjJuc3VIVFhFdkZwTHJRPSJ9.wNEaQrcGNLmcX5gGBugTLKVpf2x-C0SpZ6X4l2lowTA'
//   // token: userInfo.token || '',
//   // 'org-id': orgInfo.id || ''
//   token: store.getters.token,
//   'org-id': store.getters.organizationCurrent.id
// }

Vue.use(Vuex)

const state = {
    // 程序
    applet: {
        appInfo: {},
        appid: null
    },
    // 用户
    user: {
        region: region,
        userInfo: userInfo,
        organizationCurrent: organizationCurrent,
        questionBankInfo: questionBankInfo,
        login_status: false,
        is_examination: false
    },
    course: {
        commentHotWord: [],
        categoryList: [],
        priceTypeList: []
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
    // 用户地区
    region: state => state.user.region,
    // 是否登录
    login_status: state => state.user.login_status,
    // 当前机构
    organizationCurrent: state => state.user.organizationCurrent,
    // 获取用户所属机构
    organizationList: state => state.user.userInfo.org_list,
    // 用户题库
    questionBankInfo: state => state.user.questionBankInfo,
    // 用户题库id
    question_bank_id: state => state.user.questionBankInfo.question_bank_id,

    // 热评词
    commentHotWord: state => {
        if (!state.course.commentHotWord.length) {
            store.dispatch('getCommentHotWord')
        }
        return state.course.commentHotWord
    },
    // 课程分类
    categoryList: state => state.course.categoryList,
    
    priceTypeList: state => state.course.priceTypeList,

    // 习题列表 （存收藏夹，错题集的答题卡数据）
    questionList: state => state.questionList.list
}

const mutations = {
    // Applet
    SET_INFO(state, data) {
        state.applet.appInfo = data
    },
    // 设置applec信息
    SET_APPID(state, appid) {
        state.applet.appid = appid
    },

    // 设置用户信息
    SET_USER_INFO(state, data) {
        state.user.userInfo = data
        uni.setStorageSync('userInfo', data)
    },
    // 设置用户地区
    SET_REGION(state, data) {
        state.user.region = data
        uni.setStorageSync('region', data)
    },
    // 用户登录状态
    SET_LOGIN_STATUS(state, data) {
        state.user.login_status = data
    },
    // 用户考试状态
    SET_EXAMINATION(state, data) {
        state.user.is_examination = data
    },
    // 设置当前机构
    SET_ORG_CURRENT(state, data) {
        state.user.organizationCurrent = data
        uni.setStorageSync('orgInfo', data)
    },
    // 设置机构列表
    SET_ORG_LIST(state, data) {
        state.user.organizationList = data
    },
    // 设置课程评价词
    SET_HOT_WORD(state, data) {
        state.course.commentHotWord = data
    },
    // 设置课程分类
    SET_CATEGORY(state, data) {
        state.course.categoryList = data
    },
    SET_PRICETYPE(state, data) {
        state.course.priceTypeList = data
    },
    // 设置题库信息
    SET_QUESTION_BANK_INFO(state, data) {
        state.user.questionBankInfo = data
        uni.setStorage({ key: 'questionBankInfo', data: data })
    },
    // 设置题目列表 
    SET_LIST(state, list) {
        state.questionList.list = list
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
        data = data || {}
        let userInfo =  {...state.user.userInfo, ...data}
        commit('SET_USER_INFO', userInfo)
    },

    // 设置用户信息
    setUserInfo({ commit }, data) {
        commit('SET_USER_INFO', data)
    },
    // 设置当前机构
    setOrgCurrent({ commit }, dsta) {
        commit('SET_ORG_CURRENT', dsta)
        let userInfo = state.user.userInfo, orgInfo = state.user.organizationCurrent
        service.setHeader({ token: userInfo.token || '',  'org-id': orgInfo.id || '' })
    },

    // 设置机构列表
    setOrgList({ commit }, data) {
        commit('SET_ORG_LIST', data)
    },

    async login({ commit }, data) {
        let res = await login(data)
        if (res.code === 0) {
            commit('SET_LOGIN_STATUS', true)
            commit('SET_USER_INFO', res.data)
            commit('SET_ORG_LIST', res.data.org_list)
            let userInfo = state.user.userInfo, orgInfo = state.user.organizationCurrent
            service.setHeader({ token: userInfo.token || '',  'org-id': orgInfo.id || '' })
        }
        return res
    },
    async loginout({ commit }, data) {
        let keys = ['userInfo', 'orgInfo', ,'region', 'questionBankInfo']
        commit('SET_LOGIN_STATUS', false)
        keys.forEach(key => { uni.removeStorage({ key: key}) })

        return loginout()
    },
    // 获取热评词
    async getCommentHotWord({ commit }, data) {
        let res = await courseCommentHotWord()
        if (res.code === 0) {
            let list = res.data.map((word, index) => {
                return {id: index, label: word, checked: false}
            })
            commit('SET_HOT_WORD', list)
        }
    },
    async getCategoryList() {
        let res = await getCategoryList()
        if (res.code === 0) {
            commit('SET_CATEGORY', res.data)
        }
    },
    async getPriceTypeList() {
        let res = await coursePriceType()
        if (res.code === 0) {
            commit('SET_PRICETYPE', res.data)
        }
    },
    setQuestionBankInfo({ commit }, data) {
        commit('SET_QUESTION_BANK_INFO', data)
    },    
    setQusetionList({ commit }, list) {
        commit('SET_LIST', list)
    }
}

var store = new Vuex.Store({ state, getters, mutations, actions })

export default store

