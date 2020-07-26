function _defineProperty(a, t, e) {
    return t in a ? Object.defineProperty(a, t, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : a[t] = e, a;
}

var app = getApp();

Page(_defineProperty({
    data: {},
    onLoad: function(a) {
        wx.setNavigationBarTitle({
            title: "业务查询"
        }), this.setData({
            loadmore: !0
        });
    },
    onReady: function() {},
    onShow: function() {
        this.setData({
            loadmore: !0
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    bindSave: function(a) {
        var t = this, e = a.detail.value.keyword;
        "" != e ? app.util.request({
            url: "entry/wxapp/search",
            data: {
                keyword: e
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
            }
        }) : wx.showModal({
            title: "提示",
            content: "请输入业务相关信息",
            showCancel: !1
        });
    },
    SelectChange: function(a) {
        var t = this;
        console.log(a.detail.value);
        var e, o = a.detail.value, n = 0, i = "";
        if (0 < o.length) {
            for (var r = 0; r < o.length; r++) e = o[r].split("@"), n += parseFloat(e[0]), i = i + e[1] + "@";
            console.log(i);
        }
        t.data.listid = i, t.data.totalprice = n, t.setData({
            totalprice: n
        });
    },
    tabClick: function(a) {
        var t = a.currentTarget.id, e = this;
        app.util.request({
            url: "entry/wxapp/getsecondlist",
            data: {
                pid: t
            },
            success: function(a) {
                a.data.message.errno || e.setData({
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
    toOrder: function() {
        var a = this;
        0 != a.data.totalprice ? (console.log(a.data.listid), wx.navigateTo({
            url: "/weixinmao_jz/pages/message/index?listid=" + a.data.listid
        })) : wx.showModal({
            title: "提示",
            content: "请选择服务项目",
            showCancel: !1
        });
    }
}, "onShareAppMessage", function() {
    return {
        title: "信息综合查询-" + wx.getStorageSync("companyinfo").name,
        path: "/weixinmao_jz/pages/search/index"
    };
}));