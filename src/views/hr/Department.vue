<template>
  <div class="app-container">
    <el-row>
      <el-button type="primary" icon="el-icon-plus" size="mini" @click="onOpen">新增</el-button>
      <el-button :disabled="updateButtonDisable" type="success" icon="el-icon-edit" size="mini" @click="alterOnOpen">修改</el-button>
      <el-button :disabled="deleteButtonDisable" type="danger" icon="el-icon-delete" size="mini" @click="open">删除</el-button>
      <el-button type="warning" icon="el-icon-document" size="mini" @click="handleDownload">导出当前页</el-button>
      <el-button :disabled="false" type="danger" icon="el-icon-document" size="mini" @click="handleDownloadAll">Export All</el-button>
    </el-row>

    <!--    表格内容主体-->
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%; margin: 15px auto;"
      border
      highlight-current-row
      show-header
      :header-cell-style="{background:'#EBEEF5',color:'#606266'}"
      @select="handleSelect"
      @select-all="handleSelectAll"
    >
      <el-table-column
        type="selection"
        width="55"
      />

      <el-table-column
        prop="dept_id"
        label="部门编号"
      />

      <el-table-column
        prop="dept_name"
        label="部门名称"
      />

      <el-table-column
        prop="create_time"
        label="创建时间"
      />

      <el-table-column
        prop="leader_id"
        label="负责人编号"
      />

      <el-table-column
        prop="emp_name"
        label="负责人姓名"
      />

      <el-table-column
        prop="emp_telephone"
        label="电话"
      />

      <el-table-column
        prop="emp_email"
        label="邮箱"
        show-overflow-tooltip
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

    <!--添加dialog-->
    <template>
      <div>
        <el-dialog title="添加部门" :visible.sync="dialogFormVisible" width="36%" @close="onClose">
          <el-form ref="ruleForm" :model="formData" :rules="rules" label-width="200px" :status-icon="true">
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item
                  label="部门名"
                  label-width="100px"
                  size="small"
                  prop="deptName"
                >
                  <el-input
                    v-model="formData.deptName"
                    placeholder="请输入部门名"
                    size="small"
                    style="width: 200px;"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="负责人ID"
                  label-width="120px"
                  size="small"
                  prop="leaderId"
                >
                  <el-input
                    v-model.number="formData.leaderId"
                    placeholder="请输入负责人ID"
                    size="small"
                    style="width: 200px;"
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
    <!--修改dialog-->
    <template>
      <div>
        <el-dialog title="修改信息" :visible.sync="alterDialog" width="36%" @close="alterOnClose">
          <el-form ref="alterRuleForm" :model="alterFormData" :rules="rules" label-width="200px" :status-icon="true">
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item
                  label="部门名"
                  label-width="100px"
                  size="small"
                  prop="deptName"
                >
                  <el-input
                    v-model="alterFormData.deptName"
                    placeholder="请输入部门名"
                    size="small"
                    style="width: 200px;"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="负责人ID"
                  label-width="120px"
                  size="small"
                  prop="leaderId"
                >
                  <el-input
                    v-model.number="alterFormData.leaderId"
                    placeholder="请输入负责人ID"
                    size="small"
                    style="width: 200px;"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-form-item>
                <el-button type="primary" size="small" @click="alterRuleForm('alterRuleForm')">立即修改</el-button>
                <el-button plain type="warning" size="small" @click="resetForm('alterRuleForm')">重置表单</el-button>
              </el-form-item>
            </el-row>
          </el-form>
        </el-dialog>
      </div>
    </template>
  </div>
</template>

<script>
import { addDept, deleteDept, getDepts, updateDept } from '@/api/dept'
import Moment from 'moment'

