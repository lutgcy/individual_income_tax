<template>
  <div>
    AccountManagement:
    修改账号
    修改密码
    <!--    分页-->
    <template>
      <pagination
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
    </template>
  </div>

</template>

<script>
import Pagination from '@/components/Pagination'

export default {
  name: 'AccountManagement',
  components: { Pagination },
  data() {
    return {
      total: 0,
      listQuery: {
        page: 1,
        limit: 20
      }
    }
  },
  methods: {
    getList() {
      // 获取数据
    }
  }
}
</script>

<style scoped>

</style>

