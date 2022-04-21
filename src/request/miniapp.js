import Interceptor from './interceptor'

// bases-uytrew 
const BASE_URL = process.env.VUE_APP_BASE_API,
    PREFIX = '',
    SUFFIX = '',
    GLOBAL = uni;

// main
class Request extends Interceptor {

    constructor() {
        super()
        this.__initConfig()
        this.__initInterceptors()
        this.isAbsolute = /^[a-z]+:\/\/\w+\.\w+/i
    }

    // 初始化拦截器
    __initInterceptors() {
        this.requetInterceptors = []
        this.responseInterceptors = []
    }

    // 初始化配置
    __initConfig() {
        this.$config = {
            prefix: PREFIX,
            suffix: SUFFIX,
            baseUrl: BASE_URL,
            confirm: false,
            toast: false,
            loading: false,
            data: {},
            header: {
                token: 'eyJvcmdhbml6YXRpb25faWQiOjM0NiwiYXV0b2dyYXBoIjoiTitqOEpEZThUWVJkb0hhYXV6WDRCSjJTM05YM1I1dWdGVWJ0a3ZcL3FFbHB2cWNyNVZ2b09FMHpueEN2M2NpQUxGTWpoVFZRR3U5YjVPa0h3SkZsM2MwNVY4bm0wd25vNmlQbXdcLzBOT1dFTT0iLCJwcml2YXRlX2tleSI6IjI4NDgxNTE1NDE1MTA3MTgiLCJ1aWQiOjQ1OTAwLCJvcmlnaW5hbF91c2VyX2tleSI6IjI4NDgxNTE1NDE1MTA3MTgifQ'
            }
        }
    }

    // 创建请求
    request(options) {
        let requetInterceptors = this.requetInterceptors,
            responseInterceptors = this.responseInterceptors,
            config = this.mergeConfig(options),
            promise = Promise.resolve(config);

        const forEach = (interceptors) => {
            let len = interceptors.length, index = 0
            while (index < len) {
                let interceptor = interceptors[index++]
                if (interceptor) promise = promise.then(interceptor);
            }
        }

        forEach(requetInterceptors)
        promise = this.send(config)
        forEach(responseInterceptors)

        return promise
    }

    // 发送请求
    send(config) {
        return new Promise((resolve, reject) => {
            config.success = resolve
            config.fail = reject
            GLOBAL.request(config)
        })
    }

    // 合并配置
    mergeConfig(options) {
        let url = options.url, config = Object.assign(this.$config, options)
        config.data = {
            ...config.data,
            question_bank_id: 14
        }
        if (!this.isAbsolute.test(url)) {
            config.url = config.baseUrl + config.prefix + url + config.suffix
        }
        return config
    }

    getToken() {

    }

    setToken() {

    }
}

const request = new Request()

request.useRequestInterceptor(() => {

})

request.useResponseInterceptor((res) => {
    return res.data
})


export default request.request.bind(request)