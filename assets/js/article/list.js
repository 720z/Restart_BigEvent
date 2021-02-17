// 文章管理--文章列表页面
// 功能：1.渲染所有分类 渲染文章列表  2.分页器  3.筛选  4.删除  5.编辑
$(function() {
    const { form, laypage } = layui

    // 1.渲染所有分类 
    function getCateList() {
        axios.get('/my/article/cates').then(res => {
            if (res.status !== 0) return layer.msg('获取失败!')
            res.data.forEach(item => {
                $('#cate-sel').append(`<option value="${item.Id}">${item.name}</option>`)
            });
            form.render('select') //坑：再次渲染select选择框⭐
        })
    }
    getCateList()

    // 渲染文章列表
    const query = { // 定义一个查询对象
        pagenum: 1, // 当前页面
        pagesize: 4, // 每页显示多少条数据
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的状态:已发布、草稿
    }

    function renderTable() {
        // 准备发送axios，搞搞请求参数
        axios.get('/my/article/list', { params: query }).then(res => {
            // console.log(res);
            if (res.status !== 0) return layer.msg('获取失败!')

            //处理一下时间格式
            template.defaults.imports.dateFormat = function(time) {
                return moment(time).format('YYYY-MM-DD HH:mm:ss')
            }

            // 调用模版  引擎渲染页面
            const htmlStr = template('tpl', res)
            $('tbody').html(htmlStr)

            renderPage(res.total) // 渲染分页器
        })
    }
    renderTable()

    // 2.分页器
    function renderPage(total) {
        laypage.render({
            elem: 'pagination', // 分页器的id
            count: total, // 数据总数，从服务端得到
            limit: query.pagesize, //每页显示的条数
            limits: [4, 6, 10], //每页条数的选择项
            curr: query.pagenum, //起始页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], //自定义排版

            jump: function(obj, first) { //设置跳转逻辑，查文档⭐
                //obj包含了当前分页的所有参数，比如：
                query.pagenum = obj.curr //设置当前页，以便向服务端请求对应页的数据。
                query.pagesize = obj.limit //设置每页显示的条数

                //首次不执行
                if (!first) {
                    //do something
                    renderTable()
                }
            }
        });
    }

    // 3.筛选
    $('.layui-form').submit(function(e) {
        e.preventDefault()
        query.cate_id = $('#cate-sel').val() // 重新文章分类的 Id
        query.state = $('#state').val() // 文章的状态
        query.pagenum = 1 //⭐小细节：提交发送请求之前，修改页码值为第一页的内容(注意书写位置)
        renderTable()
    })

    // 4.删除
    $(document).on('click', '.del-btn', function() {
        const id = $(this).data('id') //获取当前id

        // 来一个confirm提示框
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            axios.get('/my/article/delete/' + id).then(res => {
                console.log(res);
                if (res.status !== 0) return layer.msg('删除失败!')
                layer.msg('删除成功!')

                //⭐优化操作：当前页只有一条数据，且不处于第一页时，那么我们点击删除数据之后，应手动更新上一页数据
                if ($('.del-btn').length == 1 && query.pagenum !== 1) {
                    query.pagenum = query.pagenum - 1
                }
                renderTable() //重新渲染
            })
            layer.close(index);
        });
    })

    // 5.编辑
    $(document).on('click', '.edit-btn', function() {
        const id = $(this).data('id') //获取当前id
        location.href = './edit.html?id=' + id //根据查询参数跳转
            // location.href = `./edit.html?id=${id}`
        window.parent.$('.layui-this').next().find('a').click() //优化左侧导航栏
    })

})