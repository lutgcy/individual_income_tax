<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'
import hrDashboard from './hr'
import employeeDashboard from './employee'

export default {
  name: 'Dashboard',
  components: { adminDashboard, editorDashboard, hrDashboard, employeeDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles',
      'roleType'
    ])
  },
  created() {
    // if (!this.roles.includes('admin')) {
    //   this.currentRole = 'editorDashboard'
    // }
    if (this.roleType === 'admin') {
      this.currentRole = 'adminDashboard'
    } else if (this.roleType === 'hr') {
      this.currentRole = 'hrDashboard'
    } else if (this.roleType === 'employee') {
      this.currentRole = 'employeeDashboard'
    }
  }
}
</script>
