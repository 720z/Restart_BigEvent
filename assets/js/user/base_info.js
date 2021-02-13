// 个人中心--基本资料页面
// 功能：1.页面加载获取用户信息  2.更改用户信息  3.重置修改操作
$(function() {
    const { form } = layui
    // 1.页面加载获取用户信息
    initUserInfo()

    function initUserInfo() {
        axios.get('/my/userinfo').then(res => {
            if (res.status !== 0) return layer.msg('获取失败!')

            //渲染用户信息
            form.val('edit-userinfo', res.data) //此方法需和 form标签中lay-filter属性值搭配
        })
    }

    // 2.更改用户信息
    //表单验证
    form.verify({
        nick: [
            /^\S{1,6}$/, '昵称必须在1 ~ 6 个字符之间'
        ],
    });

    $('.base-info-form').submit(function(e) {
        e.preventDefault()
        axios.post('/my/userinfo', $(this).serialize()).then(res => {
            if (res.status !== 0) return layer.msg('修改失败!')
            layer.msg('修改成功!')
            window.parent.getUserInfo() //同步渲染首页
        })
    })

    // 3.重置修改操作
    $('#btnReset').click(function(e) { //这按钮也有提交表单功能，需阻止⭐
        e.preventDefault()
        initUserInfo()
    })

})