<template>
  <div v-loading.fullscreen.lock="fullscreenLoading" class="app-container">
    <div class="page-module">
      <div class="module-top-info">
        <div class="module-top-left">
          <span class="el-tag el-tag--warning el-tag--dark">未开始</span>
          <el-dropdown>
            <span class="el-dropdown-link">
              <b>下拉菜单</b>
              <i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>黄金糕</el-dropdown-item>
              <el-dropdown-item>狮子头</el-dropdown-item>
              <el-dropdown-item>螺蛳粉</el-dropdown-item>
              <el-dropdown-item disabled>双皮奶</el-dropdown-item>
              <el-dropdown-item divided>蚵仔煎</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="module-top-line" />
      <div class="module-top-tabs">
        <div class="tab-item on">概览</div>
        <div class="tab-item">产品需求</div>
        <div class="tab-item">产品计划</div>
        <div class="tab-item">项目</div>
        <div class="tab-item">文档</div>
      </div>
    </div>
    <div class="page-module">
      <el-form label-width="100px" :model="form" size="small">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="调用次数">
              <el-input v-model="form.user" placeholder="调用次数" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <template slot="label">
                审批人
                <el-tooltip effect="dark" content="Right Center 提示文字" placement="top">
                  <svg-icon icon-class="question" />
                </el-tooltip>
              </template>
              <el-input v-model="form.user" placeholder="审批人" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="活动区域">
              <el-select v-model="form.region" placeholder="活动区域">
                <el-option label="区域一" value="1" />
                <el-option label="区域二" value="2" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="开始时间">
              <el-date-picker v-model="form.time1" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期时间" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="结束时间">
              <el-date-picker v-model="form.time2" type="datetimerange" placeholder="选择日期时间" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="0">
              <el-button>重置</el-button>
              <el-button type="primary">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="page-module">
      <div class="module-head">
        <div class="module-name">卡片名称</div>
        <div class="module-handle">
          <el-button size="small" type="primary" icon="el-icon-plus">新增</el-button>
          <el-button size="small" type="primary" icon="el-icon-delete">删除</el-button>
        </div>
      </div>
      <el-table :data="list">
        <el-table-column align="center" label="ID" width="95">
          <template slot-scope="scope">
            {{ scope.$index }}
          </template>
        </el-table-column>
        <el-table-column label="Title">
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column label="Author" width="110" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.author }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Pageviews" width="110" align="center">
          <template slot-scope="scope">
            {{ scope.row.pageviews }}
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="Status" width="110" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="created_at" label="Display_time" width="200">
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span>{{ scope.row.display_time }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="400" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import { getList } from '@/api/table'

export default {
  name: 'Table',
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      fullscreenLoading: true,
      currentPage: 4,
      form: {
        user: '',
        region: ''
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.fullscreenLoading = true
      getList().then((json) => {
        this.list = json.items
        this.fullscreenLoading = false
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    }
  }
}
</script>
