<template>
	<view>
		<!-- 自定义导航栏 -->
		<nav-bar>
			<template v-if="checkCount === 0">
				<text class="font-md ml-3" slot="left">首页</text>
				<template slot="left">
					<view style="width: 60rpx;height: 60rpx;" @tap="backUp" v-if="current" class="flex align-center justify-center bg-light rounded-circle mr-3">
						<text class="iconfont icon-hao"></text>
					</view>
					<view class="flex align-center justify-center bg-light rounded-circle mr-3" @click="openSortDialog"><text class="iconfont icon-gengduo"></text></view>
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
			<input type="text" style="height: 70rpx;padding-left: 70rpx;" @input="search" class="bg-light font-md rounded-circle" placeholder="搜索网盘文件" />
		</view>
		<f-list v-for="(item, index) in list" :key="index" @click="doEvent(item)" :item="item" :index="index" @select="select"></f-list>

		<!-- 底部操作条 -->
		<!-- 选中个数大于0才会出现这个操作条 -->
		<view v-if="checkCount > 0">
			<!-- 这里留一定的高度，因为底部导航条需要被固定在底部，并空出底部tabbar高度的地方 -->
			<view style="height: 115rpx;">
				<!-- 操作条容器的样式，高度，颜色，固定在底部，垂直方向上拉伸效果 -->
				<view class="flex align-center bg-primary text-white fixed-bottom" style="height: 115rpx;">
					<!-- 根据元素个数等分容器，所以要么四等分，要么两等分，行高的修改可以让图标和文字之间的距离变得合理，点击还会变色 :hover-class -->
					<view
						class="flex-1 flex flex-column align-center justify-center"
						style="line-height: 1.5;"
						v-for="(item, index) in actions"
						:key="index"
						hover-class="bg-hover-primary"
						@click="handleBottomEvent(item)"
					>
						<text class="iconfont" :class="item.icon"></text>
						{{ item.name }}
					</view>
				</view>
			</view>
		</view>
		<!-- 是否需要删除，通过ref指定为delete对话框 -->
		<f-dialog ref="delete">是否删除选中的文件？</f-dialog>
		<!-- 重命名，通过ref定义不同的对话框对象，不同操作弹出的dialog是不同的对象 -->
		<f-dialog ref="rename"><input type="text" v-model="renameValue" class="flex-1 bg-light rounded px-2" style="height: 95rpx;" placeholder="重命名" /></f-dialog>
		<!-- 添加操作条，type表示弹出的未知类型，具体取值都在popup子组件中 -->
		<uni-popup ref="add" type="bottom">
			<view class="bg-white flex" style="height: 200rpx;">
				<!-- 遍历addList数组，为每个操作分配等高的空间，每个操作有图标和名称组成 -->
				<view class="flex-1 flex align-center justify-center flex-column" hover-class="bg-light" v-for="(item, index) in addList" :key="index" @tap="handleAddEvent(item)">
					<!-- 每个操作的图标，可以传入图标的名称和颜色，很灵活 -->
					<text
						style="width: 110rpx;height: 110rpx;"
						class="rounded-circle bg-white iconfont flex align-center justify-center"
						:class="item.icon + ' ' + item.color"
					></text>
					<!-- 每个操作的名称 -->
					<text class="font text-muted">{{ item.name }}</text>
				</view>
			</view>
		</uni-popup>

		<!-- 新建文件夹，使用自定义弹出层，使用input作为插槽，绑定data中的newdirname变量 -->
		<f-dialog ref="newdir"><input type="text" v-model="newdirname" class="flex-1 bg-light rounded px-2" style="height: 95rpx;" placeholder="新建文件夹名称" /></f-dialog>
		<!-- 排序框，底部弹出，便利排序操作数组，为当前索引绑定文字蓝色样式 -->
		<uni-popup ref="sort" type="bottom">
			<view class="bg-white">
				<view
					class="flex align-center justify-center py-3 font border-bottom border-light-secondary"
					v-for="(item, index) in sortOptions"
					:key="index"
					:class="index === sortIndex ? 'text-main' : 'text-dark'"
					hover-class="bg-light"
					@click="changeSort(index)"
				>
					{{ item.name }}
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import navBar from '@/components/common/nav-bar.vue';
import fList from '@/components/common/f-list.vue';
import fDialog from '@/components/common/f-dialog.vue';
import uniPopup from '@/components/uni-ui/uni-popup/uni-popup.vue';
export default {
	data() {
		return {
			dirs: [],
			sortIndex: 0,
			sortOptions: [
				{
					name: '按名称排序',
					key: 'name'
				},
				{
					name: '按时间排序',
					key: 'created_time'
				}
			],
			newdirname: '',
			renameValue: '',
			list: [],
			// list: [
			// 	{
			// 		type: 'dir',
			// 		name: '我的笔记',
			// 		create_time: '2020-10-21 08:00',
			// 		checked: false
			// 	},
			// 	{
			// 		type: 'image',
			// 		name: '风景.jpg',
			// 		data: 'https://avatars2.githubusercontent.com/u/55441045?s=400&v=4',
			// 		checked: false
			// 	},
			// 	{
			// 		type: 'video',
			// 		name: 'uniapp实战教程.mp4',
			// 		data:'https://aweme.snssdk.com/aweme/v1/playwm/?video_id=v0200fba0000bpo4s1b82vu9dp4ehlog&line=0',
			// 		create_time: '2020-10-21 08:00',
			// 		checked: false
			// 	},
			// 	{
			// 		type: 'text',
			// 		name: '记事本.txt',
			// 		create_time: '2020-10-21 08:00',
			// 		checked: false
			// 	},
			// 	{
			// 		type: 'none',
			// 		name: '压缩包.rar',
			// 		create_time: '2020-10-21 08:00',
			// 		checked: false
			// 	}
			// ],
			addList: [
				{
					icon: 'icon-shangchuantupian',
					color: 'text-success',
					name: '上传图片'
				},
				{
					icon: 'icon-shangchuanshipin',
					color: 'text-primary',
					name: '上传视频'
				},
				{
					icon: 'icon-shangchuanwenjian',
					color: 'text-muted',
					name: '上传文件'
				},
				{
					icon: 'icon-xinjianwenjianjia',
					color: 'text-warning',
					name: '新建文件夹'
				}
			]
		};
	},
	onLoad() {
		// uni.request({
		// 	url: 'http://127.0.0.1:7001/list',
		// 	method: 'GET',
		// 	success: res => {
		// 		console.log(res.data);
		// 	}
		// });
		let dirs = uni.getStorageSync('dirs');
		if (dirs) {
			this.dirs = JSON.parse(dirs);
		}
		this.getData();
	},
	methods: {
		// 搜索功能，关键字为空就走请求所有数据的接口，否则就将文本框实时输入的内容作为关键字进行搜索
		search(e) {
			if (e.detail.value == '') {
				return this.getData();
			}
			this.$H
				.get('/file/search?keyword=' + e.detail.value, {
					token: true
				})
				.then(res => {
					this.list = this.formatList(res.rows);
				});
		},
		select(e) {
			//接受到子组件传递过来的索引选中状态，将对应的list中的数据更新
			this.list[e.index].checked = e.value;
		},
		//全选、取消全选
		handleCheckAll(checked) {
			this.list.forEach(item => {
				item.checked = checked;
			});
		},
		// 处理底部操作条事件，这里仅对“删除”做了处理
		handleBottomEvent(item) {
			switch (item.name) {
				case '删除':
					this.$refs.delete.open(close => {
						// 加载框过渡
						uni.showLoading({
							title: '删除中',
							mask: false
						});
						// 删除接口需要传“1,2,3”这样的参数形式，所以用map取出checkList中内条数据的id，然后用join拼接上逗号
						let ids = this.checkList.map(item => item.id).join(',');
						this.$H.post('/file/delete', { ids }, { token: true }).then(res => {
							// 重新请求下数据
							this.getData();
							uni.showToast({
								title: '删除成功',
								icon: 'none'
							});
							// 结束loading
							uni.hideLoading();
						});
						close();
					});
					break;
				case '重命名':
					// 重命名只能对单个文件进行，所以取thi.checkList[0]，也就是选中的唯一元素
					this.renameValue = this.checkList[0].name;
					this.$refs.rename.open(close => {
						if (this.renameValue == '') {
							return uni.showToast({
								title: '文件名称不能为空',
								icon: 'none'
							});
						}
						console.log(this.checkList[0].id + '>>>>>>>' + this.file_id);
						// 重命名接口需要三个参数，自身id，目录id，新名称
						this.$H.post('/file/rename', { id: this.checkList[0].id, file_id: this.file_id, name: this.renameValue }, { token: true }).then(res => {
							// 更新该元素的name值，实时看到效果
							this.checkList[0].name = this.renameValue;
							uni.showToast({
								title: '重命名成功',
								icon: 'none'
							});
						});
						close();
					});
					break;
				case '下载':
					this.download();
					break;
				case '分享':
					this.share();
					this.handleCheckAll(false);
					break;
				default:
					break;
			}
		},
		// 处理添加操作条的各种事件
		handleAddEvent(item) {
			this.$refs.add.close();
			switch (item.name) {
				case '上传图片':
					// 选择图片，限数为9张
					uni.chooseImage({
						count: 9,
						success: res => {
							// 选择图片成功，就循环异步调用上传接口
							res.tempFiles.forEach(item => {
								this.upload(item, 'image');
							});
						}
					});
					break;
				case '新建文件夹':
					this.$refs.newdir.open(close => {
						if (this.newdirname == '') {
							return uni.showToast({
								title: '文件夹名称不能为空',
								icon: 'none'
							});
						}
						//请求新增文件夹接口
						this.$H
							.post(
								'/file/createdir',
								{
									file_id: this.file_id,
									name: this.newdirname
								},
								{
									token: true
								}
							)
							.then(res => {
								this.getData();
								uni.showToast({
									title: '新增文件夹成功',
									icon: 'none'
								});
							});
						close();
						this.newdirname = '';
					});
					break;
				default:
					break;
			}
		},
		openAddDialog() {
			this.$refs.add.open();
		},
		//
		doEvent(item) {
			// 列表点击事件
			switch (item.type) {
				case 'image':
					let images = this.list.filter(item => {
						return item.type === 'image';
					});
					//预览图片
					uni.previewImage({
						current: item.url,
						urls: images.map(item => item.url)
					});
					break;
				case 'video':
					uni.navigateTo({
						url: '../video/video?url=' + item.url + '&title=' + item.name
					});
					break;
				default:
					this.dirs.push({
						id: item.id,
						name: item.name
					});
					this.getData();
					uni.setStorage({
						key: 'dirs',
						data: JSON.stringify(this.dirs)
					});
					break;
			}
		},
		// 将数据格式化为我们需要显示的样子，不同的文件类型，是否选中
		formatList(list) {
			return list.map(item => {
				let type = 'none';
				if (item.isdir === 1) {
					type = 'dir';
				} else {
					type = item.ext.split('/'[0] || 'none');
				}
				return {
					type,
					checked: false,
					...item
				};
			});
		},
		getData() {
			console.log(this.file_id + '>>>>>>>>>>>>>>>>');
			let orderby = this.sortOptions[this.sortIndex].key;
			console.log(orderby + '&&&&&&&&&&&&');
			this.$H
				.get(`/file?file_id=${this.file_id}&orderby=${orderby}`, {
					token: true
				})
				.then(res => {
					this.list = this.formatList(res.rows);
				});
		},
		// 切换排序
		changeSort(index) {
			// this.sortIndex = index;
			// this.$refs.sort.close();
			this.sortIndex = index;
			this.getData();
			this.$refs.sort.close();
		},
		openSortDialog() {
			this.$refs.sort.open();
		},
		// 返回上一个目录
		backUp() {
			this.dirs.pop();
			this.getData();
			uni.setStorage({
				key: 'dirs',
				data: JSON.stringify(this.dirs)
			});
		},
		// 生成唯一id
		getID(length) {
			return Number(
				Math.random()
					.toString()
					.substr(3, length) + Date.now()
			).toString(36);
		},
		upload(file,type){
			// 上传文件的类型
			let t = type;
			// 上传的key用来区分每个文件
			const key = this.getID(8);
			// 构建上传文件的对象，文件名，类型，大小，唯一的key，进度，状态，创建时间
			let obj = {
				name: file.name,
				type: t,
				size:file.size,
				key,
				progress:0,
				status:true,
				created_time:new Date().getTime()
			};
			// 创建上传任务,分发给Vuex的Actions，异步上传调度，主要是实现上传进度的回调
			this.$store.dispatch('createUploadJob',obj);
			// 上传，查询参数为当前位置所在目录的id，body参数为文件路径
			this.$H.upload('/upload?file_id='+this.file_id,{filePath:file.path},
			p => {
				// 更新上传任务进度
				this.$store.dispatch('updateUploadJob',{
					status:true,
					progress:p,
					key
				});
			}).then(res => {
				// 上传成功，请求数据更新列表
				this.getData();
			})

		},
		download(){
			this.checkList.forEach(item => {
				if(item.isdir === 0) {
					const key = this.getID(8);

			// 构建上传文件的对象，文件名，类型，大小，唯一的key，进度，状态，创建时间
			let obj = {
				name: item.name,
				type: item,type,
				size: item.size,
				key,
				progress:0,
				status:true,
				created_time:new Date().getTime()
			};
			// 创建上传任务,分发给Vuex的Actions，异步上传调度，主要是实现上传进度的回调
			this.$store.dispatch('createDownLoadJob',obj);
			let url = item.url;
			let d = uni.downloadFile({
				url,
				success: res => {
					if(res.statusCode === 200) {
						console.log('下载成功',res);
						uni.saveFile({
							tempFilePath:item.tempFilePath
						});
					}
				}
			});
			d.onProgressUpdate(res => {
				this.$store.dispatch('updateDownLoadJob',{
					status:true,
					progress:res.progress,
					key
				});
				});
				}
			});
			uni.showToast({
				title:'已加入下载任务',
				icon:'none'
			});
			this.handleCheckAll(false);
	},
	share(){
		this.$H.post(
		'/share/create',
		{
			file_id:this.checkList[0].id
		},
		{token:true}).then(res => {
			uni.showModal({
				content:res,
				showCancel:false,
				success: result => {
					// #ifndef H5
					uni.setClipboardData({
						data:res,
						success: () => {
							uni.showToast({
								title:'复制成功',
								icon:'none'
							});
						}
					});
					// #endif
				}
			});
		});
	}
},
	components: {
		navBar,
		fList,
		fDialog,
		uniPopup
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
		},
		file_id() {
			let l = this.dirs.length;
			if (l === 0) {
				return 0;
			}
			return this.dirs[l - 1].id;
		},
		current() {
			let l = this.dirs.length;
			if (l === 0) {
				return false;
			}
			return this.dirs[l - 1];
		}
	}
};
</script>

<style></style>
