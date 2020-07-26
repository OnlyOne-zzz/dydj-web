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
        orderid: "",
        tel: ""
    },
    onLoad: function(a) {
        var e = this;
        if (console.log(a.orderid), e.data.orderid = a.orderid, wx.setNavigationBarTitle({
            title: "订单进度"
        }), "" != this.data.orderid) this.data.orderid; else {
            a.orderid;
            this.data.orderid = a.orderid;
        }
        e.setData({
            isshow: !0
        }), e.oldhouseinit();
    },
    oldhouseinit: function(a) {
        var e = this, t = wx.getStorageSync("userInfo");
        app.util.request({
            url: "entry/wxapp/MatchOrderInfo",
            data: {
                orderid: e.data.orderid,
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
                }), e.data.tel = a.data.data.intro.tel, e.setData({
                    orderinfo: a.data.data.orderinfo,
                    addressinfo: a.data.data.addressinfo,
                    moneylist: a.data.data.moneylist,
                    order_detail: a.data.data.order_detail,
                    intro: a.data.data.intro,
                    noteinfo: a.data.data.noteinfo,
                    isshow: !1
                }));
            }
        });
    },
    doagree: function(a) {
        var e = this, t = a.currentTarget.dataset.id, o = wx.getStorageSync("userInfo");
        wx.showModal({
            title: "信息提示",
            content: "确定同意报价？",
            success: function(a) {
                a.confirm && app.util.request({
                    url: "entry/wxapp/AgreeOrderInfo",
                    data: {
                        id: t,
                        status: 4,
                        sessionid: o.sessionid,
                        uid: o.memberInfo.uid
                    },
                    success: function(a) {
                        a.data.message.errno || wx.navigateTo({
                            url: "/weixinmao_jz/pages/goservice/index?orderid=" + e.data.orderid
                        });
                    }
                });
            }
        });
    },
    dounagree: function(a) {
        var e = this, t = a.currentTarget.dataset.id, o = wx.getStorageSync("userInfo");
        wx.showModal({
            title: "信息提示",
            content: "确定拒绝报价？",
            success: function(a) {
                a.confirm && app.util.request({
                    url: "entry/wxapp/AgreeOrderInfo",
                    data: {
                        id: t,
                        status: 3,
                        sessionid: o.sessionid,
                        uid: o.memberInfo.uid
                    },
                    success: function(a) {
                        a.data.message.errno || e.oldhouseinit();
                    }
                });
            }
        });
    },
    pay: function(a) {
        var e = this.data.orderid, t = wx.getStorageSync("userInfo");
        console.log(e), wx.showModal({
            title: "确认支付",
            content: "确认支付？",
            success: function(a) {
                a.confirm && app.util.request({
                    url: "entry/wxapp/pay",
                    data: {
                        orderid: e,
                        sessionid: t.sessionid,
                        uid: t.memberInfo.uid
                    },
                    success: function(a) {
                        console.log(a), a.data && a.data.data && wx.requestPayment({
                            timeStamp: a.data.data.timeStamp,
                            nonceStr: a.data.data.nonceStr,
                            package: a.data.data.package,
                            signType: "MD5",
                            paySign: a.data.data.paySign,
                            success: function(a) {
                                console.log(a), wx.switchTab({
                                    url: "/weixinmao_jz/pages/matchorder/index"
                                });
                            },
                            fail: function(a) {
                                console.log("取消支付");
                            }
                        });
                    },
                    fail: function(a) {
                        console.log(a);
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
    doCall: function() {
        var a = this.data.tel;
        wx.makePhoneCall({
            phoneNumber: a
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    bindDateChange: function(a) {
        this.data.date = a.detail.value, console.log(a.detail.value), this.setData({
            dates: a.detail.value
        });
    },
    bindTimeChange: function(a) {
        this.data.datetime = a.detail.value, console.log(a.detail.value), this.setData({
            datetime: a.detail.value
        });
    },
    uploadimg: function(a, i) {
        var e = app.util.geturl({
            url: "entry/wxapp/upload"
        });
        i = i;
        wx.showToast({
            icon: "loading",
            title: "正在上传"
        });
        var n = this;
        wx.uploadFile({
            url: e,
            filePath: a[0],
            name: "file",
            header: {
                "Content-Type": "multipart/form-data"
            },
            formData: {
                session_token: wx.getStorageSync("session_token")
            },
            success: function(a) {
                var e = JSON.parse(a.data);
                if (200 == a.statusCode) for (var t = e.data.path, o = 0; o < n.data.uploadimagelist.length; o++) {
                    o + 1 == i && (n.data.uploadimagelist[o] = t);
                } else wx.showModal({
                    title: "提示",
                    content: "上传失败",
                    showCancel: !1
                });
            },
            fail: function(a) {
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
    checkboxChange: function(a) {
        var e = a.detail.value;
        this.data.special = e.join(",");
    },
    checkuser: function(e) {
        var t = this, a = (e = e, wx.getStorageSync("userInfo"));
        return console.log(a), a ? a.memberInfo.uid ? void app.util.request({
            url: "entry/wxapp/checkuserinfo",
            data: {
                sessionid: a.sessionid,
                uid: a.memberInfo.uid
            },
            success: function(a) {
                console.log("payyyy"), 0 == a.data.data.error ? e.doServices() : 2 == a.data.data.error && e.doElseServices();
            }
        }) : (app.util.getUserInfo(), !1) : (app.util.getUserInfo(function(a) {
            t.oldhouseinit();
        }), !1);
    }
});