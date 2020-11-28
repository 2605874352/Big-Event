$(function () {
  let layer = layui.layer

  // 封装ajax请求获取对应的文件列表
  function getList() {
    $.ajax({
      url: "/my/article/list",
      data: {
        pagenum: 1, // 页码值, 默认加载第一页的数据
        pagesize: 2, // 每页显示多少条数据
        cate_id: "", // 文章分类的 Id
        state: "", // 文章的状态，可选值有：已发布、草稿
      },
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败！')
        }
        let htmlStr = template('trTpl', res)
        $('tbody').html(htmlStr)
      }
    })
  }
  // 调用ajax请求获取对应的文件列表
  getList()

  // 补零函数 
  var paddZero = function (n) {
    return n < 10 ? '0' + n : n
  }

  // 过滤器美化时间
  template.defaults.imports.formatTime = function (time) {
    // time 需要处理的数据
    // return 处理好的数据
    let d = new Date(time)
    let y = d.getFullYear()
    let m = paddZero(d.getMonth() + 1)
    let day = paddZero(d.getDate())
    let h = paddZero(d.getHours())
    let mm = paddZero(d.getMinutes())
    let s = paddZero(d.getSeconds())
    return `${y}-${m}-${day} ${h}:${mm}:${s}`
  }
  // 在模板中来使用过滤器函数 {{数据 | 过滤器函数名}}
})