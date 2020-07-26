var _data;

function _defineProperty(a, e, t) {
    return e in a ? Object.defineProperty(a, e, {
        value: t,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : a[e] = t, a;
}

var R_htmlToWxml = require("../../resource/js/htmlToWxml.js"), imageUtil = require("../../resource/js/images.js"), app = getApp();

Page(_defineProperty({
    data: (_data = {
        images: {},
        autoplay: !0,
        interval: 3e3,
        duration: 1e3,
        title: "",
        address: "",
        lat: 0,
        lng: 0,
        id: 0
    }, _defineProperty(_data, "title", ""), _defineProperty(_data, "isuser", !0), _data),
    imageLoad: function(a) {
        var e = imageUtil.imageUtil(a);
        this.setData({
            imagewidth: e.imageWidth,
            imageheight: e.imageHeight
        });
    },
    onLoad: function(a) {
        wx.setNavigationBarTitle({
            title: wx.getStorageSync("companyinfo").name
        });
        var e = wx.getStorageSync("companyid"), t = !0;
        0 < e && (t = !1);
        var i = this;
        if (0 < this.data.id) var n = this.data.id; else {
            n = a.id;
            this.data.id = a.id;
        }
        var o = wx.getStorageSync("userInfo");
        console.log(o), i.data.isuser = !!o, i.setData({
            isuser: i.data.isuser
        }), app.util.request({
            url: "entry/wxapp/Getnotedetail",
            data: {
                id: n
            },
            success: function(a) {
                a.data.message.errno || (i.data.title = a.data.data.workerdetail.name, wx.setNavigationBarTitle({
                    title: i.data.title + "-" + wx.getStorageSync("companyinfo").name
                }), i.setData({
                    data: a.data.data.workerdetail,
                    showcontact: t,
                    typelist: a.data.data.typelist,
                    isuser: i.data.isuser
                }));
            },
            complete: function() {
                wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
            }
        });
    },
    toMessage: function(a) {
        a.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/weixinmao_zp/pages/message/index"
        });
    },
    toNotemessage: function(a) {
        var e = a.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/weixinmao_jz/pages/notemessage/index?id=" + e
        });
    },
    bindGetUserInfo: function(a) {
        var e = this;
        app.util.getUserInfo(function(a) {
            e.data.isuser = !0, e.setData({
                userinfo: a,
                isuser: e.data.isuser
            });
        }, a.detail);
    },
    doSendmsg: function(a) {
        var i = this, n = (a.currentTarget.dataset.tel, a.detail.formId);
        wx.showModal({
            title: "邀请面试",
            content: "确认邀请面试？",
            success: function(a) {
                if (a.confirm) {
                    var e = wx.getStorageSync("companyid"), t = i.data.id;
                    console.log("a" + t), console.log("b" + e), console.log("c" + n), app.util.request({
                        url: "entry/wxapp/Sendinvatejob",
                        data: {
                            id: t,
                            companyid: e,
                            form_id: n
                        },
                        success: function(a) {
                            a.data.message.errno;
                        }
                    });
                }
            }
        });
    },
    goMap: function(a) {
        var e = this;
        console.log(e.data.lat), console.log(e.data.lng), wx.openLocation({
            latitude: e.data.lat,
            longitude: e.data.lng,
            scale: 28,
            name: e.data.title,
            address: e.data.address
        });
    },
    doCall: function(a) {
        console.log(a.currentTarget);
        var e = a.currentTarget.dataset.tel;
        wx.makePhoneCall({
            phoneNumber: e,
            success: function() {
                console.log("拨打电话成功！");
            },
            fail: function() {
                console.log("拨打电话失败！");
            }
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
    onShareAppMessage: function() {}
}, "onShareAppMessage", function() {
    return console.log(this.data.id), {
        title: this.data.title + "-" + wx.getStorageSync("companyinfo").name,
        path: "/weixinmao_zp/pages/workerdetail/index?id=" + this.data.id
    };
}));