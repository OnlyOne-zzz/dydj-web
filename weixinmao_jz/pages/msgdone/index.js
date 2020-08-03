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
        payway: 0,
        shopid: 0,
        currentid: 0,
        gooditems: [],
        time: ''
    },
    onLoad: function(a) {
        var t = this;
        if ("" != t.data.shopid) this.data.shopid; else {
            a.shopid;
            this.data.shopid = a.shopid;
        }
        if ("" != t.data.currentid) this.data.currentid; else {
            a.currentid;
            this.data.currentid = a.currentid;
        }
        t.setData({
            isshow: !0
        }), t.oldhouseinit();
    },
    oldhouseinit: function(a) {
        var t = this, e = wx.getStorageSync("userInfo");
        app.util.request({
            url: "entry/wxapp/Getgooditems",
            data: {
                currentid: t.data.currentid,
                shopid: t.data.shopid,
                sessionid: e.sessionid,
                uid: e.memberInfo.uid
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
                }), wx.setNavigationBarTitle({
                    title: "提交订单"
                }), t.data.gooditems = a.data.data.gooditems, t.setData({
                    msgcontent: a.data.data.msgcontent,
                    gooditems: a.data.data.gooditems,
                    addressinfo: a.data.data.addressinfo,
                    intro: a.data.data.intro,
                    isshow: !1
                }));
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
        var t = this, e = t.data.addressinfo, o = a.detail.formId;
        if (e) {
            var i = t.data.shopid, d = t.data.currentid, n = wx.getStorageSync("userInfo"), s = a.detail.value.content, r = t.data.payway;
            0 < t.data.gooditems.money ? 0 == r ? wx.showModal({
                title: "确认支付",
                content: "确认支付？",
                success: function(a) {
                    a.confirm && app.util.request({
                        url: "entry/wxapp/paymsg",
                        data: {
                            currentid: d,
                            addressid: e.id,
                            shopid: i,
                            sessionid: n.sessionid,
                            uid: n.memberInfo.uid,
                            content: s,
                            form_id: o
                        },
                        success: function(a) {
                            if (console.log(a), a.data && a.data.data) {
                                var t = a.data.data.orderid;
                                wx.requestPayment({
                                    timeStamp: a.data.data.timeStamp,
                                    nonceStr: a.data.data.nonceStr,
                                    package: a.data.data.package,
                                    signType: "MD5",
                                    paySign: a.data.data.paySign,
                                    success: function(a) {
                                        console.log(a), wx.navigateTo({
                                            url: "/weixinmao_jz/pages/mymsgorder/index?orderid=" + t
                                        });
                                    },
                                    fail: function(a) {
                                        console.log("取消支付");
                                    }
                                });
                            }
                        },
                        fail: function(a) {
                            console.log(a);
                        }
                    });
                }
            }) : app.util.request({
                url: "entry/wxapp/Paytotalmoney",
                data: {
                    sessionid: n.sessionid,
                    model: t.data.model,
                    addressid: e.id,
                    orderid: orderid,
                    uid: n.memberInfo.uid,
                    form_id: o,
                    content: s
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
                                    url: "/weixinmao_jz/pages/matchorder/index?orderid=" + orderid
                                });
                            }
                        });
                    }
                }
            }) : app.util.request({
                url: "entry/wxapp/PayNomoney",
                data: {
                    sessionid: n.sessionid,
                    model: t.data.model,
                    addressid: e.id,
                    orderid: orderid,
                    uid: n.memberInfo.uid,
                    form_id: o,
                    content: s
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
                                    url: "/weixinmao_jz/pages/matchorder/index?orderid=" + orderid
                                });
                            }
                        });
                    }
                }
            });
        } else wx.showModal({
            title: "提示",
            content: "请先增加地址",
            showCancel: !1
        });
    },
    bindTimeChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            time: e.detail.value
        })
    },
    getaddress: function() {
        if(this.data.addressinfo) {
            this.selectaddress()
        } else {
            wx.navigateTo({
                url: "/weixinmao_jz/pages/getaddress/index"
            });
        }
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
    // bindTimeChange: function(a) {
    //     this.data.datetime = a.detail.value, console.log(a.detail.value), this.setData({
    //         datetime: a.detail.value
    //     });
    // },
    uploadimg: function(a, i) {
        var t = app.util.geturl({
            url: "entry/wxapp/upload"
        });
        i = i;
        wx.showToast({
            icon: "loading",
            title: "正在上传"
        });
        var d = this;
        wx.uploadFile({
            url: t,
            filePath: a[0],
            name: "file",
            header: {
                "Content-Type": "multipart/form-data"
            },
            formData: {
                session_token: wx.getStorageSync("session_token")
            },
            success: function(a) {
                var t = JSON.parse(a.data);
                if (200 == a.statusCode) for (var e = t.data.path, o = 0; o < d.data.uploadimagelist.length; o++) {
                    o + 1 == i && (d.data.uploadimagelist[o] = e);
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
        var t = a.detail.value;
        this.data.special = t.join(",");
    },
    checkuser: function(t) {
        var e = this, a = (t = t, wx.getStorageSync("userInfo"));
        return console.log(a), a ? a.memberInfo.uid ? void app.util.request({
            url: "entry/wxapp/checkuserinfo",
            data: {
                sessionid: a.sessionid,
                uid: a.memberInfo.uid
            },
            success: function(a) {
                console.log("payyyy"), 0 == a.data.data.error ? t.doServices() : 2 == a.data.data.error && t.doElseServices();
            }
        }) : (app.util.getUserInfo(), !1) : (app.util.getUserInfo(function(a) {
            e.oldhouseinit();
        }), !1);
    }
});