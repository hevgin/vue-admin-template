<template>
  <div class="tags-view-container" :class="{'has-hamburger': layoutType < 2}">
    <hamburger v-if="layoutType < 2" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <el-tabs v-model="activeValue" type="card" @tab-remove="removeTab">
      <el-tab-pane v-for="tag in visitedViews" ref="tag" :key="tag.fullPath" :label="tag.title" :name="tag.fullPath" :closable="!isAffix(tag)">
        <span slot="label" class="el-tabs-name" @click="handleClick(tag)" @click.middle.native="!isAffix(tag) ? closeSelectedTag(tag) : ''" @click.right="openMenu(tag, $event)">{{ tag.title }}</span>
      </el-tab-pane>
    </el-tabs>
    <ul v-show="visible" :style="{left: left+'px', top: top+'px'}" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">刷新</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">关闭</li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags(selectedTag)">全部关闭</li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import path from 'path'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Hamburger
  },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      affixTags: [],
      activeValue: ''
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    layoutType() {
      return this.$store.state.settings.layoutType
    },
    visitedViews() {
      return this.$store.state.tagsView.visitedViews
    },
    routes() {
      return this.$store.state.permission.routes
    }
  },
  watch: {
    $route() {
      this.addTags()
      this.moveToCurrentTag()
    },
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  mounted() {
    this.initTags()
    this.addTags()
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },

    handleClick(route) {
      this.activeValue = route.fullPath
      this.$router.push({ name: route.name, params: route.params, query: route.query })
    },

    removeTab(targetValue) {
      const views = this.visitedViews
      let activeName = this.activeValue
      views.forEach((tab, index) => {
        if (tab.fullPath === targetValue) {
          const nextTab = views[index + 1] || views[index - 1]
          if (nextTab && activeName === targetValue) {
            activeName = nextTab.fullPath
          }
          this.closeSelectedTag(tab)
        }
      })

      this.activeValue = activeName
    },

    isActive(route) {
      return route.path === this.$route.path
    },

    isAffix(tag) {
      return tag.meta && tag.meta.affix
    },

    filterAffixTags(routes, basePath = '/') {
      let tags = []
      routes.forEach((route) => {
        if (route.meta && route.meta.affix) {
          const tagPath = path.resolve(basePath, route.path)
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta }
          })
        }
        if (route.children) {
          const tempTags = this.filterAffixTags(route.children, route.path)
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags]
          }
        }
      })
      return tags
    },

    initTags() {
      const affixTags = (this.affixTags = this.filterAffixTags(this.routes))
      for (const tag of affixTags) {
        // Must have tag name
        if (tag.name) {
          this.$store.dispatch('tagsView/addVisitedView', tag)
        }
      }
    },

    addTags() {
      const { name } = this.$route
      if (name) {
        this.$store.dispatch('tagsView/addView', this.$route)
        this.activeValue = this.$route.fullPath
      }
      return false
    },

    moveToCurrentTag() {
      const tags = this.$refs.tag
      this.$nextTick(() => {
        for (const tag of tags) {
          if (
            tag.name === this.$route.path &&
            tag.name !== this.$route.fullPath
          ) {
            // when query is different then update
            this.$store.dispatch('tagsView/updateVisitedView', this.$route)
            break
          }
        }
      })
    },

    refreshSelectedTag(view) {
      this.$store.dispatch('tagsView/delCachedView', view).then(() => {
        const { fullPath } = view
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + fullPath
          })
        })
      })
    },

    closeSelectedTag(view) {
      this.$store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
        if (this.isActive(view)) {
          this.toLastView(visitedViews, view)
        }
      })
    },

    closeOthersTags() {
      this.$router.push(this.selectedTag)
      this.$store.dispatch('tagsView/delOthersViews', this.selectedTag).then(() => {
        this.moveToCurrentTag()
      })
    },

    closeAllTags(view) {
      this.$store.dispatch('tagsView/delAllViews').then(({ visitedViews }) => {
        if (this.affixTags.some((tag) => tag.path === view.path)) {
          return
        }
        this.toLastView(visitedViews, view)
      })
    },

    toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        this.$router.push(latestView.fullPath)
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'Dashboard') {
          // to reload home page
          this.$router.replace({ path: '/redirect' + view.fullPath })
        } else {
          this.$router.push('/')
        }
      }
    },

    openMenu(tag, e) {
      e.preventDefault()
      const menuMinWidth = 105
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      const offsetWidth = this.$el.offsetWidth // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const left = e.clientX - offsetLeft - 20 // 15: margin right

      if (left > maxLeft) {
        this.left = maxLeft
      } else {
        this.left = left
      }

      this.top = e.clientY - 40
      this.visible = true
      this.selectedTag = tag
    },

    closeMenu() {
      this.visible = false
    }
  }
}
</script>

<style lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(0.6);
        display: inline-block;
        vertical-align: -3px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
