<template>
  <div class="app-container">
<!--    <el-form :inline="true">-->
<!--      <el-form-item label="搜索条件" size="medium">-->
<!--        <el-input size="small" style="width: 240px" />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="搜索条件" size="medium">-->
<!--        <el-input size="small" style="width: 240px" />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="搜索条件" size="medium">-->
<!--        <el-input size="small" style="width: 240px" />-->
<!--      </el-form-item>-->

<!--      <el-form-item>-->
<!--        <div class="block">-->
<!--          <span class="demonstration">带快捷选项</span>-->
<!--          <el-date-picker-->
<!--            v-model="date_value"-->
<!--            type="daterange"-->
<!--            align="right"-->
<!--            unlink-panels-->
<!--            range-separator="至"-->
<!--            start-placeholder="开始日期"-->
<!--            end-placeholder="结束日期"-->
<!--            :picker-options="pickerOptions"-->
<!--          />-->
<!--        </div>-->
<!--      </el-form-item>-->

<!--      <el-form-item>-->
<!--        <el-button type="primary" icon="el-icon-search" size="mini">搜索</el-button>-->
<!--        <el-button icon="el-icon-refresh" size="mini">重置</el-button>-->
<!--      </el-form-item>-->
<!--    </el-form>-->

    <el-row>
      <el-button type="primary" icon="el-icon-plus" size="mini" @click="onOpen">新增</el-button>
      <el-button :disabled="updateButtonDisable" type="success" icon="el-icon-edit" size="mini" @click="alterOnOpen">修改</el-button>
      <el-button :disabled="deleteButtonDisable" type="danger" icon="el-icon-delete" size="mini" @click="open">删除</el-button>
      <el-button :disabled="true" type="danger" icon="el-icon-key" size="mini">重置密码</el-button>
      <el-button type="warning" icon="el-icon-document" size="mini" @click="handleDownload">导出当前页</el-button>
      <el-button :disabled="false" type="danger" icon="el-icon-document" size="mini" @click="handleDownloadAll">导出所有页</el-button>
      <el-button :disabled="true" type="danger" icon="el-icon-document" size="mini" @click="handleDownload">Export Selected</el-button>
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
        prop="username"
        label="用户名"
      />

      <el-table-column
        prop="hrName"
        label="姓名"
      />

      <el-table-column
        prop="hrSex"
        label="性别"
      />

      <el-table-column
        prop="hrTelephone"
        label="手机号码"
      />

      <el-table-column
        prop="hrEmail"
        width="240"
        label="邮箱"
      />

      <el-table-column
        prop="hrAddress"
        label="住址"
      />

      <el-table-column
        prop="hrIntroduction"
        label="个人介绍"
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
        <el-dialog title="添加人力资源" :visible.sync="dialogFormVisible" width="36%" @close="onClose">
          <el-form ref="ruleForm" :model="formData" :rules="rules" label-width="200px" :status-icon="true">
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item
                  label="用户名"
                  label-width="100px"
                  size="small"
                  prop="username"
                >
                  <el-input
                    v-model="formData.username"
                    placeholder="请输入用户名"
                    size="small"
                    style="width: 200px;"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="姓名"
                  label-width="120px"
                  size="small"
                  prop="hrName"
                >
                  <el-input
                    v-model="formData.hrName"
                    placeholder="请输入姓名"
                    size="small"
                    style="width: 200px;"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item
                  label="手机号码"
                  label-width="100px"
                  size="small"
                  prop="hrTelephone"
                >
                  <el-input
                    v-model.number="formData.hrTelephone"
                    autocomplete="off"
                    placeholder="请输入手机号码"
                    size="small"
                    style="width: 200px;"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="性别"
                  label-width="120px"
                  size="small"
                  prop="hrSex"
                >
                  <el-select
                    v-model="formData.hrSex"
                    placeholder="请选择性别"
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
            <el-row :gutter="10">
              <el-col :span="10">
                <el-form-item
                  label="邮箱"
                  label-width="80px"
                  size="small"
                  prop="hrEmail"
                >
                  <el-input
                    v-model="formData.hrEmail"
                    autocomplete="off"
                    placeholder="请输入邮箱"
                    size="small"
                    style="width: 180px;"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="14">
                <el-form-item
                  label="住址"
                  label-width="80px"
                  size="small"
                  prop="hrAddress"
                >
                  <el-input
                    v-model="formData.hrAddress"
                    placeholder="请输入住址"
                    size="small"
                    style="width: 280px;"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item
                  label="个人简介"
                  label-width="100px"
                  size="medium"
                  prop="hrIntroduction"
                >
                  <el-input
                    v-model="formData.hrIntroduction"
                    show-word-limit
                    type="textarea"
                    :rows="5"
                    maxlength="1024"
                    placeholder="个人简介："
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
    <!--修改dialog-->
    <template>
      <div>
        <el-dialog title="修改信息" :visible.sync="alterDialog" width="36%" @close="alterOnClose">
          <el-form ref="alterRuleForm" :model="alterFormData" :rules="rules" label-width="200px" :status-icon="true">
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item
                  label="用户名"
                  label-width="100px"
                  size="small"
                  prop="username"
                >
                  <el-input
                    v-model="alterFormData.username"
                    placeholder="请输入用户名"
                    size="small"
                    disabled
                    style="width: 200px;"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="姓名"
                  label-width="120px"
                  size="small"
                  prop="hrName"
                >
                  <el-input
                    v-model="alterFormData.hrName"
                    placeholder="请输入姓名"
                    size="small"
                    style="width: 200px;"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item
                  label="手机号码"
                  label-width="100px"
                  size="small"
                  prop="hrTelephone"
                >
                  <el-input
                    v-model.number="alterFormData.hrTelephone"
                    autocomplete="off"
                    placeholder="请输入手机号码"
                    size="small"
                    style="width: 200px;"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="性别"
                  label-width="120px"
                  size="small"
                  prop="hrSex"
                >
                  <el-select
                    v-model="alterFormData.hrSex"
                    placeholder="请选择性别"
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
            <el-row :gutter="10">
              <el-col :span="10">
                <el-form-item
                  label="邮箱"
                  label-width="80px"
                  size="small"
                  prop="hrEmail"
                >
                  <el-input
                    v-model="alterFormData.hrEmail"
                    autocomplete="off"
                    placeholder="请输入邮箱"
                    size="small"
                    style="width: 180px;"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="14">
                <el-form-item
                  label="住址"
                  label-width="80px"
                  size="small"
                  prop="hrAddress"
                >
                  <el-input
                    v-model="alterFormData.hrAddress"
                    placeholder="请输入住址"
                    size="small"
                    style="width: 280px;"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item
                  label="个人简介"
                  label-width="100px"
                  size="medium"
                  prop="hrIntroduction"
                >
                  <el-input
                    v-model="alterFormData.hrIntroduction"
                    show-word-limit
                    type="textarea"
                    :rows="5"
                    maxlength="1024"
                    placeholder="个人简介："
                    size="small"
                    style="width: 100%;"
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
import { addHr, deleteHr, getHrs, updateHr } from '@/api/hr'
import {getDepts} from "@/api/dept";
import Moment from "moment";

