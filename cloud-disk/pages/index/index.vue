<template>
	<view>
		<!-- 自定义导航栏 -->
		<view>
			<uni-status-bar></uni-status-bar>
		<view class="flex border-bottom align-center" style="height: 44px;">
			<view class="flex-1 flex">
				<text class="font-md ml-3">首页</text>
			</view>
			<view class="flex-1 flex justify-center">
				
			</view>
			<view class="flex-1 flex justify-end">
				<view class="flex align-center justify-center bg-light rounded-circle mr-3" style="width: 60rpx;height: 60rpx;">
					<text class="iconfont icon-zengjia"></text>
				</view>
				<view class="flex align-center justify-center bg-light rounded-circle mr-3" style="width: 60rpx;height: 60rpx;">
					<text class="iconfont icon-gengduo"></text>
				</view>
			</view>
		</view>
		</view>
	</view>
</template>

<script>
	import uniStatusBar from '@/components/uni-ui/uni-status-bar/uni-status-bar.vue'
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
			uniStatusBar
		}
	}
</script>

<style>
	
</style>
