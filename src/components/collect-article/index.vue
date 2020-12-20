<template>
  <van-button class="borderNone" :class="{ collected: value }" :icon="value ? 'star' : 'star-o'" :loading="loading" @click="onCollect" />
  <!-- :color="value ? '#ffa500' : '#777'" -->
</template>

<script>
import { deleteCollect, addCollect } from "@/api/article"

export default {
  name: "CollectArticle",
  components: {},
  props: {
    value: {
      type: Boolean,
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
        if (this.value) {
          await deleteCollect(this.articleId)
        } else {
          await addCollect(this.articleId)
        }
        this.$emit("input", !this.value)
        this.$toast.success(!this.value ? "收藏成功" : "取消收藏")
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
.collected {
  .van-icon {
    color: #ffa500;
  }
}
</style>
