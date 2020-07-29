// pages/cart/index.js
/*
1绑定点击事件
2调用小程序内置api 获取用户的收货地址


获取用户对小程序所授予的获取地址的权限状态scope
  1同意获取地址  scope为true
  2不同意获取地址  scope为fales.
    1诱导用户自己打开授权设置页面重新给权限openSetting
  3没有调用过  scope为undefined



  吧获取到的收货地址存入到本地存储中


页面加载完毕后的事情
  0 onload onShow
  1获取本地存储中的地址数据 
  2把数据设置给data的一个变量


onShow
    获取缓存中的购物车数组
    把购物车数据填充到data中


全选的实现数据的展示
    onshow获取缓存中的购物车数组
    根据购物车的的商品数据所有的商品被选中 checked=true 全选就被选中


总价格和总数量
    1需要商品被选中才计算
    2获取购物车数组
    3遍历
    4判断商品是否被选中
    5总价格 +=商品的单价*商品的数量
    5总数量+=商品的数量
    6把计算后的价格数量设置会data



商品的选中功能
    1绑定change事件
    2获取到被修改的商品对象
    3商品对象的选中状态 取反
    4重新填充回data中和缓存中
    5重新计算全选 总价格 总数量


全选和反选
    全选的复选框绑定事件
    获取data中的全选变量allChecked
    取反allChecked=！allChecked
    遍历购物车数组让里面商品的状态跟随allChecked改变而改变
    把购物车数组和allChecked重新设置回data把购物车重新设置回缓存中



商品数量的编辑
+和-按钮绑定同一个点击事件 

传递被点击的商品ID  goods-id
获取data中购物车数组  来获取需要被修改的商品对象
当购物车数量=1同事用户点击-
    弹窗提示(showModal)询问是否删除
    确定直接执行删除
    取消什么都不做
直接修改商品对象的数量num
吧cart数组重新设置回缓存中和data中this.setCart




结算信息
    1判断是否有收货地址和商品信息
    2结算

*/


import { getSetting, chooseAddress, openSetting, showModal, showToast } from "../../utils/asyncWx.js"
import regeneratorRuntime from '../../lib/runtime/runtime.js';

Page({
    data: {
        address: {},
        cart: [],
        allChecked: false,
        totalPrice: 0,
        totalNum: 0
    },
    onShow() {
        //获取缓存中的收货地址信息
        const address = wx.getStorageSync("address");
        //获取缓存中的购物车数据
        const cart = wx.getStorageSync("cart") || [];
        this.setData({ address });
        this.setCart(cart);
    },

    //点击收货地址
    async handleChooseAddress() {
        //获取收货地址
        // wx.getSetting({
        //     success: (result) => {
        //         // 获取权限状态
        //         const scopeAddress = result.authSetting["scope.address"]
        //         if (scopeAddress === true || scopeAddress === undefined) {
        //             wx.chooseAddress({
        //                 success: (result1) => {
        //                     console.log(result1);
        //                 }
        //             });
        //         } else {
        //             wx.openSetting({
        //                 success: (result2) => {
        //                     // 调用收货地址代码
        //                     wx.chooseAddress({
        //                         success: (result3) => {

        //                         },
        //                     });
        //                 },
        //                 fail: () => {},
        //                 complete: () => {}
        //             });
        //         }
        //     },
        //     fail: () => {},
        //     complete: () => {}
        // });

        try {
            //获取权限状态
            const res1 = await getSetting();
            const scopeAddress = res1.authSetting["scope.address"];
            //判断权限状态
            if (scopeAddress === false) {
                //诱导用户打开授权页面
                await openSetting();
            }
            //调用收货地址的api
            const address = await chooseAddress();
            //存入缓存中
            wx.setStorageSync("address", address);
        } catch (error) {
            console.log(error);
        }
    },
    //商品的选中
    handelItemChange(e) {
        //获取被修改的商品ID
        const goods_id = e.currentTarget.dataset.id;
        //获取购物车数组
        let { cart } = this.data;
        //找到被修改的商品对象
        let index = cart.findIndex(v => v.goods_id === goods_id);
        //选中状态取反
        cart[index].checked = !cart[index].checked;

        this.setCart(cart);
        //把购物车数据重新设置回data中和缓存中

    },
    //设置购物车状态同时重新计算底部工具栏的数据 

    setCart(cart) {


        let allChecked = true;
        // 1总价格总数量
        let totalPrice = 0;
        let totalNum = 0;
        cart.forEach(v => {
            if (v.checked) {
                totalPrice += v.num * v.goods_price;
                totalNum += v.num
            } else {
                allChecked = false
            }
        });

        //判断数组是否为空
        allChecked = cart.length != 0 ? allChecked : false;
        this.setData({
            cart,
            totalPrice,
            totalNum,
            allChecked
        });
        wx.setStorageSync("cart", cart);
    },


    //商品全选功能
    handleItemAllCheck() {
        //获取data中的数据
        let { cart, allChecked } = this.data
            //修改值
        allChecked = !allChecked;
        //循环修改cart数组 中的商品选中状态
        cart.forEach(v => v.checked = allChecked);
        //修改后的值填充会data或者缓存中
        this.setCart(cart);
    },

    //商品数量编辑功能
    async handelItemNumEdit(e) {
        //获取传递过来的参数
        const { operation, id } = e.currentTarget.dataset;
        //获取购物车数组
        let { cart } = this.data;
        //找到需要修改的商品的索引
        const index = cart.findIndex(v => v.goods_id === id);
        //判断是否要执行
        if (cart[index].num === 1 && operation === -1) {
            //弹窗提示
            const res = await showModal({ content: "您是否要删除？" });
            if (res.confirm) {
                cart.splice(index, 1);
                this.setCart(cart);
            } else {
                //进行修改数量
                cart[index].num += operation;
                //设置回缓存中
                this.setCart(cart);
            }
        }

    },


    //点击结算、
    async handelPay() {
        //判断收货地址
        const { address, totalNum } = this.data;
        if (!address.userName) {
            await showToast({ title: "你还没有选择收货地址" });
            return;
        }
        //判断是否选购商品
        if (totalNum === 0) {
            await showToast({ title: "你还没有选购商品" });
            return;
        }
        //跳转到支付页面
        wx.navigateTo({
            url: '/pages/pay/index'
        });
    }
})