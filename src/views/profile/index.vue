<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="基本资料" name="user-info">
<!--                <user-info />-->
                <component :is="currentRole" :user="user"></component>
              </el-tab-pane>
              <el-tab-pane label="修改密码" name="reset-pwd">
                <reset-pwd />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import Activity from './components/Activity'
import Timeline from './components/Timeline'
import Account from './components/Account'
import resetPwd from '@/views/profile/components/resetPwd'
import userInfo from '@/views/profile/components/userInfo'
import AdminInfo from '@/views/profile/components/AdminInfo'
import HrInfo from '@/views/profile/components/HrInfo'
import EmployeeInfo from '@/views/profile/components/EmployeeInfo'

export default {
  name: 'Profile',
  components: { UserCard, Activity, Timeline, Account, resetPwd, userInfo, AdminInfo, HrInfo, EmployeeInfo },
  data() {
    return {
      currentRole: 'AdminInfo',
      user: {},
      activeTab: 'user-info'
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles',
      'roleType'
    ])
  },
  created() {
    this.getUser()
    if (this.roleType === 'admin') {
      this.currentRole = 'AdminInfo'
    } else if (this.roleType === 'hr') {
      this.currentRole = 'HrInfo'
    } else if (this.roleType === 'employee') {
      this.currentRole = 'EmployeeInfo'
    }
  },
  methods: {
    getUser() {
      this.user = {
        name: this.name,
        role: this.roles.join(' | '),
        email: 'admin@lut.com',
        avatar: this.avatar
      }
    }
  }
}
</script>
