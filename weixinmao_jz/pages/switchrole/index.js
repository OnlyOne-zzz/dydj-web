var app = getApp();

Page({
    data: {},
    onLoad: function(n) {
        wx.setNavigationBarTitle({
            title: "选择类型"
        }), app.util.request({
            url: "entry/wxapp/Intro",
            success: function(n) {
                n.data.message.errno || (wx.setStorageSync("companyinfo", n.data.data.intro), wx.setNavigationBarTitle({
                    title: wx.getStorageSync("companyinfo").name
                }), n.data.data.intro.maincolor || (n.data.data.intro.maincolor = "#09ba07"), wx.setNavigationBarColor({
                    frontColor: "#ffffff",
                    backgroundColor: n.data.data.intro.maincolor,
                    animation: {
                        duration: 400,
                        timingFunc: "easeIn"
                    }
                }));
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    toPersonreg: function() {
        wx.navigateTo({
            url: "/weixinmao_jz/pages/mynote/index"
        });
    },
    toCompanyreg: function() {
        wx.navigateTo({
            url: "/weixinmao_jz/pages/mycompanynote/index"
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});