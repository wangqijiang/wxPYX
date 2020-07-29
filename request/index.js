//同时法师异步代码的次数
let ajaxTime = 0;

export const request = (Params) => {
    ajaxTime++;
    //显示加载中效果
    wx.showLoading({
        title: '加载中',
        mask: true
    })


    //定义公共的url
    const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1";

    return new Promise((resolve, reject) => {
        wx.request({
            ...Params,
            url: baseUrl + Params.url,
            success: (result) => {
                resolve(result.data.message);
            },
            faile: (err) => {
                reject(err);
            },
            complete: () => {
                ajaxTime--;
                if (ajaxTime === 0) {
                    //关闭正在等待的图标
                    wx.hideLoading();
                }
            }
        });
    })
}