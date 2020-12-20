<template>
  <van-button v-if="isFollowed" class="follow-btn" round size="small" @click="onFollow" :loading="loading">
    已关注
  </van-button>
  <van-button v-else class="follow-btn" type="info" color="#3296fa" round size="small" icon="plus" @click="onFollow" :loading="loading">
    关注
  </van-button>
</template>

<script>
import { addFollow, deleteFollow } from "@/api/user"

export default {
  name: "FollowUser",
  components: {},
  model: {
    prop: "isFollowed",
    event: "update-is_followed",
  },
  props: {
    isFollowed: {
      type: Boolean,
      required: true,
    },
    // value: {
    //   type: Boolean,
    //   required: true,
    // },
    userId: {
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
    async onFollow() {
      this.loading = true
      try {
        if (this.isFollowed) {
          await deleteFollow(this.userId)
          // this.article.is_followed = false
        } else {
          await addFollow(this.userId)
          // this.article.is_followed = truisFollowed
        }
        // this.artcile.is_followed = !this.artcile.is_followed
        // this.$emit("update-is_followed", !this.value)
        // this.$emit("input", !this.value)
        this.$emit("update-is_followed", !this.isFollowed)
      } catch (err) {
        let message = "操作失败"
        if (err.response && err.response.status === 400) {
          message = "你不能关注你自己"
        }
        this.$toast(message)
        console.log(err)
      }
      this.loading = false
    },
  },
}
</script>

<style lang="less" scoped></style>
