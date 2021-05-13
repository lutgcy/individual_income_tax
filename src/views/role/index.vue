<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="搜索条件" size="medium">
        <el-input size="small" style="width: 240px" />
      </el-form-item>
      <el-form-item label="搜索条件" size="medium">
        <el-input size="small" style="width: 240px" />
      </el-form-item>
      <el-form-item label="搜索条件" size="medium">
        <el-input size="small" style="width: 240px" />
      </el-form-item>

      <el-form-item>
        <div class="block">
          <span class="demonstration">带快捷选项</span>
          <el-date-picker
            v-model="date_value"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          />
        </div>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row>
      <el-button type="primary" icon="el-icon-plus" size="mini" @click="openDialog">新增</el-button>
      <el-button :disabled="updateButtonDisable" type="success" icon="el-icon-edit" size="mini">修改</el-button>
      <el-button :disabled="deleteButtonDisable" type="danger" icon="el-icon-delete" size="mini">删除</el-button>
      <el-button type="warning" icon="el-icon-document" size="mini" @click="handleDownload">Export All</el-button>
      <el-button :disabled='true' type="danger" icon="el-icon-document" size="mini" @click="handleDownload">Export Selected</el-button>
    </el-row>

    <!--    表格内容主题-->
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%; position:relative; top: 10px"
      stripe
      border
      highlight-current-row
      show-header
      :header-cell-style="{ background:'#EBEEF5',color:'#606266' }"
      @selection-change="handleSelectionChange"
      @select="selectOne"
    >
      <el-table-column
        type="selection"
        width="55"
      />

      <el-table-column
        prop="roleId"
        label="角色ID"
      />

      <el-table-column
        prop="roleName"
        label="角色名称"
      />

      <el-table-column
        prop="roleKey"
        label="角色权限字符串"
      />

      <el-table-column
        prop="roleSort"
        label="显示顺序"
      />

      <el-table-column
        prop="dataScope"
        width="240"
        label="数据范围（1：全部数据权限 2：自定数据权限 3：本部门数据权限 4：本部门及以下数据权限）"
      />

      <el-table-column
        prop="menuCheckStrictly"
        label="菜单树选择项是否关联显示"
      />

      <el-table-column
        prop="deptCheckStrictly"
        label="部门树选择项是否关联显示"
      />

      <el-table-column
        prop="status"
        label="角色状态（0正常 1停用）"
      />
      <el-table-column
        prop="delFlag"
        label="删除标志（0代表存在 2代表删除）"
      />

      <el-table-column
        prop="createBy"
        label="创建者"
      />

      <el-table-column
        prop="createTime"
        label="创建时间"
        show-overflow-tooltip
      />

      <el-table-column
        prop="updateBy"
        label="更新者"
      />

      <el-table-column
        prop="updateTime"
        label="更新时间"
      />

      <el-table-column
        prop="remark"
        label="备注"
        show-overflow-tooltip
      />
    </el-table>

    <!--    分页-->
    <el-pagination
      style="position:relative; top: 15px; right: 0px;"
      background
      :page-sizes="[100, 200, 300, 400]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400"
    />
    <!--弹框-->
    <template>
      <div>
        <el-dialog title="添加角色" :visible.sync="dialogFormVisible" width="36%" @open="onOpen" @close="onClose">
          <el-form ref="ruleForm" :model="formData" :rules="rules" label-width="200px" :status-icon="true">
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item
                  label="角色名称"
                  label-width="100px"
                  size="small"
                  prop="roleName"
                  :required="true"
                >
                  <el-input
                    v-model="formData.roleName"
                    placeholder="请输入角色名称"
                    size="small"
                    style="width: 200px;"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="角色权限字符串"
                  label-width="120px"
                  size="small"
                  prop="roleKey"
                >
                  <el-input
                    v-model="formData.roleKey"
                    placeholder="请输入角色权限字符串"
                    size="small"
                    style="width: 200px;"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item
                  label="显示顺序"
                  label-width="100px"
                  size="small"
                  prop="roleSort"
                >
                  <el-input
                    v-model.number="formData.roleSort"
                    autocomplete="off"
                    placeholder="请输入角色显示顺序"
                    size="small"
                    style="width: 200px;"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="数据范围"
                  label-width="120px"
                  size="small"
                  prop="dataScope"
                >
                  <el-select
                    v-model="formData.dataScope"
                    placeholder="请选择数据范围"
                    clearable
                    size="small"
                    style="width: 200px;"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item
                  label="备注"
                  label-width="100px"
                  size="medium"
                  prop="remark"
                >
                  <el-input
                    v-model="formData.remark"
                    show-word-limit
                    type="textarea"
                    :rows="5"
                    maxlength="300"
                    placeholder="备注信息："
                    size="small"
                    style="width: 100%;"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-form-item>
                <el-button type="primary" size="small" @click="submitForm('ruleForm')">立即添加</el-button>
                <el-button plain type="warning" size="small" @click="resetForm('ruleForm')">清空表单</el-button>
              </el-form-item>
            </el-row>
          </el-form>
        </el-dialog>
      </div>
    </template>
  </div>
