import { combineURLs, isAbsoluteURL } from './utils'


const GLOBAL = uni,
    BASE_URL = process.env.VUE_APP_BASE_API;


class Http {
    constructor() {
        this.__initConfig()
        this.__initInterceptor()
        this.__defaultInterceptr()
    }

    __initConfig() {
        this.$config = {
            dataType: 'json',
            responseTtype: 'json',
            header: {
                // "X-Token": '1111'
                'content-type': 'application/json; charset=utf8'
            }
        }
        this.$cache = {}
    }

    __initInterceptor() {
        this.requestInterceptors = []
        this.responseInterceptors = []
        this.errInterceptors = []
    }

    __defaultInterceptr() {
        const tipsRequest = (data, config) => {
            if (config.loading) {
                GLOBAL.showLoading(config.loading)
            } else if (config.toast) {
                GLOBAL.showToast(config.toast)
            } else {
                return; 1
            }
        }

        const tipsRespone = (data, config) => {
            console.log('tipsRespon', data, config);
            if (config.loading) {
                GLOBAL.hideLoading()
            } else if (config.toast) {
                GLOBAL.hideToast()
            }
            return;
        }

        const tipsError = (data, config) => {
            console.log('tipsError', data, config);
            if (config.loading) {
                GLOBAL.hideLoading()
            } else if (config.toast) {
                GLOBAL.hideToast()
            } else {
                return;
            }
        }

        this.requestInterceptorsInject(tipsRequest)
        this.responseInterceptorsInject(tipsRespone)
        this.errorInterceptorsInject(tipsError)
    }

    /**
     * 请求方法
     * @param {*} options 
     */
    request(options) {
        let { url, data, header } = options

        if (!isAbsoluteURL(url)) { url = BASE_URL + url }
        header = this.mergConfig(this.$config.header, header)

        const config = { ...options, url, header }

        this.$cache = config
        // return Promise.resolve(this.send(config))
        return new Promise((resolve, reject) => {
            config.success = res => {
                console.log("re", res);
                if (res.statusCode !== 200) {
                    throw new Error('eeeeee')
                }
                this.forEach(this.requestInterceptors, res.data, config)
                resolve(res.data)
            }
            config.fail = err => {
                console.log("err", err);
                this.forEach(this.errInterceptors, err, config)
                reject(err)
            }
            config.complete = (res) => {
                this.forEach(this.responseInterceptors, res, config)
            }
            return GLOBAL.request(config)
        })
    }

    mergConfig(target, source) {
        return Object.assign(target, source)
    }

    // 数据转换 
    dataTransform(response) {
        console.log("dataTransform", response);
        let { data } = response
        if (typeof data === 'string') {
            return JSON.parse(data)
        } else {
            return data
        }
    }

    /**
     * 注入请求拦截器
     * @param [{ handler: () => {} }] interceptor 
     */
    requestInterceptorsInject(interceptors) {
        if (this.checkInterceptor(interceptors) === 'array') {
            this.requestInterceptors.push(...interceptors)
        } else {
            this.requestInterceptors.push(interceptors)
        }
    }

    // 注入响应拦截器
    responseInterceptorsInject(interceptors) {
        if (this.checkInterceptor(interceptors) === 'array') {
            this.responseInterceptors.push(...interceptors)
        } else {
            this.responseInterceptors.push(interceptors)
        }
    }

    // 异常拦截器
    errorInterceptorsInject(interceptors) {
        if (this.checkInterceptor(interceptors) === 'array') {
            this.errInterceptors.push(...interceptors)
        } else {
            this.errInterceptors.push(interceptors)
        }
    }

    // 弹出请求拦截器
    requestInterceptorsEject(index) {
        this.requestInterceptors[index] = undefined
    }

    // 弹出响应拦截器
    responseInterceptorsEject(index) {
        this.responseInterceptors[index] = undefined
    }

    // 取消异常拦截器 
    errorInterceptorsEject(index) {
        this.errInterceptors[index] = undefined
    }

    // 执行拦截器
    forEach(arr) {
        let args = Array.prototype.slice.call(arguments, 1)
        try {
            for (let i = 0, ii = arr.length; i < ii; i++) {
                const interceptor = arr[i];
                (interceptor && interceptor.apply(this, args));
            }
        } catch (e) {
            console.log("Request error", e);
        }
    }

    /**
     * 发送请i去
     * @param {*} options 
     */
    send(options) {
        return new Promise((resolve, reject) => {
            options.success = res => {
                this.forEach(this.requestInterceptors, res.data, options)
                resolve(res.data)
            }
            options.complete = (res) => {
                this.forEach(this.responseInterceptors, res, options)
            }
            return GLOBAL.request(options)
        })
    }

    // 检查拦截器类型
    checkInterceptor(val) {
        if (typeof val === 'function') {
            return 'function'
        } else if (typeof val !== 'string' && val.length !== undefined) {
            return 'array'
        } else {
            return 'illegal'
        }
    }
}

export default new Http()