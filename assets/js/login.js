$(function () {

  // 注册（注册区域显示，登陆区域隐藏）
  $('#gotoRegi').click(function () {
    $('.regiBox').show()
    $('.loginBox').hide()
  })

  // 登录（登录区域显示，注册区域隐藏）
  $("#gotoLogin").click(function () {
    $(".regiBox").hide()
    $(".loginBox").show()
  })

  // 从layui中获取到form表单的功能
  let form = layui.form
  let layer = layui.layer

  // 表单效验
  form.verify({
    // 表单效验函数式的方式，也支持数组的形式
    // 数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
    pass: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    // 再次确认密码的校验 需要和密码框的内容保持一致 ==> 函数写法
    repass: function (value) {
      // value：表单的值
      // 获取密码框需要精确，需要是注册表单中的密码框
      let pwd = $(".regiBox input[name=password]").val()
      // 判断密码框内容是否和确认密码框的内容是否一致
      if (value !== pwd) {
        // return 后面的内容就是提示文字
        return "两次输入的密码不一致!"
      }
    },
  })

  // 注册ajax请求
  $('#regiForm').on('submit', function (e) {
    e.preventDefault()
    let data = $(this).serialize()
    $.ajax({
      type: 'POST',
      url: '/api/reguser',
      data,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('注册失败' + res.message)
        }
        layer.msg('注册成功')
        $('#gotoLogin').click()
      }
    })
  })

  // 登录ajax请求
  $('#loginForm').on('submit', function (e) {
    e.preventDefault()
    let data = $(this).serialize()
    $.ajax({
      type: 'POST',
      url: '/api/login',
      data,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('登录失败')
        }

        localStorage.setItem('token', res.token)
        layer.msg(
          '登陆成功，即将去后台主页', {
            time: 2000, //2秒关闭
          },
          function () {
            location.href = 'index.html'
          }
        )
      }
    })
  })






})