export default {
  components: {
  },
  data() {
    return {
      listQuery: {
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      tableData: [],
      dialogFormVisible: false, // 添加对话框
      alterDialog: false, // 修改对话框
      updateButtonDisable: true,
      deleteButtonDisable: true,
      delPrimaryKeySet: [],
      formData: {
        deptName: undefined,
        leaderId: undefined
      },
      alterFormData: {
        deptId: undefined,
        deptName: undefined,
        leaderId: undefined
      },
      rules: {
        deptName: [
          { required: true, message: '请输入部门名', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
        ],
        leaderId: [
          { required: true, message: '负责人ID不能为空' },
          { type: 'number', message: '负责人ID必须为数字值' }
        ]
      }
    }
  },
  beforeCreate() {
  },
  created() {
    this.getDeptList(this.listQuery.pageNum, this.listQuery.pageSize)
  },
  methods: {
    pageChange() {
      this.getDeptList(this.listQuery.pageNum, this.listQuery.pageSize)
    },
    sizeChange(pageSize) {
      this.getDeptList(1, pageSize)
    },
    open() {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleDelete()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleDelete() {
      const requestBody = {}
      this.delPrimaryKeySet.forEach((value, index) => {
        requestBody[index] = value
      })
      deleteDept(requestBody).then(response => {
        this.$message.info('删除成功')
        this.listQuery.pageNum = 1
        this.getDeptList(this.listQuery.pageNum, this.listQuery.pageSize)
      }).catch(error => {
        this.$message.error('删除失败')
        console.log(error)
      })
    },
    // 点击全选按钮
    handleSelectAll(selection) {
      const temp = []
      selection.forEach((value) => {
        temp.push(value.dept_id)
      })
      this.delPrimaryKeySet = temp
      if (selection.length > 0) {
        this.deleteButtonDisable = false
      } else if (selection.length === 0) {
        this.deleteButtonDisable = true
      }
    },
    // 单个选择
    // selection: 选中的所有项， row： 刚刚勾选的行
    handleSelect(selection, row) {
      const temp = []
      selection.forEach((value) => {
        temp.push(value.dept_id)
      })
      this.delPrimaryKeySet = temp
      if (selection.length === 1) {
        this.updateButtonDisable = false
      } else if (selection.length !== 1) {
        this.updateButtonDisable = true
      }
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
    objectToArray(obj) {
      var arr = []
      var i = 0
      const header_title = ['dept_id', 'dept_name', 'create_time', 'leader_id', 'emp_name', 'emp_telephone', 'emp_email']
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
      const header = ['部门编号', '部门名称', '创建时间', '负责人编号', '负责人姓名', '电话', '邮箱']
      const data = this.formatJson(this.tableData)
      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header,
          data: data, // 具体数据 必填  ====>  二维数组
          filename: 'dept-page-list', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx' // 非必填 xlsx
        })
      })
    },
    handleDownloadAll() {
      let wholeTableData = []
      new Promise((resolve, reject) => {
        getDepts(1, this.listQuery.total, this.$store.getters.token).then(response => {
          wholeTableData = response.data.list
          wholeTableData.forEach((value) => {
            if (value.create_time) {
              value.create_time = Moment(value.create_time).format('YYYY-MM-DD HH:mm:ss')
            }
          })
          resolve()
        }).catch(error => {
          console.log(error)
          reject()
        })
      }).then(() => {
        const header = ['部门编号', '部门名称', '创建时间', '负责人编号', '负责人姓名', '电话', '邮箱']
        const data = this.formatJson(wholeTableData)
        import('@/vendor/Export2Excel').then(excel => {
          excel.export_json_to_excel({
            header,
            data: data, // 具体数据 必填  ====>  二维数组
            filename: 'dept-all-list', // 非必填
            autoWidth: true, // 非必填
            bookType: 'xlsx' // 非必填 xlsx
          })
        })
      })
    },
    getDeptList(pageNum, pageSize) {
      getDepts(pageNum, pageSize, this.$store.getters.token).then(response => {
        this.tableData = response.data.list
        this.tableData.forEach((value) => {
          if (value.create_time) {
            value.create_time = Moment(value.create_time).format('YYYY-MM-DD HH:mm:ss')
          }
        })
        this.listQuery.total = response.data.total
      }).catch(error => {
        console.log(error)
      })
    },
    createDept() {
      addDept(this.formData).then(response => {
        this.$message.info('添加成功')
        this.listQuery.pageNum = 1
        this.getDeptList(this.listQuery.pageNum, this.listQuery.pageSize)
      }).catch(error => {
        this.$message.error('添加失败')
        console.log(error)
      })
    },
    // 弹出添加角色窗口
    onOpen() {
      this.dialogFormVisible = true
    },
    alterOnOpen() {
      this.alterDialog = true
      this.tableData.forEach((item) => {
        if (item.dept_id === this.delPrimaryKeySet[0]) {
          this.alterFormData.deptId = item.dept_id
          this.alterFormData.deptName = item.dept_name
          this.alterFormData.leaderId = item.leader_id
        }
      })
    },
    onClose() {
    },
    alterOnClose() {
    },
    alterRuleForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          updateDept(this.alterFormData).then(response => {
            this.$message.info('修改成功')
            this.getDeptList(this.listQuery.pageNum, this.listQuery.pageSize)
            this.deleteButtonDisable = true
            this.updateButtonDisable = true
            // 修改成功后重置表单内容
            setTimeout(() => {
              this.resetForm(formName)
            }, 1000)
            // 关闭对话框
            this.alterDialog = false
          }).catch(error => {
            this.$message.error('修改失败')
            console.log(error)
          })
        } else {
          // console.log('error submit!!')
          return false
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.createDept()
          // 添加成功后重置表单内容  formName undefined不能用
          setTimeout(() => {
            this.resetForm(formName)
          }, 1000)
          // 关闭对话框
          this.dialogFormVisible = false
        } else {
          // console.log('error submit!!')
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
