import axios from 'axios'
import contentDisposition from 'content-disposition'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth' // get token from cookie
import { saveBlob } from '@/utils/index'
const VUE_APP_ROUTER = process.env.VUE_APP_ROUTER

const ajax = function(options) {
  const NODE_ENV = process.env.NODE_ENV
  const BASE_API = process.env.VUE_APP_BASE_API
  const token = getToken()
  const defaults = {
    responseType: 'json',
    method: 'post',
    baseURL: BASE_API,
    url: '',
    data: {},
    timeout: 30000,
    withCredentials: true,
    hideToast: false,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json;charset=utf-8',
      'Authorization': `bearer ${token}`
    },
    transformResponse: [
      function(data) {
        return data
      }
    ]
  }

  const clone = (target) => {
    if (Object.prototype.toString.call(target) === '[object Object]' || Object.prototype.toString.call(target) === '[object Array]') {
      const result = Array.isArray(target) ? [] : {}
      for (const key in target) {
        result[key] = clone(target[key])
      }
      return result
    // 过滤入参前后空格
    } else if (typeof target === 'string') {
      return target.replace(/(^\s*)|(\s*$)/g, '')
    } else {
      return target
    }
  }

  options = { ...defaults, ...options }
  options.data = options.data ? clone(options.data) : {}

  if (NODE_ENV !== 'production') {
    console.log(JSON.stringify(options.data))
    const url = options.url.indexOf('http') === 0 ? options.url : `${BASE_API}${options.url}`
    console.log(`%c ${url}`, 'color: #207928')
  }

  return new Promise((resole, reject) => {
    let data = {}
    let code = 0
    let message = ''
    axios(options)
      .then((response) => {
        const json = response.data || {}
        data = json.data || {}
        code = json.code
        message = json.msg || '接口异常，请稍后再试.'

        // 文件下载
        if (options.responseType === 'blob') {
          const disposition = response.headers['content-disposition']
          let fileName = 'default'
          let cdResult = null
          try {
            cdResult = contentDisposition.parse(disposition)
          } catch (e) {
            console.log(e)
          }
          if (cdResult && cdResult.parameters && cdResult.parameters.filename) {
            fileName = decodeURI(cdResult.parameters.filename)
          }
          const fileType = response.headers['content-type']
          const fileData = new Blob([json], { type: fileType })
          saveBlob(fileData, fileName)
          resole(json)
          return false
        }

        if (NODE_ENV === 'development' || NODE_ENV === 'debug') {
          console.log(json)
        } else if (NODE_ENV !== 'production') {
          console.log(JSON.stringify(json, null, 2))
        }

        if (json.success) {
          resole(data)
        } else if (code === 1001) {
          // 1101 token无效或已过期
          store.dispatch('user/resetToken').then(() => {
            location.href = `${VUE_APP_ROUTER}login?redirect=${encodeURIComponent(location.pathname + location.search + location.hash)}`
          })
        } else {
          reject({ code, message })
          // hideToast=true不展示报错信息
          if (options.hideToast) {
            return
          }
          Message({ message, type: 'error', duration: 3 * 1000 })
        }
      })
      .catch((error) => {
        if (NODE_ENV !== 'production') {
          console.log(error.message)
        }
        if (error.response) {
          code = error.response.status
          message = error.response.statusText || error.response.data && error.response.data.msg
        } else if (error.request && error.message === 'Network Error') {
          // 网络异常
          message = '连接似乎有问题，请检查网络.'
        } else if (error.request && error.code === 'ECONNABORTED') {
          // 请求超时
          message = '接口异常，请稍后再试.'
        } else if (error.__CANCEL__) {
          // 取消请求
          message = 'cancel request'
          code = '_CANCEL_REQUEST_'
        } else {
          message = 'params setting error'
        }
        reject({ code, message })
        if (options.hideToast) {
          return
        }
        Message({ message, type: 'error', duration: 3 * 1000 })
      })
  })
}
export default ajax
