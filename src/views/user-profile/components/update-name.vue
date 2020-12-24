<template>
  <div class="update-name">
    <van-nav-bar title="更改昵称" left-text="取消" right-text="完成" @click-left="$emit('close')" @click-right="onConfirm" />
    <div class="field-wrap">
      <van-field v-model.trim="localName" rows="2" autosize type="textarea" maxlength="7" placeholder="请输入昵称" show-word-limit />
    </div>
  </div>
</template>

<script>
import { updateUserProfile } from "@/api/user"

export default {
  name: "UpdateName",
  components: {},
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      localName: this.value,
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onConfirm() {
      this.$toast.loading({
        message: "正在更新...",
        forbidClick: true, // 静止背景点击
        duration: 0, // 持续展示
      })
      try {
        const localName = this.localName
        if (!localName.length) {
          this.$toast("昵称不可以为空")
          return
        }
        await updateUserProfile({
          name: localName,
        })
        this.$emit("input", localName)
        this.$emit("close")
        this.$toast("成功修改昵称")
      } catch (err) {
        console.log(err)
        this.$toast("修改昵称失败")
      }
    },
  },
}
</script>

<style lang="less" scoped>
.update-name {
  .field-wrap {
    padding: 15px;
  }
}
</style>
