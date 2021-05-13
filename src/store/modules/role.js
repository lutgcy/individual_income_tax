const state = {
  roleType: 'employee'
}

const mutations = {
  SET_ROLE_TYPE: (state, roleType) => {
    state.roleType = roleType
  }
}

const actions = {
  setRoleType({ commit }, roleType) {
    commit('SET_ROLE_TYPE', roleType)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
