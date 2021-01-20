module.exports = {
  port: 6001,
  host: '0.0.0.0',
  proxy: {
    '/api': {
      // target: 'http://39.98.173.131:7000',
      //target: 'http://39.98.173.131:7000',
      target: 'http://localhost:8888',// 这是服务器地址
      //http://localhost:8888/wlhse_war
      // 接口地址映射 如前端请求 http://localhost:8080/api 映射到后端为 http://localhost:8888/wlhse/api/v3

      pathRewrite: {'^/api' : '/wlhse_war/api/v3'},
      changeOrigin: true
    }
  }
}