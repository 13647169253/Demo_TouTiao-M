<template>
  <!-- :to="`/article/${article.art_id}`"

  "{ 
    name根据路由的名称进行跳转;params传递路由的动态参数,属性名是手动设置路由动态参数的名称,值为需要传递的具体值 
    name: 'article', 
    params: { articleId: article.art_id } }""

    call 中的to属性与VueRouter 中的RouterLink中的to属性用法一致
   -->
  <van-cell class="article-item" :to="{ name: 'article', params: { articleId: article.art_id } }">
    <div slot="title" class="title van-multi-ellipsis--l2">
      {{ article.title }}
    </div>
    <div slot="label" class="label">
      <div v-if="article.cover.type === 3" class="cover-wrap">
        <div class="cover-item" v-for="(img, index) in article.cover.images" :key="index">
          <van-image :src="img" fit="cover" class="cover-item-img" />
        </div>
      </div>
      <div class="label-info-wrap">
        <span>{{ article.aut_name }}</span>
        <span>{{ article.comm_count }}评论</span>
        <span>{{ article.pubdate | relativeTime }}</span>
      </div>
    </div>
    <van-image v-if="article.cover.type === 1" slot="default" class="right-cover" fit="cover" :src="article.cover.images[0]" />
  </van-cell>
</template>

<script>
export default {
  name: "ArticleItem",
  props: {
    article: {
      type: Object,
      erquired: true,
    },
  },
  data() {
    return {}
  },
  created() {},
  methods: {},
}
</script>

<style lang="less" scoped>
.article-item {
  .title {
    font-size: 32px;
    color: #3a3a3a;
  }
  .van-cell__value {
    flex: unset;
    width: 232px;
    height: 146px;
    padding-left: 22px;
  }
  .right-cover {
    width: 232px;
    height: 146px;
  }
  .label {
    .label-info-wrap {
      span {
        font-size: 22px;
        color: #b4b4b4;
        margin-right: 20px;
      }
    }
    .cover-wrap {
      display: flex;
      padding: 30px 0;
      .cover-item {
        flex: 1;
        height: 146px;
        &:not(last-child) {
          padding-right: 4px;
        }
        .cover-item-img {
          width: 100%;
          height: 146px;
        }
      }
    }
  }
}
</style>
