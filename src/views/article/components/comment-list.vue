<template>
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
    :error.sync="error"
    error-text="加载失败,请点击重试"
    :immediate-check="false"
  >
    <!-- <van-cell v-for="(item, index) in list" :key="index" :title="item.content" /> -->
    <comment-item v-for="(item, index) in list" :key="index" :comment="item" @reply-click="$emit('reply-click', $event)" />
  </van-list>
</template>

<script>
import { getComments } from "@/api/comment"
import CommentItem from "./comment-item"

export default {
  name: "CommentList",
  components: {
    CommentItem,
  },
  props: {
    source: {
      type: [Object, String, Number],
      required: true,
    },
    list: {
      type: Array,
      default: () => [],
    },
    type: {
      type: String,
      // 自定义type数据验证,参数为当前Prop的值
      validator(value) {
        // 必须包含数组中的内容,返回一个Boolean
        return ["a", "c"].includes(value)
      },
      default: "a",
    },
  },
  data() {
    return {
      // list: [],
      loading: false,
      finished: false,
      offset: null, // 获取下一页标记
      limit: 10,
      error: false,
    }
  },
  computed: {},
  watch: {},
  created() {
    // 手动调用,没有触发loading事件所以我们需要手动开启
    this.loading = true
    this.onLoad()
  },
  mounted() {},
  methods: {
    async onLoad() {
      try {
        // #1 请求
        const { data } = await getComments({
          type: this.type, // 评论类型
          source: this.source.toString(), // 文章Id .toString 方法在comment.js中使用了params进行传递
          offset: this.offset,
          limit: this.limit,
        })
        console.log(data)
        // #2
        const { results } = data.data
        this.list.push(...results)

        // 将文章评论总数量传递出去
        this.$emit("onload-success", data.data)

        // #3
        this.loading = false
        // #4
        if (results.length) {
          this.offset = data.data.last_id
        } else {
          this.finished = true
        }
      } catch (err) {
        console.log(err)
        this.error = true
        this.loading = false
      }
    },
  },
}
</script>

<style lang="less" scoped></style>
