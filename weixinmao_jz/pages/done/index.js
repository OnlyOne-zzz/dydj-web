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
        model: 0,
        addressinfo: [],
        payway: 0
    },
    onLoad: function(a) {
        var e = this;
        if (console.log(a.orderid), e.data.orderid = a.orderid, "" != this.data.orderid) this.data.orderid; else {
            a.orderid;
            this.data.orderid = a.orderid;
        }
        e.setData({
            isshow: !0
        }), e.oldhouseinit();
    },
    oldhouseinit: function(a) {
        var t = this, e = wx.getStorageSync("userInfo");
        app.util.request({
            url: "entry/wxapp/GetOrderInfo",
            data: {
                orderid: t.data.orderid,
                sessionid: e.sessionid,
                uid: e.memberInfo.uid
            },
            success: function(a) {
                if (!a.data.message.errno) {
                    a.data.data.intro.maincolor || (a.data.data.intro.maincolor = "#09ba07"), wx.setNavigationBarColor({
                        frontColor: "#ffffff",
                        backgroundColor: a.data.data.intro.maincolor,
                        animation: {
                            duration: 400,
                            timingFunc: "easeIn"
                        }
                    });
                    var e = a.data.data.order_detail;
                    wx.setNavigationBarTitle({
                        title: e[0].title
                    }), t.data.orderinfo = a.data.data.orderinfo, t.setData({
                        orderinfo: a.data.data.orderinfo,
                        addressinfo: a.data.data.addressinfo,
                        order_detail: a.data.data.order_detail,
                        intro: a.data.data.intro,
                        isshow: !1
                    });
                }
            }
        });
    },
    radioChange: function(a) {
        this.data.model = a.detail.value;
    },
    radioPayChange: function(a) {
        this.data.payway = a.detail.value;
    },
    pay: function(a) {
        var e = this, t = e.data.addressinfo, o = a.detail.formId;
        if (t) if (-1 != e.data.model) {
            var i = e.data.orderid, d = wx.getStorageSync("userInfo"), n = a.detail.value.content, s = e.data.orderinfo, r = e.data.payway;
            0 < s.money ? 0 == r ? wx.showModal({
                title: "确认支付",
                content: "确认支付？",
                success: function(a) {
                    a.confirm && app.util.request({
                        url: "entry/wxapp/pay",
                        data: {
                            model: e.data.model,
                            addressid: t.id,
                            orderid: i,
                            sessionid: d.sessionid,
                            uid: d.memberInfo.uid,
                            content: n,
                            form_id: o
                        },
                        success: function(a) {
                            console.log(a), a.data && a.data.data && wx.requestPayment({
                                timeStamp: a.data.data.timeStamp,
                                nonceStr: a.data.data.nonceStr,
                                package: a.data.data.package,
                                signType: "MD5",
                                paySign: a.data.data.paySign,
                                success: function(a) {
                                    console.log(a), wx.navigateTo({
                                        url: "/weixinmao_jz/pages/matchorder/index?orderid=" + i
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
            }) : app.util.request({
                url: "entry/wxapp/Paytotalmoney",
                data: {
                    sessionid: d.sessionid,
                    model: e.data.model,
                    addressid: t.id,
                    orderid: i,
                    uid: d.memberInfo.uid,
                    form_id: o,
                    content: n
                },
                success: function(a) {
                    if (!a.data.message.errno) {
                        if (0 != a.data.data.error) return void wx.showModal({
                            title: "提示",
                            content: a.data.data.msg,
                            showCancel: !1
                        });
                        wx.showModal({
                            title: "提示",
                            content: a.data.data.msg,
                            showCancel: !1,
                            success: function() {
                                wx.navigateTo({
                                    url: "/weixinmao_jz/pages/matchorder/index?orderid=" + i
                                });
                            }
                        });
                    }
                }
            }) : app.util.request({
                url: "entry/wxapp/PayNomoney",
                data: {
                    sessionid: d.sessionid,
                    model: e.data.model,
                    addressid: t.id,
                    orderid: i,
                    uid: d.memberInfo.uid,
                    form_id: o,
                    content: n
                },
                success: function(a) {
                    if (!a.data.message.errno) {
                        if (0 != a.data.data.error) return void wx.showModal({
                            title: "提示",
                            content: a.data.data.msg,
                            showCancel: !1
                        });
                        wx.showModal({
                            title: "提示",
                            content: a.data.data.msg,
                            showCancel: !1,
                            success: function() {
                                wx.navigateTo({
                                    url: "/weixinmao_jz/pages/matchorder/index?orderid=" + i
                                });
                            }
                        });
                    }
                }
            });
        } else wx.showModal({
            title: "提示",
            content: "请选择订单匹配模式",
            showCancel: !1
        }); else wx.showModal({
            title: "提示",
            content: "请先增加地址",
            showCancel: !1
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
        this.data.addressinfo = wx.getStorageSync("addressinfo"), this.setData({
            addressinfo: wx.getStorageSync("addressinfo")
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
        var d = this;
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
                if (200 == a.statusCode) for (var t = e.data.path, o = 0; o < d.data.uploadimagelist.length; o++) {
                    o + 1 == i && (d.data.uploadimagelist[o] = t);
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