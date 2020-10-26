import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import $H from '../common/request.js';

export default new Vuex.Store({
	state: {
		user: null,
		token: null,
		uploadList: [],
		downlist: []
	},
	actions: {
		logout({
			state
		}) {
			$H.post('/logout', {}, {
				torkn: true
			})
			state.user = null
			state.token = null
			uni.removeStorageSync('user');
			uni.removeStorageSync('token');
			uni.removeStorageSync('dirs');

			// 重启应用
			uni.reLaunch({
				url: '/pages/login/login'
			});
		},
		login({
			state
		}, user) {
			state.user = user
			state.token = user.token

			uni.setStorageSync('user', JSON.stringify(user))
			uni.setStorageSync('token', user.token)
		},
		initUser({
			state
		}) {
			let user = null.getStorageSync('user')
			if (user) {
				state.user = JSON.parse(user)
				state.token = state.user.token
			}
		},
		updateSize({
			state
		}, e) {
			state.user.total_size = e.total_size
			state.user.used_size = e.used_size
		},

		initList({
			state
		}) {
			if (state.user) {
				let d = uni.getStorageSync("downlist_" + state.user.id)
				let u = uni.getStorageSync("uploadList_" + state.user.id)

				state.downlist = d ? JSON.parse(d) : []
				state.uploadList = u ? JSON.parse(u) : []
			}
		},

		// 创建一个上传任务
		createUploadJob({
			state
		}, obj) {
			// 添加到上传队列的最前面
			state.uploadList.unshift(obj)
			// 异步设置本地存储，纪录键值对为：上传人和上传内容
			uni.setStorage({
				key: "uploadList_" + state.user.id,
				data: JSON.stringify(state.uploadList)
			})
		},

		// 更新上传任务进度
		updateUploadJob({
			state
		}, obj) {
			// 在上传队列中查找该用户的上传任务
			let i = state.uploadList.findIndex(item => item.key === obj.key)
			// 如果存在
			if (i !== -1) {
				// 更新progress属性的值和上传状态的值
				state.uploadList[i].progress = obj.progress
				state.uploadList[i].status = obj.status
				// 异步更新本地存储
				uni.setStorage({
					key: "uploadList_" + state.user.id,
					data: JSON.stringify(state.uploadList)
				})
			}
		},
		
		// 创建一个下载任务
		createDownLoadJob({
			state
		}, obj) {
			state.downlist.unshift(obj)
			uni.setStorage({
				key: "downlist_" + state.user.id,
				data: JSON.stringify(state.downlist)
			})
		},
		
		// 更新下载任务进度
		updateDownLoadJob({
			state
		}, obj) {
			let i = state.downlist.findIndex(item => item.key === obj.key)
			// 如果存在
			if (i !== -1) {
				state.downlist[i].progress = obj.progress
				state.downlist[i].status = obj.status
				uni.setStorage({
					key: "downlist_" + state.user.id,
					data: JSON.stringify(state.downlist)
				})
			}
		},
	}
})
