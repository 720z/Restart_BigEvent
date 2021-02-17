// 文章管理--文章类别页面
// 功能：1.模版引擎渲染分类列表  2.添加  3.编辑  4.删除
$(function() {
    const { form } = layui
    // 1.模版引擎渲染分类列表
    function getList() {
        axios.get('/my/article/cates').then(res => {
            // console.log(res);
            if (res.status !== 0) return layer.msg('获取文章列表失败!')

            //定义一个模版引擎
            const htmlStr = template('tpl', res)
            $('tbody').html(htmlStr) //填充内容
        })
    }
    getList()

    // 2.添加
    let index
    $('.add-btn').click(function() {
        // 来一个弹出框
        index = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $('.add-form-container').html() //这里content是一个普通的String
        });
    })

    // 事件委托，给表单绑定提交事件
    $(document).on('submit', '.add-form', function(e) {
        e.preventDefault()
        axios.post('/my/article/addcates', $(this).serialize()).then(res => { // 这里的this仍然指向表单⭐
            if (res.status !== 0) return layer.msg('添加失败!')
            layer.msg('添加成功!')
            layer.close(index) // 关闭弹框
            getList() // 重新渲染页面
        })
    })

    // 3.编辑
    $(document).on('click', '.edit-btn', function() {
        // 来一个弹出框
        index = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $('.edit-form-container').html() //这里content是一个普通的String
        });
        const id = $(this).data('id') // 根据自定义属性获取当前id⭐
        axios.get('/my/article/cates/' + id).then(res => {
            if (res.status !== 0) return layer.msg('获取失败!')
            form.val('edit-form', res.data)
        })
    })

    $(document).on('submit', '.edit-form', function(e) {
        e.preventDefault()
            // const id = $(this).data('id') // 不需要 已经在html里构架了隐藏input框
        axios.post('/my/article/updatecate', $(this).serialize()).then(res => {
            console.log(res);
            if (res.status !== 0) return layer.msg('修改失败!')
            layer.msg('修改成功!')
            layer.close(index) // 关闭弹框
            getList() // 重新渲染页面
        })
    })

    // 4.删除
    $(document).on('click', '.del-btn', function() {
        //来个confirm框
        const id = $(this).data('id') // 注意书写位置⭐
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            axios.get('/my/article/deletecate/' + id).then(res => {
                if (res.status !== 0) return layer.msg('删除失败!')
                layer.msg('删除成功!')
                getList() // 重新渲染页面
            })

            layer.close(index);
        });
    })
})