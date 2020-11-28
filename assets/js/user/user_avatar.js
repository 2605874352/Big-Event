$(function () {
  let layer = layui.layer
  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $("#image")
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: ".img-preview",
  }
  // 1.3 创建裁剪区域
  $image.cropper(options)
  // 点击上传按钮，模拟点击文件域
  $('#uploadBtn').click(function () {
    $('#file').click()
  })
  // 坚挺文件域的选择文件的变化
  $('#file').on('change', function () {
    // 当选择的文件改变了，该事件就会触发
    // files属性是文件域的DOM对象的属性，记录所有用户选择的文件
    // 获取到用户选择的文件（头像）
    let file = this.files[0]
    // 把选择的文件得到他对应的url地址
    let newImgURL = URL.createObjectURL(file)
    $image
      .cropper("destroy") // 销毁旧的裁剪区域
      .attr("src", newImgURL) // 重新设置图片路径
      .cropper(options); // 重新初始化裁剪区域
  })
  // 上传头像
  $("#sureBtn").click(function () {
    let dataURL = $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 100,
        height: 100,
      })
      .toDataURL("image/png"); // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

    $.ajax({
      type: 'POST',
      url: "/my/update/avatar",
      data: {
        avatar: dataURL,
      },
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('更换头像失败')
        }
        layer.msg('更换头像成功')
        window.parent.getAvatarAndName()
      }
    })



  })

})