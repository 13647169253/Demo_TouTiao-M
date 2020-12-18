<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button class="search-btn" slot="title" type="info" size="small" round icon="search" to="/search">搜索</van-button>
    </van-nav-bar>
    <!-- /导航栏 -->
    <van-tabs class="channel-tabs" v-model="active" animated swipeable swipe-threshold="4">
      <van-tab v-for="item in channels" :key="item.id" :title="item.name">
        <article-list :channel="item" />
      </van-tab>
      <div slot="nav-right" class="placeholder"></div>
      <div slot="nav-right" class="hamburger-btn" @click="isChennelEditShow = true">
        <i class="iconfont icon-gengduo"></i>
      </div>
    </van-tabs>
    <!-- 频道编辑弹出层 -->
    <van-popup v-model="isChennelEditShow" position="right" :style="{ height: '95vh', width: '100vw' }" round closeable>
      <channel-edit :my-channels="channels" :active="active" @updata-active="onUpdataActive" />
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from "@/api/user"
import ArticleList from "./components/article-list"
import ChannelEdit from "./components/channel-edit"
import { mapState } from "vuex"
import { getItem } from "@/utils/storage"

export default {
  name: "HomeIndex",
  components: {
    ArticleList,
    ChannelEdit,
  },
  props: {},
  data() {
    return {
      active: 0,
      channels: [],
      isChennelEditShow: false,
    }
  },
  computed: {
    ...mapState(["user"]),
  },
  watch: {},
  created() {
    this.loadChannels()
  },
  mounted() {},
  methods: {
    async loadChannels() {
      try {
        let channels = []
        if (this.user) {
          const { data } = await getUserChannels()
          channels = data.data.channels
        } else {
          const localChannels = getItem("CHANNELS_LOCAL")
          if (localChannels) {
            channels = localChannels
          } else {
            // 没有本地数据,请求默认频道列表
            const { data } = await getUserChannels()
            channels = data.data.channels
          }
        }
        this.channels = channels
      } catch (err) {
        this.$toast("获取频道列表数据失败")
      }
    },
    onUpdataActive(index, isChennelEditShow = true) {
      this.active = index
      this.isChennelEditShow = isChennelEditShow
    },
  },
}
</script>

<style scoped lang="less">
.home-container {
  padding-bottom: 100px;
  padding-top: 174px;
  /deep/.van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }
  /deep/ .channel-tabs {
    .van-tab {
      border-right: 1px solid #edeff3;
      min-width: 200px;
      height: 80px;
      .van-tab__text {
        font-size: 27px;
        color: #777777;
      }
    }
    .van-tab--active .van-tab__text {
      color: #333 !important;
    }
    .van-tabs__line {
      width: 31px !important;
      height: 6px;
      background: rgba(50, 150, 250, 1);
      border-radius: 3px;
      bottom: 8px;
    }
    .van-tabs__nav {
      padding: 0;
    }
    .van-tabs__wrap {
      right: 0;
      left: 0;
      position: fixed;
      top: 92px;
      z-index: 1;
    }
    .placeholder {
      flex-shrink: 0;
      width: 66px;
      height: 82px;
    }
    .hamburger-btn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: #fff;
      opacity: 0.802;
      i.iconfont {
        font-size: 33px;
      }
      &:before {
        content: "";
        position: absolute;
        left: 0;
        width: 2px;
        height: 100%;
        background-image: url(~@/assets/gradient-gray-line.png);
        background-size: contain;
      }
    }
  }
}
</style>
