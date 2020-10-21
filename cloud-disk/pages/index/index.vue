<template>
	<view>
	<!-- 自定义导航栏 -->
		<nav-bar>
			<text slot="left" class="font-md ml-3">首页</text>
			<template slot="right">
				<view style="width: 60rpx;height: 60rpx;"
					  class="flex align-center justify-center bg-icon rounded-circle mr-3">
					<text class="iconfont icon-zengjia"></text>
				</view>
				<view style="width: 60rpx;height: 60rpx;"
					  class="flex align-center justify-center bg-icon rounded-circle mr-3">
					<text class="iconfont icon-gengduo"></text>
				</view>
			</template>
		</nav-bar>
		<!-- 搜索框 -->
			<view class="px-3 py-2">
				<view class="position-relative">
					<view style="height: 70rpx;width: 70rpx;position: absolute;top: 0;left: 0;"
					class="flex align-center justify-center text-light-muted">
					<text class="iconfont icon-sousuo"></text>
					</view>
				</view>
				<input type="text"
					   style="height: 70rpx;padding-left: 70rpx;"
					   class="bg-light font-md rounded-circle"
					   placeholder="搜索网盘文件"/>
			</view>
		</view>
	</view>
</template>

<script>
	import navBar from '@/components/common/nav-bar.vue';
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {

		},
		methods: {

		},
		components:{
			navBar
		}
	}
</script>

<style>
	
</style>
