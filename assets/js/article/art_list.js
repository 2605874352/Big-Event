$(function () {
  let layer = layui.layer
  let form = layui.form
  let laypage = layui.laypage

  // 把请求参数单独抽离出来作为query对象，以后发送请求，按照对应query即可获取到数据
  let query = {
    pagenum: 1, // 页码值, 默认加载第一页的数据
    pagesize: 2, // 每页显示多少条数据
    cate_id: "", // 文章分类的 Id
    state: "", // 文章的状态，可选值有：已发布、草稿
  }

  // 发送ajax请求获取对应的文章列表
  function getList() {
    $.ajax({
      url: "/my/article/list",
      data: query,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取文章列表失败！")
        }
        let htmlStr = template("trTpl", res)
        $("tbody").html(htmlStr)
        // 渲染展示分页功能
        renderPage(res.total)
      },
    })
  }
  // 调用封装的ajax请求获取对应的文件列表
  getList()

  // 定义分页渲染函数
  function renderPage(total) {
    laypage.render({
      curr: query.pagenum, //当前分页的页码
      limit: query.pagesize, //每页多少条
      elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
      count: total, //数据总数，从服务端得到
      limits: [5, 10, 20, 50],
      layout: ["count", "limit", "prev", "page", "next", "skip"],
      jump: function (obj, first) {
        // 点击分页修改query对象的pagenum的值， 修改为obj.curr
        query.pagenum = obj.curr
        // 修改query对象的每页多少条（pagesize属性的值）
        query.pagesize = obj.limit
        // 初始化分页效果，jump函数会执行，但是不要执行getlast函数
        if (!first) {
          // 点击时让first成立
          getList()
        }
      }
    })
  }

  // 下拉框所有分类的数据
  $.ajax({
    url: "/my/article/cates",
    success: function (res) {
      // 使用ES6的反引号来把数据渲染到下拉框中
      let htmlStr = "" // 装option的html字符串
      let data = res.data
      // 遍历数组，数据结合option创建出来
      data.forEach((item) => {
        htmlStr += `
          <option value="${item.Id}">${item.name}</option>
        `;
      })
      // 将创建的option添加到下拉框中
      $("[name=cate_id]").append(htmlStr)
      // 需要手动更新form表单（重新渲染下即可）
      form.render()
    },
  })

  // 处理筛选功能
  $("#form").on("submit", function (e) {
    e.preventDefault()
    // 点击筛选按钮会触发form的submit事件
    // 需要修改query对象的文章分类的id 和文章的state状态
    // 发送ajax请求获取到对应的数据
    // 修改query对象的cate_id ==> 文章分类的id
    query.cate_id = $("[name=cate_id]").val()
    query.state = $("[name=state]").val()
    // 发送ajax请求重新获取所有文章列表
    getList()
  })

  // 删除功能
  $('tbody').on('click', '.delBtn', function () {
    // 获取id的值
    let id = $(this).attr('data-id')

    // 解决删除功能的bug
    // 需要判断tbody中的删除按钮的个数是否为1，如果为1，意味着请求发送成功，该页面中就没有了数据，需要将pagenum - 1（展示上一页数据）
    if ($('.delBtn').length === 1) {
      if (query.pagenum === 1) {
        query.pagenum = 1
      } else {
        query.pagenum = query.pagenum - 1
      }
    }
    $.ajax({
      url: "/my/article/delete/" + id,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('删除失败！')
        }
        layer.msg('删除成功！')
        // 发送ajax请求重新获取所有文章列表
        getList()
      }
    })
  })

  // 编辑功能
  $('tbody').on('click', '.editBtn', function () {
    // 获取id的值
    let id = $(this).attr('data-id')
    // 跳转修改文章的页面（拼接到url地址后面）
    location.href = '/article/art_edit.html?id=' + id
  })

  // 补零函数 
  var paddZero = function (n) {
    return n < 10 ? '0' + n : n
  }

  // 过滤器过滤时间
  // 在模板中来使用过滤器函数 {{数据 | 过滤器函数名}}
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
})