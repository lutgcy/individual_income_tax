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
      <el-form-item label="所属部门" prop="deptId">
        <el-select
          v-model="searchFromData.deptId"
          placeholder="请选择所属部门"
          filterable
          clearable
          :style="{width: '90%'}"
        >
          <el-option
            v-for="item in deptIdOptions"
            :key="item.dept_id"
            :label="item.dept_name"
            :value="item.dept_id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="岗位" prop="postId">
        <el-select
          v-model="searchFromData.postId"
          placeholder="请选择岗位"
          filterable
          clearable
          :style="{width: '90%'}"
        >
          <el-option
            v-for="item in postIdOptions"
            :key="item.post_id"
            :label="item.post_name"
            :value="item.post_id"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="search">查找</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetForm('searchForm')">重置</el-button>
      </el-form-item>

    </el-form>
    <el-row>
      <el-button type="primary" icon="el-icon-plus" size="mini" @click="onOpen">新增</el-button>
      <el-button :disabled="updateButtonDisable" type="success" icon="el-icon-edit" size="mini" @click="alterOnOpen">修改</el-button>
      <el-button :disabled="deleteButtonDisable" type="danger" icon="el-icon-delete" size="mini" @click="deleteEmp">删除</el-button>
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
      :header-cell-style="{background:'#EBEEF5',color:'#606266',textAlign: 'center'}"
      :cell-style="{ textAlign: 'center' }"
      border
      highlight-current-row
      show-header
      @select="handleSelect"
      @select-all="handleSelectAll"
    >
      <el-table-column
        type="selection"
        width="55"
      />

      <el-table-column
        prop="emp_id"
        label="员工编号"
        width="60"
      />

      <el-table-column
        prop="username"
        label="用户名"
        width="100"
      />

      <el-table-column
        prop="emp_name"
        label="姓名"
        width="80"
      />

      <el-table-column
        prop="emp_sex"
        label="性别"
        width="60"
      />

      <el-table-column
        prop="emp_email"
        label="邮箱"
        width="160"
      />

      <el-table-column
        prop="emp_telephone"
        label="电话"
        width="120"
      />

      <el-table-column
        prop="emp_address"
        label="住址"
        width="260"
      />

      <el-table-column
        prop="emp_idnumber"
        label="身份证号"
        width="165"
      />

      <el-table-column
        prop="emp_bank"
        label="银行卡号"
        width="150"
      />

      <el-table-column
        prop="emp_hiredate"
        label="入职时间"
        width="100"
      />

      <el-table-column
        prop="dept_name"
        label="所属部门"
        width="100"
      />

      <el-table-column
        prop="post_name"
        label="岗位"
        width="100"
      />

      <el-table-column
        prop="emp_introduction"
        label="个人简介"
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
        <el-dialog :visible.sync="dialogFormVisible" v-bind="$attrs" title="添加员工" width="42%" v-on="$listeners" @close="onClose">
          <el-form ref="ruleForm" :model="formData" :rules="rules" size="small" label-width="100px" :status-icon="true">
            <el-row :gutter="15">
              <el-col :span="12">
                <el-form-item label="用户名" prop="username">
                  <el-input
                    v-model="formData.username"
                    placeholder="请输入用户名"
                    :maxlength="15"
                    clearable
                    :style="{width: '90%'}"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="姓名" prop="empName">
                  <el-input
                    v-model="formData.empName"
                    placeholder="请输入姓名"
                    :maxlength="15"
                    clearable
                    :style="{width: '90%'}"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="25">
              <el-col :span="12">
                <el-form-item label="性别" prop="empSex">
                  <el-select v-model="formData.empSex" placeholder="请择选性别" clearable :style="{width: '90%'}">
                    <el-option
                      v-for="(item, index) in empSexOptions"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                      :disabled="item.disabled"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="邮箱" prop="empEmail">
                  <el-input v-model="formData.empEmail" placeholder="请输入邮箱" clearable :style="{width: '90%'}" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="15">
              <el-col :span="12">
                <el-form-item label="手机号码" prop="empTelephone">
                  <el-input
                    v-model="formData.empTelephone"
                    placeholder="请输入手机号码"
                    clearable
                    :style="{width: '90%'}"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="住址" prop="empAddress">
                  <el-input v-model="formData.empAddress" placeholder="请输入住址" clearable :style="{width: '90%'}" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="15">
              <el-col :span="12">
                <el-form-item label="身份证号" prop="empIdnumber">
                  <el-input
                    v-model="formData.empIdnumber"
                    placeholder="请输入身份证号"
                    :maxlength="18"
                    clearable
                    :style="{width: '90%'}"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="银行卡号" prop="empBank">
                  <el-input
                    v-model="formData.empBank"
                    placeholder="请输入银行卡号"
                    :maxlength="20"
                    clearable
                    :style="{width: '90%'}"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="15">
              <el-col :span="12">
                <el-form-item label="入职时间" prop="empHiredate">
                  <el-date-picker
                    v-model="formData.empHiredate"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :style="{width: '90%'}"
                    placeholder="请选择入职时间"
                    clearable
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="15">
              <el-col :span="12">
                <el-form-item label="所属部门" prop="deptId">
                  <el-select
                    v-model="formData.deptId"
                    placeholder="请选择所属部门"
                    filterable
                    clearable
                    :style="{width: '90%'}"
                  >
                    <el-option
                      v-for="item in deptIdOptions"
                      :key="item.dept_id"
                      :label="item.dept_name"
                      :value="item.dept_id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="岗位" prop="postId">
                  <el-select
                    v-model="formData.postId"
                    placeholder="请选择岗位"
                    filterable
                    clearable
                    :style="{width: '90%'}"
                  >
                    <el-option
                      v-for="item in postIdOptions"
                      :key="item.post_id"
                      :label="item.post_name"
                      :value="item.post_id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="15">
              <el-form-item label="个人简介" prop="empIntroduction">
                <el-input
                  v-model="formData.empIntroduction"
                  type="textarea"
                  placeholder="请输入个人简介"
                  :maxlength="1024"
                  show-word-limit
                  :autosize="{minRows: 3, maxRows: 5}"
                  :style="{width: '95%'}"
                />
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label-width="300px">
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
        <el-dialog :visible.sync="alterDialog" v-bind="$attrs" title="修改信息" width="42%" v-on="$listeners" @close="onClose">
          <el-form ref="ruleForm" :model="alterFormData" :rules="rules" size="small" label-width="100px" :status-icon="true">
            <el-row :gutter="15">
              <el-col :span="12">
                <el-form-item label="用户名" prop="username">
                  <el-input
                    v-model="alterFormData.username"
                    placeholder="请输入用户名"
                    :maxlength="15"
                    clearable
                    :style="{width: '90%'}"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="姓名" prop="empName">
                  <el-input
                    v-model="alterFormData.empName"
                    placeholder="请输入姓名"
                    :maxlength="15"
                    clearable
                    :style="{width: '90%'}"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="25">
              <el-col :span="12">
                <el-form-item label="性别" prop="empSex">
                  <el-select v-model="alterFormData.empSex" placeholder="请择选性别" clearable :style="{width: '90%'}">
                    <el-option
                      v-for="(item, index) in empSexOptions"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                      :disabled="item.disabled"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="邮箱" prop="empEmail">
                  <el-input v-model="alterFormData.empEmail" placeholder="请输入邮箱" clearable :style="{width: '90%'}" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="15">
              <el-col :span="12">
                <el-form-item label="手机号码" prop="empTelephone">
                  <el-input
                    v-model="alterFormData.empTelephone"
                    placeholder="请输入手机号码"
                    clearable
                    :style="{width: '90%'}"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="住址" prop="empAddress">
                  <el-input v-model="alterFormData.empAddress" placeholder="请输入住址" clearable :style="{width: '90%'}" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="15">
              <el-col :span="12">
                <el-form-item label="身份证号" prop="empIdnumber">
                  <el-input
                    v-model="alterFormData.empIdnumber"
                    placeholder="请输入身份证号"
                    :maxlength="18"
                    clearable
                    :style="{width: '90%'}"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="银行卡号" prop="empBank">
                  <el-input
                    v-model="alterFormData.empBank"
                    placeholder="请输入银行卡号"
                    :maxlength="20"
                    clearable
                    :style="{width: '90%'}"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="15">
              <el-col :span="12">
                <el-form-item label="入职时间" prop="empHiredate">
                  <el-date-picker
                    v-model="alterFormData.empHiredate"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :style="{width: '90%'}"
                    placeholder="请选择入职时间"
                    clearable
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="15">
              <el-col :span="12">
                <el-form-item label="所属部门" prop="deptId">
                  <el-select
                    v-model="alterFormData.deptId"
                    placeholder="请选择所属部门"
                    filterable
                    clearable
                    :style="{width: '90%'}"
                  >
                    <el-option
                      v-for="item in deptIdOptions"
                      :key="item.dept_id"
                      :label="item.dept_name"
                      :value="item.dept_id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="岗位" prop="postId">
                  <el-select
                    v-model="alterFormData.postId"
                    placeholder="请选择岗位"
                    filterable
                    clearable
                    :style="{width: '90%'}"
                  >
                    <el-option
                      v-for="item in postIdOptions"
                      :key="item.post_id"
                      :label="item.post_name"
                      :value="item.post_id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="15">
              <el-form-item label="个人简介" prop="empIntroduction">
                <el-input
                  v-model="alterFormData.empIntroduction"
                  type="textarea"
                  placeholder="请输入个人简介"
                  :maxlength="1024"
                  show-word-limit
                  :autosize="{minRows: 3, maxRows: 5}"
                  :style="{width: '95%'}"
                />
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label-width="300px">
                <el-button type="primary" size="small" @click="alterRuleForm('ruleForm')">立即修改</el-button>
                <el-button plain type="warning" size="small" @click="resetForm('ruleForm')">重置表单</el-button>
              </el-form-item>
            </el-row>
          </el-form>
        </el-dialog>
      </div>
    </template>
  </div>
