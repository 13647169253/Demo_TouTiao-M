<template>
  <div class="article-list">
    <!--
      List 列表组件：瀑布流滚动加载，用于展示长列表。
      List 组件通过 loading 和 finished 两个变量控制加载状态，
      当组件初始化或滚动到到底部时，会触发 load 事件并将 loading 自动设置成 true，此时可以发起异步操作并更新数据，
      数据更新完毕后，将 loading 设置成 false 即可。
      若数据已全部加载完毕，则直接将 finished 设置成 true 即可。
      - load 事件：
        + List 初始化后会触发一次 load 事件，用于加载第一屏的数据。
        + 如果一次请求加载的数据条数较少，导致列表内容无法铺满当前屏幕，List 会继续触发 load 事件，直到内容铺满屏幕或数据全部加载完成。
      - loading 属性：控制加载中的 loading 状态
        + 非加载中，loading 为 false，此时会根据列表滚动位置判断是否触发 load 事件（列表内容不足一屏幕时，会直接触发）
        + 加载中，loading 为 true，表示正在发送异步请求，此时不会触发 load 事件
      - finished 属性：控制加载结束的状态
        + 在每次请求完毕后，需要手动将 loading 设置为 false，表示本次加载结束
        + 所有数据加载结束，finished 为 true，此时不会触发 load 事件
     -->
    <van-pull-refresh
      v-model="isLoading"
      @refresh="onRefresh"
      :success-text="refreshSuccessText"
      :success-duration="1000"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
      >
        <!-- <van-cell
          v-for="(article, index) in list"
          :key="index"
          :title="article.title"
        /> -->
        <article-item
          v-for="(article, index) in list"
          :key="index"
          :article="article"
        />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from "@/api/article";
import ArticleItem from "@/components/article-item/article-item";

export default {
  name: "ArticleList",
  props: {
    channel: {
      type: Object,
      required: true,
    },
  },
  components: {
    ArticleItem,
  },
  data() {
    return {
      list: [], // 存储列表的数据的数组
      loading: false, // 控制加载中的 loading 状态
      finished: false, // 控制数据加载结束的状态
      timeStamp: null, // 获取下一页数据的时间戳
      error: false,
      isLoading: false, // 控制下拉刷新的 loading状态
      refreshSuccessText: "",
    };
  },
  created() {},
  methods: {
    // onLoad() {
    //   // 异步更新数据
    //   // setTimeout 仅做示例，真实场景中一般为 ajax 请求
    //   setTimeout(() => {
    //     for (let i = 0; i < 10; i++) {
    //       this.list.push(this.list.length + 1);
    //     }
    //     // 加载状态结束
    //     this.loading = false;
    //     // 数据全部加载完成
    //     if (this.list.length >= 40) {
    //       this.finished = true;
    //     }
    //   }, 1000);
    // },
    async onLoad() {
      // 异步更新数据
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id,
          timestamp: this.timeStamp || Date.now(),
          with_top: 1,
        });
        // if (Math.random() > 0.5) {
        //   JSON.parse("dasdasdaf");
        // }
        // console.log(data);
        const { results } = data.data;
        this.list.push(...results);
        this.loading = false;
        if (results.length) {
          this.timeStamp = data.data.pre_timestamp;
        } else {
          this.finished = true;
        }
      } catch (err) {
        console.log("请求失败", err);
        this.error = true;
        this.loading = false;
      }
    },
    // 下拉时会触发的函数
    async onRefresh() {
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id,
          timestamp: Date.now(), // 下拉刷新没次获取最新数据
          with_top: 1,
        });
        // if (Math.random() > 0.5) {
        //   JSON.parse("dasdasdaf");
        // }
        const { results } = data.data;
        this.list.unshift(...results);
        this.refreshSuccessText = `刷新成功,更新了${results.length}条数据`;
        this.isLoading = false;
      } catch (err) {
        this.refreshSuccessText = `刷新失败,请稍后重试`;
        this.isLoading = false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.article-list {
  /*
    解决不同分页的滚动条问题,给当前组件添加一下代码.给标签内容页添加独立的滚动条
    每一个节点中都有自己的组件容器.所以每一个列表都是一个独立的容器
    C3中添加了一种新的单位vw和vh,相对于视口,不受父元素的影响 1vw = 可视窗口的1% 1vh 同理
  */
  height: 80vh;
  overflow-y: auto;
}
</style> 