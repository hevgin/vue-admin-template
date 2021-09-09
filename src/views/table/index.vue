<template>
  <div class="app-container">
    <el-card class="search-form" shadow="never">
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
              <el-date-picker v-model="form.time1" type="datetime" placeholder="选择日期时间" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="结束时间">
              <el-date-picker v-model="form.time2" type="datetime" placeholder="选择日期时间" />
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
    </el-card>

    <el-card class="table-list" shadow="never">
      <template slot="header">
        <span>卡片名称</span>
        <div class="button-group">
          <el-button size="small" type="primary" icon="el-icon-plus">新增</el-button>
          <el-button size="small" type="primary" icon="el-icon-delete">删除</el-button>
        </div>
      </template>
      <el-table v-loading="listLoading" :data="list" border stripe element-loading-text="Loading">
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
    </el-card>
  </div>
</template>

<script>
import { getList } from '@/api/table'

export default {
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
      listLoading: true,
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
      this.listLoading = true
      getList().then((response) => {
        this.list = response.data.items
        this.listLoading = false
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