</template>

<script>
import {
  addEmp,
  deleteEmp,
  getAllDeptIdAndName,
  getAllPostIdAndName,
  getEmps,
  searchEmployee,
  updateEmp
} from '@/api/emp'
// import Moment from 'moment'

export default {
  components: {},
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
        deptId: undefined,
        postId: undefined
      },
      total: undefined,
      loading: false,
      searchChange: false,
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
        empName: undefined,
        empSex: undefined,
        empEmail: undefined,
        empTelephone: undefined,
        empAddress: undefined,
        empIdnumber: undefined,
        empBank: undefined,
        empHiredate: undefined,
        deptId: undefined,
        postId: undefined,
        empIntroduction: undefined
      },
      alterFormData: {
        empId: undefined,
        username: undefined,
        empName: undefined,
        empSex: undefined,
        empEmail: undefined,
        empTelephone: undefined,
        empAddress: '',
        empIdnumber: undefined,
        empBank: undefined,
        empHiredate: '',
        deptId: undefined,
        postId: undefined,
        empIntroduction: undefined
      },
      options: [],
      rules: {
        username: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        }],
        empName: [{
          required: true,
          message: '请输入姓名',
          trigger: 'blur'
        }],
        empSex: [],
        empEmail: [{
          pattern: /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
          message: '请输入正确格式的邮箱',
          trigger: 'blur'
        }],
        empTelephone: [{
          pattern: /^1[3|4|5|7|8|9][0-9]\d{8}$/,
          message: '请输入正确的手机号',
          trigger: 'blur'
        }],
        empAddress: [],
        empIdnumber: [],
        empBank: [],
        empHiredate: [],
        deptId: [],
        postId: [],
        empIntroduction: []
      },
      empSexOptions: [{
        'label': '男',
        'value': '男'
      }, {
        'label': '女',
        'value': '女'
      }],
      deptIdOptions: [],
      postIdOptions: []
    }
  },
  beforeCreate() {
  },
  created() {
    // console.log(Moment().format('YYYY-MM-DD')) // 参数为空会生成当前时间
    this.getEmpList(this.listQuery.pageNum, this.listQuery.pageSize)
    this.initSelectForm()
    searchEmployee({}, this.listQuery.pageNum, this.listQuery.pageSize, this.$store.getters.token).then((response) => {
      this.total = response.data.total
    })
  },
  watch: {
    searchFromData: {
      handler: function() {
        this.searchChange = true
      },
      deep: true // 深度监听
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
      if (this.searchFromData.deptId) {
        condition['deptId'] = this.searchFromData.deptId
      }
      if (this.searchFromData.postId) {
        condition['postId'] = this.searchFromData.postId
      }
      this.loading = true
      if (this.searchChange) {
        this.listQuery.pageNum = 1
        this.searchChange = false
      }
      searchEmployee(condition, this.listQuery.pageNum, this.listQuery.pageSize, this.$store.getters.token).then((response) => {
        this.tableData = response.data.list
        this.listQuery.total = response.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    getEmpList(pageNum, pageSize) {
      this.search(pageNum, pageSize)
    },
    initSelectForm() { // 初始化select表单项
      getAllDeptIdAndName(this.$store.getters.token).then(response => {
        this.deptIdOptions = response.data
      }).catch(error => {
        console.log(error)
      })
      getAllPostIdAndName(this.$store.getters.token).then(response => {
        this.postIdOptions = response.data
      }).catch(error => {
        console.log(error)
      })
    },
    pageChange() {
      this.getEmpList(this.listQuery.pageNum, this.listQuery.pageSize)
    },
    sizeChange(pageSize) {
      this.getEmpList(1, pageSize)
    },
    deleteEmp() {
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
      deleteEmp(requestBody).then(response => {
        this.$message.info('删除成功')
        this.listQuery.pageNum = 1
        this.getEmpList(this.listQuery.pageNum, this.listQuery.pageSize)
      }).catch(error => {
        this.$message.error('删除失败')
        console.log(error)
      })
    },
    // 点击全选按钮
    handleSelectAll(selection) {
      const temp = []
      selection.forEach((value) => {
        temp.push(value.emp_id)
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
        temp.push(value.emp_id)
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
      const arr = []
      let i = 0
      for (const item in tableData) {
        arr[i] = item
        i++
      }
      return arr
    },
    // 单个对象转为一个数组 ===》 filter
    objectToArray(obj) {
      const arr = []
      let i = 0
      const header_title = ['emp_id', 'username', 'emp_name', 'emp_sex', 'emp_email', 'emp_telephone', 'emp_address', 'emp_idnumber', 'emp_bank', 'emp_hiredate', 'dept_name', 'post_name', 'emp_introduction']
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
      const header = ['员工编号', '用户名', '姓名', '性别', '邮箱', '电话', '住址', '身份证号', '银行卡号', '入职时间', '所属部门', '岗位', '个人简介']
      const data = this.formatJson(this.tableData)
      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          // header: this.getTableHeader(this.tableData[0]),
          header: header,
          data: data, // 具体数据 必填  ====>  二维数组
          filename: 'emp-page-list', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx' // 非必填 xlsx
        })
      })
    },
    handleDownloadAll() {
      let wholeTableData = []
      new Promise((resolve, reject) => {
        getEmps(1, this.total, this.$store.getters.token).then(response => {
          wholeTableData = response.data.list
          resolve()
        }).catch(error => {
          console.log(error)
          reject()
        })
      }).then(() => {
        const header = ['员工编号', '用户名', '姓名', '性别', '邮箱', '电话', '住址', '身份证号', '银行卡号', '入职时间', '所属部门', '岗位', '个人简介']
        const data = this.formatJson(wholeTableData)
        import('@/vendor/Export2Excel').then(excel => {
          excel.export_json_to_excel({
            header,
            data: data, // 具体数据 必填  ====>  二维数组
            filename: 'emp-all-list', // 非必填
            autoWidth: true, // 非必填
            bookType: 'xlsx' // 非必填 xlsx
          })
        })
      })
    },
    // 弹出添加窗口
    onOpen() {
      this.dialogFormVisible = true
    },
    alterOnOpen() {
      this.alterDialog = true
      this.tableData.forEach((item) => {
        if (item.emp_id === this.delPrimaryKeySet[0]) {
          this.alterFormData.empId = item.emp_id
          this.alterFormData.username = item.username
          this.alterFormData.empName = item.emp_name
          this.alterFormData.empSex = item.emp_sex
          this.alterFormData.empEmail = item.emp_email
          this.alterFormData.empTelephone = item.emp_telephone
          this.alterFormData.empAddress = item.emp_address
          this.alterFormData.empIdnumber = item.emp_idnumber
          this.alterFormData.empBank = item.emp_bank
          this.alterFormData.empHiredate = item.emp_hiredate
          this.alterFormData.deptId = item.dept_id
          this.alterFormData.postId = item.post_id
          this.alterFormData.empIntroduction = item.emp_introduction
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
          new Promise((resolve, reject) => {
            updateEmp(this.alterFormData).then(() => {
              this.getEmpList(this.listQuery.pageNum, this.listQuery.pageSize)
              this.deleteButtonDisable = true
              this.updateButtonDisable = true
              this.$message.info('修改成功')
              this.listQuery.pageNum = 1
              this.getEmpList(this.listQuery.pageNum, this.listQuery.pageSize)
              resolve()
            }).catch(error => {
              this.$message.error('修改失败')
              reject(error)
            })
          }).then(() => {
            this.resetForm(formName)
            this.alterDialog = false
          }).catch(error => {
            console.log(error)
          })
        } else {
          // console.log('error submit!!')
          return false
        }
      })
    },
    submitForm(formName) { // 添加
      this.$refs[formName].validate((valid) => {
        if (valid) {
          new Promise((resolve, reject) => {
            addEmp(this.formData).then(() => {
              this.listQuery.pageNum = 1
              this.getEmpList(this.listQuery.pageNum, this.listQuery.pageSize)
              this.$message.info('添加成功')
              resolve()
            }).catch(error => {
              this.$message.error('添加失败')
              reject(error)
            })
          }).then(() => {
            this.resetForm(formName) // 添加成功后重置表单内容
            this.dialogFormVisible = false
          }).catch(error => {
            console.log(error)
          })
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
