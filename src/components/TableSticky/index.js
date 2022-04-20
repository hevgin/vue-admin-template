/**
* table表头固定吸附功能
* 通过动态计算设置table最大高度
*/

// 业务文件调用：
// import TableSticky from '@/components/TableSticky'
// mixins: [TableSticky]
// <el-table ref="table" :max-height="tableHeight"></el-table>

// 场景1：正常列表页，table-list > el-table + el-pagination
// 场景2: 带tab切换的列表页, 除了按上面正常调用, 在tab切换时增加如下代码, tableOffset在特殊场景设置，场景1不需要设置

// this.$nextTick(() => {
//   this.tableOffset = 0
//   this.tableSticky = this.$refs.table.$el
// })

export default {
  created() {
    this.bindEvents()
  },
  beforeDestory() {
    this.unbindEvents()
  },
  activated() {
    this.bindEvents()
  },
  deactivated() {
    this.unbindEvents()
  },
  methods: {
    bindEvents() {
      if (this._bindFixContainerResizeEvent) {
        return
      }
      window.addEventListener('resize', this.calcuFixHeight, false)
      this._bindFixContainerResizeEvent = true
    },
    unbindEvents() {
      window.removeEventListener('resize', this.calcuFixHeight, false)
      this._bindFixContainerResizeEvent = false
    },
    calcuFixHeight() {
      this.$nextTick(() => {
        const parentNode = this.tableSticky && this.tableSticky.parentNode || document.querySelector('.table-list')
        const childNode = parentNode.children[0]
        let childNodeTop = childNode.getBoundingClientRect().top

        // 分页高度
        const paginationNode = parentNode.getElementsByClassName('el-pagination')
        let paginationStyle = {}
        let paginationHeight = 0
        if (paginationNode.length) {
          paginationStyle = window.getComputedStyle(paginationNode[0])
          paginationHeight = +paginationStyle.marginTop.replace('px', '') + +paginationStyle.height.replace('px', '')
        }

        // 容器底部高度
        const containerNode = document.querySelector('.app-container')
        const containerStyle = window.getComputedStyle(containerNode)
        const containerPaddingBottom = +containerStyle.paddingBottom.replace('px', '')

        if (this.tableSticky) {
          childNodeTop = this.tableSticky.getBoundingClientRect().top
        }
        this.tableHeight = window.innerHeight - childNodeTop - paginationHeight - this.tableOffset - containerPaddingBottom
      })
    }
  },
  data() {
    return {
      tableHeight: 'auto',
      tableSticky: null,
      tableOffset: 0
    }
  },
  watch: {
    tableSticky() {
      this.calcuFixHeight()
    }
  }
}
