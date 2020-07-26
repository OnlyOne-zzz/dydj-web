var app = getApp();

Page({
    data: {
        autoplay: !0,
        interval: 3e3,
        duration: 1e3,
        listid: "",
        totalprice: 0,
        id: 0,
        isding: 0
    },
    onLoad: function(a) {
        if (wx.setNavigationBarTitle({
            title: "服务列表-" + wx.getStorageSync("companyinfo").name
        }), 0 < this.data.id) this.data.id; else {
            a.id;
            this.data.id = a.id;
        }
        var t = this;
        t.setData({
            isshow: !0,
            isding: t.data.isding
        }), app.util.request({
            url: "entry/wxapp/getarticle",
            data: {
                id: this.data.id
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
                    category: a.data.data.category,
                    article: a.data.data.article,
                    activeCategoryId: a.data.data.activeCategoryId,
                    totalprice: 0,
                    intro: a.data.data.intro,
                    isshow: !1
                }));
            },
            complete: function() {
                wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
            }
        });
    },
    toContentorderdetail: function(a) {
        var t = a.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/weixinmao_jz/pages/contentorderdetail/index?id=" + t
        });
    },
    radioChange: function(a) {
        var t = this, i = a.detail.value.split("@");
        console.log(i), t.data.listid = i[1], t.data.totalprice = i[0], t.data.isding = i[2], 
        t.setData({
            totalprice: t.data.totalprice,
            isding: t.data.isding
        });
    },
    SelectChange: function(a) {
        var t = this;
        console.log(a.detail.value);
        var i, e = a.detail.value, o = 0, n = "";
        if (0 < e.length) {
            for (var d = 0; d < e.length; d++) i = e[d].split("@"), o += parseFloat(i[0]), n = n + i[1] + "@";
            console.log(n);
        }
        t.data.listid = n, t.data.totalprice = o, t.setData({
            totalprice: o
        });
    },
    tabClick: function(a) {
        var t = a.currentTarget.id, i = this;
        app.util.request({
            url: "entry/wxapp/getsecondlist",
            data: {
                pid: t
            },
            success: function(a) {
                a.data.message.errno || i.setData({
                    article: a.data.data,
                    activeCategoryId: t
                });
            }
        });
    },
    toNewsDetail: function(a) {
        var t = a.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/weixinmao_jz/pages/newsdetail/index?id=" + t
        });
    },
    toOrder: function(a) {
        var t = this;
        if (console.log(t.data.listid), "" != t.data.listid) {
            var i = wx.getStorageSync("userInfo"), e = a.detail.formId, o = wx.getStorageSync("cityinfo"), n = {
                sessionid: i.sessionid,
                listid: t.data.listid,
                uid: i.memberInfo.uid,
                form_id: e,
                cityid: o.id
            };
            app.util.request({
                url: "entry/wxapp/newsaveorder",
                data: n,
                success: function(a) {
                    if (0 != a.data.errno) return wx.hideLoading(), void wx.showModal({
                        title: "失败",
                        content: "提交失败",
                        showCancel: !1
                    });
                    if (0 != a.data.data.error) return wx.hideLoading(), void wx.showModal({
                        title: "失败",
                        content: "提交失败",
                        showCancel: !1
                    });
                    var t = a.data.data.orderid;
                    wx.showToast({
                        title: "提交成功",
                        icon: "success",
                        duration: 2e3,
                        success: function(a) {
                            console.log(a), wx.navigateTo({
                                url: "/weixinmao_jz/pages/done/index?orderid=" + t
                            });
                        }
                    });
                }
            });
        } else wx.showModal({
            title: "提示",
            content: "请选择服务项目",
            showCancel: !1
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        wx.showNavigationBarLoading(), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
    },
    onReachBottom: function() {
        wx.showNavigationBarLoading(), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
    },
    onShareAppMessage: function() {
        return {
            title: "服务列表-" + wx.getStorageSync("companyinfo").name,
            path: "/weixinmao_jz/pages/article/index"
        };
    }
});