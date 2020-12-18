<template>
  <div class="search-result">
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :error="error">
      <van-cell v-for="(article, index) in list" :key="index" :title="article.title" />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from "@/api/search"

export default {
  name: "SearchResult",
  components: {},
  props: {
    searchText: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      perPage: 10,
      error: false,
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onLoad() {
      try {
        // #1 获取请求数据
        const { data } = await getSearchResult({
          page: this.page, // 页码值
          per_page: this.perPage, // 每页显示的数据
          q: this.searchText, // 查询关键词
        })
        console.log(data)
        // #2 将数据添加到数组列表中
        const { results } = data.data
        this.list.push(...results)
        // #3 将本次加载中的 loading 关闭
        this.loading = false
        // #4 判断是否还有数据;有就更新下一个数据的页码,没有就将加载状态设置为结束.
        if (results.length) {
          this.page++
        } else {
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
        console.log(err)
      }
    },
  },
}
</script>

<style lang="less" scoped></style>
