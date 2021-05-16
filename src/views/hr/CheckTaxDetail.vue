<template>
  <div class="app-container">
    <el-form ref="searchForm" :inline="true" :model="searchFromData">
      <el-form-item
        prop="empId"
        label="员工编号"
        size="medium"
      >
        <el-input
          v-model="searchFromData.empId"
          size="small"
          placeholder="请输入员工编号"
          clearable
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item prop="empName" label="员工姓名" size="medium">
        <el-input
          v-model="searchFromData.empName"
          size="small"
          placeholder="请输入员工姓名"
          clearable
          style="width: 240px"
        />
      </el-form-item>

      <el-form-item prop="yearOnly" label="选择年份" size="medium">
        <el-date-picker
          v-model="searchFromData.yearOnly"
          style="margin-right: 10px"
          type="year"
          size="small"
          clearable
          placeholder="选择年"
          value-format="yyyy"
        />
      </el-form-item>

      <el-form-item prop="onlyMonth" label="选择月份" size="medium">
        <el-select v-model="searchFromData.onlyMonth" clearable placeholder="请选择">
          <el-option
            v-for="item in monthOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="search">查找</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetForm('searchForm')">重置</el-button>
      </el-form-item>

    </el-form>
    <el-row>
<!--      <el-button plain type="primary" icon="el-icon-refresh-right" size="mini" @click="generate">重新生成纳税数据</el-button>-->
      <el-button plain type="warning" icon="el-icon-document" size="mini" @click="handleDownload">导出当前页</el-button>
      <el-button plain :disabled="false" type="danger" icon="el-icon-document" size="mini" @click="handleDownloadAll">导出所有页</el-button>
    </el-row>
    <el-table
      ref="multipleTable"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.7)"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%; margin: 15px auto;"
      :header-cell-style="{background:'#EBEEF5',color:'#606266',textAlign: 'center'}"
      :cell-style="{ textAlign: 'center' }"
      highlight-current-row
      show-header
    >
      <el-table-column
        prop="emp_id"
        label="员工编号"
      />

      <el-table-column
        prop="emp_name"
        label="员工姓名"
      />

      <el-table-column
        prop="tax_year"
        label="年份"
      />

      <el-table-column
        prop="tax_month"
        label="月份"
      />

      <el-table-column
        label="应纳税所得额"
        prop="taxable_income"
      />
      <el-table-column
        label="应纳税额"
        prop="tax_money"
      />
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
import { generateTax, searchTaxDetail } from '@/api/tax'
import XLSX from 'xlsx'
import { openDownloadDialog, sheet2blob } from '@/utils/myexcel'

export default {
  data() {
    return {
      listQuery: {
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      tableData: [],
      searchFromData: {
        empId: undefined,
        empName: undefined,
        yearOnly: undefined,
        onlyMonth: undefined
      },
      total: undefined,
      loading: false,
      searchChange: false,
      monthOptions: [{
        value: '1',
        label: '一月'
      }, {
        value: '2',
        label: '二月'
      }, {
        value: '3',
        label: '三月'
      }, {
        value: '4',
        label: '四月'
      }, {
        value: '5',
        label: '五月'
      }, {
        value: '6',
        label: '六月'
      }, {
        value: '7',
        label: '七月'
      }, {
        value: '8',
        label: '八月'
      }, {
        value: '9',
        label: '九月'
      }, {
        value: '10',
        label: '十月'
      }, {
        value: '11',
        label: '十一月'
      }, {
        value: '12',
        label: '十二月'
      }]
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
    this.getTaxDetailList(this.listQuery.pageNum, this.listQuery.pageSize)
    searchTaxDetail({}, this.listQuery.pageNum, this.listQuery.pageSize, this.$store.getters.token).then((response) => {
      this.total = response.data.total
    })
  },
  methods: {
    search() {
      const condition = {}
      if (this.searchFromData.empId) {
        condition['empId'] = this.searchFromData.empId
      }
      if (this.searchFromData.empName) {
        condition['empName'] = this.searchFromData.empName
      }
      if (this.searchFromData.yearOnly) {
        condition['yearOnly'] = this.searchFromData.yearOnly
      }
      if (this.searchFromData.onlyMonth) {
        condition['onlyMonth'] = this.searchFromData.onlyMonth
      }
      this.loading = true
      if (this.searchChange) {
        this.listQuery.pageNum = 1
        this.searchChange = false
      }
      searchTaxDetail(condition, this.listQuery.pageNum, this.listQuery.pageSize, this.$store.getters.token).then((response) => {
        this.tableData = response.data.list
        this.listQuery.total = response.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    getTaxDetailList(pageNum, pageSize) {
      this.search(pageNum, pageSize)
    },
    pageChange() {
      this.getTaxDetailList(this.listQuery.pageNum, this.listQuery.pageSize)
    },
    sizeChange(pageSize) {
      this.getTaxDetailList(1, pageSize)
    },
    // 单个对象转为一个数组 ===》 filter
    objectToArray(obj) {
      const arr = []
      let i = 0
      const header_title = ['emp_id', 'emp_name', 'tax_year', 'tax_month', 'taxable_income', 'tax_money']
      for (const key of header_title) {
        arr[i++] = !obj[key] ? '' : obj[key]
      }
      return arr
    },
    // 对象数组转为二维数组 ===》 filter
    formatJson(tableData) {
      return tableData.map(v => this.objectToArray(v))
    },
    handleDownload() {
      const data = this.formatJson(this.tableData)
      data.unshift(
        ['员工编号', '员工姓名', '年份', '月份', '应纳税所得额', '应纳税额']
      )
      const sheet = XLSX.utils.aoa_to_sheet(data)
      openDownloadDialog(sheet2blob(sheet), 'tax-page.xlsx')
    },
    handleDownloadAll() {
      let wholeTableData = []
      new Promise((resolve, reject) => {
        const condition = {}
        if (this.searchFromData.empId) {
          condition['empId'] = this.searchFromData.empId
        }
        if (this.searchFromData.empName) {
          condition['empName'] = this.searchFromData.empName
        }
        if (this.searchFromData.yearOnly) {
          condition['yearOnly'] = this.searchFromData.yearOnly
        }
        if (this.searchFromData.onlyMonth) {
          condition['onlyMonth'] = this.searchFromData.onlyMonth
        }
        searchTaxDetail(condition, 1, this.total, this.$store.getters.token).then(response => {
          wholeTableData = response.data.list
          resolve()
        }).catch(error => {
          console.log(error)
          reject()
        })
      }).then(() => {
        const data = this.formatJson(wholeTableData)
        data.unshift(
          ['员工编号', '员工姓名', '年份', '月份', '应纳税所得额', '应纳税额']
        )
        const sheet = XLSX.utils.aoa_to_sheet(data)
        openDownloadDialog(sheet2blob(sheet), 'tax-all.xlsx')
      })
    },
    generate() {
      this.$confirm('将重新生成数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        generateTax(this.$store.getters.token).then(() => {
          this.loading = false
          this.getTaxDetailList(this.listQuery.pageNum, this.listQuery.pageSize)
        }).catch()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>

</style>
