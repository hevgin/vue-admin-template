import Vue from 'vue'
import store from '@/store/index'

function checkPermission(el, binding) {
  const { value } = binding
  if (value) {
    const permissionBtns = store.state.permission.permissionBtns || []
    const hasPermission = function() {
      return permissionBtns.includes(value)
    }
    if (permissionBtns.length > 0 && !hasPermission()) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  } else {
    console.log(`need resource id! Like v-permission="'resource-id'"`)
  }
}

Vue.directive('permission', {
  inserted(el, binding) {
    checkPermission(el, binding)
  },
  update(el, binding) {
    checkPermission(el, binding)
  }
})
