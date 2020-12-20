/* 
  postcss 配置文件   postcss 是 css 的 babel
  本身是一个处理CSS的工具,功能比较单一,插件体系强大,功能跟随插件多种多样
  Autoprefixer 实现自动添加浏览器相关的声明前缀
  PostCss PresetEnv 插件,可以使用更新的CSS语法,并向下兼容.
  == 这里我们配置 postcss-pxtorem 将单位转换为Rem; 它无法转换行内样式的单位 
*/
module.exports = {
  // 需要使用的插件
  plugins: {
    // 在Vue-cli中自动配置了此项功能
    // autoprefixer: {
    //   // 配置需要兼容的环境信息
    //   browsers: ['Android >= 4.0', 'iOS >= 8'],
    // },
    'postcss-pxtorem': {
      // 基于amfe-flexible 的一行分为10份
      // 设置为设计稿的10/1; vant中基于375进行设置 ;设计稿中为750 所以需要/一半
      // 可以使用一个函数,动态的返回. postcss-pxtorem在处理每一个css文件时都会调用
      rootValue({ file }) {
        // file是处理的css文件
        // return file.indexOf('vant') !== -1 ? 37.5 : 75
        return file.includes('vant') ? 37.5 : 75
      },
      // 需要转换的属性 例如 height 
      propList: ['*'],
      // 排除不需要转换的css文件
      exclude: "github-markdown"
    },
  },
};