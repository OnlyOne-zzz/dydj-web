var app = getApp();

Page({
    data: {},
    onLoad: function(n) {
        var a = this;
        wx.setNavigationBarTitle({
            title: "我的账户"
        });
        var o = wx.getStorageSync("userInfo");
        app.util.request({
            url: "entry/wxapp/getusermoney",
            data: {
                sessionid: o.sessionid,
                uid: o.memberInfo.uid
            },
            success: function(n) {
                n.data.data.intro.maincolor || (n.data.data.intro.maincolor = "#09ba07"), wx.setNavigationBarColor({
                    frontColor: "#ffffff",
                    backgroundColor: n.data.data.intro.maincolor,
                    animation: {
                        duration: 400,
                        timingFunc: "easeIn"
                    }
                }), n.data.message.errno || a.setData({
                    moneyinfo: n.data.data.moneyinfo
                });
            }
        });
    },
    toMymoney: function() {
        var n = wx.getStorageSync("userInfo");
        app.util.request({
            url: "entry/wxapp/checkbindcard",
            data: {
                sessionid: n.sessionid,
                uid: n.memberInfo.uid
            },
            success: function(n) {
                n.data.message.errno || (1 == n.data.data.error ? wx.navigateTo({
                    url: "/weixinmao_jz/pages/bindcard/index"
                }) : wx.navigateTo({
                    url: "/weixinmao_jz/pages/myusermoney/index"
                }));
            }
        });
    },
    toMymoneyrecord: function() {
        wx.navigateTo({
            url: "/weixinmao_jz/pages/domoney/index"
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});