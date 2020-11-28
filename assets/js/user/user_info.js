$(function () {
  let form = layui.form
  let layer = layui.layer

  function getInfo() {
    $.ajax({
      url: '/my/userinfo',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取用户的基本信息', {
            time: 500 //（如果不配置，默认是3秒）
          })
        }
        form.val("userForm", res.data);
      }
    })
  }
  getInfo()

  // 提交表单数据-修改用户信息
  $('#userForm').submit(function (e) {
    e.preventDefault()
    let data = $(this).serialize()
    $.ajax({
      url: '/my/userinfo',
      type: 'POST',
      data: data,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('修改用户信息失败', {
            time: 500
          })
        }
        layer.msg('修改用户信息成功', {
          time: 500
        })
        // 通过window.parent来获取到父页面（ index.html）
        window.parent.getAvatarAndName()
      }
    })
  })
  // 重置功能
  $('#resetBtn').click(function (e) {
    e.preventDefault()
    getInfo()
  })
  // 表单效验功能
  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return '昵称长度必须在1-6之间'
      }
    }
  })
})