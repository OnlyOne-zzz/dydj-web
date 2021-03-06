var qqmapsdk, QQMapWX = require("../../resource/js/qqmap-wx-jssdk.min.js"), config = require("../../resource/js/config.js"), markersData = [], app = getApp();

Page({
    data: {
        autoplay: !0,
        interval: 3e3,
        duration: 1e3,
        isshow: !0
    },
    onLoad: function(a) {
        var t = this;
        t.setData({
            isshow: t.data.isshow
        }), 
        wx.setNavigationBarTitle({
            title: "项目列表" 
        }), wx.setNavigationBarColor({
            frontColor: "#ffffff",
            backgroundColor: "#3C9BDF",
            animation: {
                duration: 400,
                timingFunc: "easeIn"
            }
        });
        app.util.request({
            url: "entry/wxapp/Intro",
            success: function(a) {
                console.log(a)
                // a.data.message.errno 
                t.setData({
                    intro: a.data.data.intro,
                    catelist: a.data.data.catelist,
                    banners: a.data.data.bannerlist,
                    msgList: a.data.data.noticelist,
                    isshow: !1
                });
            },
            complete: function() {
                wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
            }
        });
        app.util.request({
            url: "entry/wxapp/Getinfo",
            success: function(a) {
                console.log(a)
                if(!a.data.message.errno){
                    t.setData({
                        contentList: a.data.data.list
                    })
                }
            },
            complete: function() {
                wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
            }
        });
    },
    toList: function(a) {
        var t = a.currentTarget.id;
        wx.navigateTo({
             // url: "/weixinmao_jz/pages/article/index?id=" + t
            url: "/weixinmao_jz/pages/contentdetail/index?id=" + t
        });
    },
    toSearch: function(a) {
        wx.navigateTo({
            url: "/weixinmao_jz/pages/search/index"
        });
    },
    onReady: function() {},
    bindInput: function(a) {
        this.setData({
            inputValue: a.detail.value
        }), this.onShow();
    },
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        wx.showNavigationBarLoading(), this.onLoad();
    },
    doCall: function() {
        var a = this.data.textData.shop_tel;
        wx.makePhoneCall({
            phoneNumber: a
        });
    },
    onShareAppMessage: function() {
        return {
            title: wx.getStorageSync("companyinfo").name,
            path: "/weixinmao_jz/pages/index/index"
        };
    }
});