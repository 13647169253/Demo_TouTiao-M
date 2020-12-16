<template>
  <div class="login-container">
    <van-nav-bar class="page-nav-bar" title="登录">
      <van-icon v-if="$route.query.redirect" slot="left" name="cross" @click="$router.back()" />
    </van-nav-bar>
    <van-form @submit="onSubmit" ref="loginForm">
      <van-field v-model="user.mobile" name="mobile" placeholder="请输入手机号" :rules="userFormRules.mobile" type="Number" maxlength="11">
        <i slot="left-icon" class="iconfont icon-shouji"></i>
      </van-field>
      <van-field v-model="user.code" name="code" placeholder="请输入验证码" :rules="userFormRules.code" type="Number" maxlength="6">
        <i slot="left-icon" class="iconfont icon-yanzhengma"></i>
        <template #button>
          <van-count-down v-if="isCountDownShow" :time="1000 * 60" format="ss s" @finish="isCountDownShow = false" />
          <van-button v-else class="send-sms-btn" round size="small" type="default" native-type="button" @click="onSendSms">
            获取验证码
          </van-button>
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button class="login-btn" block type="info" native-type="submit">
          登录
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendSms } from "@/api/user"
export default {
  name: "loginIndex",
  data() {
    return {
      user: {
        mobile: "13911111113",
        code: "246810",
      },
      userFormRules: {
        mobile: [
          { required: true, message: "请填写用户名" },
          { pattern: /1[3|5|7|8]\d{9}/, message: "手机号格式错误" },
        ],
        code: [
          { required: true, message: "请填写验证码" },
          { pattern: /\d{6}/, message: "验证码错误" },
        ],
      },
      isCountDownShow: false,
    }
  },
  created() {},
  methods: {
    async onSubmit() {
      const user = this.user
      // todo : 验证

      // 组件中必须通过this.$toast 来调用toast
      this.$toast.loading({
        message: "登录中...",
        forbidClick: true,
        duration: 0, // 弹出框的持续时间;默认为2s,为0则会持续。
      })

      try {
        const { data } = await login(user)
        this.$store.commit("setUser", data.data)
        console.log("登陆成功", data)
        this.$toast.success("登录成功")
        // back 的方式不严谨
        // this.$router.back();
        this.$router.push(this.$route.query.redirect || "/")
      } catch (err) {
        console.log(err)
        if (err.response.status === 400) {
          this.$toast.fail("手机号或验证码错误")
        } else {
          this.$toast.fail("登录失败，请稍后重试")
        }
      }
    },
    async onSendSms() {
      try {
        await this.$refs.loginForm.validate("mobile")
      } catch (err) {
        return console.log("请输入正确的手机号", err)
      }
      this.isCountDownShow = true
      try {
        await sendSms(this.user.mobile)
        this.$toast("发送成功")
      } catch (err) {
        this.isCountDownShow = false
        if (err.response.status === 429) {
          this.$toast("获取次数太频繁")
        } else {
          this.$toast("获取验证码失败")
        }
      }
    },
  },
}
</script>

<style lang="less" scoped>
.login-container {
  .iconfont {
    font-size: 37px;
  }

  .send-sms-btn {
    // width: 156px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
  }

  .login-btn-wrap {
    padding: 53px 33px;

    .login-btn {
      background-color: #6db4fd;
      border: none;
    }
  }
}
</style>
