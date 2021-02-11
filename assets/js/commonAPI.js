// 全局的 axios 默认值
axios.defaults.baseURL = 'http://api-breakingnews-web.itheima.net';

// 添加请求拦截器(http://www.axios-js.com/zh-cn/docs/#%E6%8B%A6%E6%88%AA%E5%99%A8)
axios.interceptors.request.use(function(config) {
    // 判断接口是否以 /my 开头，设置请求头(注意书写格式⭐)
    const token = localStorage.getItem('token') || ''
    if (config.url.startsWith('/my')) {
        config.headers.Authorization = token
    }
    return config;
}, function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function(response) {
    // 每次发送请求都判断一下是否有token令牌
    const { message, status } = response.data
    if (message == '身份认证失败！' && status == 1) {
        localStorage.removeItem('token')
        location.href = './login.html'
    }
    return response.data;
}, function(error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});