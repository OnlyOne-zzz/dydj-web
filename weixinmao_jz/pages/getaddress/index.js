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
        listid: "",
        ison: 0,
        lat:"",
        lng:"",
        addressId:0

    },
    onLoad: function(a) {
        var t = this;
        if (wx.setNavigationBarTitle({
            title: "我的地址"
        }), "" != t.data.listid) t.data.listid; else {
            a.listid;
            t.data.listid = a.listid;
        }
        if(0!=t.data.addressId) t.data.addressId=0;else{
            t.data.addressId = a.addressId;   
        }
        if(t.data.addressId>0){
            var editAddress = wx.getStorageSync('editAddress');
            this.data.lat = editAddress.lat;
            this.data.lng = editAddress.lng;
            this.setData({
                editAddress:editAddress
            })
        }
        t.setData({
            isshow: !0
        }), console.log(t.data.listid), t.oldhouseinit();
    },
    oldhouseinit: function(a) {
        var t = this, e = wx.getStorageSync("userInfo");
        app.util.request({
            url: "entry/wxapp/Intro",
            data: {
                listid: t.data.listid,
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
                }), t.setData({
                    intro: a.data.data.intro,
                    isshow: !1
                }));
            },
            complete: function() {
                wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
            }
        });
    },
    getaddress: function() {
        var t = this;
        wx.chooseLocation({
            success: function(a) {
                console.log(a.name), console.log(a.latitude), console.log(a.longitude), t.data.lat = a.latitude, 
                t.data.lng = a.longitude, t.setData({
                    address: a.name
                });
            },
            fail: function(a) {
                console.log(a);
            },
            complete: function() {}
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
    savepubinfo: function(a) {
        
        var t = this, e = wx.getStorageSync("userInfo"), i = a.detail.value.name, o = a.detail.value.tel, n = (t.data.date, 
        t.data.datetime, a.detail.value.address), s = a.detail.value.daddress, d = (a.detail.value.content, 
        a.detail.formId), l = t.data.ison;
        if ("" != i) if ("" != o) if ("" != n) if ("" != s) {
            var r = {
                sessionid: e.sessionid,
                listid: t.data.listid,
                uid: e.memberInfo.uid,
                name: i,
                tel: o,
                address: n,
                daddress: s,
                ison: l,
                form_id: d,
                lat:t.data.lat,
                lng:t.data.lng,
                id:t.data.addressId
            };
            app.util.request({
                url: "entry/wxapp/saveaddress",
                data: r,
                success: function(a) {
                    console.log(a)
                    return 0 != a.data.errno ? (wx.hideLoading(), void wx.showModal({
                        title: "失败",
                        content: "提交失败",
                        showCancel: !1
                    })) : 0 != a.data.data.error ? (wx.hideLoading(), void wx.showModal({
                        title: "失败",
                        content: "提交失败",
                        showCancel: !1
                    })) : (wx.setStorageSync("addressinfo", a.data.data.addressinfo), void wx.navigateBack({
                        changed: !0
                    }));
                }
            });
        } else wx.showModal({
            title: "提示",
            content: "请填写详细地址",
            showCancel: !1
        }); else wx.showModal({
            title: "提示",
            content: "请获取地址",
            showCancel: !1
        }); else wx.showModal({
            title: "提示",
            content: "请填写电话",
            showCancel: !1
        }); else wx.showModal({
            title: "提示",
            content: "请填写姓名",
            showCancel: !1
        });
    },
    onReady: function() {
       
    },
    switchOn: function(a) {
        a.detail.value ? this.data.ison = 1 : this.data.ison = 0;
    },
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        wx.showNavigationBarLoading(), this.onLoad();
    },
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
    uploadimg: function(a, o) {
        var t = app.util.geturl({
            url: "entry/wxapp/upload"
        });
        o = o;
        wx.showToast({
            icon: "loading",
            title: "正在上传"
        });
        var n = this;
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
                if (200 == a.statusCode) for (var e = t.data.path, i = 0; i < n.data.uploadimagelist.length; i++) {
                    i + 1 == o && (n.data.uploadimagelist[i] = e);
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