</template>

<script>

import { addRole, getRoles } from '@/api/role'

export default {
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      date_value: '',
      tableData: [],
      dialogFormVisible: false,
      updateButtonDisable: true,
      deleteButtonDisable: true,
      formData: {
        roleName: undefined,
        roleKey: undefined,
        roleSort: undefined,
        dataScope: '',
        remark: undefined
      },
      options: [{
        value: '1',
        label: '全部数据权限'
      }, {
        value: '2',
        label: '自定数据权限'
      }, {
        value: '3',
        label: '本部门数据权限'
      }, {
        value: '4',
        label: '本部门及以下数据权限'
      }],
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        roleKey: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        roleSort: [
          { required: true, message: '数值不能为空', trigger: 'blur' },
          { type: 'number', message: '必须为数字值' }
        ],
        dataScope: [
          { required: true, message: '请选择权限', trigger: 'change' }
        ],
        date1: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
      }
    }
  },
  beforeCreate() {
  },
  created() {
    this.getRolesList()
  },
  methods: {
    handleSelectionChange() {
      console.log('handleSelectionChange')
    },
    // selection: 选中的所有项， row： 刚刚勾选的行
    selectOne(selection, row) {
      if (selection.length > 0) {
        this.deleteButtonDisable = false
      } else if (selection.length === 0) {
        this.deleteButtonDisable = true
      }
    },
    // 获取表头信息， 即获取对象的 所有 keys
    getTableHeader(tableData) {
      var arr = []
      let i = 0
      for (const item in tableData) {
        arr[i] = item
        i++
      }
      return arr
    },
    // 单个对象转为一个数组 ===》 filter
    objectToArray(object) {
      var arr = []
      var i = 0
      for (var item in object) {
        let value = object[item]
        // arr[i] = !value ? '' : value
        arr[i] = value
        i++
      }
      return arr
    },
    // 对象数组转为二维数组 ===》 filter
    formatJson(tableData) {
      return tableData.map(v => this.objectToArray(v))
    },
    handleDownload() {
      const data = this.formatJson(this.tableData)
      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header: this.getTableHeader(this.tableData[0]),
          data: data, // 具体数据 必填  ====>  二维数组
          filename: 'excel-list', // 非必填
          autoWidth: true, // 非必填
          bookType: 'csv' // 非必填 xlsx
        })
      })
    },
    getRolesList() {
      getRoles(this.$store.getters.token).then(response => {
        this.tableData = response.data
      }).catch(error => {
        console.log(error)
      })
    },
    createRole() {
      addRole(this.formData).then(response => {
        this.getRolesList()
      }).catch(error => {
        console.log(error)
      })
    },
    // 弹出添加角色窗口
    openDialog() {
      this.onOpen()
    },
    onOpen() {
      this.dialogFormVisible = true
    },
    onClose(formName) {
      // this.resetForm(formName)
    },
    submitForm(formName) {
      // console.log(formName)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.createRole()
          // 添加成功后重置表单内容  formName undefined不能用
          setTimeout(() => {
            this.resetForm(formName)
          }, 1000)
          // 关闭对话框
          this.dialogFormVisible = false
        } else {
          console.log('error submit!!')
          return false
        }
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
