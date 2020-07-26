var R_htmlToWxml = require("../../resource/js/htmlToWxml.js"), imageUtil = require("../../resource/js/images.js"), app = getApp();

Page({
    data: {
        id: 1,
        ordertype: 0
    },
    onShow: function(e) {
        var a = this;
        wx.setNavigationBarTitle({
            title: "我的订单"
        });
        var t = wx.getStorageSync("userInfo");
        console.log(t), t.sessionid ? a.InitPage() : app.util.getUserInfo(function() {
            a.InitPage();
        });
    },
    InitPage: function() {
        var a = this, e = wx.getStorageSync("userInfo"), t = a.data.ordertype;
        app.util.request({
            url: "entry/wxapp/myorderlist",
            data: {
                ordertype: t,
                sessionid: e.sessionid,
                uid: e.memberInfo.uid
            },
            success: function(e) {
                e.data.message.errno || (e.data.data.intro.maincolor || (e.data.data.intro.maincolor = "#09ba07"), 
                wx.setNavigationBarColor({
                    frontColor: "#ffffff",
                    backgroundColor: e.data.data.intro.maincolor,
                    animation: {
                        duration: 400,
                        timingFunc: "easeIn"
                    }
                }), a.setData({
                    list: e.data.data.list,
                    ordertype: t,
                    intro: e.data.data.intro,
                    isshow: !1
                }));
            },
            complete: function() {
                wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
            }
        });
    },
    onReady: function() {},
    setcomment: function(e) {
        var a = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/weixinmao_jz/pages/setcomment/index?orderid=" + a
        });
    },
    toOrderProcess: function(e) {
        var a = e.currentTarget.dataset.id, t = wx.getStorageSync("userInfo");
        app.util.request({
            url: "entry/wxapp/CheckOrderProcess",
            data: {
                id: a,
                sessionid: t.sessionid,
                uid: t.memberInfo.uid
            },
            success: function(e) {
                if (!e.data.message.errno) {
                    var a = e.data.data.orderid, t = e.data.data.status;
                    console.log(t), 0 == t ? wx.navigateTo({
                        url: "/weixinmao_jz/pages/done/index?orderid=" + a
                    }) : 1 == t ? wx.navigateTo({
                        url: "/weixinmao_jz/pages/matchorder/index?orderid=" + a
                    }) : 2 == t ? wx.navigateTo({
                        url: "/weixinmao_jz/pages/matchorder/index?orderid=" + a
                    }) : 3 == t ? wx.navigateTo({
                        url: "/weixinmao_jz/pages/couponmoney/index?orderid=" + a
                    }) : 4 == t && wx.navigateTo({
                        url: "/weixinmao_jz/pages/couponmoney/index?orderid=" + a
                    });
                }
            }
        });
    },
    tabClick: function(t) {
        var n = this;
        this.checkuser({
            doServices: function() {
                var a = t.currentTarget.id, e = wx.getStorageSync("userInfo");
                app.util.request({
                    url: "entry/wxapp/myorderlist",
                    data: {
                        ordertype: a,
                        sessionid: e.sessionid,
                        uid: e.memberInfo.uid
                    },
                    success: function(e) {
                        e.data.message.errno || n.setData({
                            list: e.data.data.list,
                            ordertype: a
                        });
                    }
                });
            }
        });
    },
    RefundOrder: function(e) {
        var a = this, t = e.currentTarget.dataset.id, n = e.currentTarget.dataset.refund;
        console.log(n);
        var o = wx.getStorageSync("userInfo");
        wx.showModal({
            title: "订单退款",
            content: "确认退款？",
            success: function(e) {
                e.confirm && app.util.request({
                    url: "entry/wxapp/RefundOrderStatus",
                    data: {
                        id: t,
                        sessionid: o.sessionid,
                        uid: o.memberInfo.uid,
                        refund: n
                    },
                    success: function(e) {
                        console.log(e), a.onLoad();
                    },
                    fail: function(e) {
                        console.log(e);
                    }
                });
            }
        });
    },
    RepayOrder: function(e) {
        var a = this, t = e.currentTarget.dataset.id, n = wx.getStorageSync("userInfo");
        wx.showModal({
            title: "订单支付",
            content: "是否确认订单？",
            success: function(e) {
                e.confirm && app.util.request({
                    url: "entry/wxapp/repay",
                    data: {
                        id: t,
                        sessionid: n.sessionid,
                        uid: n.memberInfo.uid
                    },
                    success: function(e) {
                        e.data && e.data.data && wx.requestPayment({
                            timeStamp: e.data.data.timeStamp,
                            nonceStr: e.data.data.nonceStr,
                            package: e.data.data.package,
                            signType: "MD5",
                            paySign: e.data.data.paySign,
                            success: function(e) {
                                a.onLoad();
                            },
                            fail: function(e) {}
                        });
                    },
                    fail: function(e) {
                        console.log(e);
                    }
                });
            }
        });
    },
    paymoney: function(e) {
        var a = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/weixinmao_jz/pages/paymoney/index?id=" + a
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        wx.showNavigationBarLoading(), this.onShow();
    },
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    checkuser: function(a) {
        var t = this, e = (a = a, wx.getStorageSync("userInfo"));
        return console.log(e), e ? e.memberInfo.uid ? void app.util.request({
            url: "entry/wxapp/checkuserinfo",
            data: {
                sessionid: e.sessionid,
                uid: e.memberInfo.uid
            },
            success: function(e) {
                console.log("payyyy"), 0 == e.data.data.error ? a.doServices() : 2 == e.data.data.error && a.doServices();
            }
        }) : (app.util.getUserInfo(), !1) : (app.util.getUserInfo(function(e) {
            t.InitPage();
        }), !1);
    }
});