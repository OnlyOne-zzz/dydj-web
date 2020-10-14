var qqmapsdk, QQMapWX = require("../../resource/js/qqmap-wx-jssdk.min.js"), config = require("../../resource/js/config.js"), markersData = [], app = getApp();

Page({
    data: {
        flag: !1,
        codeDis: !1,
        phoneCode: "获取验证码",
        telephone: "",
        codePhone: "",
        isuser: !0
    },
    onLoad: function(e) {
        wx.setNavigationBarTitle({
            title: "我要认证"
        });
        var t = this, a = wx.getStorageSync("userInfo");
        if (a) if (a.hasOwnProperty("wxInfo")) {
            t.data.isuser = !0;
            a.memberInfo.uid;
        } else t.data.isuser = !1; else t.data.isuser = !1;
        app.util.request({
            url: "entry/wxapp/Intro",
            success: function(e) {
                e.data.message.errno || t.setData({
                    intro: e.data.data.intro
                });
            }
        }), t.setData({
            isuser: t.data.isuser
        });
    },
    binduser: function(e) {
        var t = wx.getStorageSync("userInfo"), a = e.detail.value.telephone, n = e.detail.value.code;
        11 != a.length || isNaN(a) ? wx.showModal({
            title: "提示",
            content: "请输入有效的手机号码",
            showCancel: !1
        }) : "" != n ? app.util.request({
            url: "entry/wxapp/register",
            data: {
                phone: a,
                code: n,
                uid: t.memberInfo.uid
            },
            success: function(e) {
                if (!e.data.message.errno) return 1 == e.data.data.error ? void wx.showModal({
                    title: "提示",
                    content: e.data.data.msg,
                    showCancel: !1
                }) : void wx.showModal({
                    title: "提示",
                    content: e.data.data.msg,
                    showCancel: !1,
                    success: function(e) {
                        wx.navigateTo({
                            url: "/weixinmao_zp/pages/user/index"
                        });
                    }
                });
            }
        }) : wx.showModal({
            title: "提示",
            content: "请输入验证码",
            showCancel: !1
        });
    },
    getPhoneNumber: function(e) {
        // console.log(e.detail);
        // if ("getPhoneNumber:fail user deny" == e.detail.errMsg) wx.showModal({
        //     title: "提示",
        //     showCancel: !1,
        //     content: "未授权",
        //     success: function(e) {}
        // }); else {
        //     var t = wx.getStorageSync("userInfo");
        //     app.util.request({
        //         url: "entry/wxapp/Getphone",
        //         data: {
        //             iv: e.detail.iv,
        //             encryptedData: e.detail.encryptedData,
        //             uid: t.memberInfo.uid
        //         },
        //         success: function(e) {
        //             e.data.message.errno || wx.navigateBack({
        //                 changed: !0
        //             });
        //         }
        //     });
        // }
    },
    bindGetUserInfo: function(e) {
        // var s = this;
        // app.util.getUserInfo(function(t) {
        //     console.log(t), s.data.isuser = !0;
        //     var e = t.memberInfo.uid, a = t.wxInfo.nickName, n = t.wxInfo.avatarUrl;
        //     0 < (s.data.uid = e) && (s.setData({
        //         userinfo: t,
        //         isphone: !1,
        //         isuser: s.data.isuser
        //     }), app.util.request({
        //         url: "entry/wxapp/Updateuserinfo",
        //         data: {
        //             uid: e,
        //             nickname: a,
        //             avatarUrl: n
        //         },
        //         success: function(e) {
        //             e.data.message.errno || (app.globalData.isuser = !0, s.setData({
        //                 userinfo: t,
        //                 isphone: !1,
        //                 isuser: s.data.isuser
        //             }));
        //         }
        //     }));
        // }, e.detail);
    },
    onReady: function() {},
    changeCode: function() {
        var a = this, e = this.data.telephone;
        11 != e.length || isNaN(e) ? wx.showModal({
            title: "提示",
            content: "请输入有效的手机号码",
            showCancel: !1
        }) : (this.setData({
            codeDis: !0
        }), app.util.request({
            url: "entry/wxapp/sendsms",
            data: {
                phone: this.data.telephone
            },
            success: function(e) {
                if (!e.data.message.errno) {
                    a.setData({
                        phoneCode: 60
                    });
                    var t = setInterval(function() {
                        var e = a.data.phoneCode;
                        e--, a.setData({
                            phoneCode: e
                        }), 0 == e && (clearInterval(t), a.setData({
                            phoneCode: "获取验证码",
                            flag: !0,
                            codeDis: !1
                        }));
                    }, 1e3);
                }
            }
        }));
    },
    phoneinput: function(e) {
        console.log(e);
        var t = e.detail.value;
        console.log(t), this.setData({
            telephone: t
        });
    },
    codeinput: function(e) {
        var t = e.detail.value;
        console.log(t), this.setData({
            codePhone: t
        });
    },
    onShow: function() {
        var t = this;
        this.checkuser({
            doServices: function() {
                var e = wx.getStorageSync("userInfo");
                console.log(e.wxInfo), t.setData({
                    userinfo: e
                });
            }
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    checkuser: function(t) {
        var a = this, e = (t = t, wx.getStorageSync("userInfo"));
        return e ? e.memberInfo.uid ? void app.util.request({
            url: "entry/wxapp/checkuserinfo",
            data: {
                sessionid: e.sessionid,
                uid: e.memberInfo.uid
            },
            success: function(e) {
                0 == e.data.data.error ? (console.log(t), t.doServices()) : 2 == e.data.data.error && t.doServices();
            }
        }) : (console.log("tmddddsssssqqqqs1111"), app.util.getUserInfo(function(e) {
            a.setData({
                userinfo: e
            });
        }), !1) : (console.log("tmddddssssss222222"), app.util.getUserInfo(function(e) {
            a.setData({
                userinfo: e
            });
        }), !1);
    }
});