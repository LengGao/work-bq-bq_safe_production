import Vue from 'vue'
import Vuex from 'vuex'
import { service } from '@/request/index'
import {
    systemRegion
} from '@/api/index'
import {
    login,
    loginout,
    renewal,
} from "@/api/user";
import {
    coursePriceType,
    courseCategory,
    courseCommentHotWord
} from '@/api/course'
import {
    getQuestionBankList
} from '@/api/question'

const region = uni.getStorageSync('region') || {}
const orgInfo = uni.getStorageSync('orgInfo') || {}
const userInfo = uni.getStorageSync('userInfo') || {}
const userStatus = uni.getStorageSync('userStatus') || 0
const questionBankInfo = uni.getStorageSync('questionBankInfo') || {}

Vue.use(Vuex)

const state = {
    user: {
        region: region,
        userInfo: userInfo,
        orgInfo: orgInfo,
        questionBankInfo: questionBankInfo,
        userStatus: userStatus, // 0 1 1000 1008
        is_examination: false,
        is_practice: false,
    },
    course: {
        commentHotWord: [],
        categoryList: [],
        priceTypeList: []
    },
    
    questionList: {
        list: []
    }
}

const getters = {
    
    appInfo: state => state.applet.appInfo,
    
    organization_id: state => state.applet.appInfo.organization_id,
    
    userInfo: state => state.user.userInfo,
    
    token: state => state.user.userInfo.token,
    
    region: state => state.user.region,
    
    userStatus: state => state.user.userStatus,
    
    orgInfo: state => state.user.orgInfo,
    
    organizationList: state => state.user.userInfo.org_list,
    
    question_bank_id: state => state.user.questionBankInfo.question_bank_id,
    
    questionBankInfo: state =>  {
        // if (!state.user.questionBankInfo.length) {
        //     store.dispatch('getQuestionBankInfo')
        // }
        return state.user.questionBankInfo
    },
    
    commentHotWord: state => {
        if (!state.course.commentHotWord.length) {
            store.dispatch('getCommentHotWord')
        }
        return state.course.commentHotWord
    },
    
    categoryList: state => {
        if (!state.course.commentHotWord.length) {
            store.dispatch('getCategoryList')
        }
        return state.course.categoryList
    },

    priceTypeList: state =>  {
        if (!state.course.commentHotWord.length) {
            store.dispatch('getPriceTypeList')
        }
        return state.course.priceTypeList
    },

    questionList: state => state.questionList.list
}

const mutations = {

    SET_USER_INFO(state, data) {
        state.user.userInfo = data
        uni.setStorageSync('userInfo', data)
    },

    SET_REGION(state, data) {
        state.user.region = data
        uni.setStorageSync('region', data)
    },

    SET_LOGIN_STATUS(state, data) {
        state.user.userStatus = data
        uni.setStorageSync('userStatus', data)
    },

    SET_EXAMINATION(state, data) {
        state.user.is_examination = data
    },

    SET_ORG_CURRENT(state, data) {
        state.user.orgInfo = data
        uni.setStorageSync('orgInfo', data)
    },

    SET_ORG_LIST(state, data) {
        state.user.organizationList = data
    },
    
    SET_HOT_WORD(state, data) {
        state.course.commentHotWord = data
    },
    
    SET_CATEGORY(state, data) {
        state.course.categoryList = data
    },
    SET_PRICETYPE(state, data) {
        state.course.priceTypeList = data
    },
    
    SET_QUESTION_BANK_INFO(state, data) {
        state.user.questionBankInfo = data
        uni.setStorageSync('questionBankInfo', data)
    },

    SET_QUESTION_LIST(state, list) {
        state.questionList.list = list
    },
}

const actions = {
    setUserInfo({ commit }, data) {
        commit('SET_USER_INFO', data)
    },
    
    setOrgCurrent({ commit }, dsta) {
        commit('SET_ORG_CURRENT', dsta)
        let userInfo = state.user.userInfo, orgInfo = state.user.orgInfo
        service.setHeader({ token: userInfo.token || '',  'org-id': orgInfo.id || '' })
    },
    
    setOrgList({ commit }, data) {
        commit('SET_ORG_LIST', data)
    },

    async login({ commit }, data) {
        let res = await login(data)
        if (res.code === 0) {
            commit('SET_LOGIN_STATUS', 1)
            commit('SET_USER_INFO', res.data)
            commit('SET_ORG_LIST', res.data.org_list)
            let userInfo = state.user.userInfo, orgInfo = state.user.orgInfo
            service.setHeader({ token: userInfo.token || '',  'org-id': orgInfo.id || '' })
        }
        return res
    },
    async loginout({ commit }, data) {
        commit('SET_LOGIN_STATUS', data || 0)
        commit('SET_ORG_LIST', [])
        let keys = ['userInfo', 'orgInfo', 'questionBankInfo']
        keys.forEach(key => { uni.removeStorage({ key: key}) })

        return loginout()
    },
    async renewal({ commit }, data) {
        let res = await renewal()
        let old = state.user.userInfo
        let orgInfo = state.user.orgInfo
        if (res.code === 0) {
            old.token = res.data.token
            commit('SET_LOGIN_STATUS', 1)
            commit('SET_USER_INFO', old)
            service.setHeader({ token: old.token || '',  'org-id': orgInfo.id || '' })
        }
    },
    async getCommentHotWord({ commit }, data) {
        let res = await courseCommentHotWord()
        if (res.code === 0) {
            let list = res.data.map((word, index) => {
                return {id: index, label: word, checked: false}
            })
            commit('SET_HOT_WORD', list)
        }
    },
    async getCategoryList({ commit }) {
        let res = await courseCategory()
        if (res.code === 0) {
            commit('SET_CATEGORY', res.data)
        }
    },
    async getPriceTypeList({ commit }) {
        let res = await coursePriceType()
        if (res.code === 0) {
            commit('SET_PRICETYPE', res.data)
        }
    },
    async getQuestionBankInfo({ commit }) {
        let res = await getQuestionBankList()
        if (res.code === 0) {
            commit('SET_QUESTION_LIST', res.data)
        }
    },  
    setQusetionList({ commit }, list) {
        commit('SET_QUESTION_LIST', list)
    }
}

var store = new Vuex.Store({ state, getters, mutations, actions })

export default store

