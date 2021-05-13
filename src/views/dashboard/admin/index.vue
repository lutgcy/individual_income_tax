<template>
  <div class="dashboard-editor-container">
    <h3>admin dashboard</h3>
    <div class=" clearfix">
      <pan-thumb :image="avatar" style="float: left">
        Your roles:
        <span class="pan-info-roles">{{ roleType }}</span>
      </pan-thumb>
      <github-corner style="position: absolute; top: 0px; border: 0; right: 0;" />
      <div class="info-container">
        <span class="display_name">{{ name }}</span>
        <span style="font-size:20px;padding-top:20px;display:inline-block;">Hello!</span>
      </div>
    </div>
<!--    <div>-->
<!--      <img :src="img" class="emptyGif" style="width: 100%; height: 100%">-->
<!--    </div>-->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PanThumb from '@/components/PanThumb'
import GithubCorner from '@/components/GithubCorner'

const img = require('../../../assets/dashborad-img/桌面背景图片壁纸 - 2.jpg')

export default {
  name: 'EmployeeDashboard',
  components: { PanThumb, GithubCorner },
  data() {
    return {
      img
      // emptyGif: 'https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3'
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles',
      'roleType'
    ])
  }
}
</script>

<style lang="scss" scoped>
.emptyGif {
  display: block;
  width: 45%;
  margin: 0 auto;
}

.dashboard-editor-container {
  background-color: #e3e3e3;
  //url("../../../assets/dashborad-img/桌面背景图片壁纸 - 2.jpg") no-repeat;
  //background-size: 100% 90%;
  min-height: 100vh;
  padding: 50px 60px 0px;
  .pan-info-roles {
    font-size: 12px;
    font-weight: 700;
    color: #333;
    display: block;
  }
  .info-container {
    position: relative;
    margin-left: 190px;
    height: 150px;
    line-height: 200px;
    .display_name {
      font-size: 48px;
      line-height: 48px;
      color: #212121;
      position: absolute;
      top: 25px;
    }
  }
}
</style>
