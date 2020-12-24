<template>
  <div class="update-birthday">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择年月日"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="$emit('close')"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
import { updateUserProfile } from "@/api/user"
import dayjs from "dayjs"

export default {
  name: "UpdateBirthday",
  components: {},
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      minDate: new Date(1937, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.value),
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
        const currentDate = dayjs(this.currentDate).format("YYYY-MM-DD")
        console.log(currentDate)
        await updateUserProfile({
          birthday: currentDate,
        })
        this.$emit("input", currentDate)
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
