<template>
  <div class="dashboard-editor-container">
    <!--    <h3>hr dashboard</h3>-->
    <!--    <div class=" clearfix">-->
    <!--      <pan-thumb :image="avatar" style="float: left">-->
    <!--        Your roles:-->
    <!--        <span class="pan-info-roles">{{ roleType }}</span>-->
    <!--      </pan-thumb>-->
    <!--      <github-corner style="position: absolute; top: 0px; border: 0; right: 0;" />-->
    <!--      <div class="info-container">-->
    <!--        <span class="display_name">{{ name }}</span>-->
    <!--        <span style="font-size:20px;padding-top:20px;display:inline-block;">Hello!</span>-->
    <!--      </div>-->
    <!--    </div>-->
    <!--    <div>-->
    <!--      <img :src="img" class="emptyGif" style="width: 100%; height: 100%">-->
    <!--    </div>-->

    <el-row :gutter="5" style="margin-top: -30px">
      <el-col :span="12">
        <el-card shadow="hover" :style="{width: '780px', height: '400px'}">
          <div id="main1" :style="{width: '720px', height: '400px'}" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover" :style="{width: '780px', height: '400px'}">
          <div id="main2" :style="{width: '720px', height: '400px'}" />
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="12" style="margin-top: 10px">
      <el-col :span="24">
        <el-card shadow="hover" :style="{width: '1565px', height: '400px'}">
          <div id="main3" :style="{width: '1565px', height: '400px'}" />
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PanThumb from '@/components/PanThumb'
import GithubCorner from '@/components/GithubCorner'
import { getHistogramData, getLineData, getPieData } from '@/api/dashboard'
import axios from "axios";

const img = require('../../../assets/dashborad-img/桌面背景图片壁纸 - 2.jpg')

export default {
  name: 'EmployeeDashboard',
  components: { PanThumb, GithubCorner },
  data() {
    return {
      img,
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
  },
  mounted() {
    this.draw1()
    this.draw2()
    this.draw3()
  },
  methods: {
    draw1() {
      const legendData = []
      const pieData = []

      getPieData(this.$store.getters.token).then(response => {
        for (const item of response.data) {
          legendData.push(item['postName'])
          const temp = {}
          temp['value'] = item['count']
          temp['name'] = item['postName']
          pieData.push(temp)
        }
        const chartDom = document.getElementById('main1')
        const myChart = this.$echarts.init(chartDom)
        const option = {
          legend: {
            left: 'center',
            bottom: '50',
            data: legendData
          },
          toolbox: {
            show: true,
            feature: {
              mark: { show: true },
              dataView: { show: true, readOnly: false },
              restore: { show: true },
              saveAsImage: { show: true }
            }
          },
          series: [
            {
              name: '面积模式',
              type: 'pie',
              radius: [36, 130],
              center: ['50%', '38%'],
              roseType: 'area',
              itemStyle: {
                borderRadius: 8
              },
              data: pieData
            }
          ]
        }
        option && myChart.setOption(option)
      })
    },
    draw2() {
      const chartDom = document.getElementById('main2')
      const myChart = this.$echarts.init(chartDom)

      const lineData = []

      getHistogramData(this.$store.getters.token).then(response => {
        for (const item of response.data) {
          lineData.push(item.count)
        }
        const option = {
          title: {
            text: '工资分布区图',
            textStyle: { // ---主标题内容样式
              color: 'rgba(50,47,47,0.88)'
            },
            padding: [10, 10, 100, 300] // ---标题位置,因为图形是是放在一个dom中,因此用padding属性来定位

          },
          xAxis: {
            type: 'category',
            // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            data: ['小于17k', '17k~18k', '18k~19k', '19k~20k', '20k~21k', '21k~22k', '22k~23k', '大于23k']
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            // data: [120, 200, 150, 80, 70, 110, 130],
            data: lineData,
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
            },
            itemStyle: { // ---图形形状
              color: '#546fc6',
              barBorderRadius: [10, 10, 0, 0]
            }
          }]
        }
        option && myChart.setOption(option)
      })
    },
    draw3() {
      const chartDom = document.getElementById('main3')
      const myChart = this.$echarts.init(chartDom)

      const salaryData = []
      const taxData = []
      const incomeData = []

      getLineData(this.$store.getters.token).then(response => {
        const resp = response.data
        for (let i = 0; i < 12; i++) {
          salaryData.push(resp[i].avgSalary)
        }
        for (let i = 12; i < 24; i++) {
          taxData.push(resp[i].avgTax)
        }
        for (let i = 24; i < 36; i++) {
          incomeData.push(resp[i].avgIncome)
        }

        const option = {
          title: {
            text: '折线图堆叠',
            textStyle: { // ---主标题内容样式
              color: '#303133'
            },
            padding: [10, 10, 100, 300] // ---标题位置,因为图形是是放在一个dom中,因此用padding属性来定位
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['月平均工资', '月平均应纳税额', '月平均应纳税所得额']
          },
          grid: {
            left: '3%',
            right: '10%',
            bottom: '10%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
          },
          yAxis: {
            type: 'log'
          },
          series: [
            {
              name: '月平均工资',
              type: 'line',
              // stack: '总量',
              data: salaryData
              // data: [120, 132, 101, 134, 90, 230, 210]
            },
            {
              name: '月平均应纳税额',
              type: 'line',
              // stack: '总量',
              data: taxData
              // data: [120, 132, 101, 134, 90, 230, 210]
            },
            {
              name: '月平均应纳税所得额',
              type: 'line',
              // stack: '总量',
              data: incomeData
              // data: [120, 132, 101, 134, 90, 230, 210]
            }
          ]
        }
        option && myChart.setOption(option)
      })
    }
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
