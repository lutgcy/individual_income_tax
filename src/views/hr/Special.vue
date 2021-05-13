<template>
  <div class="app-container">
    <el-form ref='searchForm' :inline="true" :model="searchFromData">
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
          style="margin-right: 10px"
          v-model="searchFromData.yearOnly"
          type="year"
          size="small"
          clearable
          placeholder="选择年"
          value-format="yyyy"
        />
      </el-form-item>

      <el-form-item prop="onlyMonth" label="选择月份" size="medium">
        <el-select clearable v-model="searchFromData.onlyMonth" placeholder="请选择">
          <el-option
            v-for="item in monthOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="search">查找</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetForm('searchForm')">重置</el-button>
      </el-form-item>

    </el-form>
    <el-row>
      <el-button plain type="primary" icon="el-icon-plus" size="mini" @click="generate">重新生成专项扣除数据</el-button>
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
        width="100"
      />

      <el-table-column
        prop="special_year"
        label="年份"
        width="100"
      />

      <el-table-column
        prop="special_month"
        label="月份"
        width="100"
      />

      <el-table-column label="个人（元/单位）">
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
        label="企业（元/单位）"
      >
        <el-table-column
          label="工伤保险"
          prop="comp_hurt"
        />
        <el-table-column
          label="生育保险"
          prop="comp_birth"
        />
        <el-table-column
          label="养老保险"
          prop="comp_old"
        />
        <el-table-column
          label="医疗保险"
          prop="comp_medical"
        />
        <el-table-column
          label="失业保险"
          prop="comp_fire"
        />
        <el-table-column
          label="住房公积金"
          prop="comp_house"
        />
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
import { generate, searchSpecial } from '@/api/special'

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
  created() {
    this.getSpecialsList(this.listQuery.pageNum, this.listQuery.pageSize)
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
      searchSpecial(condition, this.listQuery.pageNum, this.listQuery.pageSize, this.$store.getters.token).then((response) => {
        this.tableData = response.data.list
        this.listQuery.total = response.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    getSpecialsList(pageNum, pageSize) {
      this.search(pageNum, pageSize)
    },
    pageChange() {
      this.getSpecialsList(this.listQuery.pageNum, this.listQuery.pageSize)
    },
    sizeChange(pageSize) {
      this.getSpecialsList(1, pageSize)
    },
    generate() {
      this.$confirm('将重新生成数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        generate(this.$store.getters.token).then(() => {
          this.loading = false
          this.getSpecialsList(this.listQuery.pageNum, this.listQuery.pageSize)
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
