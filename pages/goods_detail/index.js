/*
点击轮播图 预览大图
    1给轮播图绑定点击事件
    2调用小程序的api  previewImage
*/

import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime.js';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodsObj: {

        }
    },
    //全局商品对象
    GoodsInfo: {},
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        const { goods_id } = options;
        this.getGoodsDetail(goods_id);
    },
    //获取商品详情数据
    async getGoodsDetail(goods_id) {
        const goodsObj = await request({ url: "/goods/detail", data: { goods_id } });
        this.GoodsInfo = goodsObj;
        this.setData({
            //优化Obj无用属性太多
            goodsObj: {
                goods_name: goodsObj.goods_name,
                goods_price: goodsObj.goods_price,
                goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
                pics: goodsObj.pics
            }
        })
    },
    //点击轮播图放大预览
    handlePrevewImage(e) {
        //构造要预览的图片数组
        const urls = this.GoodsInfo.pics.map(v => v.pics_mid)
            //接受传过来的参数  可以点击哪张就预览哪张
        const current = e.currentTarget.dataset.url;
        wx.previewImage({
            current: current,
            urls: urls,
        })
    },
    //点击加入购物车
    handleCartAdd() {
        //1获取缓存中的购物车数组
        let cart = wx.getStorageSync("cart") || [];
        //判断商品对象是否存在购物车数组中
        let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
        if (index === -1) {
            //不存在 第一次添加
            this.GoodsInfo.num = 1;
            this.GoodsInfo.checked = true;
            cart.push(this.GoodsInfo);
        } else {
            //已经存在购物车数据执行num++
            cart[index].num++;
        }
        //把购物车重新添加回缓存中
        wx.setStorageSync("cart", cart);
        //t弹窗提示
        wx.showToast({
            title: '加入成功',
            icon: 'success',
            //true防止用户手抖疯狂点击 1.5S之后才会加入
            mask: true
        });
    }
})