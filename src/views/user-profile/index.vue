<template>
  <div class="user-profile">
    <van-nav-bar title="个人信息" class="page-nav-bar" left-arrow @click-left="$router.back()" />
    <input type="file" hidden ref="file" @change="onFileChange" />
    <van-cell title="头像" is-link @click="$refs.file.click()">
      <van-image class="avater" fit="cover" round :src="user.photo" />
    </van-cell>
    <van-cell title="昵称" :value="user.name" is-link @click="isUpdateShow = true" />
    <van-cell title="性别" :value="user.gender === 0 ? '男' : '女'" is-link @click="isUpdateGenderShow = true" />
    <van-cell title="生日" :value="user.birthday" is-link @click="isUpdateBirthdayShow = true" />
    <!-- 编辑弹用户名弹出层 -->
    <van-popup v-model="isUpdateShow" position="bottom" :style="{ height: '80%' }">
      <update-name v-model="user.name" @close="isUpdateShow = false" v-if="isUpdateShow" />
    </van-popup>
    <!-- 编辑弹用户名性别弹出层 -->
    <van-popup v-model="isUpdateGenderShow" position="bottom">
      <update-gender v-model="user.gender" @close="isUpdateGenderShow = false" v-if="isUpdateGenderShow" />
    </van-popup>
    <!-- 编辑弹用户名生日弹出层 -->
    <van-popup v-model="isUpdateBirthdayShow" position="bottom">
      <update-birthday v-model="user.birthday" @close="isUpdateBirthdayShow = false" v-if="isUpdateBirthdayShow" />
    </van-popup>
    <!-- 编辑弹用户头像弹出层 -->
    <van-popup v-model="isUpdatePhotoShow" position="right" :style="{ height: '100%' }">
      <update-photo :img="img" @close="isUpdatePhotoShow = false" v-if="isUpdatePhotoShow" @update-photo="user.photo = $event" />
    </van-popup>
  </div>
</template>

<script>
import { getUserProfile } from "@/api/user"
import UpdateName from "./components/update-name"
import UpdateGender from "./components/update-gender"
import UpdateBirthday from "./components/update-birthday"
import UpdatePhoto from "./components/update-photo"

export default {
  name: "UserProfile",
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto,
  },
  props: {},
  data() {
    return {
      user: {},
      isUpdateShow: false,
      isUpdateGenderShow: false,
      isUpdateBirthdayShow: false,
      isUpdatePhotoShow: false,
      img: null,
    }
  },
  computed: {},
  watch: {},
  created() {
    this.loadUserProfile()
  },
  mounted() {},
  methods: {
    async loadUserProfile() {
      try {
        const { data } = await getUserProfile()
        this.user = data.data
      } catch (err) {
        this.$toast("当前用户数据获取失败")
      }
    },
    onFileChange() {
      const file = this.$refs.file.files[0]
      // 获取 blob 数据
      this.img = window.URL.createObjectURL(file)
      this.isUpdatePhotoShow = true
      // 选着了同一张图片;不会触发change事件 ; 这里使用清空Value解决
      this.$refs.file.value = ""
    },
  },
}
</script>

<style lang="less" scoped>
.user-profile {
  .avater {
    width: 60px;
    height: 60px;
  }
  .van-popup {
    background-color: #f5f7f9;
  }
}

/deep/ .update-gender {
  .van-picker__cancel,
  .van-picker__confirm {
    color: #1989fa;
  }
}
/deep/ .update-birthday {
  .van-picker__cancel,
  .van-picker__confirm {
    color: #1989fa;
  }
}
</style>
