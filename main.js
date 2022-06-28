import App from './App'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif
// 按需导入 $http 对象
import { $http } from '@escook/request-miniprogram'
// 将按需导入的 $http 挂载到 wx 顶级对象之上，方便全局调用
// wx.$http = $http

// 在 uni-app 项目中，可以把 $http 挂载到 uni 顶级对象之上，方便全局调用
uni.$http = $http
$http.beforeRequest=function(options){
	uni.showLoading({
		title:'数据加载中...'
	})
}
$http.afterRequest=function(response){
	// console.log(response)
	uni.hideLoading()
	if(response.statusCode!=200)
	{
		uni.showToast({
			title:'请求出错',
			duration:1500
		})
	}
	else{
		return response.data
	}
	
}
$http.baseUrl='https://www.uinav.com'

//toast方法
uni.$showMsg=function(title='数据请求失败！',duration=1500){
	uni.showToast({
		title,
		duration,
	})
	
}