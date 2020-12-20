<template>
  <van-button
    class="borderNone"
    :class="{ liked: value === 1 }"
    :icon="value === 1 ? 'good-job' : 'good-job-o'"
    :loading="loading"
    @click="onCollect"
  />
</template>

<script>
import { deleteLike, addLike } from "@/api/article"

export default {
  name: "LikeArticle",
  components: {},
  props: {
    value: {
      type: Number,
      required: true,
    },
    articleId: {
      type: [Number, String, Object],
      required: true,
    },
  },
  data() {
    return {
      loading: false,
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onCollect() {
      this.loading = true
      try {
        let status = -1
        if (this.value === 1) {
          await deleteLike(this.articleId)
        } else {
          await addLike(this.articleId)
          status = 1
        }
        this.$emit("input", status)
        this.$toast.success(status === 1 ? "点赞成功" : "取消点赞")
      } catch (err) {
        console.log(err)
        this.$toast.fail("操作失败")
      }
      this.loading = false
    },
  },
}
</script>

<style lang="less" scoped>
.borderNone {
  border: none;
  background-color: #ffffff;
}
.liked {
  .van-icon {
    color: #e5645f;
  }
}
</style>
