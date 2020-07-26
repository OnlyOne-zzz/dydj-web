var _Page;

function _defineProperty(e, a, t) {
    return a in e ? Object.defineProperty(e, a, {
        value: t,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[a] = t, e;
}

var app = getApp();

function isHasElementOne(e, a) {
    for (var t = 0, n = e.length; t < n; t++) if (e[t] == a) return t;
    return -1;
}

function isHasElementTwo(e, a) {
    for (var t = 0, n = e.length; t < n; t++) if (e[t].id == a) return t;
    return -1;
}

Page((_defineProperty(_Page = {
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
        areaidindex: 0,
        areaid: 0
    },
    onLoad: function(e) {
        var a = this;
        a.data.id = e.id, wx.setNavigationBarTitle({
            title: "企业入驻申请"
        });
        wx.getStorageSync("companyid");
        wx.getStorageSync("userInfo").sessionid ? a.oldhouseinit() : app.util.getUserInfo(function() {
            a.oldhouseinit();
        });
    },
    oldhouseinit: function(e) {
        var a = wx.getStorageSync("companyid"), t = wx.getStorageSync("userInfo");
        app.util.request({
            url: "entry/wxapp/Editcompanyinit",
            data: {
                companyid: a,
                sessionid: t.sessionid,
                uid: t.memberInfo.uid
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
                }), e.data.data.isbind);
            }
        });
    },
    checkboxChange: function(e) {
        var a = e.detail.value;
        this.data.special = a.join(",");
    },
    bindAreaChange: function(e) {
        var a = this.data.arealist;
        a && (this.data.areaid = a[e.detail.value].id, this.data.areaidindex = e.detail.value), 
        this.setData({
            arealist: a,
            areaidindex: e.detail.value
        });
    },
    savepubinfo: function(e) {
        var a = wx.getStorageSync("userInfo"), t = e.detail.value.companyname, n = e.detail.value.name, o = e.detail.value.tel, i = e.detail.value.account, s = e.detail.value.password, l = e.detail.value.password2;
        e.detail.value.content, this.data.id;
        if ("" != t) if ("" != n) if ("" != o) if ("" != i) if ("" != s) if ("" != l) if (s == l) {
            var r = {
                sessionid: a.sessionid,
                uid: a.memberInfo.uid,
                companyname: t,
                name: n,
                tel: o,
                account: i,
                password: s,
                type: 1
            };
            app.util.request({
                url: "entry/wxapp/Addcompanyinfo",
                data: r,
                success: function(e) {
                    if (0 != e.data.errno) return wx.hideLoading(), void wx.showModal({
                        title: "失败",
                        content: e.data.data.msg,
                        showCancel: !1
                    });
                    wx.showToast({
                        title: "注册成功",
                        icon: "success",
                        duration: 2e3,
                        success: function(e) {
                            console.log(e), wx.navigateTo({
                                url: "/weixinmao_jz/pages/paycompanyrole/index"
                            });
                        }
                    });
                }
            });
        } else wx.showModal({
            title: "提示",
            content: "两次密码不一致",
            showCancel: !1
        }); else wx.showModal({
            title: "提示",
            content: "请输入确认密码",
            showCancel: !1
        }); else wx.showModal({
            title: "提示",
            content: "请输入登录密码",
            showCancel: !1
        }); else wx.showModal({
            title: "提示",
            content: "请输入登录账号",
            showCancel: !1
        }); else wx.showModal({
            title: "提示",
            content: "请输入手机号",
            showCancel: !1
        }); else wx.showModal({
            title: "提示",
            content: "请输入真实姓名",
            showCancel: !1
        }); else wx.showModal({
            title: "提示",
            content: "请输入企业名称",
            showCancel: !1
        });
    },
    onReady: function() {},
    radioChange: function(e) {
        this.data.sex = e.detail.value;
    },
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    uploadimg: function(e, o) {
        var a = app.util.geturl({
            url: "entry/wxapp/upload"
        });
        o = o;
        wx.showToast({
            icon: "loading",
            title: "正在上传"
        });
        var i = this;
        wx.uploadFile({
            url: a,
            filePath: e[0],
            name: "file",
            header: {
                "Content-Type": "multipart/form-data"
            },
            formData: {
                session_token: wx.getStorageSync("session_token")
            },
            success: function(e) {
                var a = JSON.parse(e.data);
                if (200 == e.statusCode) for (var t = a.data.path, n = 0; n < i.data.uploadimagelist.length; n++) {
                    n + 1 == o && (i.data.uploadimagelist[n] = t);
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
    }
}, "checkboxChange", function(e) {
    var a = e.detail.value;
    this.data.special = a.join(",");
}), _defineProperty(_Page, "checkuser", function(a) {
    var t = this, e = (a = a, wx.getStorageSync("userInfo"));
    return console.log(e), e ? e.memberInfo.uid ? void app.util.request({
        url: "entry/wxapp/checkuserinfo",
        data: {
            sessionid: e.sessionid,
            uid: e.memberInfo.uid
        },
        success: function(e) {
            console.log("payyyy"), 0 == e.data.data.error ? a.doServices() : 2 == e.data.data.error && a.doElseServices();
        }
    }) : (app.util.getUserInfo(), !1) : (app.util.getUserInfo(function(e) {
        t.oldhouseinit();
    }), !1);
}), _Page));