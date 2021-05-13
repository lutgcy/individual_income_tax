<template>
  <div class="app-container">
    <el-row>
      <el-form ref="searchForm" :inline="true" :model="searchFromData">
        <el-form-item
          prop="applyState"
          label="申请状态"
          size="medium"
        >
          <el-select v-model="searchFromData.applyState" clearable placeholder="请选择" size="small" style="margin: 0 10px" @change="selectChange">
            <el-option
              v-for="item in applyStateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="empName" label="员工姓名" size="medium">
          <el-input
            v-model="searchFromData.empName"
            size="small"
            placeholder="请输入员工姓名"
            clearable
            style="width: 180px"
          />
        </el-form-item>
        <el-form-item
          prop="dateRange"
          label="申请日期"
          size="medium"
        >
          <el-date-picker
            v-model="searchFromData.dateRange"
            size="small"
            clearable
            type="monthrange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始月份"
            end-placeholder="结束月份"
            :picker-options="pickerOptions"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="search">查找</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetForm('searchForm')">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button size="medium" @click="setZero">setZero</el-button>
          <el-button type="success" icon="el-icon-edit" size="medium">XX</el-button>
          <el-button type="primary" icon="el-icon-plus" size="medium">XX</el-button>
        </el-form-item>
      </el-form>

    </el-row>
    <el-table
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.7)"
      :data="tableData"
      :header-cell-style="{background:'#EBEEF5',color:'#606266',textAlign: 'center'}"
      :cell-style="{ textAlign: 'center' }"
      style="width: 90%; margin: 10px 30px"
    >
      <el-table-column
        label="申请人"
      >
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>姓名: {{ scope.row.emp_name }}</p>
            <p>住址: {{ scope.row.emp_address }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium" type="">{{ scope.row.emp_name }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        label="申请项"
      >
        <template slot-scope="scope">
          <el-tag type="success">{{ scope.row.apply_type | applyType }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        label="日期"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 10px">{{ scope.row.apply_date | dateFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="申请额度"
        width="100"
      >
        <template slot-scope="scope">
          <svg-icon icon-class="money" />
          <span style="margin-left: 10px">{{ scope.row.apply_money }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请文件">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            @click="handleDownload(scope.row)"
          >下载</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="申请状态"
      >
        <template slot-scope="scope">
          <el-tag
            :key="items[scope.row.apply_state].label"
            :type="items[scope.row.apply_state].type"
            effect="dark"
          >
            {{ items[scope.row.apply_state].label }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success"
            plain
            @click="handleAgree(scope.row)"
          >批准</el-button>
          <el-button
            size="mini"
            type="warning"
            plain
            @click="handleReject(scope.row)"
          >驳回</el-button>
          <!--          <el-button-->
          <!--            size="mini"-->
          <!--            type="danger"-->
          <!--            plain-->
          <!--            @click="handleDelete(scope.row)"-->
          <!--          >删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <!--    分页-->
    <template>
      <el-pagination
        background
        style="margin-top: 20px;"
        layout="total, sizes, prev, pager, next, jumper"
        :total="listQuery.total"
        :current-page.sync="listQuery.pageNum"
        :page-size.sync="listQuery.pageSize"
        :page-sizes="[5, 10, 20, 30, 50]"
        @current-change="pageChange"
        @size-change="sizeChange"
      />
    </template>
  </div>
</template>

<script>
import { agreeApply, deleteApply, downloadApplyFile, rejectApply, searchAddApply, setZero } from '@/api/addition'
import Qs from 'qs'
import Moment from 'moment'

export default {
  filters: {
    applyType: function(value) {
      const roleTypeMap = {
        'child_edu': '子女教育',
        'big_sick': '大病医疗',
        'continue_edu': '继续教育',
        'old_man': '赡养老人',
        'credit': '住房贷款利息',
        'rent': '租房租金'
      }
      if (roleTypeMap[value]) {
        return roleTypeMap[value]
      } else {
        return '显示错误：' + value
      }
    },
    dateFilter: function(value) {
      if (!value) {
        return value
      } else {
        return Moment(value).format('YYYY-MM')
      }
    }
  },
  data() {
    return {
      applyStateOptions: [{
        value: '0',
        label: '待审核'
      }, {
        value: '1',
        label: '已批准'
      }, {
        value: '2',
        label: '已驳回'
      }],
      pickerOptions: {
        shortcuts: [{
          text: '本月',
          onClick(picker) {
            picker.$emit('pick', [new Date(), new Date()])
          }
        }, {
          text: '今年至今',
          onClick(picker) {
            const end = new Date()
            const start = new Date(new Date().getFullYear(), 0)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近六个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setMonth(start.getMonth() - 6)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      listQuery: {
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      searchFromData: {
        applyState: undefined,
        empName: undefined,
        dateRange: []
      },
      loading: false,
      searchChange: false,
      tableData: [],
      items: [
        { type: 'info', label: '待审核' },
        { type: 'success', label: '已批准' },
        { type: 'danger', label: '已驳回' }
      ]
    }
  },
  watch: {
    searchFromData: {
      handler: function() {
        this.searchChange = true
      },
      deep: true // 深度监听
      // immediate: true,  //立即执行
    }
  },
  created() {
    this.getAddApplyList(this.listQuery.pageNum, this.listQuery.pageSize)
  },
  methods: {
    setZero() {
      // setZero().then(() => {
      //
      // }).catch(() => {
      //   alert('error')
      // })
    },
    selectChange() {
      this.search()
    },
    handleAgree(row) {
      agreeApply(Qs.stringify({ 'id': row.id })).then(() => {
        this.$message.info('操作成功')
        this.search()
      }).catch(() => {
        this.$message.error('操作失败')
      })
    },
    handleReject(row) {
      rejectApply(Qs.stringify({ 'id': row.id })).then(() => {
        this.$message.info('操作成功')
        this.search()
      }).catch(() => {
        this.$message.error('操作失败')
      })
    },
    handleDelete(row) {
      deleteApply(Qs.stringify({ 'id': row.id })).then(() => {
        this.$message.info('操作成功')
        this.search()
      }).catch(() => {
        this.$message.error('操作失败')
      })
    },
    handleDownload(row) {
      downloadApplyFile({ 'fileName': row.apply_file }).then((response) => { // 传对象 payload  键值对 formData
        const blob = new Blob([response.data], { type: 'multipart/form-data' })
        const downloadElement = document.createElement('a')
        const href = window.URL.createObjectURL(blob) // 创建下载的链接
        downloadElement.href = href
        downloadElement.download = row.apply_file.split('\\').pop() // 下载后文件名
        document.body.appendChild(downloadElement)
        downloadElement.click() // 点击下载
        document.body.removeChild(downloadElement) // 下载完成移除元素
        window.URL.revokeObjectURL(href) // 释放掉blob对象
      })
    },
    search() {
      const condition = {}
      if (this.searchFromData.empName) {
        condition['empName'] = this.searchFromData.empName
      }
      if (this.searchFromData.applyState) {
        condition['applyState'] = this.searchFromData.applyState
      }
      if (this.searchFromData.dateRange.length === 2) {
        condition['startDate'] = this.searchFromData.dateRange[0]
        condition['endDate'] = this.searchFromData.dateRange[1]
      }
      this.loading = true
      if (this.searchChange) {
        this.listQuery.pageNum = 1
        this.searchChange = false
      }
      searchAddApply(condition, this.listQuery.pageNum, this.listQuery.pageSize, this.$store.getters.token).then((response) => {
        this.tableData = response.data.list
        // console.log(this.tableData)
        this.listQuery.total = response.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    getAddApplyList(pageNum, pageSize) {
      this.search(pageNum, pageSize)
    },
    pageChange() {
      this.getAddApplyList(this.listQuery.pageNum, this.listQuery.pageSize)
    },
    sizeChange(pageSize) {
      this.getAddApplyList(1, pageSize)
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>

</style>
