// 个人中心--修改密码页面
// 功能：修改密码 
$(function() {
    const { form } = layui
    //表单验证
    form.verify({
        pass: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        confirmPass: function(value) {
            if (value !== $('#pass').val()) {
                return '两次密码不一致';
            }
        }
    });

    // 1.修改密码
    $('.layui-form').submit(function(e) {
        e.preventDefault()
        axios.post('/my/updatepwd', $(this).serialize()).then(res => {
            if (res.status !== 0) return layer.msg('原密码错误!')
            layer.msg('修改密码成功，请重新登录！')

            // 重置表单 reset()⭐
            $('.layui-form')[0].reset()

            //跳转到登录页
            localStorage.removeItem('token')
            setTimeout(() => {
                window.parent.location.href = '../login.html'
            }, 2e3);
        })
    })
})