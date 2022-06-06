import request from '@/request/index'

// 获取小程序信息
export const getVersion = (data) => {
    return requset({
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

export function userCourseList(data) {
    return request({
        url: 'user/courseList',
        method: 'get',
        data
    })
}

export function uploadImage(data) {
    return request({
        url: 'user/uploadImage',
        method: 'post',
        data
    })
}

export function feedback(data) {
    return request({
        url: 'helpcenter/feedback',
        method: 'post',
        data
    })
}
