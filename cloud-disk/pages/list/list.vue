<template>
	<view style="height: 100vh;" class="flex flex-column">
		<view class="flex border-bottom border-light-secondary" style="height: 100rpx;">
			<view class="flex-1 flex flex-column align-center justify-center" v-for="(item,index) in tabBars" :key="index"
			:class="index === tabIndex ? 'text-main' : ''"
			@click="changeTab(index)">
				<text class="font-md">{{item.name}}</text>
				<text class="rounded" style="height: 8rpx;width: 140rpx;" :class="tabIndex === index ? 'bg-main' : 'bg-white'"></text>
			</view>
		</view>
		<!-- swiper内容随着上面tab的切换联动 -->
		<swiper class="flex-1 flex" :duration="250" :current="tabIndex" @change="changeTab($event.detail.current)">
			<swiper-item class="flex-1 flex" v-for="(item,index) in tabBars" :key="index">
				<scroll-view scroll-y="true" class="flex-1">
					<view class="bg-light flex align-center font-sm px-2 text-muted" style="height: 60rpx;">
						文件下载至：storage/XXXX/XXXX
					</view>
					<view class="bg-light flex align-center font-sm px-2 text-muted">
						下载中({{downing.length}})
					</view>
					<!-- 注意 -->
					<f-list v-for="(item,index) in downing" :key="'i'+index" :item="item" :index="index">
						<view class="flex align-center text-main" style="height: 70rpx;">
							<text class="iconfont icon-zanting"></text>
							<text class="ml-1">{{item.download}}%</text>
						</view>
						<!-- 进度条组件，uni-app自带的，无需引入。percent双属性绑定下载百分比数值 -->
						<progress slot="bottom" :percent="item.download" activeColor="#009CFF" :stroke-width="4"></progress>
					</f-list>
					<view class="p-2 border-bottom border-light-secondary font text-muted">
						下载完成{{item.length}}
					</view>
					<f-list v-for="(item ,index) in downed" :key="'d'+index" :item="item" :index="index" :showRight="false"></f-list>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
import fList from '@/components/common/f-list.vue'
	export default {
		data() {
			return {
				tabIndex: 0,
				tabBars: [
					{
						name: '下载列表'
					},
					{
						name: '上传列表'
					}
				],
				list: [
					{
						type: 'dir',
						name: '我的笔记',
						data:'https://avatars2.githubusercontent.com/u/55441045?s=400&v=4',
						create_time: '2020-10-21 08:00',
						download:100
					},
					{
						type: 'image',
						name: '风景.jpg',
						data: 'https://avatars2.githubusercontent.com/u/55441045?s=400&v=4',
						create_time: '2020-10-21 08:00',
						download:30
					},
					{
						type: 'video',
						name: 'uniapp实战教程.mp4',
						data:'https://aweme.snssdk.com/aweme/v1/playwm/?video_id=v0200fba0000bpo4s1b82vu9dp4ehlog&line=0',
						create_time: '2020-10-21 08:00',
						download:100
					},
					{
						type: 'text',
						name: '记事本.txt',
						data: 'https://avatars2.githubusercontent.com/u/55441045?s=400&v=4',
						create_time: '2020-10-21 08:00',
						download:60
					},
					{
						type: 'none',
						name: '压缩包.rar',
						data: 'https://avatars2.githubusercontent.com/u/55441045?s=400&v=4',
						create_time: '2020-10-21 08:00',
						download:70
					}
				],
			};
		},
		methods:{
			changeTab(index) {
				this.tabIndex = index
			}
		},
		components:{
			fList
		},
		computed:{
			downing() {
				return this.list.filter(item => {
					return item.download < 100;
				})
			},
			downed() {
				return this.list.filter(item => {
					return item.download === 100;
				})
			}
		}
	}
</script>

<style lang="scss">

</style>
