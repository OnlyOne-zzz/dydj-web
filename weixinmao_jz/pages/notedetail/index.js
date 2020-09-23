var _data;

function _defineProperty(a, t, e) {
    return t in a ? Object.defineProperty(a, t, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : a[t] = e, a;
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
    }, _defineProperty(_data, "title", ""), _defineProperty(_data, "isuser", !0), _defineProperty(_data, "ordertype", 1), 
    _data),
    imageLoad: function(a) {
        var t = imageUtil.imageUtil(a);
        this.setData({
            imagewidth: t.imageWidth,
            imageheight: t.imageHeight
        });
    },
    onLoad: function(a) {
        wx.setNavigationBarTitle({
            title: "技师详情"
        }),wx.setNavigationBarColor({
            frontColor: "#ffffff",
            backgroundColor: "#3C9BDF",
            animation: {
                duration: 400,
                timingFunc: "easeIn"
            }
        });
        var t = wx.getStorageSync("companyid"), e = !0;
        0 < t && (e = !1);
        var i = this;
        if (0 < this.data.id) var o = this.data.id; else {
            o = a.id;
            this.data.id = a.id;
        }
        var n = wx.getStorageSync("userInfo");
        console.log(n), i.data.isuser = !!n, i.setData({
            isuser: i.data.isuser,
            ordertype: i.data.ordertype,
            shopid: i.data.id
        }), app.util.request({
            url: "entry/wxapp/Getnotedetail",
            data: {
                id: o
            },
            success: function(a) {
                console.log("*****************")
                console.log(a)
                if(!a.data.message.errno){
                    i.data.title = a.data.data.workerdetail.name,
                    i.setData({
                       data: a.data.data.workerdetail,
                       showcontact: e,
                       typelist: a.data.data.typelist,
                       isuser: i.data.isuser,
                       intro: a.data.data.intro,
                       msgcontentlist: a.data.data.msgcontentlist,
                       comment:a.data.data.comment
                   });
                }
            },
            complete: function() {
                wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
            }
        });
    },
    tabClick: function(a) {
        var t = a.currentTarget.id;
        this.setData({
            ordertype: t
        });
    },
    toMessage: function(a) {
        a.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/weixinmao_zp/pages/message/index"
        });
    },
    toHouseDetail: function(a) {
        var t = a.currentTarget.dataset.id, e = a.currentTarget.dataset.shopid, n = this.data.id;
        console.log(e), wx.navigateTo({
            url: "/weixinmao_jz/pages/contentdetail/index?id=" + t + "&shopid=" + e+"&noteId=" +n
        });
    },
    toNotemessage: function(a) {
        var t = a.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/weixinmao_jz/pages/notemessage/index?id=" + t
        });
    },
    bindGetUserInfo: function(a) {
        var t = this;
        app.util.getUserInfo(function(a) {
            t.data.isuser = !0, t.setData({
                userinfo: a,
                isuser: t.data.isuser
            });
        }, a.detail);
    },
    doSendmsg: function(a) {
        var i = this, o = (a.currentTarget.dataset.tel, a.detail.formId);
        wx.showModal({
            title: "邀请面试",
            content: "确认邀请面试？",
            success: function(a) {
                if (a.confirm) {
                    var t = wx.getStorageSync("companyid"), e = i.data.id;
                    console.log("a" + e), console.log("b" + t), console.log("c" + o), app.util.request({
                        url: "entry/wxapp/Sendinvatejob",
                        data: {
                            id: e,
                            companyid: t,
                            form_id: o
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
        var t = this;
        console.log(t.data.lat), console.log(t.data.lng), wx.openLocation({
            latitude: t.data.lat,
            longitude: t.data.lng,
            scale: 28,
            name: t.data.title,
            address: t.data.address
        });
    },
    doCall: function(a) {
        console.log(a.currentTarget);
        var t = a.currentTarget.dataset.tel;
        wx.makePhoneCall({
            phoneNumber: t,
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
        path: "/weixinmao_jz/pages/notedetail/index?id=" + this.data.id
    };
}));