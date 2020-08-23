var qqmapsdk, QQMapWX = require("../../resource/js/qqmap-wx-jssdk.min.js"), config = require("../../resource/js/config.js"), app = getApp();

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
        isuser: !0,
        id: 0
    },
    onLoad: function(e) {
        var t = this;
        if (wx.setNavigationBarTitle({
            title: "预约服务"
        }), 0 < this.data.id) this.data.id; else {
            e.id;
            this.data.id = e.id;
        }
        var a = wx.getStorageSync("userInfo");
        console.log(a), a && a.hasOwnProperty("wxInfo") ? (t.data.isuser = !0, t.setData({
            userinfo: a
        })) : t.data.isuser = !1, t.setData({
            isuser: t.data.isuser
        }), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
    },
    bindGetUserInfo: function(e) {
        var t = this;
        app.util.getUserInfo(function(e) {
            console.log(e), t.data.isuser = !0, t.setData({
                userinfo: e,
                isuser: t.data.isuser
            });
        }, e.detail);
    },
    getpostion: function() {
        var t = this;
        wx.chooseLocation({
            success: function(e) {
                console.log(e.name), console.log(e.latitude), console.log(e.longitude), t.data.lat = e.latitude, 
                t.data.lng = e.longitude, t.setData({
                    address: e.name
                });
            },
            fail: function(e) {
                console.log(e);
            },
            complete: function() {}
        });
    },
    getaddress: function() {
        var a = this;
        qqmapsdk = new QQMapWX({
            key: config.Config.key
        }), console.log("fffff"), wx.getLocation({
            type: "wgs84",
            success: function(e) {
                qqmapsdk.reverseGeocoder({
                    location: {
                        latitude: e.latitude,
                        longitude: e.longitude
                    },
                    success: function(e) {
                        var t = e.result.formatted_addresses.recommend;
                        console.log(t), a.setData({
                            address: t
                        });
                    }
                });
            }
        });
    },
    bindAreaChange: function(e) {
        var t = this.data.arealist;
        t && (this.data.areaid = t[e.detail.value].id), this.setData({
            arealist: t,
            areaidindex: e.detail.value
        });
    },
    bindToplistChange: function(e) {
        var t = this.data.toplist;
        t && (this.data.toplistid = t[e.detail.value].id), this.setData({
            toplist: t,
            toplistidindex: e.detail.value
        });
    },
    savepubinfo: function(e) {
        var t = this, a = wx.getStorageSync("userInfo"), o = e.detail.value.name, i = e.detail.value.tel, n = t.data.date + t.data.datetime, s = e.detail.value.address, d = e.detail.value.content, l = e.detail.formId, r = t.data.id;
        if ("" != o) if ("" != i) if ("" != n) if ("" != s) {
            var u = {
                sessionid: a.sessionid,
                pid: r,
                uid: a.memberInfo.uid,
                name: o,
                tel: i,
                msgtime: n,
                address: s,
                content: d,
                form_id: l
            };
            app.util.request({
                url: "entry/wxapp/savenoteorder",
                data: u,
                success: function(e) {
                    if (0 != e.data.errno) return wx.hideLoading(), void wx.showModal({
                        title: "失败",
                        content: "提交失败",
                        showCancel: !1
                    });
                    if (0 != e.data.data.error) return wx.hideLoading(), void wx.showModal({
                        title: "失败",
                        content: "提交失败",
                        showCancel: !1
                    });
                    var t = e.data.data.orderid;
                    wx.showModal({
                        title: "确认支付",
                        content: "确认支付？",
                        success: function(e) {
                            e.confirm && app.util.request({
                                url: "entry/wxapp/paynote",
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
                                            console.log(e), wx.navigateTo({
                                                url: "/weixinmao_jz/pages/mymsgorder/index"
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
                }
            });
        } else wx.showModal({
            title: "提示",
            content: "请输入联系人地址",
            showCancel: !1
        }); else wx.showModal({
            title: "提示",
            content: "请填写预约时间",
            showCancel: !1
        }); else wx.showModal({
            title: "提示",
            content: "请填写联系人电话",
            showCancel: !1
        }); else wx.showModal({
            title: "提示",
            content: "请填写联系人姓名",
            showCancel: !1
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        wx.showNavigationBarLoading(), this.onLoad();
    },
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