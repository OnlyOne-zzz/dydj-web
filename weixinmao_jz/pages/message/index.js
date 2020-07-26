var qqmapsdk, QQMapWX = require("../../resource/js/qqmap-wx-jssdk.min.js"), app = getApp();

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
        listid: ""
    },
    onLoad: function(t) {
        var a = this;
        if (wx.setNavigationBarTitle({
            title: "提交订单"
        }), "" != a.data.listid) a.data.listid; else {
            t.listid;
            a.data.listid = t.listid;
        }
        a.setData({
            isshow: !0
        }), console.log(a.data.listid), a.oldhouseinit();
    },
    oldhouseinit: function(t) {
        var a = this, e = wx.getStorageSync("userInfo");
        app.util.request({
            url: "entry/wxapp/initMessage",
            data: {
                listid: a.data.listid,
                sessionid: e.sessionid,
                uid: e.memberInfo.uid
            },
            success: function(t) {
                t.data.message.errno || (t.data.data.intro.maincolor || (t.data.data.intro.maincolor = "#09ba07"), 
                wx.setNavigationBarColor({
                    frontColor: "#ffffff",
                    backgroundColor: t.data.data.intro.maincolor,
                    animation: {
                        duration: 400,
                        timingFunc: "easeIn"
                    }
                }), a.setData({
                    totalprice: t.data.data.totalprice,
                    intro: t.data.data.intro,
                    isshow: !1
                }));
            },
            complete: function() {
                wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
            }
        });
    },
    getaddress: function() {
        var e = this;
        qqmapsdk = new QQMapWX({
            key: "5D3BZ-J55WF-SFPJJ-NI6PG-YN2ZO-M4BHX"
        }), wx.getLocation({
            type: "wgs84",
            success: function(t) {
                qqmapsdk.reverseGeocoder({
                    location: {
                        latitude: t.latitude,
                        longitude: t.longitude
                    },
                    success: function(t) {
                        var a = t.result.formatted_addresses.recommend;
                        console.log(a), e.setData({
                            address: a
                        });
                    }
                });
            }
        });
    },
    bindAreaChange: function(t) {
        var a = this.data.arealist;
        a && (this.data.areaid = a[t.detail.value].id), this.setData({
            arealist: a,
            areaidindex: t.detail.value
        });
    },
    bindToplistChange: function(t) {
        var a = this.data.toplist;
        a && (this.data.toplistid = a[t.detail.value].id), this.setData({
            toplist: a,
            toplistidindex: t.detail.value
        });
    },
    savepubinfo: function(t) {
        var a = this, e = wx.getStorageSync("userInfo"), i = t.detail.value.name, o = t.detail.value.tel, n = a.data.date + a.data.datetime, s = t.detail.value.address, d = t.detail.value.content, l = t.detail.formId;
        if ("" != i) if ("" != o) if ("" != n) if ("" != s) {
            var r = {
                sessionid: e.sessionid,
                listid: a.data.listid,
                uid: e.memberInfo.uid,
                name: i,
                tel: o,
                msgtime: n,
                address: s,
                content: d,
                form_id: l
            };
            app.util.request({
                url: "entry/wxapp/saveorder",
                data: r,
                success: function(t) {
                    if (0 != t.data.errno) return wx.hideLoading(), void wx.showModal({
                        title: "失败",
                        content: "提交失败",
                        showCancel: !1
                    });
                    if (0 != t.data.data.error) return wx.hideLoading(), void wx.showModal({
                        title: "失败",
                        content: "提交失败",
                        showCancel: !1
                    });
                    var a = t.data.data.orderid;
                    wx.showToast({
                        title: "提交成功",
                        icon: "success",
                        duration: 2e3,
                        success: function(t) {
                            console.log(t), wx.navigateTo({
                                url: "/weixinmao_jz/pages/done/index?orderid=" + a
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
    bindDateChange: function(t) {
        this.data.date = t.detail.value, console.log(t.detail.value), this.setData({
            dates: t.detail.value
        });
    },
    bindTimeChange: function(t) {
        this.data.datetime = t.detail.value, console.log(t.detail.value), this.setData({
            datetime: t.detail.value
        });
    },
    uploadimg: function(t, o) {
        var a = app.util.geturl({
            url: "entry/wxapp/upload"
        });
        o = o;
        wx.showToast({
            icon: "loading",
            title: "正在上传"
        });
        var n = this;
        wx.uploadFile({
            url: a,
            filePath: t[0],
            name: "file",
            header: {
                "Content-Type": "multipart/form-data"
            },
            formData: {
                session_token: wx.getStorageSync("session_token")
            },
            success: function(t) {
                var a = JSON.parse(t.data);
                if (200 == t.statusCode) for (var e = a.data.path, i = 0; i < n.data.uploadimagelist.length; i++) {
                    i + 1 == o && (n.data.uploadimagelist[i] = e);
                } else wx.showModal({
                    title: "提示",
                    content: "上传失败",
                    showCancel: !1
                });
            },
            fail: function(t) {
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
    checkboxChange: function(t) {
        var a = t.detail.value;
        this.data.special = a.join(",");
    },
    checkuser: function(a) {
        var e = this, t = (a = a, wx.getStorageSync("userInfo"));
        return console.log(t), t ? t.memberInfo.uid ? void app.util.request({
            url: "entry/wxapp/checkuserinfo",
            data: {
                sessionid: t.sessionid,
                uid: t.memberInfo.uid
            },
            success: function(t) {
                console.log("payyyy"), 0 == t.data.data.error ? a.doServices() : 2 == t.data.data.error && a.doElseServices();
            }
        }) : (app.util.getUserInfo(), !1) : (app.util.getUserInfo(function(t) {
            e.oldhouseinit();
        }), !1);
    }
});