var app = getApp();

Page({
    data: {
        title: "",
        special: "",
        imagelist: [],
        uploadimagelist: [ "", "", "", "", "", "" ],
        true1: !0,
        true2: !0,
        true3: !0,
        true4: !0,
        true5: !0,
        true6: !0,
        arealist: [],
        toplist: [],
        areaid: 0,
        toplistid: 0,
        date: "",
        datetime: "",
        orderid: ""
    },
    onLoad: function(e) {
        if (console.log(e.id), wx.setNavigationBarTitle({
            title: "报价列表"
        }), "" != this.data.orderid) this.data.orderid; else {
            e.id;
            this.data.orderid = e.id;
        }
        this.setData({
            isshow: !0
        }), this.oldhouseinit();
    },
    oldhouseinit: function(e) {
        var t = this, a = wx.getStorageSync("userInfo");
        app.util.request({
            url: "entry/wxapp/getmsgmoney",
            data: {
                orderid: t.data.orderid,
                sessionid: a.sessionid,
                uid: a.memberInfo.uid
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
                }), t.setData({
                    moneylist: e.data.data.moneylist,
                    intro: e.data.data.intro,
                    isshow: !1
                }));
            }
        });
    },
    doagree: function(e) {
        var t = this, a = e.currentTarget.dataset.id, o = wx.getStorageSync("userInfo");
        wx.showModal({
            title: "信息提示",
            content: "确定同意报价？",
            success: function(e) {
                e.confirm && app.util.request({
                    url: "entry/wxapp/AgreeMsgmoney",
                    data: {
                        id: a,
                        status: 3,
                        sessionid: o.sessionid,
                        uid: o.memberInfo.uid
                    },
                    success: function(e) {
                        e.data.message.errno || wx.navigateTo({
                            url: "/weixinmao_jz/pages/goservice/index?orderid=" + t.data.orderid
                        });
                    }
                });
            }
        });
    },
    dounagree: function(e) {
        var t = this, a = e.currentTarget.dataset.id, o = wx.getStorageSync("userInfo");
        wx.showModal({
            title: "信息提示",
            content: "确定拒绝报价？",
            success: function(e) {
                e.confirm && app.util.request({
                    url: "entry/wxapp/AgreeMsgmoney",
                    data: {
                        id: a,
                        status: -3,
                        sessionid: o.sessionid,
                        uid: o.memberInfo.uid
                    },
                    success: function(e) {
                        e.data.message.errno || t.oldhouseinit();
                    }
                });
            }
        });
    },
    pay: function(e) {
        var t = this.data.orderid, a = wx.getStorageSync("userInfo");
        console.log(t), wx.showModal({
            title: "确认支付",
            content: "确认支付？",
            success: function(e) {
                e.confirm && app.util.request({
                    url: "entry/wxapp/pay",
                    data: {
                        orderid: t,
                        sessionid: a.sessionid,
                        uid: a.memberInfo.uid
                    },
                    success: function(e) {
                        console.log(e), e.data && e.data.data && wx.requestPayment({
                            timeStamp: e.data.data.timeStamp,
                            nonceStr: e.data.data.nonceStr,
                            package: e.data.data.package,
                            signType: "MD5",
                            paySign: e.data.data.paySign,
                            success: function(e) {
                                console.log(e), wx.switchTab({
                                    url: "/weixinmao_jz/pages/matchorder/index"
                                });
                            },
                            fail: function(e) {
                                console.log("取消支付");
                            }
                        });
                    },
                    fail: function(e) {
                        console.log(e);
                    }
                });
            }
        });
    },
    getaddress: function() {
        wx.navigateTo({
            url: "/weixinmao_jz/pages/getaddress/index"
        });
    },
    selectaddress: function() {
        wx.navigateTo({
            url: "/weixinmao_jz/pages/selectaddress/index"
        });
    },
    onReady: function() {},
    onShow: function() {
        this.setData({
            addressinfo: wx.getStorageSync("addressinfo")
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    bindDateChange: function(e) {
        this.data.date = e.detail.value, console.log(e.detail.value), this.setData({
            dates: e.detail.value
        });
    },
    bindTimeChange: function(e) {
        this.data.datetime = e.detail.value, console.log(e.detail.value), this.setData({
            datetime: e.detail.value
        });
    },
    uploadimg: function(e, i) {
        var t = app.util.geturl({
            url: "entry/wxapp/upload"
        });
        i = i;
        wx.showToast({
            icon: "loading",
            title: "正在上传"
        });
        var n = this;
        wx.uploadFile({
            url: t,
            filePath: e[0],
            name: "file",
            header: {
                "Content-Type": "multipart/form-data"
            },
            formData: {
                session_token: wx.getStorageSync("session_token")
            },
            success: function(e) {
                var t = JSON.parse(e.data);
                if (200 == e.statusCode) for (var a = t.data.path, o = 0; o < n.data.uploadimagelist.length; o++) {
                    o + 1 == i && (n.data.uploadimagelist[o] = a);
                } else wx.showModal({
                    title: "提示",
                    content: "上传失败",
                    showCancel: !1
                });
            },
            fail: function(e) {
                wx.showModal({
                    title: "提示",
                    content: "上传失败",
                    showCancel: !1
                });
            },
            complete: function() {
                wx.hideToast();
            }
        });
    },
    checkboxChange: function(e) {
        var t = e.detail.value;
        this.data.special = t.join(",");
    },
    checkuser: function(t) {
        var a = this, e = (t = t, wx.getStorageSync("userInfo"));
        return console.log(e), e ? e.memberInfo.uid ? void app.util.request({
            url: "entry/wxapp/checkuserinfo",
            data: {
                sessionid: e.sessionid,
                uid: e.memberInfo.uid
            },
            success: function(e) {
                console.log("payyyy"), 0 == e.data.data.error ? t.doServices() : 2 == e.data.data.error && t.doElseServices();
            }
        }) : (app.util.getUserInfo(), !1) : (app.util.getUserInfo(function(e) {
            a.oldhouseinit();
        }), !1);
    }
});