<script>
	export default {
		onLaunch: function() {
			console.log('App Launch');
			// console.log(this.$store.state.test);
			//初始化用户信息
			this.$store.dispatch('initUser')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/* 引入官方样式库 */
	@import url('/common/uni.css');
	/* 引入本项目公共样式库 */
	@import url('/common/common.css');
	/* 引入通用free样式库 */
	@import url('/common/free.css');
	@import url('/common/iconfont.css');
</style>
