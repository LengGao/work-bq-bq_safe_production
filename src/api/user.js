// import http from '@/request/web'
// console.log('request', http);

// export function login(data) {
//     return http.request({
//         url: '/passport/login',
//         method: 'post',
//         data,
//         loading: { icon: 'success', title: '成功' },
//     })
// }

// export function list () {
//     return http.request({
//         url: '/Customfield/getPage?page=1&limit=20&output_type=1&keyword='
//     })
// }


import Request from '@/request/miniapp'

export function login(data) {
    return new Request({
        url: '',
        method: 'get',
        data
    })
}