<template>
	<view>
		<!-- 自定义导航栏 -->
		<nav-bar>
			<template v-if="checkCount === 0">
				<text class="font-md ml-3" slot="left">首页</text>
				<template slot="right">
					<view style="width: 60rpx;height: 60rpx;" class="flex align-center justify-center bg-light rounded-circle mr-3"><text class="iconfont icon-hao"></text></view>
					<view class="flex align-center justify-center bg-light rounded-circle mr-3"><text class="iconfont icon-gengduo"></text></view>
				</template>
			</template>
			<template v-else>
				<view slot="left" class="font-md ml-3 text-primary" @click="handleCheckAll(false)">取消</view>
				<text class="font-md font-weight-bold">已选中{{ checkCount }}</text>
				<view slot="right" class="font-md ml-3 text-primary" @click="handleCheckAll(true)">全选</view>
			</template>
		</nav-bar>
		<!-- 搜索框 -->
		<view class="px-3 py-2">
			<view class="position-relative">
				<view style="height: 70rpx;width: 70rpx;position: absolute;top: 0;left: 0;" class="flex align-center justify-center text-light-muted">
					<text class="iconfont icon-search"></text>
				</view>
			</view>
			<input type="text" style="height: 70rpx;padding-left: 70rpx;" class="bg-light font-md rounded-circle" placeholder="搜索网盘文件" />
		</view>
		<f-list v-for="(item, index) in list" :key="index" :item="item" :index="index" @select="select"></f-list>
		
		<!-- 底部操作条 -->
		<!-- 选中个数大于0才会出现这个操作条 -->
		<view v-if="checkCount > 0">
			<!-- 这里留一定的高度，因为底部导航条需要被固定在底部，并空出底部tabbar高度的地方 -->
			<view style="height: 115rpx;">
				<!-- 操作条容器的样式，高度，颜色，固定在底部，垂直方向上拉伸效果 -->
				<view class="flex align-center bg-primary text-white fixed-bottom" style="height: 115rpx;">
					<!-- 根据元素个数等分容器，所以要么四等分，要么两等分，行高的修改可以让图标和文字之间的距离变得合理，点击还会变色 :hover-class -->
					<view class="flex-1 flex flex-column align-center justify-center" style="line-height: 1.5;"
					v-for="(item,index) in actions" :key="index" hover-class="bg-hover-primary">
						<text class="iconfont" :class="item.icon"></text>
						{{item.name}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import navBar from '@/components/common/nav-bar.vue';
import fList from '@/components/common/f-list.vue';
export default {
	data() {
		return {
			list: [
				{
					type: 'dir',
					name: '我的笔记',
					create_time: '2020-10-21 08:00',
					checked: false
				},
				{
					type: 'image',
					name: '风景.jpg',
					create_time: '2020-10-21 08:00',
					checked: false
				},
				{
					type: 'video',
					name: 'uniapp实战教程.mp4',
					create_time: '2020-10-21 08:00',
					checked: false
				},
				{
					type: 'text',
					name: '记事本.txt',
					create_time: '2020-10-21 08:00',
					checked: false
				},
				{
					type: 'none',
					name: '压缩包.rar',
					create_time: '2020-10-21 08:00',
					checked: false
				}
			]
		};
	},
	onLoad() {},
	methods: {
		select(e) {
			//接受到子组件传递过来的索引选中状态，将对应的list中的数据更新
			this.list[e.index].checked = e.value;
		},
		//全选、取消全选
		handleCheckAll(checked) {
			this.list.forEach(item => {
				item.checked = checked;
			});
		}
	},
	components: {
		navBar,
		fList
	},
	computed: {
		//选中列表
		checkList() {
			return this.list.filter(item => item.checked);
		},
		//选中数量
		checkCount() {
			return this.checkList.length;
		},
		//操作菜单
		actions() {
			if (this.checkCount > 1) {
				return [
					{
						icon: 'icon-xiazai',
						name: '下载'
					},
					{
						icon: 'icon-shanchu',
						name: '删除'
					}
				];
			}
			return [
				{
					icon: 'icon-xiazai',
					name: '下载'
				},
				{
					icon: 'icon-fenxiang',
					name: '分享'
				},
				{
					icon: 'icon-shanchu',
					name: '删除'
				},
				{
					icon: 'icon-chongmingming',
					name: '重命名'
				}
			];
		}
	}
}; 
</script>

<style></style>
