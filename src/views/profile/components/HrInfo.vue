<template>
  <el-form ref="alterRuleForm" :model="alterFormData" :rules="rules" label-width="200px" :status-icon="true" style="width: 50%;">
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
        <el-button plain type="warning" size="small" @click="close">关闭</el-button>
      </el-form-item>
    </el-row>
  </el-form>
</template>

<script>
import { getHrByUsername } from '@/api/updateUserInfo'
import { updateHr } from '@/api/hr'

export default {
  name: 'HrInfo',
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
      // user: {
      //   username: '用户名'
      // }
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
      },
      oldUserInfoOK: undefined
    }
  },
  created() {
    this.oldUserInfoOK = this.user.name
    getHrByUsername(this.oldUserInfoOK, this.$store.getters.token).then((response) => {
      const obj = response.data
      if (obj.hrSex === 0) {
        obj.hrSex = '男'
      } else if (obj.hrSex === 1) {
        obj.hrSex = '女'
      } else {
        obj.hrSex = ''
      }
      this.alterFormData = obj
    })
  },
  methods: {
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
            // 修改成功后返回主页
            getHrByUsername(this.oldUserInfoOK, this.$store.getters.token).then((response) => {
              const obj = response.data
              if (obj.hrSex === 0) {
                obj.hrSex = '男'
              } else if (obj.hrSex === 1) {
                obj.hrSex = '女'
              } else {
                obj.hrSex = ''
              }
              this.alterFormData = obj
            })
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
