// 登录注册页面
// 功能：1.登录注册切换  2.注册  3.登录
$(function() {
    const { form } = layui

    // 1.登录注册切换
    $('.link a').click(function() {
        $('.layui-form').toggle()
    })

    //表单验证
    form.verify({
        username: function(value, item) { //value：表单的值、item：表单的DOM对象
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '用户名不能有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '用户名首尾不能出现下划线\'_\'';
            }
            if (/^\d+\d+\d$/.test(value)) {
                return '用户名不能全为数字';
            }

        },
        pass: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        samePass: function(value) {
            if (value !== $('#pass').val()) {
                return '两次密码不一致';
            }
        }
    });

    //2.注册
    $('.reg-form').submit(function(e) {
        e.preventDefault()
            // 发送请求
        axios.post('/api/reguser', $(this).serialize()).then(res => {
            if (res.status !== 0) return layer.msg('注册失败!')

            //注册成功，跳转登录页
            layer.msg('注册成功!')
            $('.reg-form a').click()
        })
    })

    // 3.登录
    $('.login-form').submit(function(e) {
        e.preventDefault()
            // 发送请求
        axios.post('/api/login', $(this).serialize()).then(res => {
            if (res.status !== 0) return layer.msg('登录失败!')

            //注册成功，保存token令牌，跳转至首页
            layer.msg('登录成功!')
            localStorage.setItem('token', res.token)
            setTimeout(() => {
                location.href = './index.html'
            }, 500);
        })
    })
})