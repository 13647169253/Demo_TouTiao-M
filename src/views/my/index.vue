<template>
  <div class="my-container">
    <div v-if="user" class="header user-info">
      <div class="base-info">
        <div class="left">
          <van-image round class="avatar" :src="userInfo.photo" fit="cover" />
          <span class="name">{{ userInfo.name }}</span>
        </div>
        <div class="right">
          <van-button size="mini" round to="/user/profile">编辑资料</van-button>
        </div>
      </div>
      <div class="data-stats">
        <div class="data-item">
          <span class="count"> {{ userInfo.art_count }} </span>
          <span class="text"> 头条 </span>
        </div>
        <div class="data-item">
          <span class="count"> {{ userInfo.follow_count }} </span>
          <span class="text"> 关注 </span>
        </div>
        <div class="data-item">
          <span class="count"> {{ userInfo.fans_count }} </span>
          <span class="text"> 粉丝 </span>
        </div>
        <div class="data-item">
          <span class="count"> {{ userInfo.like_count }} </span>
          <span class="text"> 获赞 </span>
        </div>
      </div>
    </div>
    <div v-else class="header not-login">
      <div class="login-btn" @click="$router.push({ name: 'login', query: { redirect: '/my' } })">
        <img src="~@/assets/mobile.png" alt="登录,注册" />
        <span class="text"> 登录　|　注册 </span>
      </div>
    </div>

    <van-grid :column-num="2" class="grid-nav" clickable>
      <van-grid-item class="grid-item">
        <i slot="icon" class="iconfont icon-shoucang"></i>
        <span slot="text" class="text">收藏</span>
      </van-grid-item>
      <van-grid-item class="grid-item">
        <i slot="icon" class="iconfont icon-lishi"></i>
        <span slot="text" class="text">历史</span>
      </van-grid-item>
    </van-grid>
    <van-cell class="cell" title="消息通知" is-link />
    <van-cell title="小智同学" is-link />
    <van-cell v-if="user" class="logout-cell" title="退出登录" center @click="onLogout" clickable />
  </div>
</template>

<script>
import { mapState } from "vuex"
import { getUserInfo } from "@/api/user"

export default {
  name: "myIndex",
  data() {
    return {
      userInfo: {},
    }
  },
  computed: {
    ...mapState(["user"]),
  },
  created() {
    // 如果用户登录了,则请求加载用户信息
    if (this.user) {
      this.loadUserInfo()
    }
  },
  methods: {
    onLogout() {
      console.log("123")
      this.$dialog
        .confirm({
          title: "您确认退出么？",
        })
        .then(() => {
          this.$store.commit("setUser", null)
        })
        .catch(() => {
          // on cancel
        })
    },
    async loadUserInfo() {
      try {
        const { data } = await getUserInfo()
        console.log(data)
        this.userInfo = data.data
      } catch (err) {
        this.$toast("获取用户信息失败,请稍后重试.")
      }
    },
  },
}
</script>

<style lang="less" scoped>
.my-container {
  .header {
    height: 361px;
    background: url("~@/assets/banner.png") no-repeat;
    background-size: cover;
  }
  .not-login {
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      img {
        height: 132px;
        padding-bottom: 15px;
      }
      span.text {
        font-size: 28px;
        color: #fff;
      }
    }
  }
  .user-info {
    .base-info {
      height: 231px;
      padding: 76px 32px 23px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      .left {
        display: flex;
        align-items: center;
        .avatar {
          width: 132px;
          height: 132px;
          border: 2px solid #fff;
          margin-right: 23px;
        }
        .name {
          font-size: 32px;
          margin-left: 22px;
          color: white;
        }
      }
    }
    .data-stats {
      // height: 130px;
      display: flex;
      justify-content: space-around;
      .data-item {
        height: 130px;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        color: #fff;
        span:nth-child(1) {
          font-size: 36px;
          margin-bottom: 15px;
        }
        span:nth-child(2) {
          font-size: 26px;
          font-weight: 400;
        }
      }
    }
  }
  .grid-nav {
    .grid-item {
      height: 141px;
      .iconfont {
        font-size: 45px;
      }
      .icon-shoucang {
        color: yellow;
      }
      .icon-lishi {
        color: #ff9d1d;
      }
      .text {
        font-size: 28px;
      }
    }
  }
  .cell {
    margin: 10px 0 0 0;
  }
  .logout-cell {
    height: 100px;
    text-align: center;
    color: #eb5253;
    margin: 10px 0;
    font-size: 30px;
  }
}
</style>
