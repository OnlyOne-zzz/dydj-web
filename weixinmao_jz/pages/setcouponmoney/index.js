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
        id: 0
    },
    onLoad: function(a) {
        var t = this;
        wx.setNavigationBarTitle({
            title: "预约详单报价"
        }), t.data.id = a.id, t.checkuser({
            doServices: function() {
                t.oldhouseinit();
            },
            doElseServices: function() {
                t.oldhouseinit();
            }
        });
    },
    oldhouseinit: function(a) {
        var t = this, e = wx.getStorageSync("userInfo");
        app.util.request({
            url: "entry/wxapp/Getpubinit",
            data: {
                sessionid: e.sessionid,
                uid: e.memberInfo.uid
            },
            success: function(a) {
                a.data.message.errno || (a.data.data.intro.maincolor || (a.data.data.intro.maincolor = "#3274e5"), 
                wx.setNavigationBarColor({
                    frontColor: "#ffffff",
                    backgroundColor: a.data.data.intro.maincolor,
                    animation: {
                        duration: 400,
                        timingFunc: "easeIn"
                    }
                }), t.data.arealist = a.data.data.arealist, t.data.toplist = a.data.data.toplist, 
                t.setData({
                    intro: a.data.data.intro,
                    arealist: a.data.data.arealist,
                    toplist: a.data.data.toplist
                }));
            }
        });
    },
    bindAreaChange: function(a) {
        var t = this.data.arealist;
        t && (this.data.areaid = t[a.detail.value].id), this.setData({
            arealist: t,
            areaidindex: a.detail.value
        });
    },
    bindToplistChange: function(a) {
        var t = this.data.toplist;
        t && (this.data.toplistid = t[a.detail.value].id), this.setData({
            toplist: t,
            toplistidindex: a.detail.value
        });
    },
    upload: function(a) {
        var t = this;
        a = a;
        t.checkuser({
            doServices: function() {
                t.doupload(a);
            },
            doElseServices: function() {
                t.doupload(a);
            }
        });
    },
    doupload: function(a) {
        var e, i, o, s, r, n, u = this, d = parseInt(a.currentTarget.dataset.id);
        switch (d) {
          case 1:
            if (0 == u.data.true1) return;
            break;

          case 2:
            if (0 == u.data.true2) return;
            break;

          case 3:
            if (0 == u.data.true3) return;
            break;

          case 4:
            if (0 == u.data.true4) return;
            break;

          case 5:
            if (0 == u.data.true5) return;
            break;

          case 6:
            if (0 == u.data.true6) return;
        }
        wx.chooseImage({
            count: 1,
            sizeType: [ "compressed" ],
            sourceType: [ "album", "camera" ],
            success: function(a) {
                var t = a.tempFilePaths;
                switch (d) {
                  case 1:
                    if (e = t, console.log(u.data.true1), 0 == u.data.true1) return;
                    u.data.true1 = !1;
                    break;

                  case 2:
                    i = t, u.data.true2 = !1;
                    break;

                  case 3:
                    o = t, u.data.true3 = !1;
                    break;

                  case 4:
                    s = t, u.data.true4 = !1;
                    break;

                  case 5:
                    r = t, u.data.true5 = !1;
                    break;

                  case 6:
                    n = t, u.data.true6 = !1;
                }
                u.setData({
                    imgurl1: e,
                    imgurl2: i,
                    imgurl3: o,
                    imgurl4: s,
                    imgurl5: r,
                    imgurl6: n,
                    true1: u.data.true1,
                    true2: u.data.true2,
                    true3: u.data.true3,
                    true4: u.data.true4,
                    true5: u.data.true5,
                    true6: u.data.true6
                }), u.data.imagelist.push(t), u.uploadimg(t, d);
            }
        });
    },
    delupload: function(a) {
        var t = this, e = parseInt(a.currentTarget.dataset.id);
        switch (e) {
          case 1:
            t.setData({
                imgurl1: "",
                true1: !0
            });
            break;

          case 2:
            t.setData({
                imgurl2: "",
                true2: !0
            });
            break;

          case 3:
            t.setData({
                imgurl3: "",
                true3: !0
            });
            break;

          case 4:
            t.setData({
                imgurl4: "",
                true4: !0
            });
            break;

          case 5:
            t.setData({
                imgurl5: "",
                true5: !0
            });
            break;

          case 6:
            t.setData({
                imgurl6: "",
                true6: !0
            });
        }
        for (var i = 0; i < this.data.uploadimagelist.length; i++) {
            i + 1 == e && (this.data.uploadimagelist[i] = "");
        }
        console.log(this.data.uploadimagelist);
    },
    savepubinfo: function(a) {
        var t = wx.getStorageSync("userInfo"), e = this.data.id, i = a.detail.value.content, o = a.detail.value.money;
        if ("" != i) if ("" != o) if (o <= 0) wx.showModal({
            title: "提示",
            content: "请正确填写报价金额",
            showCancel: !1
        }); else {
            var s = {
                sessionid: t.sessionid,
                uid: t.memberInfo.uid,
                content: i,
                money: o,
                orderid: e,
                status: 2
            };
            app.util.request({
                url: "entry/wxapp/savemsgmoney",
                data: s,
                success: function(a) {
                    if (0 != a.data.errno) return wx.hideLoading(), void wx.showModal({
                        title: "失败",
                        content: a.data.data.msg,
                        showCancel: !1
                    });
                    wx.showToast({
                        title: "提交成功",
                        icon: "success",
                        duration: 2e3,
                        success: function(a) {
                            console.log(a), wx.navigateTo({
                                url: "/weixinmao_jz/pages/noteorder/index"
                            });
                        }
                    });
                }
            });
        } else wx.showModal({
            title: "提示",
            content: "请填写报价金额",
            showCancel: !1
        }); else wx.showModal({
            title: "提示",
            content: "请填写报价说明",
            showCancel: !1
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    uploadimg: function(a, o) {
        var t = app.util.geturl({
            url: "entry/wxapp/upload"
        });
        o = o;
        wx.showToast({
            icon: "loading",
            title: "正在上传"
        });
        var s = this;
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
                if (200 == a.statusCode) for (var e = t.data.path, i = 0; i < s.data.uploadimagelist.length; i++) {
                    i + 1 == o && (s.data.uploadimagelist[i] = e);
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
            e.getlethousedetail();
        }), !1);
    }
});