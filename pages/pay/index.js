/*
  1页面记载的时候
    从缓存中获取购物车数据 渲染到页面
      这些数据 checked =true

 */


import { getSetting, chooseAddress, openSetting, showModal, showToast } from "../../utils/asyncWx.js"
import regeneratorRuntime from '../../lib/runtime/runtime.js';

Page({
    data: {
        address: {},
        cart: [],
        totalPrice: 0,
        totalNum: 0
    },
    onShow() {
        //获取缓存中的收货地址信息
        const address = wx.getStorageSync("address");
        //获取缓存中的购物车数据
        let cart = wx.getStorageSync("cart") || [];

        //过滤后的购物车数组
        cart = cart.filter(v => v.checked);
        this.setData({ address });
        // 1总价格总数量
        let totalPrice = 0;
        let totalNum = 0;
        cart.forEach(v => {
            totalPrice += v.num * v.goods_price;
            totalNum += v.num
        });


        this.setData({
            cart,
            totalPrice,
            totalNum,

            address
        });
    },

    //设置购物车状态同时重新计算底部工具栏的数据 



})