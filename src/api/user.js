import Request from '@/request/index'

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
    return Request({
        url: 'http://testadmin.beiqujy.com/apidata/admin/v2/StaffNotice/index',
        method: 'get',
        data
    })
}