export default {
  components: {
  },
  data() {
    const checkEmail = (rule, value, callback) => {
      setTimeout(() => {
        if (!value) {
          callback()
          // return callback(new Error('邮箱不能为空'))
        } else {
          const mailReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
          if (mailReg.test(value)) {
            callback()
          } else {
            return callback(new Error('请输入正确的邮箱格式'))
          }
        }
      })
    }
    const checkPhone = (rule, value, callback) => {
      setTimeout(() => {
        if (!value) {
          callback()
          // return callback(new Error('手机号不能为空'))
        } else {
          const reg = /^1[3|4|5|7|8|9][0-9]\d{8}$/
          if (reg.test(value)) {
            callback()
          } else {
            return callback(new Error('请输入正确的手机号'))
          }
        }
      })
    }
    return {
      listQuery: {
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      tableData: [],
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
      dialogFormVisible: false, // 添加对话框
      alterDialog: false, // 修改对话框
      updateButtonDisable: true,
      deleteButtonDisable: true,
      delPrimaryKeySet: [],
      formData: {
        username: undefined,
        hrName: undefined,
        hrTelephone: undefined,
        hrEmail: undefined,
        hrSex: '',
        hrAddress: undefined,
        hrIntroduction: undefined
      },
      alterFormData: {
        username: undefined,
        hrName: undefined,
        hrTelephone: undefined,
        hrEmail: undefined,
        hrSex: '',
        hrAddress: undefined,
        hrIntroduction: undefined
      },
      options: [{
        value: '0',
        label: '男'
      }, {
        value: '1',
        label: '女'
      }],
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        hrName: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        hrTelephone: [
          { required: false, validator: checkPhone, trigger: 'change' }
        ],
        hrSex: [
          { required: false, message: '请选择性别', trigger: 'blur' }
        ],
        hrEmail: [
          { required: false, validator: checkEmail, trigger: 'change' }
        ]
      }
    }
  },
  beforeCreate() {
  },
  created() {
    this.getHrsList(this.listQuery.pageNum, this.listQuery.pageSize)
  },
  methods: {
    pageChange() {
      this.getHrsList(this.listQuery.pageNum, this.listQuery.pageSize)
    },
    sizeChange(pageSize) {
      this.getHrsList(1, pageSize)
    },
    open() {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleDelete()
        // this.$message({
        //   type: 'success',
        //   message: '删除成功!'
        // })
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
      deleteHr(requestBody).then(response => {
        this.$message.info('删除成功')
        this.listQuery.pageNum = 1
        this.getHrsList(this.listQuery.pageNum, this.listQuery.pageSize)
      }).catch(error => {
        this.$message.error('删除失败')
        console.log(error)
      })
    },
    // 点击全选按钮
    handleSelectAll(selection) {
      const temp = []
      selection.forEach((value) => {
        temp.push(value.username)
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
        temp.push(value.username)
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
    objectToArray(object) {
      var arr = []
      var i = 0
      for (var item in object) {
        const value = object[item]
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
          filename: 'hr-list', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx' // 非必填 xlsx
        })
      })
    },
    handleDownloadAll() {
      let wholeTableData = []
      new Promise((resolve, reject) => {
        getHrs(1, this.listQuery.total, this.$store.getters.token).then(response => {
          wholeTableData = response.data.list
          wholeTableData.forEach((value) => {
            value.hrSex = value.hrSex === 0 ? '男' : '女'
          })
          resolve()
        }).catch(error => {
          console.log(error)
          reject()
        })
      }).then(() => {
        const data = this.formatJson(wholeTableData)
        import('@/vendor/Export2Excel').then(excel => {
          excel.export_json_to_excel({
            header: this.getTableHeader(wholeTableData[0]),
            data: data, // 具体数据 必填  ====>  二维数组
            filename: 'hr-all-list', // 非必填
            autoWidth: true, // 非必填
            bookType: 'xlsx' // 非必填 xlsx
          })
        })
      })
    },
    getHrsList(pageNum, pageSize) {
      getHrs(pageNum, pageSize, this.$store.getters.token).then(response => {
        this.tableData = response.data.list
        this.tableData.forEach((obj) => {
          if (obj.hrSex === 0) {
            obj.hrSex = '男'
          } else if (obj.hrSex === 1) {
            obj.hrSex = '女'
          } else {
            obj.hrSex = ''
          }
        })
        this.listQuery.total = response.data.total
      }).catch(error => {
        console.log(error)
      })
    },
    createHr() {
      addHr(this.formData).then(response => {
        this.$message.info('添加成功')
        this.listQuery.pageNum = 1
        this.getHrsList(this.listQuery.pageNum, this.listQuery.pageSize)
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
        if (item.username === this.delPrimaryKeySet[0]) {
          this.alterFormData = item
        }
      })
    },
    onClose() {
    },
    alterOnClose() { // 关闭对话框回调， 选择性别后不确认修改的话性别会显示 0 1
      if (this.alterFormData.hrSex === '0') {
        this.alterFormData.hrSex = '男'
      } else {
        this.alterFormData.hrSex = '女'
      }
    },
    alterRuleForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.alterFormData.hrSex === '男' || this.alterFormData.hrSex === '0') {
            this.alterFormData.hrSex = 0
          } else {
            this.alterFormData.hrSex = 1
          }
          updateHr(this.alterFormData).then(response => {
            this.$message.info('修改成功')
            this.getHrsList(this.listQuery.pageNum, this.listQuery.pageSize)
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
      // console.log(formName)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.createHr()
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
