<template>
  <div style="margin: 20px 20px">
    <el-page-header content="专项附加扣除申请" @back="goBack" />
    <el-form ref="applyForm" :model="formData" style="margin: 50px 20px">
      <el-form-item
        prop="applyType"
        :rules="[
          { required: true, message: '不能为空'},
        ]"
        label-width="120px"
        label="选择申请项"
      >
        <el-select v-model="formData.applyType" placeholder="请选择" style="width: 15%;">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        style="width: 20%"
        label-width="120px"
        label="额度"
        prop="applyMoney"
        :rules="[
          { required: true, message: '额度不能为空'},
          { type: 'number', message: '额度必须为数字值'}
        ]"
      >
        <el-input v-model.number="formData.applyMoney" autocomplete="off" />
      </el-form-item>

      <el-form-item
        style="width: 20%"
        label-width="120px"
        label="申请日期"
        prop="applyDate"
        :rules="[
          { required: true, message: '不能为空'},
        ]"
      >
        <el-date-picker
          v-model="formData.applyDate"
          type="month"
          placeholder="选择月"
        />
      </el-form-item>

      <el-form-item
        style="width: 20%"
        label-width="120px"
        label="上传申请材料"
      >
        <el-upload
          ref="fileUpload"
          multiple
          action=""
          drag
          :limit="1"
          :with-credentials="true"
          :http-request="httpRequest"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :before-remove="beforeRemove"
          :data="getUploadList"
          :auto-upload="false"
          :on-change="handleChange"
          :on-exceed="exceed"
          :file-list="fileList"
        >
          <!--          action="/interface/api/addition/file/upload"-->
          <i class="el-icon-upload" />
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div slot="tip" class="el-upload__tip">只能上传单个文件,最大100MB</div>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="margin-left: 80px" @click="submitForm('applyForm')">提交申请</el-button>
        <el-button style="margin-right: 50px" @click="resetForm('applyForm')">重置</el-button>
      </el-form-item>

    </el-form>

  </div>
</template>

<script>

import axios from 'axios'
// import {additionApply} from "@/api/addition";
import Qs from 'qs'

export default {
  data() {
    return {
      options: [{
        value: 'child_edu',
        label: '子女教育'
      }, {
        value: 'big_sick',
        label: '大病医疗'
      }, {
        value: 'continue_edu',
        label: '继续教育'
      }, {
        value: 'old_man',
        label: '赡养老人'
      }, {
        value: 'credit',
        label: '住房贷款利息'
      }, {
        value: 'rent',
        label: '租房租金'
      }],
      formData: {
        applyType: undefined,
        applyMoney: undefined,
        applyDate: undefined
      },
      getUploadList: undefined,
      fileList: []
    }
  },
  created() {

  },
  methods: {
    goBack() {
      this.$router.push('/employee/specialadditional/index')
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$refs.fileUpload.submit()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.$refs.fileUpload.clearFiles()
    },
    handleChange(file, fileList) {
      // console.log(file)
      // console.log(fileList)
    },
    handlePreview(file) {
      // console.log(file)
    },
    handleRemove(file, fileList) {
    },
    exceed() {
      this.$message.error('超出个数限制')
    },
    handleSuccess(response, file, fileList) {

    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name} ?`)
    },
    // param是自带参数。 this.$refs.upload.submit() 会自动调用 httpRequest方法.在里面取得file
    httpRequest(param) {
      // console.log(param)
      const fileObj = param.file // 相当于input里取得的files
      const fd = new FormData()// FormData 对象
      fd.append('file', fileObj)// 文件对象
      fd.append('formData', JSON.stringify(this.formData))

      const url = '/interface/api/addition/apply'
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      axios.post(url, fd, config).then(res => {
        // console.log(res.data)
        this.$message.info('提交成功')
        this.resetForm('applyForm')
        this.$router.push('/employee/specialadditional/index')
      }).catch(() => {
        this.$message.error('提交失败！')
      })
    }
  }
}
</script>

<style scoped>

</style>
