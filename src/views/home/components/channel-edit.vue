<template>
  <div class="channel-edit">
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button type="danger" plain round size="mini" class="edit-btn" @click="isEdit = !isEdit">
        {{ isEdit ? "完成" : "编辑" }}
      </van-button>
    </van-cell>
    <van-grid :gutter="10" class="my-grid">
      <van-grid-item v-for="(channel, index) in myChannels" :key="index" class="grid-item" @click="onMyChannelClick(channel, index)">
        <van-icon v-show="isEdit && !fiexdChannels.includes(channel.id)" slot="icon" name="clear"> </van-icon>
        <span slot="text" class="text" :class="{ active: index === active }">{{ channel.name }}</span>
      </van-grid-item>
    </van-grid>
    <!-- 推荐模块 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid :gutter="10" class="recommend-grid">
      <van-grid-item
        v-for="(channel, index) in recommendChannels"
        :key="index"
        :text="channel.name"
        class="grid-item"
        icon="plus"
        @click="onAddChannel(channel)"
      />
    </van-grid>
  </div>
</template>

<script>
import { getAllChannels, addUserChannel, deleteUserChannel } from "@/api/channels"
import { mapState } from "vuex"
import { setItem } from "@/utils/storage.js"

export default {
  name: "",
  data() {
    return {
      allChannle: [],
      isEdit: false,
      fiexdChannels: [0, 2], // 固定频道不允许删除
    }
  },
  props: {
    myChannels: {
      type: Array,
      required: true,
    },
    active: {
      type: Number,
      required: true,
    },
  },
  created() {
    this.loadgetAllChannels()
  },
  // 计算属性会观测依赖数据的变化.数据变化重新执行,没有变化将会缓存.
  computed: {
    ...mapState(["user"]),
    // recommendChannels() {
    //   const residueChannels = [];
    //   // 枚举所有频道
    //   this.allChannle.forEach((channel) => {
    //     // find 方法遍历数据 ；　需要定义一个函数返回满足条件元素,返回一个布尔值
    //     const res = this.myChannels.find((myChannels) => {
    //       // 满足了条件,说明了我的频道中包含了当前获取的频道
    //       return myChannels.id === channel.id;
    //     });
    //     // 如果 我的频道中没有找到改频道channel,则将当前频道添加到推荐频道
    //     if (!res) {
    //       residueChannels.push(channel);
    //     }
    //   });
    //   return residueChannels;
    // },
    recommendChannels() {
      // filter 方法遍历数组,把符合条件的元素存储到新数组中并返回
      return this.allChannle.filter(channel => {
        // find 方法遍历数组,把符合条件的第一个元素返回,返回为true的项将会存储在filter创建的新数组中。
        return !this.myChannels.find(myChannel => {
          // 将myChannel中的元素与channel中的元素进行比较如果存在返回true，取反.
          return myChannel.id === channel.id
        })
      })
    },
  },
  methods: {
    async loadgetAllChannels() {
      try {
        const { data } = await getAllChannels()
        console.log(data, "所有分类")
        this.allChannle = data.data.channels
      } catch (err) {
        this.$toast("数据获取失败")
        console.log(err)
      }
    },
    async onAddChannel(channel) {
      this.myChannels.push(channel)
      if (this.user) {
        try {
          await addUserChannel({
            id: channel.id,
            seq: this.myChannels.length,
          })
        } catch (err) {
          this.$toast("保存频道失败")
          console.log(err)
        }
      } else {
        setItem("CHANNELS_LOCAL", this.myChannels)
      }
    },
    onMyChannelClick(channel, index) {
      if (this.isEdit) {
        if (this.fiexdChannels.includes(channel.id)) {
          return
        }

        if (index < this.active) {
          this.$emit("updata-active", this.active - 1)
        }
        this.myChannels.splice(index, 1)

        this.deleteChannel(channel.id)
      } else {
        this.$emit("updata-active", index, false)
      }
    },
    async deleteChannel(id) {
      try {
        if (this.user) {
          await deleteUserChannel(id)
        } else {
          setItem("CHANNELS_LOCAL", this.myChannels)
        }
      } catch (err) {
        this.$toast("删除频道失败")
        console.log(err)
      }
    },
  },
}
</script>

<style lang="less" scoped>
.channel-edit {
  padding: 85px 0;
  .title-text {
    font-size: 32px;
    color: #333333;
    line-height: 58px;
  }
  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      background-color: #f4f5f6;
      white-space: nowrap;
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
        margin: 0;
      }
      .active {
        color: red;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }

  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -15px;
        font-size: 30px;
        z-index: 2;
        color: #707479;
      }
    }
  }

  /deep/ .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 30px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
