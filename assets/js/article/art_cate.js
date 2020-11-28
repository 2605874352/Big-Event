$(function () {
  let layer = layui.layer
  let form = layui.form

  // 获取文章类别封装函数
  function getCate() {
    $.ajax({
      url: "/my/article/cates",
      success: function (res) {
        // 数据和模板结合起来得到html字符串——》放到tbody中显示
        let htmlStr = template('trTpl', res)
        $('tbody').html(htmlStr)
      }
    })
  }
  // 调用获取文章类别
  getCate()

  // 点击添加类别功能按钮
  let index //  index变量保存弹出层的索引
  $('#btnAdd').click(function () {
    // 弹出层
    index = layer.open({
      // 层类型
      type: 1, // 页面层
      // 定义宽度
      area: '500px',
      // 标题
      title: '添加文章分类',
      // 内容  来源于addForm这个script标签中的内容，使用html方法可以解析标签
      content: $('#addForm').html()
    })
  })

  // 确认添加
  // 点击按钮弹出层弹出的form表单结构， 需要使用事件委托来注册
  $('body').on('submit', '#form', function (e) {
    e.preventDefault()
    let data = $(this).serialize()
    $.ajax({
      url: '/my/article/addcates',
      type: 'POST',
      data: data,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('新增文章分类失败！')
        }
        layer.msg('新增文章分类成功！')
        // 关闭弹出层
        layer.close(index)
        // 重新获取文章类别
        getCate()
      }
    })
  })

  // 点击编辑功能按钮
  let editIndex // editIndex存编辑的弹出层的索引
  $('tbody').on('click', '.editBtn', function () {
    // 获取当前编辑按钮的存储的data-id自定义属性的值
    let id = $(this).attr('data-id')
    // 弹出层
    editIndex = layer.open({
      // 层类型
      type: 1, // 页面层
      // 定义宽度
      area: "500px",
      // 标题
      title: "修改文章分类",
      // 内容 来源于editFormTpl这个script标签中的内容，注意这里使用的是html方法() ==> 可以获取到标签
      content: $("#editFormTpl").html(),
    })
    // 发送请求，获取到form里面的数据
    $.ajax({
      url: "/my/article/cates/" + id, //  接口文档拼接id
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取文章分类数据失败！')
        }
        // 把数据填充到form表单中
        form.val('editForm', res.data)
      }
    })
  })

  // 编辑的form表单的确认修改功能
  $('body').on('submit', '#editForm', function (e) {
    e.preventDefault()
    // 获取from表单数据    
    let data = $(this).serialize()
    // 发送ajax，提交到服务器上
    $.ajax({
      url: "/my/article/updatecate",
      type: "POST",
      data: data,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('更新分类信息失败！')
        }
        layer.msg('更新分类信息成功！')
        // 关闭弹出层
        layer.close(editIndex)
        // 重新获取数据
        getCate()
      }
    })
  })

  // 删除功能
  $('tbody').on('click', '.delBtn', function () {
    //  获取到存储的id
    let id = $(this).attr('data-id')
    // ajax发送删除请求
    $.ajax({
      url: "/my/article/deletecate/" + id,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('删除文章分类失败！')
        }
        layer.msg('删除文章分类成功！')
        // 重新加载所有文章分类
        getCate()
      }
    })
  })
})