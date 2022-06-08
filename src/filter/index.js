import Vue from 'vue'
import avator from '@/static/img/user_avator.png'

const systems = uni.getSystemInfoSync()

const filters = {
    phoneFormat(val) {
        if (!val) return '--'
        return (val + '').replace(/(\d{3})\d{4}(\d{4})/, `$1****$2`)
    },
    idCardFormat(val) {
        if (!val) return '--'
        return (val + '').replace(/(\d{2})\d+(\d{3})/, `$1**************$2`)
    },
    moneyFormat(number) {
        number = (number * 1 || 0).toFixed(3).slice(0, -1)
        return `￥${number}`
    },
    empty(val) {
        return val === undefined || val === null || val === '' ? '--' : val
    },
    avatorFormat(url) {
        return url || avator
    },
}

Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})