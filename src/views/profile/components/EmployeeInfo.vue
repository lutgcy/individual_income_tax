<template>
  <el-form ref="ruleForm" :model="alterFormData" :rules="rules" size="small" label-width="100px" :status-icon="true">
    <el-row :gutter="15">
      <el-col :span="12">
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="alterFormData.username"
            placeholder="请输入用户名"
            :maxlength="15"
            clearable
            disabled
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
        <el-button plain type="warning" size="small" @click="close">返回</el-button>
      </el-form-item>
    </el-row>
  </el-form>
</template>

<script>
import { getEmployeeByUsername } from '@/api/updateUserInfo'
import { getAllDeptIdAndName, getAllPostIdAndName, updateEmp } from '@/api/emp'

export default {
  name: 'EmployeeInfo',
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: ''
        }
      }
    }
  },
  data() {
    return {
      // user: {
      //   username: '用户名'
      // }
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
      empSexOptions: [{
        'label': '男',
        'value': '男'
      }, {
        'label': '女',
        'value': '女'
      }],
      deptIdOptions: [],
      postIdOptions: [],
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
      oldUserInfoOK: undefined
    }
  },
  created() {
    this.oldUserInfoOK = this.user.name
    getEmployeeByUsername(this.oldUserInfoOK, this.$store.getters.token).then((response) => {
      this.alterFormData = response.data
    })
    this.initSelectForm()
  },
  methods: {
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
    alterRuleForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          updateEmp(this.alterFormData).then(response => {
            this.$message.info('修改成功')
            // 修改成功后返回主页
            setTimeout(() => {
              this.$router.push({ path: '/dashboard' })
            }, 300)
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
    close() {
      this.$router.push({ path: '/dashboard' })
    }
  }
}
</script>

<style scoped>

</style>
