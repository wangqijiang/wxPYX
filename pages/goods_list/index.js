/*页面上滑  滚动条触底开始加载下一页
1找到滚动条触底事件onReachBottom
2判断是否还有下一页
    1总页数=Math.ceil(总条数/页容量 pagesize)
    2获取当前页码  pagenum
    3判断当前页码是否大于总页数
如果没有下一页 弹出一个提示
如果有 则加载下一页数据
    1当前页码++
    2重新发送请求
    3数据请求回来对data进行拼接，而不是替换


二下拉刷新事件
    1触发下拉刷新时间
    2充值数据数组
    3充值页码为1

*/
// pages/goods_list/index.js
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime.js';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabs: [{
                id: 0,
                value: "综合",
                isActive: true
            },
            {
                id: 1,
                value: "销量",
                isActive: false
            },
            {
                id: 2,
                value: "价格",
                isActive: false
            },
        ],
        goodsList: []

    },
    //接口要的参数
    QueryParams: {
        query: "",
        cid: "",
        pagenum: 1,
        pagesize: 10
    },
    //总页数
    totalPages: 1,
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.QueryParams.cid = options.cid;
        this.getGoodList();
    },

    async getGoodList() {
        const res = await request({ url: "/goods/search", data: this.QueryParams });

        const total = res.total;
        //计算总页数
        this.totalPages = Math.ceil(total / this.QueryParams.pagesize)
        this.setData({
                goodsList: [...this.data.goodsList, ...res.goods]
            })
            //关闭下拉刷新的窗口
        wx.stopPullDownRefresh();
    },

    //获取商品列表数据


    handleTabsItemChange(e) {
        //获取被点击的标题索引
        const { index } = e.detail;
        //获取总条数
        const total = res.total;
        this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
        console.log(this.totalPages);
        //修改数组
        let { tabs } = this.data;
        tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
        //复制到data中

        this.setData({
            tabs
        })
    },

    //页面上滑触底事件
    onReachBottom() {
        if (this.QueryParams.pagenum >= this.totalPages) {
            // console.log('没了');
            wx.showToast({
                title: '没有下一页数据了'
            });
        } else {
            this.QueryParams.pagenum++;
            this.getGoodList();
        }

    },
    //下拉刷新
    onPullDownRefresh() {
        //1重置数组
        this.setData({
                goodsList: []
            })
            // 重置页码
        this.QueryParams.pagenum = 1;
        //发送请求
        this.getGoodList();

    }

})