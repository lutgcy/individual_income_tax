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
      <el-button plain type="primary" icon="el-icon-plus" size="mini" @click="generate">重新生成纳税数据</el-button>
      <el-button plain type="warning" icon="el-icon-document" size="mini">导出当前页</el-button>
      <el-button plain :disabled="false" type="danger" icon="el-icon-document" size="mini">Export All</el-button>
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
import {generateTax, searchTaxDetail} from '@/api/tax'

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
      searchTaxDetail(condition, this.listQuery.pageNum, this.listQuery.pageSize, this.$store.getters.token).then((response) => {
        this.tableData = response.data.list
        console.log(response)
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
