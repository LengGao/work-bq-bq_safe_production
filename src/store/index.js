import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import applet from './modules/applet'
import questionList from './modules/questionList'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        user,
        applet,
        questionList
    },
    getters
})

export default store