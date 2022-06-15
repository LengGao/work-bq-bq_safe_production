import request from '@/request/index'
import { PREFIX } from '@/request/config'


// 获取小程序信息
export const getVersion = (data) => {
    return request({
        url: 'sign/getVersion',
        method: 'post',
        data,
        loading: true
    })
}

export function login(data) {
    return request({
        url: 'login/password',
        method: 'post',
        data,
        loading: true
    })
}

export function loginout(data) {
    return request({
        url: 'login/out',
        method: 'post',
        data,
        loading: false
    })
}

export function renewal(data) {
    return request({
        url: 'login/renewal',
        method: 'get',
        data,
        loading: false
    })
}

export function agreement(data) {
    return request({
        url: 'HelpCenter/agreement',
        method: 'post',
        data
    })
}

export function userCourseFavorite(data) {
    return request({
        url: 'user/courseFavorite',
        method: 'get',
        data
    })
}

export function userClasses(data) {
    return request({
        url: 'user/classes',
        method: 'get',
        data
    })
}

export function userCourseList(data) {
    return request({
        url: 'user/courseList',
        method: 'get',
        data
    })
}

export function userCertList(data) {
    return request({
        url: 'user/certList',
        method: 'get',
        data
    })
}

export function problemList(data) {
    return request({
        url: 'article/problemList',
        method: 'post',
        data
    })
}

export function feedback(data) {
    return request({
        url: 'HelpCenter/feedback',
        method: 'post',
        data
    })
}

export function aboutUs(data) {
    return request({
        url: 'HelpCenter/aboutUs',
        method: 'post',
        data
    })
}


export function updateIdCardImg(data) {
    return request({
        url: 'user/updateIdCardImg',
        method: 'post',
        data
    })
}

var base_url = process.env.VUE_APP_BASE_API
var prefix = PREFIX
export function uploadImage(data, header) {
    let url = base_url + prefix + 'user/uploadImage'
    return uni.uploadFile({ url: url, file: data, name: 'image', header })
}


export function uploadFile(files, header, formData) {
    let url = base_url + prefix + 'user/updateIdCardImg'
    return uni.uploadFile({ url: url, files: files, header, formData })
}