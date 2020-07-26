var R_htmlToWxml = require("../../resource/js/htmlToWxml.js"), imageUtil = require("../../resource/js/images.js"), app = getApp();

Page({
    data: {
        id: 0,
        ordertype: 1
    },
    onLoad: function(e) {
        wx.setNavigationBarTitle({
            title: "我要赚钱"
        });
        var t = this, n = wx.getStorageSync("userInfo"), a = t.data.ordertype;
        app.util.request({
            url: "entry/wxapp/mycustomer",
            data: {
                ordertype: a,
                sessionid: n.sessionid,
                uid: n.memberInfo.uid
            },
            success: function(e) {
                e.data.message.errno || (wx.setNavigationBarColor({
                    frontColor: "#ffffff",
                    backgroundColor: "#eb4f38",
                    animation: {
                        duration: 400,
                        timingFunc: "easeIn"
                    }
                }), t.setData({
                    agentinfo: e.data.data.agentinfo,
                    agent_setting: e.data.data.agent_setting,
                    ordertype: a
                }));
            },
            complete: function() {
                wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
            }
        });
    },
    toAgentqrcode: function() {
        wx.navigateTo({
            url: "/weixinmao_jz/pages/agentqrcode/index"
        });
    },
    toFxrecord: function() {
        wx.navigateTo({
            url: "/weixinmao_jz/pages/fxrecord/index"
        });
    },
    onReady: function() {},
    tabClick: function(n) {
        var a = this;
        this.checkuser({
            doServices: function() {
                var t = n.currentTarget.id, e = wx.getStorageSync("userInfo");
                app.util.request({
                    url: "entry/wxapp/mycustomer",
                    data: {
                        ordertype: t,
                        sessionid: e.sessionid,
                        uid: e.memberInfo.uid
                    },
                    success: function(e) {
                        e.data.message.errno || a.setData({
                            list: e.data.data.list,
                            ordertype: t
                        });
                    }
                });
            }
        });
    },
    delOrder: function(e) {
        var a = this;
        this.checkuser({
            doServices: function() {
                var t = e.currentTarget.dataset.id, n = wx.getStorageSync("userInfo");
                wx.showModal({
                    title: "订单取消",
                    content: "确认取消订单？",
                    success: function(e) {
                        e.confirm && app.util.request({
                            url: "entry/wxapp/delOrder",
                            data: {
                                id: t,
                                sessionid: n.sessionid,
                                uid: n.memberInfo.uid
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
            }
        });
    },
    RepayOrder: function(e) {
        var a = this;
        this.checkuser({
            doServices: function() {
                var t = e.currentTarget.dataset.id, n = wx.getStorageSync("userInfo");
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
            }
        });
    },
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        wx.showNavigationBarLoading(), this.onLoad();
    },
    toAgentnotelist: function() {
        wx.navigateTo({
            url: "/weixinmao_zp/pages/agentnotelist/index"
        });
    },
    toAgentcompanylist: function() {
        wx.navigateTo({
            url: "/weixinmao_zp/pages/agentcompanylist/index"
        });
    },
    toMyteam: function() {
        wx.navigateTo({
            url: "/weixinmao_jz/pages/myteam/index"
        });
    },
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    checkuser: function(t) {
        t = t;
        var e = wx.getStorageSync("userInfo");
        return e && e.memberInfo.uid ? void app.util.request({
            url: "entry/wxapp/checkuserinfo",
            data: {
                sessionid: e.sessionid,
                uid: e.memberInfo.uid
            },
            success: function(e) {
                0 == e.data.data.error ? (console.log(t), t.doServices()) : 2 == e.data.data.error && t.doServices();
            }
        }) : (app.util.getUserInfo(), !1);
    }
});