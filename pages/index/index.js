import { request } from "../../request/index.js";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //轮播图数组
        swiperList: [],
        //导航数组
        catesList: [],
        //楼层数组
        floorList: []
    },
    //页面加载就会出发
    onLoad: function(options) {
        //发送异步请求获取轮播图
        // wx.request({
        // url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
        // success:(result) =>{
        //   this.setData({
        //     swiperList:result.data.message
        //   })
        // }

        // })
        request({ url: "/home/swiperdata" })
            .then(result => {
                this.setData({
                    swiperList: result.data.message
                })
            })

        this.getSWiperList();
        this.getCatesList();
        this.getFloorList();
    },


    //获取轮播图数据

    getSWiperList() {
        request({ url: "/home/swiperdata" })
            .then(result => {
                this.setData({
                    swiperList: result
                })
            })
    },
    getCatesList() {
        request({ url: "/home/catitems" })
            .then(result => {
                this.setData({
                    catesList: result
                })
            })
    },
    getFloorList() {
        request({ url: "/home/floordata" })
            .then(result => {
                this.setData({
                    floorList: result
                })
            })
    },

})