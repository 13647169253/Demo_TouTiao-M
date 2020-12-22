<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" left-arrow title="黑马头条" @click-left="$router.back()"></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="loading">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div class="article-detail" v-else-if="article.title">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->
        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image class="avatar" slot="icon" round fit="cover" :src="article.aut_photo" />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">{{ article.pubdate | relativeTime }}</div>
          <!-- 模板中的 $event 是事件参数 
              当传递给子组件的数据,需要使用和修改时,
              一般写法
            :is-followed="article.is_followed"
            @update-is_followed="article.is_followed = $event"
              简写,使用v-model
              v-model="article.is_followed"
              会生成一个 value="article.is_followed" 的props;并自动监听一个@input="article.is_followed = $event"事件
              如果需要修改 v-model 的规则名称,可以通过子组件的model属性来进行配置修改
              参考 vue自定义事件里的 自定义组件的v-model  https://cn.vuejs.org/v2/guide/components-custom-events.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BB%84%E4%BB%B6%E7%9A%84-v-model
              一个组件只能使用一次v-model
              如果有多个数据需要使用这个特性,可以使用 .sync 修饰符
          -->
          <follow-user class="follow-btn" v-model="article.is_followed" :user-id="article.aut_id" />
          <!-- <van-button v-if="article.is_followed" class="follow-btn" round size="small" @click="onFollow" :loading="followLoading">
            已关注
          </van-button>
          <van-button
            v-else
            class="follow-btn"
            type="info"
            color="#3296fa"
            round
            size="small"
            icon="plus"
            @click="onFollow"
            :loading="followLoading"
          >
            关注
          </van-button> -->
        </van-cell>
        <!-- /用户信息 -->
        <!-- 文章内容 -->
        <div class="article-content markdown-body" v-html="article.content" ref="article-content"></div>
        <van-divider>正文结束</van-divider>
        <div class="comments" v-if="commentList.length !== 0">评论</div>
        <!-- 文章评论 -->
        <comment-list
          :source="article.art_id"
          :list="commentList"
          @onload-success="totalCommentCount = $event.total_count"
          @reply-click="onReplyClick"
        />
        <!-- /文章评论 -->
        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button class="comment-btn" type="default" round size="small" @click="isPostShow = true">写评论</van-button>
          <van-icon name="comment-o" :info="totalCommentCount" color="#777" />
          <collect-article class="btn-item" v-model="article.is_collected" :article-id="article.art_id" />
          <like-article class="btn-item" v-model="article.attitude" :article-id="article.art_id" />
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->
        <!-- 评论弹出层 -->
        <van-popup v-model="isPostShow" position="bottom">
          <comment-post :target="article.art_id" @post-success="onPostSuccess" />
        </van-popup>
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div class="error-wrap" v-else-if="errorStatus === 404">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div class="error-wrap" v-else>
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
    <!-- 评论回复框 -->
    <!-- 弹出层是懒渲染,只有在第一次展示的时候才会发生渲染,之后的切换只是在显示内容的显示或隐藏 -->
    <van-popup v-model="isReplyShow" position="bottom" style="height: 85vh">
      <!--
        使用V-if条件渲染解决弹出层无法重新获取并渲染数据问题,
        true,进行组件的渲染,如果为false,那么组件不会发生渲染(组件将会被销毁),
      -->
      <comment-reply :comment="currentComment" @close="isReplyShow = false" v-if="isReplyShow" />
    </van-popup>

    <!-- /评论回复框 -->
  </div>
</template>

<script>
import { getArticleById } from "@/api/article"
import { ImagePreview } from "vant"
import FollowUser from "@/components/follow-user/index"
import CollectArticle from "@/components/collect-article/index"
import LikeArticle from "@/components/like-article/index"
import CommentList from "./components/comment-list"
import CommentPost from "./components/comment-post"
import CommentReply from "./components/comment-reply"

export default {
  name: "ArticleIndex",
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle,
    CommentList,
    CommentPost,
    CommentReply,
  },
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true,
    },
  },
  // 给所有的后代组件提供数据
  provide: function() {
    return {
      articleId: this.articleId,
    }
  },
  data() {
    return {
      article: {},
      loading: true,
      errorStatus: 0, //失败的状态码
      followLoading: false,
      totalCommentCount: 0,
      isPostShow: false,
      commentList: [], // 评论列表
      isReplyShow: false,
      currentComment: {},
    }
  },
  computed: {},
  watch: {},
  created() {
    this.loadArticle()
  },
  mounted() {},
  methods: {
    async loadArticle() {
      this.loading = true
      try {
        const { data } = await getArticleById(this.articleId)
        // if (Math.random() > 0.5) {
        //   JSON.parse("asdgdhfjgk")
        // }
        this.article = data.data
        // 初始化图片点击预览;数据驱动试图不是立即的
        setTimeout(() => {
          this.previewImage()
        }, 0)
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.errorStatus = 404
        }
        console.log(`获取数据失败,\n ${err}`)
      }
      // 加载完成让loading关闭 ; 在失败和成功都需要关闭loading
      this.loading = false
    },
    previewImage() {
      // 获取 img 节点
      const articleContent = this.$refs["article-content"]
      const imgs = articleContent.querySelectorAll("img")
      const images = []
      imgs.forEach((img, index) => {
        images.push(img.src)
        img.onclick = () => {
          ImagePreview({
            images,
            startPosition: index,
          })
        }
      })
    },
    onPostSuccess(data) {
      // 关闭弹出层  将发布内容显示到列表顶部
      this.isPostShow = false
      this.commentList.unshift(data.new_obj)
    },
    onReplyClick(comment) {
      this.currentComment = comment
      this.isReplyShow = true
    },
  },
}
</script>

<style scoped lang="less">
@import "./github-markdown.css";

.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: #fff;
  }
  .article-detail {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
    .comments {
      font-size: 40px;
      padding-left: 30px;
      margin-bottom: 32px;
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 60px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    /deep/ .van-icon {
      font-size: 40px;
    }
    .comment-icon {
      top: 2px;
      color: #777;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
    .btn-item {
      border: none;
      padding: 0;
      height: 40px;
      line-height: 40px;
      color: #777777;
    }
    .collect-btn--collected {
      color: #ffa500;
    }
    .like-btn--liked {
      color: #e5645f;
    }
  }
}
</style>
