var app = getApp();

Page({
    data: {
        id: 0,
        mycouponlist: [],
        totalmoney: 0,
        couponid: 0
    },
    onLoad: function(a) {
        var n = this;
        if (wx.setNavigationBarTitle({
            title: "支付保证金"
        }), 0 < n.data.id) n.data.id; else {
            a.id;
            n.data.id = a.id;
        }
        var t = wx.getStorageSync("userInfo");
        app.util.request({
            url: "entry/wxapp/getcompanyrole",
            data: {
                sessionid: t.sessionid,
                uid: t.memberInfo.uid
            },
            success: function(a) {
                a.data.message.errno || (a.data.data.intro.maincolor || (a.data.data.intro.maincolor = "#09ba07"), 
                wx.setNavigationBarColor({
                    frontColor: "#ffffff",
                    backgroundColor: a.data.data.intro.maincolor,
                    animation: {
                        duration: 400,
                        timingFunc: "easeIn"
                    }
                }), n.setData({
                    companyrole: a.data.data.companyrole
                }));
            }
        });
    },
    paymoney: function(a) {
        var n = a.currentTarget.dataset.id, t = wx.getStorageSync("userInfo");
        wx.showModal({
            title: "支付保证金",
            content: "是否确认支付保证金？",
            success: function(a) {
                a.confirm && app.util.request({
                    url: "entry/wxapp/paycompanyrole",
                    data: {
                        id: n,
                        sessionid: t.sessionid,
                        uid: t.memberInfo.uid
                    },
                    success: function(a) {
                        a.data && a.data.data && wx.requestPayment({
                            timeStamp: a.data.data.timeStamp,
                            nonceStr: a.data.data.nonceStr,
                            package: a.data.data.package,
                            signType: "MD5",
                            paySign: a.data.data.paySign,
                            success: function(a) {
                                wx.showModal({
                                    title: "提示",
                                    content: "支付成功，我们将在1-2工作审核！",
                                    showCancel: !1,
                                    success: function() {
                                        wx.navigateTo({
                                            url: "/weixinmao_jz/pages/login/index"
                                        });
                                    }
                                });
                            },
                            fail: function(a) {}
                        });
                    },
                    fail: function(a) {
                        console.log(a);
                    }
                });
            }
        });
    },
    toMymoneyrecord: function() {
        wx.navigateTo({
            url: "/weixinmao_zp/pages/mymoneyrecord/index"
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