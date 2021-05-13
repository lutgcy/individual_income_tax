<template>
  <div style="margin: 20px 20px">
    <el-page-header content="修改专项附加扣除申请" @back="goBack" />
    <el-form ref="applyForm" :model="formData" style="margin: 50px 20px">
      <el-form-item
        style="width: 20%"
        label-width="120px"
        label="申请人"
      >
        <el-popover trigger="hover" placement="top">
          <p>姓名: {{ this.formData.empName }}</p>
          <p>住址: {{ this.formData.empAddress }}</p>
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium" type="">{{ this.formData.empName }}</el-tag>
          </div>
        </el-popover>
      </el-form-item>
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
          :data="getUploadList"
          :auto-upload="false"
          :on-change="handleChange"
          :on-exceed="exceed"
          :file-list="fileList"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div slot="tip" class="el-upload__tip">只能上传单个文件,最大100MB</div>
        </el-upload>
      </el-form-item>
      <el-form-item
        style="width: 20%"
        label-width="120px"
        label="查看原文件"
      >
        <el-button
          type="text"
          size="mini"
          @click="handleDownload"
        >下载</el-button>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" style="margin-left: 80px" @click="submitForm('applyForm')">提交修改</el-button>
        <el-button style="margin-right: 50px" @click="resetForm('applyForm')">重置</el-button>
      </el-form-item>

    </el-form>

  </div>
</template>

<script>

import axios from 'axios'
import Qs from 'qs'
import { downloadApplyFile } from '@/api/addition'

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
        id: undefined,
        empName: undefined,
        empAddress: undefined,
        applyType: undefined,
        applyMoney: undefined,
        applyDate: undefined,
        applyFile: undefined
      },
      getUploadList: undefined,
      fileList: []
    }
  },
  created() {
    this.initFormData()
  },
  methods: {
    initFormData() {
      const row = JSON.parse(this.$route.query.row)
      this.formData.id = row.id
      this.formData.empName = row.emp_name
      this.formData.empAddress = row.emp_address
      this.formData.applyType = row.apply_type
      this.formData.applyMoney = row.apply_money
      this.formData.applyDate = row.apply_date
      this.formData.applyFile = row.apply_file
    },
    goBack() {
      this.$router.push('/employee/specialadditional/index')
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.fileList.length === 0) {
            this.$message.error('需重新上传申请材料')
          }
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
      this.fileList = fileList
    },
    handlePreview(file) {
      // console.log(file)
    },
    handleRemove(file, fileList) {
      // console.log(fileList)
    },
    handleDownload() {
      downloadApplyFile({ 'fileName': this.formData.applyFile }).then((response) => { // 传对象 payload  键值对 formData
        const blob = new Blob([response.data], { type: 'multipart/form-data' })
        const downloadElement = document.createElement('a')
        const href = window.URL.createObjectURL(blob) // 创建下载的链接
        downloadElement.href = href
        downloadElement.download = this.formData.applyFile.split('\\').pop() // 下载后文件名
        document.body.appendChild(downloadElement)
        downloadElement.click() // 点击下载
        document.body.removeChild(downloadElement) // 下载完成移除元素
        window.URL.revokeObjectURL(href) // 释放掉blob对象
      })
    },
    exceed() {
      this.$message.error('超出个数限制')
    },
    handleSuccess(response, file, fileList) {

    },
    // param是自带参数。 this.$refs.upload.submit() 会自动调用 httpRequest方法.在里面取得file
    httpRequest(param) {
      // console.log(param)
      const fd = new FormData()// FormData 对象
      if (this.fileList.length === 1) {
        const fileObj = param.file // 相当于input里取得的files
        fd.append('file', fileObj)// 文件对象
      }
      fd.append('formData', JSON.stringify(this.formData))

      const url = '/interface/api/addition/alter'
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      axios.post(url, fd, config).then(res => {
        // console.log(res.data)
        this.$message.info('提交成功')
        // this.resetForm('applyForm')
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
