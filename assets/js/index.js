$(function () {
  let layer = layui.layer
  getAvatarAndName()

  // 退出功能
  $("#logoutBtn").click(function () {
    layer.confirm("确定退出登录?", {
        title: "提 示",
      },
      function (index) {
        // 该函数会在点击确认的时候执行
        // 退出登录要做的事情，应该和登录的时候做的事情是相反的
        // 1. 把存储在本地的token信息给删除掉 ==> localStorage.removeItem(key)
        localStorage.removeItem("token")
        // 2. 页面跳转回到login.html 登录页面
        location.href = "login.html"
        layer.close(index) // 关闭当前询问框
      }
    )
  })
})

// 获取用户头像和昵称基本信息
function getAvatarAndName() {
  $.ajax({
    url: "/my/userinfo",
    /* // 设置请求头信息
    headers: {
      Authorization: localStorage.getItem("token"),
    }, */
    success: function (res) {
      if (res.status !== 0) {
        return layer.msg("获取用户信息失败！", {
          time: 500
        })
      }
      // 需要处理头像和昵称
      // 1. 先处理名字 （优先展示昵称，其次在是用户名）
      let name = res.data.nickname || res.data.username
      //   console.log(name, name[0].toUpperCase())
      $("#welcome").text("欢迎 " + name)
      // 2. 在处理头像
      // 根据res的data的user_pic来做不同的处理
      if (res.data.user_pic) {
        //   有用户头像，展示用户头像，隐藏文字头像
        $(".layui-nav-img").show().attr("src", res.data.user_pic)
        $(".text-avatar").hide()
      } else {
        //   没有用户头像，隐藏用户头像，展示文字头像 ==> 文字头像的文字来源于name的第一个字符（大写的）
        $(".layui-nav-img").hide()
        $(".text-avatar").text(name[0].toUpperCase()).show()
      }
    }
  })
}