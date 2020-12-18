<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isDeleteShow">
        <span @click="$emit('clearSearchHistories')">全部删除</span>
        &nbsp; &nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </div>
      <van-icon name="delete" v-else @click="isDeleteShow = true" />
    </van-cell>
    <van-cell v-for="(item, index) in searchHistories" :key="index" :title="item" @click="onSearchItemClick(item, index)">
      <van-icon name="close" v-show="isDeleteShow" />
    </van-cell>
  </div>
</template>

<script>
export default {
  name: "SearchHistory",
  components: {},
  props: {
    /* 
    prop数据: 受父组件数据影响的
      如果是一个普通数据(数字、字符串、布尔值),建议不进行修改;即使是修改了也不会传导给父组件.
      如果是引用数据类型(数组、对象) 可以修改;例如数组的push方法,对象.xx=xx等;但是不能重新赋值.
    */
    searchHistories: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      isDeleteShow: false, // 控制删除显示状态
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onSearchItemClick(item, index) {
      if (this.isDeleteShow) {
        this.searchHistories.splice(index, 1)
      } else {
        this.$emit("search", item)
      }
    },
  },
}
</script>

<style lang="less" scoped></style>
