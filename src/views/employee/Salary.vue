<template>
  <div class="app-container">
    <el-form ref="searchForm" :inline="true" :model="searchFromData">

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
      border
      highlight-current-row
      show-header
    >
      <el-table-column
        prop="emp_id"
        label="员工编号"
        width="80"
      />

      <el-table-column
        prop="emp_name"
        label="员工姓名"
      />

      <!--      <el-table-column-->
      <!--        prop="post_name"-->
      <!--        label=" 岗位"-->
      <!--        width="100"-->
      <!--      />-->

      <!--      <el-table-column-->
      <!--        prop="dept_name"-->
      <!--        label="部门"-->
      <!--        width="100"-->
      <!--      />-->

      <el-table-column
        prop="salary_year"
        label="年份"
      />

      <el-table-column
        prop="salary_month"
        label="月份"
        width="60"
      />

      <el-table-column label="应发工资">
        <el-table-column
          label="基本工资"
          prop="base_salary"
        />
        <el-table-column
          label="岗位工资"
          prop="post_salary"
        />
      </el-table-column>
      <el-table-column label="专项扣除">
        <el-table-column
          label="养老保险"
          prop="per_old"
        />
        <el-table-column
          label="医疗保险"
          prop="per_medical"
        />
        <el-table-column
          label="失业保险"
          prop="per_fire"
        />
        <el-table-column
          label="住房公积金"
          prop="per_house"
        />
      </el-table-column>

      <el-table-column
        label="专项附加扣除"
      >
        <el-table-column
          label="子女教育"
          prop="child_edu"
        />
        <el-table-column
          label="继续教育"
          prop="continue_edu"
        />
        <el-table-column
          label="住房租金"
          prop="rent"
        />
        <el-table-column
          label="住房贷款利息"
          prop="credit"
        />
        <el-table-column
          label="赡养老人"
          prop="old_man"
        />
        <el-table-column
          label="大病医疗"
          prop="big_sick"
        />
      </el-table-column>
      <el-table-column
        label="应纳税所得额"
        prop="taxable_income"
      />
      <el-table-column
        label="个人所得税"
        prop="tax_money"
      />
      <el-table-column
        label="实发工资"
        prop="real_salary"
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
import { searchSalary } from '@/api/salary'
import XLSX from 'xlsx'
import { openDownloadDialog, sheet2blob } from '@/utils/myexcel'

export default {
  name: 'Special',
  data() {
    return {
      listQuery: {
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      tableData: [],
      searchFromData: {
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
    this.getSalaryList(this.listQuery.pageNum, this.listQuery.pageSize)
    searchSalary({}, this.listQuery.pageNum, this.listQuery.pageSize, this.$store.getters.token).then((response) => {
      this.total = response.data.total
    })
  },
  methods: {
    search() {
      const condition = {}
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
      searchSalary(condition, this.listQuery.pageNum, this.listQuery.pageSize, this.$store.getters.token).then((response) => {
        this.tableData = response.data.list
        // console.log(this.tableData)
        this.listQuery.total = response.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    getSalaryList(pageNum, pageSize) {
      this.search(pageNum, pageSize)
    },
    pageChange() {
      this.getSalaryList(this.listQuery.pageNum, this.listQuery.pageSize)
    },
    sizeChange(pageSize) {
      this.getSalaryList(1, pageSize)
    },
    // 单个对象转为一个数组 ===》 filter
    objectToArray(obj) {
      const arr = []
      let i = 0
      const header_title = ['emp_id', 'emp_name', 'salary_year', 'salary_month', 'base_salary', 'post_salary', 'per_old', 'per_medical', 'per_fire', 'per_house',
        'child_edu', 'continue_edu', 'rent', 'credit', 'old_man', 'big_sick', 'taxable_income', 'tax_money', 'real_salary']
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
        ['员工编号', '员工姓名', '年份', '月份', '应发工资', null, '专项扣除', null, null, null, '专项附加扣除', null, null, null, null, null, '应纳税所得额', '个人所得税', '实发工资'],
        [null, null, null, null, '基本工资', '岗位工资', '养老保险', '医疗保险', '失业保险', '住房公积金', '子女教育', '继续教育', '住房租金', '住房贷款利息', '赡养老人', '大病医疗', null, null, null]
      )
      const sheet = XLSX.utils.aoa_to_sheet(data)
      sheet['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 1, c: 0 }},
        { s: { r: 0, c: 1 }, e: { r: 1, c: 1 }},
        { s: { r: 0, c: 2 }, e: { r: 1, c: 2 }},
        { s: { r: 0, c: 3 }, e: { r: 1, c: 3 }},
        { s: { r: 0, c: 4 }, e: { r: 0, c: 5 }},
        { s: { r: 0, c: 6 }, e: { r: 0, c: 9 }},
        { s: { r: 0, c: 10 }, e: { r: 0, c: 15 }},
        { s: { r: 0, c: 16 }, e: { r: 1, c: 16 }},
        { s: { r: 0, c: 17 }, e: { r: 1, c: 17 }},
        { s: { r: 0, c: 18 }, e: { r: 1, c: 18 }}
      ]
      openDownloadDialog(sheet2blob(sheet), 'salary-page.xlsx')
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
        searchSalary(condition, 1, this.total, this.$store.getters.token).then(response => {
          wholeTableData = response.data.list
          resolve()
        }).catch(error => {
          console.log(error)
          reject()
        })
      }).then(() => {
        const data = this.formatJson(wholeTableData)
        data.unshift(
          ['员工编号', '员工姓名', '年份', '月份', '应发工资', null, '专项扣除', null, null, null, '专项附加扣除', null, null, null, null, null, '应纳税所得额', '个人所得税', '实发工资'],
          [null, null, null, null, '基本工资', '岗位工资', '养老保险', '医疗保险', '失业保险', '住房公积金', '子女教育', '继续教育', '住房租金', '住房贷款利息', '赡养老人', '大病医疗', null, null, null]
        )
        const sheet = XLSX.utils.aoa_to_sheet(data)
        sheet['!merges'] = [
          { s: { r: 0, c: 0 }, e: { r: 1, c: 0 }},
          { s: { r: 0, c: 1 }, e: { r: 1, c: 1 }},
          { s: { r: 0, c: 2 }, e: { r: 1, c: 2 }},
          { s: { r: 0, c: 3 }, e: { r: 1, c: 3 }},
          { s: { r: 0, c: 4 }, e: { r: 0, c: 5 }},
          { s: { r: 0, c: 6 }, e: { r: 0, c: 9 }},
          { s: { r: 0, c: 10 }, e: { r: 0, c: 15 }},
          { s: { r: 0, c: 16 }, e: { r: 1, c: 16 }},
          { s: { r: 0, c: 17 }, e: { r: 1, c: 17 }},
          { s: { r: 0, c: 18 }, e: { r: 1, c: 18 }}
        ]
        openDownloadDialog(sheet2blob(sheet), 'salary-all.xlsx')
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
