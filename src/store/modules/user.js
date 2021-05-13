import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import Crypto from 'crypto'
import Cookies from 'js-cookie'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { loginForm, roleType } = userInfo
    const { username, password } = loginForm

    // 对密码进行加密处理再传输
    const hash = Crypto.createHash('SHA256')
    hash.update(password)
    const pwdSHA256 = hash.digest('hex')

    return new Promise((resolve, reject) => {
      let loginUrl = ''
      if (roleType === 'admin') {
        loginUrl = '/api/admin/login'
      } else if (roleType === 'hr') {
        loginUrl = '/api/hr/login'
      } else if (roleType === 'employee') {
        loginUrl = '/api/employee/login'
      }

      login({ username: username.trim(), pwdSHA256: pwdSHA256 }, loginUrl).then(response => {
        const { data } = response

        // token map返回null => data 为 string '' , data.token 为 undefined
        if (data.token && data.roleType) {
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          Cookies.set('roleType', data.roleType) // 将权限类型存到本地cookie，getInfo之前判断，防止F5刷新后VueX数据初始化
        } else {
          reject('账号或密码错误！！！')
        }
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }, roleType) {
    return new Promise((resolve, reject) => {
      let getInfoUrl = ''
      if (roleType === 'admin') {
        getInfoUrl = '/api/admin/info'
      } else if (roleType === 'hr') {
        getInfoUrl = '/api/hr/info'
      } else if (roleType === 'employee') {
        getInfoUrl = '/api/employee/info'
      }

      getInfo(state.token, getInfoUrl).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { roles, name, avatar, introduction } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions  // 原网页 切换 admin | editor
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
