<template>
	<view>
		<!-- 使用自定义的搜索组件 -->
		<view class="search-box">
		  <my-search @click="gotoSearch"></my-search>
		</view>
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<swiper-item v-for="(item,i) in swiperList" :key="i">
				<navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id='+item.goods_id">
					<image :src="item.image_src"></image>
				</navigator>
			</swiper-item>

		</swiper>


		<view class="nav-list">
			<view class="nav-item" v-for="(item,index) in navList" :key="index" @click="navClickHandle(item)">
				<image :src="item.image_src" class="nav-img">
			</view>
		</view>

		<!-- 楼层区域 -->
		<view class="floor-list">
			<!-- 楼层 item 项 -->
			<view class="floor-item" v-for="(item, i) in floorList" :key="i">
				<!-- 楼层标题 -->
				<image :src="item.floor_title.image_src" class="floor-title"></image>
				<!-- 楼层图片区域 -->
				<view class="floor-img-box">
					<!-- 左侧大图片的盒子 -->
					<navigator class="left-img-box" :url="item.product_list[0].url">
						<image :src="item.product_list[0].image_src" :style="{width:
			item.product_list[0].image_width + 'rpx'}" mode="widthFix"></image>
					</navigator>
					<!-- 右侧 4 个小图片的盒子 -->
					<view class="right-img-box">
						<navigator class="right-img-item" v-for="(item2, i2) in item.product_list" :key="i2" v-if="i2 !== 0" :url="item2.url">
							<image :src="item2.image_src" mode="widthFix" :style="{width:
			item2.image_width + 'rpx'}"></image>
						</navigator>
					</view>
				</view>

			</view>
		</view>
	</view>

</template>

<script>
	// 导入自己封装的 mixin 模块
	import badgeMix from '@/mixins/tabbar-badge.js'
	export default {
		 // 将 badgeMix 混入到当前的页面中进行使用
		  mixins: [badgeMix],
		data() {
			return {
				swiperList: [],
				navList: [],
				floorList: []
			}
		},
		onLoad() {
			this.getSwiperList()
			this.getNavList()
			this.getFloorList()
		},
		methods: {
			async getSwiperList() {
				const {
					data: {
						message,
						meta
					}
				} = await uni.$http.get('/api/public/v1/home/swiperdata')
				if (meta.status !== 200) {
					return uni.$showMsg()
				}
				this.swiperList = message
			},
			async getNavList() {
				const {
					data: {
						meta,
						message
					}
				} = await uni.$http.get('/api/public/v1/home/catitems')
				if (meta.status !== 200) {
					return uni.$showMsg()
				}
				this.navList = message
			},
			navClickHandle(item) {
				if (item.name === '分类') {
					uni.switchTab({
						url: '/pages/cate/cate'
					})
				}
			},

			// 3. 定义获取楼层列表数据的方法
			async getFloorList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/home/floordata')
				if (res.meta.status !== 200) return uni.$showMsg()
				// 通过双层 forEach 循环，处理 URL 地址
				res.message.forEach(floor => {
					floor.product_list.forEach(prod => {
						prod.url = '/subpkg/goods_list/goods_list?' +
							prod.navigator_url.split('?')[1]
					})
				})

				this.floorList = res.message
			},
			gotoSearch() {
			  uni.navigateTo({
			    url: '/subpkg/search/search'
			  })
			}

		}
	}
</script>

<style lang="scss">
	swiper {
		height: 300rpx;
// display: block;
		.swiper-item,
		image {
			width: 100%;
			height: 100%;

		}
	}

	.nav-list {
		display: flex;
		justify-content: space-around;
		margin: 15rpx 0;

		.nav-item {
			image {
				width: 128rpx;
				height: 140rpx;
			}
		}
	}

	.floor-title {
		height: 60rpx;
		width: 100%;
		display: flex;
	}

	.floor-img-box {
		display: flex;
		padding-left: 10rpx;
	}

	.right-img-box {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
	}
	.search-box {
	  // 设置定位效果为“吸顶”
	  position: sticky;
	  // 吸顶的“位置”
	  top: 0;
	  // 提高层级，防止被轮播图覆盖
	  z-index: 999;
	}
</style>
