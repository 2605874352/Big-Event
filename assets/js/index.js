$(function () {

  $.ajax({
    url: '/my/userinfo',
    success: function (res) {
      if (res.status !== 0) {
        return layer.msg('获取用户信息失败')
      }
      let name = res.data.nickname || res.data.username
      let first = name[0].toUpperCase()

      $('#welcome').text(name)
      if (res.data.user_pic) {
        $('.layui-nav-img').show().attr('src', res.data.user_pic)
        $('.text-avatar').hide()
      } else {
        $('.layui-nav-img').hide()
        $('.text-avatar').text(first).show()
      }
    },
    // complete: function (xhr) {
    //   if (xhr.responseJSON.status === 1 && xhr.responseJSON.message === '身份认证失败！') {
    //     localStorage.removeItem('token')
    //     location.href = 'login.html'  
    //   }
    // }
  })

  let layer = layui.layer
  $('#logoutBtn').click(function () {
    layer.confirm(
      '确认是否退出', {
        title: '提示'
      },
      function (index) {
        // 清除token
        localStorage.removeItem('token')
        // 跳转到登录页面
        location.href = 'login.html'
        layer.close(index)
      }
    )
  })
})