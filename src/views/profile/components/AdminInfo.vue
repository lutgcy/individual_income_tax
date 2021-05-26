<template>
  <el-form ref="form" :model="user" label-width="80px">
    <el-form-item label="用户名" prop="username" style="width: 30%;">
      <el-input v-model="user.name" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" @click="submit">保存</el-button>
      <el-button type="danger" size="mini" @click="close">关闭</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updateAdminInfo } from '@/api/updateUserInfo'
import Cookies from 'js-cookie'

export default {
  name: 'AdminInfo',
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
      oldUserInfoOK: undefined
    }
  },
  created() {
    this.oldUserInfoOK = this.user.name
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout')
      Cookies.remove('roleType')
      await this.$store.dispatch('role/setRoleType', 'employee') // 恢复默认
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      this.$router.push(`/login`)
    },
    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          updateAdminInfo({ newUsername: this.user.name, oldUsername: this.oldUserInfoOK }).then(() => {
            this.$message.info('用户名修改成功，请重新登录！')
            this.logout()
          })
        }
      })
      // location.reload()
      // this.$router.push('/dashboard')
      // this.$router.push('/profile/index')
    },
    close() {
      this.$router.push({ path: '/dashboard' })
    }
  }
}
</script>

<style scoped>

</style>
