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

// export function staffNotice(data) {
//     return request ({
//         url: 'http://testadmin.beiqujy.com/apidata/admin/v2/StaffNotice/index',
//         method: 'get',
//         data
//     })
// }


export function login(data) {
    return request({
        url: 'login/password',
        method: 'post',
        data
    })
}

export function loginout(data) {
    return request({
        url: 'login/out',
        method: 'post',
        data
    })
}

