import defaultSettings from '@/settings'
import Cookies from 'js-cookie'

const { title, showNavIcon, fixedHeader, layoutType } = defaultSettings
const state = {
  title,
  showNavIcon,
  fixedHeader,
  layoutType: +Cookies.get('layout') >= 0 ? +Cookies.get('layout') : layoutType
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

