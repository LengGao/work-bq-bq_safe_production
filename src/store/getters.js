const getters = {
    appInfo: state => state.applet.appInfo,
    token: state => state.user.userInfo.token,
    userInfo: state => state.user.userInfo,
    organization_id: state => state.applet.appInfo.organization_id,
    questionBankInfo: state => state.user.questionBankInfo,
    question_bank_id: state => state.user.questionBankInfo.question_bank_id,
    questionList: state => state.questionList.list
}
export default getters