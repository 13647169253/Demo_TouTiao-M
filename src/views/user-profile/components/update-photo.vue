<template>
  <div class="update-photo">
    <img :src="img" ref="img" />
    <div class="toolbar">
      <div class="cancal" @click="$emit('close')">取消</div>
      <div class="confirm" @click="onconfirm">完成</div>
    </div>
  </div>
</template>

<script>
import "cropperjs/dist/cropper.css"
import Cropper from "cropperjs"
import { updateUserPhoto } from "@/api/user"

export default {
  name: "UpdatePhoto",
  components: {},
  props: {
    img: {
      type: [String, Object],
      required: true,
    },
  },
  data() {
    return {
      cropper: null,
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    const image = this.$refs.img
    this.cropper = new Cropper(image, {
      // 限制裁切范围 1 为图片区域
      viewMode: 1,
      // 裁切器的拖动模式,move 为画布拖动 none 画布不可拖动
      dragMode: "none",
      // 裁切器的大小
      aspectRatio: 1,
      // 自动裁切区域
      autoCropArea: 1,
      // 裁切器的移动
      cropBoxMovable: true,
      // 裁切器的缩放
      cropBoxResizable: true,
      // 画布背景
      background: false,
    })
  },
  methods: {
    onconfirm() {
      this.cropper.getCroppedCanvas().toBlob(blob => {
        this.updataUserPhoto(blob)
      })
    },
    async updataUserPhoto(blob) {
      this.$toast.loading({
        message: "正在更新...",
        forbidClick: true, // 静止背景点击
        duration: 0, // 持续展示
      })
      const formData = new FormData()
      formData.append("photo", blob)
      try {
        const { data } = await updateUserPhoto(formData)
        console.log(data)
        this.$emit("close")
        this.$emit("update-photo", data.data.photo)
        this.$toast("成功修改")
      } catch (err) {
        console.log(err)
        this.$toast("修改失败")
      }
    },
  },
}
</script>

<style lang="less" scoped>
.update-photo {
  width: 100vw;
  height: 100vh;
  background-color: #000;
  img {
    display: block;
    max-width: 100%;
  }
  .toolbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    .cancal,
    .confirm {
      width: 90px;
      height: 90px;
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
    }
  }
}
</style>
