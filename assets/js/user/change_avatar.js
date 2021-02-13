// 个人中心--更换头像页面
// 功能： 1.用cropper插件渲染用户头像  2.更新头像
$(function() {
    // 初始化裁剪插件
    const $image = $('#image');
    $image.cropper({
        aspectRatio: 1 / 1,
        crop: function(event) {
            // console.log(event.detail.x);
            // console.log(event.detail.y);
        },
        //指定预览区 (文档中未提到⭐)
        preview: '.img-preview'
    });

    // 点击上传=点击选择文件
    $('#upload-btn').click(function() {
        $('#file').click()
    })

    // 给文件上传按钮绑定change事件(容易遗忘⭐)
    $('#file').change(function() {
        console.log(this.files);
        if (this.files.length !== 1) return layer.msg('请先选择上传的图片!')

        //把图片转成url地址的形式⭐
        const imgUrl = URL.createObjectURL(this.files[0])
        console.log(imgUrl); // blob:http://127.0.0.1:5501/5190115...
        // 替换裁剪区域的图片⭐
        $image.cropper('replace', imgUrl)
    })

    // 点击“确定” 更新头像
    $('#save-btn').click(function() {
        //限制上传图片宽高，从而可上传大图⭐
        const dataURL = $image.cropper('getCroppedCanvas', {
            width: 150,
            height: 150
        }).toDataURL('image/png')

        // 手动构建查询参数avatar(base64格式的字符串)⭐
        const search = new URLSearchParams();
        search.append('avatar', dataURL);

        axios.post('/my/update/avatar', search).then(res => {
            console.log(res);
            if (res.status !== 0) return layer.msg('上传失败!')
            window.parent.getUserInfo() //重新渲染首页头像
            layer.msg('更新头像成功!')
        })
    })

})