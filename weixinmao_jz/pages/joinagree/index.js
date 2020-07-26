var app = getApp();

Page({
    data: {
        isagree: 0
    },
    onLoad: function(a) {
        wx.setNavigationBarTitle({
            title: "协议入驻"
        }), app.util.request({
            url: "entry/wxapp/Intro",
            success: function(a) {
                a.data.message.errno || (wx.setStorageSync("companyinfo", a.data.data.intro), wx.setNavigationBarTitle({
                    title: wx.getStorageSync("companyinfo").name
                }), a.data.data.intro.maincolor || (a.data.data.intro.maincolor = "#09ba07"), wx.setNavigationBarColor({
                    frontColor: "#ffffff",
                    backgroundColor: a.data.data.intro.maincolor,
                    animation: {
                        duration: 400,
                        timingFunc: "easeIn"
                    }
                }));
            }
        });
    },
    doagree: function(a) {
        var n = a.detail.value;
        0 < n.length ? this.data.isagree = n[0] : this.data.isagree = 0, console.log(this.data.isagree);
    },
    Tojoinagree: function() {
        0 != this.data.isagree ? wx.navigateTo({
            url: "/weixinmao_jz/pages/switchrole/index"
        }) : wx.showModal({
            title: "提示",
            content: "请先同意家政入驻协议",
            showCancel: !1,
            success: function(a) {}
        });
    },
    onReady: function() {},
    goHousexy: function(a) {
        wx.navigateTo({
            url: "/weixinmao_jz/pages/housexy/index"
        });
    },
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});