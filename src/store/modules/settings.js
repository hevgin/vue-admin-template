import defaultSettings from '@/settings'
import Cookies from 'js-cookie'

const { title, showNavIcon, layoutType } = defaultSettings
const layout = Cookies.get('layout') || 0
const state = {
  title,
  showNavIcon,
  layoutType: +layout >= 0 ? +layout : layoutType
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value

      if (key === 'layoutType') {
        Cookies.set('layout', value)
      }
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

