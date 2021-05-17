import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'

// create an axios instance
const service = axios.create({
  baseURL: '/interface',
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 20000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // console.log(store.getters.token + "*************111111111111111111111");
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // console.log(store.getters.token + "*************222222222222222222");  //'Content-Type': 'application/x-www-form-urlencoded'

      // config.headers['X-Token'] = getToken()
      // config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    if (res.token) {
      // console.log(res)
      Message({
        message: '登录成功' || 'Error',
        type: 'info',
        duration: 3 * 1000
      })
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return response
      // return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return response
    }
  },
  error => {
    if (error.response) {
      if (error.response.status === 401) {
        MessageBox.confirm('登录信息已过期，请您重新登录！', 'Confirm logout', {
          confirmButtonText: '重新登录',
          cancelButtonText: '返回',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      } else {
        Message({
          message: 'requests.js:line 91 ' + error.message,
          type: 'error',
          duration: 3 * 1000
        })
      }
    }
    return Promise.reject(error)
  }
)

export default service
