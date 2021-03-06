var R_htmlToWxml = require("../../resource/js/htmlToWxml.js"), imageUtil = require("../../resource/js/images.js"), app = getApp();

Page({
    data: {
        id: 0,
        ordertype: 1,
        list:[]
    },
    onLoad: function(e) {
        var t = this;
        if (wx.setNavigationBarTitle({
            title: "我的订单"
        }),
        wx.setNavigationBarColor({
            frontColor: "#ffffff",
            backgroundColor: "#3C9BDF",
            animation: {
                duration: 400,
                timingFunc: "easeIn"
            }
        }), 
        0 < t.data.id) t.data.id; else {
            e.id;
            t.data.id = e.id;
        }
        var u = wx.getStorageSync("userInfo");
        if(u ==undefined || u ==null || u =='' ){
            wx.navigateTo({
                // url: "/weixinmao_jz/pages/myusermsgmoney/index?id=" + t
                url:"/weixinmao_jz/pages/login-customer/index"
            });
        }else{
            u.sessionid ? this.InitPage() : app.util.getUserInfo(function() {
                this.InitPage();
            });
        }
    },
    onShow: function(e) {
        this.InitPage()
    },
    InitPage: function() {
        var t = this, e = wx.getStorageSync("userInfo"), a = t.data.ordertype;
        if(e ==undefined || e ==null || e =='' ){
            t.setData({
                isshow: !1
            });
        }else{
            app.util.request({
                url: "entry/wxapp/mymsgorder",
                data: {
                    ordertype: a,
                    sessionid: e.sessionid,
                    uid: e.memberInfo.uid
                },
                success: function(e) {
                    console.log(e)
                    // e.data.message.errno || 
                    t.setData({
                        list: e.data.data.list,
                        ordertype: a,
                        intro: e.data.data.intro,
                        isshow: !1
                    });
                },
                complete: function() {
                    wx.hideNavigationBarLoading(), wx.stopPullDownRefresh()
                }
            });
        }
    },
    RefundOrder: function(e) {
        var a = this, t = e.currentTarget.dataset.id, n = e.currentTarget.dataset.status;
        console.log(n)
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
                        status: n
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
    onReady: function() {},
    tabClick: function(a) {
        var o = this;
        var t = a.currentTarget.id;
        o.setData({
            ordertype: t
        });
        this.checkuser({
            doServices: function() {
                let e = wx.getStorageSync("userInfo");
                // console.log(t)
                app.util.request({
                    url: "entry/wxapp/mymsgorder",
                    data: {
                        ordertype: t,
                        sessionid: e.sessionid,
                        uid: e.memberInfo.uid
                    },
                    success: function(e) {
                        // e.data.message.errno || 
                        o.setData({
                            list: e.data.data.list
                        });
                    }
                });
            }
        });
    },
    delOrder: function(e) {
        var o = this;
        this.checkuser({
            doServices: function() {
                var t = e.currentTarget.dataset.id, a = wx.getStorageSync("userInfo");
                wx.showModal({
                    title: "订单取消",
                    content: "确认取消订单？",
                    success: function(e) {
                        e.confirm && app.util.request({
                            url: "entry/wxapp/delOrder",
                            data: {
                                id: t,
                                sessionid: a.sessionid,
                                uid: a.memberInfo.uid
                            },
                            success: function(e) {
                                console.log(e), o.onLoad();
                            },
                            fail: function(e) {
                                console.log(e);
                            }
                        });
                    }
                });
            }
        });
    },
    paymoney: function(e) {
        var t = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/weixinmao_jz/pages/paylastmoney/index?id=" + t
        });
    },
    toMyusermsgmoney: function(e) {
        var t = e.currentTarget.dataset.id;
        wx.navigateTo({
            // url: "/weixinmao_jz/pages/myusermsgmoney/index?id=" + t
            url:"/weixinmao_jz/pages/matchorder/index?orderid=" + t
        });
    },
    setcomment: function(e) {
        var a = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/weixinmao_jz/pages/setcomment/index?orderId=" + a
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        wx.showNavigationBarLoading(), this.onShow();
    },
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    checkuser: function(t) {
        var a = this, e = (t = t, wx.getStorageSync("userInfo"));
        return console.log(e), e ? e.memberInfo.uid ? void app.util.request({
            url: "entry/wxapp/checkuserinfo",
            data: {
                sessionid: e.sessionid,
                uid: e.memberInfo.uid
            },
            success: function(e) {
                console.log("payyyy"), 0 == e.data.data.error ? t.doServices() : 2 == e.data.data.error && t.doServices();
            }
        }) : (app.util.getUserInfo(), !1) : (app.util.getUserInfo(function(e) {
            a.InitPage();
        }), !1);
    }
});