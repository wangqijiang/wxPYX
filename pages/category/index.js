import { request } from "../../request/index.js";

import regeneratorRuntime from '../../lib/runtime/runtime.js';
// pages/category/index.js

Page({

    /**
     * 页面的初始数据
     */
    data: {
        //左侧的菜单数据
        leftMenuList: [],
        //右侧的商品数据
        rightContent: [],
        //被点击的菜单
        currentIndex: 0,
        //滚动条距离顶部的距离
        scrollTop: 0
    },
    //接口的返回数据
    Cates: [],
    onLoad: function(options) {

        /*
        web中存储和获取的方式是   localStorage.setItem("key","value")   localStorage.getItem("key")
       小程序中是：wx.setStorageSync("key","value")    wx.getStorageSync("key")


        */
        const Cates = wx.getStorageSync("cates");
        if (!Cates) {
            //不存在这个本地数据则发送请求获取数据
            this.getCates();
        } else {
            //有旧数据  定义过期时间  10s改成五分钟
            if (Date.now() - Cates.time > 1000 * 10) {
                //重新发送
                this.getCates();
            } else {
                //使用旧数据
                this.Cates = Cates.data;
                //构造左侧的大菜单数据
                let leftMenuList = this.Cates.map(v => v.cat_name);
                //构造右侧的大菜单数据
                let rightContent = this.Cates[0].children;
                this.setData({
                    leftMenuList,
                    rightContent
                })

            }

        }
    },
    //获取分类的数据
    async getCates() {
        // request({
        //         url: "/categories"
        //     })
        //     .then(res => {
        //         this.Cates = res.data.message;
        //         //吧接口的数据存入本地存储中
        //         wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });


        //         //构造左侧的大菜单数据
        //         let leftMenuList = this.Cates.map(v => v.cat_name);
        //         //构造右侧的大菜单数据
        //         let rightContent = this.Cates[0].children;
        //         this.setData({
        //             leftMenuList,
        //             rightContent
        //         })
        //     })
        //使用es7语法
        const res = await request({ url: "/categories" });
        // this.Cates = res.data.message;
        this.Cates = res;
        //吧接口的数据存入本地存储中
        wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });


        //构造左侧的大菜单数据
        let leftMenuList = this.Cates.map(v => v.cat_name);
        //构造右侧的大菜单数据
        let rightContent = this.Cates[0].children;
        this.setData({
            leftMenuList,
            rightContent
        })
    },
    handleItemTap(e) {
        /* 获取标题上的索引  然后给他赋值
        根据不同的所有渲染右侧的商品内容
        */
        const { index } = e.currentTarget.dataset;
        let rightContent = this.Cates[index].children;

        this.setData({
            currentIndex: index,
            rightContent,
            //重新设置右侧内容的滚动条距离顶部的距离
            scrollTop: 0
        })

    }
})