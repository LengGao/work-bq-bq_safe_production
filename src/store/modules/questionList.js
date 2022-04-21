const questionList = {
    state: {
        list: [] // 存收藏夹，错题集的答题卡数据
    },
    mutations: {
        SET_LIST(state, list) {
            state.list = list
        }
    },
    actions: {
        setQusetionList({ commit }, list) {
            commit('SET_LIST', list)
        }
    }
}
export default questionList