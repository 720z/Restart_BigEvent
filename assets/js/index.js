// 首页功能 1.封装函数 获取并渲染头像用户名  2.退出按钮

// 1.封装函数 获取并渲染头像用户名
function getUserInfo() {
    axios.get('/my/userinfo').then(res => {
        if (res.status !== 0) return layer.msg('获取失败!')

        //渲染头像与昵称
        const { user_pic, nickname, username } = res.data
        const name = nickname || username
        if (res.data.user_pic) {
            $('.avatar').prop('src', user_pic).show()
            $('.text-avatar').hide()
        } else {
            $('.text-avatar').text(name[0].toUpperCase()).show()
            $('.avatar').hide()
        }

        $('.nickname').text(`欢迎 ${name}`).show()
    })
}
getUserInfo()

// 2.退出按钮
$('#logout').click(function() {
    //弹出提示框
    layer.confirm('确认退出登录？', { icon: 3, title: '提示' }, function(index) {
        //do something
        localStorage.removeItem('token')
        layer.msg('已退出登录!')
        setTimeout(() => {
            location.href = './index.html' //延迟跳转首页
        }, 600);

        layer.close(index);
    });
})