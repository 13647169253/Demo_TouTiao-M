<template>
  <div class="search-suggestion">
    <van-cell icon="search" v-for="(text, index) in suggestions" :key="index" @click="$emit('search', text)">
      <!-- 给显示数据定义一个方法,这里不修改原数据. -->
      <div slot="title" v-html="highlight(text)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from "@/api/search"
import { debounce } from "lodash"

export default {
  name: "SearchSuggestion",
  components: {},
  props: {
    searchText: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      suggestions: [],
      htmlStr: `Hello <span style='color:red'>World</span>`,
    }
  },
  computed: {},
  watch: {
    searchText: {
      // 当发生变化时触发
      // handler(value) {
      //   this.loadSearchSuggestions(value)
      // },
      handler: debounce(function(value) {
        this.loadSearchSuggestions(value)
      }, 200),
      immediate: true, // 函数会在侦听一开始就进行触发
    },
  },
  created() {},
  mounted() {},
  methods: {
    async loadSearchSuggestions(q) {
      try {
        const { data } = await getSearchSuggestions(q)
        // console.log(data)
        this.suggestions = data.data.options
      } catch (err) {
        console.log(err)
        this.$toast("数据获取失败")
      }
    },
    highlight(text) {
      const highlightStr = `<span class="active">${this.searchText}</span>`
      // 这里需要一个动态的正则表达式,RegExp正则表达式构造函数;参数1(需要匹配的字符串,会根据这个字符串创建正则对象)，参数2(匹配的模式,需要写在字符串中)
      const reg = new RegExp(this.searchText, "gi")
      // replace 返回一个替换后的新字符串
      return text.replace(reg, highlightStr)
    },
  },
}
</script>

<style lang="less" scoped>
.search-suggestion {
  /deep/ span.active {
    color: #3296fa;
  }
}
</style>
