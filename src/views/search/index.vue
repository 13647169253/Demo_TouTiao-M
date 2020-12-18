<template>
  <div class="search-conta">
    <form action="/" class="search-form">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
        background="#3296fa"
        @focus="isResultShow = false"
      />
    </form>
    <!-- 搜索结果组件 -->
    <search-result v-if="isResultShow" :searchText="searchText" />
    <!-- 搜索联想提示组件 -->
    <search-suggestion :searchText="searchText" v-else-if="searchText" @search="onSearch" />
    <!-- 搜索历史组件 -->
    <search-history v-else :searchHistories="searchHistories" @clearSearchHistories="searchHistories = []" @search="onSearch" />
  </div>
</template>

<script>
import SearchHistory from "./components/search-history"
import SearchResult from "./components/search-result"
import SearchSuggestion from "./components/search-suggestion"
import { setItem, getItem } from "@/utils/storage"

export default {
  name: "SearchIndex",
  components: {
    SearchHistory,
    SearchResult,
    SearchSuggestion,
  },
  props: {},
  data() {
    return {
      searchText: "",
      isResultShow: false, // 控制搜索结果的展示
      searchHistories: getItem("TT_SEARCH_HISTORIES") || [], //历史记录数据
    }
  },
  computed: {},
  watch: {
    searchHistories(value) {
      setItem("TT_SEARCH_HISTORIES", value)
    },
  },
  created() {},
  mounted() {},
  methods: {
    onSearch(val) {
      this.searchText = val
      const index = this.searchHistories.indexOf(val)
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      this.searchHistories.unshift(val)
      this.isResultShow = true
    },
    onCancel() {
      this.$router.back()
    },
  },
}
</script>

<style lang="less" scoped>
.search-conta {
  padding-top: 108px;
  .search-form {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }

  .van-search__action {
    color: #fff;
  }
}
</style>
