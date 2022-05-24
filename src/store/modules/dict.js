const getDefaultState = () => {
  return {
    dictionary: {}
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState())
  },
  SET_DICT: (state, dict) => {
    state.dictionary = dict
  },
  CHANGE_DICT: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.dictionary.hasOwnProperty(key)) {
      state.dictionary[key] = value
    }
  }
}

const actions = {
  // remove dict
  resetDict({ commit }) {
    return new Promise(resolve => {
      commit('RESET_STATE')
      resolve()
    })
  },

  changeDict({ commit }, data) {
    commit('CHANGE_DICT', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

