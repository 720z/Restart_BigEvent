// 编辑文件页面专属
// 功能 1.根据渲染文章类别  2.富文本插件 3.裁剪插件  4.发布文章
$(function() {
    const { form } = layui
    //接收列表页传来的参数
    location.search
    const arr = location.search.slice(1).split('=')
    const id = arr[1]
        // console.log(id);

    //根据 id 获取文章详情
    function getArtDetail(id) {
        axios.get('/my/article/' + id).then(res => {
            if (res.status !== 0) return layer.msg('获取失败!')

            form.val('edit-form', res.data) //使用插件自带的form功能渲染表单
            initEditor() //初始化富文本
            $image.cropper('replace', 'http://api-breakingnews-web.itheima.net' + res.data.cover_img) //替换图片(这网址路径哪来的)⭐
        })

    }
    // getArtDetail()




    // 1.渲染文章类别
    function getCateList() {
        axios.get('/my/article/cates').then(res => {
            // console.log(res);
            if (res.status !== 0) return layer.msg('获取失败!')
            res.data.forEach(item => {
                $('#cate-sel').append(`<option value="${item.Id}">${item.name}</option>`)
            });
            form.render('select') //刷新select选择框渲染
            getArtDetail(id) //注意函数调用位置
        })
    }
    getCateList()

    // 2.初始化富文本编辑器⭐
    initEditor()

    // 3.裁剪插件
    const $image = $('#image'); // 初始化裁剪插件
    $image.cropper({
        aspectRatio: 10 / 7,
        crop: function(event) {
            // console.log(event.detail.x);
            // console.log(event.detail.y);
        },
        preview: '.img-preview' // 指定预览区域
    });

    // 点击上传 = 点击选择文件
    $('#choose-btn').click(function() {
        $('#file').click()
    })

    // 给文件上传按钮绑定change事件
    $('#file').change(function() {
        if (this.files.length == 0) return layer.msg('请先选择上传的图片!') // 未选择文件时判断
        const imgUrl = URL.createObjectURL(this.files[0]) //把图片转成url地址的形式
        $image.cropper('replace', imgUrl) // 替换裁剪区域的图片
    })

    // 4.发布文章
    //提前获取state(已发布 or 草稿)
    let state
    $('.last-row button').click(function() {
        state = $(this).data('state')
            // console.log(state);
    })

    $('.publish-form').submit(function(e) { // 两个按钮都有发布功能，给表单绑
        e.preventDefault()

        // 准备发送axios请求，需要的请求参数：title、cate_id、content、cover_img、state
        const fd = new FormData(this) // 已经拿到title、cate_id、content
        fd.append('state', state) // 添加state
            // console.log(fd.get('state'));

        // 添加cover_img  此处可查cropper文档(查了也看不懂)⭐
        $image.cropper('getCroppedCanvas', {
            width: 150,
            height: 150
        }).toBlob(blob => {
            // console.log(blob); //二进制图片数据
            fd.append('cover_img', blob)
            publishArticle(fd) //注意函数调用位置⭐
        })
    })

    // 万事俱备，发送请求(为了美观，封装函数)
    function publishArticle(fd) {
        axios.post('/my/article/add', fd).then(res => {
            console.log(res);
            if (res.status !== 0) return layer.msg('发表失败!')

            layer.msg(state == '草稿' ? '已存为草稿!' : '发表成功!')
            setTimeout(() => { //延迟跳转
                location.href = './list.html' //跳转至 "文章列表"
                window.parent.$('.layui-this').prev().find('a').click() //优化左侧导航栏高亮
            }, 1e3);
        })
    }

})