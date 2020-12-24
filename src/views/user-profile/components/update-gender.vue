<template>
  <div class="update-gender">
    <van-picker
      title="性别"
      show-toolbar
      :columns="columns"
      :default-index="value"
      @confirm="onConfirm"
      @cancel="$emit('close')"
      @change="onPickerChange"
    />
  </div>
</template>

<script>
import { updateUserProfile } from "@/api/user"

export default {
  name: "UpdateGender",
  components: {},
  props: {
    value: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      columns: ["男", "女"],
      localGender: this.value,
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onPickerChange(picker, value, index) {
      this.localGender = index
    },
    async onConfirm() {
      this.$toast.loading({
        message: "正在更新...",
        forbidClick: true, // 静止背景点击
        duration: 0, // 持续展示
      })
      try {
        const localGender = this.localGender
        await updateUserProfile({
          gender: localGender,
        })
        this.$emit("input", localGender)
        this.$emit("close")
        this.$toast("修改成功")
      } catch (err) {
        console.log(err)
        this.$toast("修改失败")
      }
    },
  },
}
</script>

<style lang="less" scoped></style>
