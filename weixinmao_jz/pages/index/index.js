var qqmapsdk, QQMapWX = require("../../resource/js/qqmap-wx-jssdk.min.js"), config = require("../../resource/js/config.js"), markersData = [], app = getApp();

Page({
    data: {
        autoplay: !0,
        interval: 3e3,
        duration: 1e3,
        showmsg: !0,
        isshow: !0,
        isright: 0,
        isuser: !0,
        tel: ""
    },
    onShow: function() {
        var _this=this;
        var a = wx.getStorageSync("cityinfo");
        a && (wx.setStorageSync("city", a.name), _this.initpage());
        var o = wx.getStorageSync("userInfo");
        console.log(o), o && o.hasOwnProperty("wxInfo") && (_this.data.isuser = !0, _this.setData({
            isuser: _this.data.isuser
        }));
    },
    onLoad: function(a) {
        var n = this;
        if (a && a.hasOwnProperty("scene")) {
            var t = decodeURIComponent(a.scene).split("="), e = parseInt(t[1]);
            wx.setStorageSync("tid", e);
        }
        var i = wx.getStorageSync("cityinfo");
        i ? (wx.setStorageSync("city", i.name), n.initpage()) : (qqmapsdk = new QQMapWX({
            key: config.Config.key
        }), wx.getLocation({
            type: "gcj02",
            success: function(a) {
                wx.setStorageSync("latitude", a.latitude), wx.setStorageSync("longitude", a.longitude), 
                qqmapsdk.reverseGeocoder({
                    location: {
                        latitude: a.latitude,
                        longitude: a.longitude
                    },
                    success: function(a) {
                        var t = a.result.address_component.city, e = t.substr(0, t.length - 1);
                        wx.setStorageSync("city", e), n.initpage();
                    }
                });
            },
            fail: function() {
                n.initpage();
            },
            complete: function() {}
        }));
    },
    initpage: function() {
        var e = this, a = wx.getStorageSync("city");
        console.log(a), app.util.request({
            url: "entry/wxapp/Intro",
            data: {
                city: a
            },
            success: function(a) {
                if (!a.data.message.errno) {
                    if (wx.setStorageSync("companyinfo", a.data.data.intro), wx.setStorageSync("cityinfo", a.data.data.cityinfo), 
                    wx.setNavigationBarTitle({
                        title: wx.getStorageSync("companyinfo").name
                    }), a.data.data.intro.maincolor || (a.data.data.intro.maincolor = "#09ba07"), wx.setNavigationBarColor({
                        frontColor: "#ffffff",
                        backgroundColor: a.data.data.intro.maincolor,
                        animation: {
                            duration: 400,
                            timingFunc: "easeIn"
                        }
                    }), e.data.tel = a.data.data.intro.tel, 0 == a.data.data.intro.isright) e.data.isright = 0, 
                    e.data.isuser = !0, e.setData({
                        isuser: !0
                    }); else {
                        var t = wx.getStorageSync("userInfo");
                        t ? t.hasOwnProperty("wxInfo") && (e.data.isuser = !0, e.setData({
                            isuser: e.data.isuser
                        })) : (e.data.isuser = !1, e.setData({
                            isuser: e.data.isuser
                        }));
                    }
                    e.setData({
                        intro: a.data.data.intro,
                        catelist: a.data.data.catelist,
                        banners: a.data.data.bannerlist,
                        notelist: a.data.data.notelist,
                        couponlist: a.data.data.couponlist,
                        msgList: a.data.data.noticelist,
                        isshow: !1,
                        navlist: a.data.data.navlist,
                        ordertype: a.data.data.ordertype,
                        cityinfo: a.data.data.cityinfo,
                        msgcontentlist:a.data.data.msgcontentlist
                    });
                }
            },
            complete: function() {
                wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
            }
        });
    },
    toWxapp: function(a) {
        var t = a.currentTarget.dataset.url, e = a.currentTarget.dataset.appid;
        console.log(t), console.log(e), wx.navigateToMiniProgram({
            appId: e,
            path: t,
            extraData: {
                foo: "bar"
            },
            envVersion: "develop",
            success: function(a) {}
        });
    },
    toUser: function() {
        wx.switchTab({
            url: "/weixinmao_jz/pages/user/index"
        });
    },
    // toMycoupon: function() {
    //     wx.navigateTo({
    //         url: "/weixinmao_jz/pages/mycoupon/index"
    //     });
    // },
    toInnerUrl: function(a) {
        var t = a.currentTarget.dataset.url;
        wx.navigateTo({
            url: t
        });
    },
    toMenuUrl: function(a) {
        var t = a.currentTarget.dataset.url;
        wx.switchTab({
            url: t
        });
    },
    givecoupon: function(a) {
        var t = a.currentTarget.id, e = this, n = wx.getStorageSync("userInfo");
        return console.log(n), n && n.hasOwnProperty("wxInfo") ? (e.data.isuser = !0, void app.util.request({
            url: "entry/wxapp/givecoupon",
            data: {
                pid: t,
                sessionid: n.sessionid,
                uid: n.memberInfo.uid
            },
            success: function(a) {
                a.data.message.errno || (a.data.data.error, wx.showToast({
                    title: a.data.data.msg,
                    icon: "success",
                    duration: 2e3
                }));
            }
        })) : (e.data.isuser = !1, void e.setData({
            isuser: e.data.isuser
        }));
    },
    closeUp: function(a){
        console.log('000')
        this.setData({
            isuser: !0
        })
        console.log(this.data.isuser)
    },
    toLogin: function(a) {
        0 < wx.getStorageSync("companyid") ? wx.navigateTo({
            url: "/weixinmao_jz/pages/companylogin/index"
        }) : wx.navigateTo({
            url: "/weixinmao_jz/pages/login/index"
        });
    },
    bindGetUserInfo: function(a) {
        var o = this;
        app.util.getUserInfo(function(t) {
            console.log(t), o.data.isuser = !0;
            var a = t.memberInfo.uid, e = t.wxInfo.nickName, n = t.wxInfo.avatarUrl;
            0 < (o.data.uid = a) && (o.setData({
                userinfo: t,
                isphone: !1,
                isuser: o.data.isuser
            }), wx.setStorageSync("userInfo", t), app.util.request({
                url: "entry/wxapp/Updateuserinfo",
                data: {
                    uid: a,
                    nickname: e,
                    avatarUrl: n
                },
                success: function(a) {
                    a.data.message.errno || (o.data.isphone = a.data.data.isphone, o.setData({
                        userinfo: t,
                        isphone: o.data.isphone,
                        isuser: !0
                    }));
                }
            }));
        }, a.detail);
    },
    close:function(a){
            console.log("关闭弹框")
    },
    toList: function(a) {
        var t = a.currentTarget.dataset.id;
        console.log(t)
        wx.navigateTo({
            url: "/weixinmao_jz/pages/contentdetail/index?id=" + t
        });
    },
    toNotemessage: function(a) {
        var t = a.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/weixinmao_jz/pages/notemessage/index?id=" + t
        });
    },
    toNotelist: function() {
        wx.switchTab({
            url: "/weixinmao_jz/pages/notelist/index"
        });
    },
    toMycoupon: function() {
        let userInfo = wx.getStorageSync("userInfo");
        if(userInfo ==undefined || userInfo ==null || userInfo =='' ){
            wx.navigateTo({
                url: "/weixinmao_jz/pages/login-customer/index" 
            });
        }else{
            wx.navigateTo({
                url: "/weixinmao_jz/pages/mycoupon/index"
            });
        }
       
    },
    tabClick: function(a) {
        var t = this, e = a.currentTarget.id;
        app.util.request({
            url: "entry/wxapp/changenotelist",
            data: {
                ordertype: e
            },
            success: function(a) {
                a.data.message.errno || t.setData({
                    notelist: a.data.data.notelist,
                    ordertype: e
                });
            }
        }), t.setData({
            ordertype: e
        });
    },
    toNewHouse: function(a) {
        wx.navigateTo({
            url: "/weixinmao_jz/pages/newhouselist/index"
        });
    },
    toServiceorder: function() {
        wx.navigateTo({
            url: "/weixinmao_jz/pages/serviceorder/index"
        });
    },
    toGuestHouse: function(a) {
        wx.navigateTo({
            url: "/weixinmao_house/pages/guesthouselist/index"
        });
    },
    toOldHouse: function(a) {
        wx.switchTab({
            url: "/weixinmao_house/pages/oldhouselist/index"
        });
    },
    toletHouseDetail: function(a) {
        var t = a.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/weixinmao_house/pages/lethousedetail/index?id=" + t
        });
    },
    toAgentlist: function(a) {
        wx.navigateTo({
            url: "/weixinmao_house/pages/agentlist/index"
        });
    },
    toArticle: function(a) {
        wx.navigateTo({
            url: "/weixinmao_house/pages/salelist/index"
        });
    },
    toActive: function(a) {
        wx.navigateTo({
            url: "/weixinmao_house/pages/active/index"
        });
    },
    toNewHouseDetail: function(a) {
        var t = a.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/weixinmao_house/pages/newhousedetail/index?id=" + t
        });
    },
    toNoteDetail: function(a) {
        var t = a.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/weixinmao_jz/pages/notedetail/index?id=" + t
        });
    },
    toCompanyNoteDetail: function(a) {
        var t = a.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/weixinmao_jz/pages/companynotedetail/index?id=" + t
        });
    },
    toLethouse: function(a) {
        var t = a.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/weixinmao_house/pages/lethouselist/index?id=" + t
        });
    },
    toMessage: function(a) {
        wx.navigateTo({
            url: "/weixinmao_house/pages/message/index"
        });
    },
    toSearch: function(a) {
        wx.navigateTo({
            url: "/weixinmao_jz/pages/search/index"
        });
    },
    PubOldhouse: function(a) {
        var t = this;
        wx.navigateTo({
            url: "/weixinmao_house/pages/pub/index",
            success: function() {
                t.data.showmsg = !0, t.setData({
                    showmsg: t.data.showmsg
                });
            }
        });
    },
    PubLethouse: function(a) {
        var t = this;
        wx.navigateTo({
            url: "/weixinmao_house/pages/letpub/index",
            success: function() {
                t.data.showmsg = !0, t.setData({
                    showmsg: t.data.showmsg
                });
            }
        });
    },
    toSaleOldPub: function(a) {
        var t = this;
        wx.navigateTo({
            url: "/weixinmao_house/pages/saleoldpub/index",
            success: function() {
                t.data.showmsg = !0, t.setData({
                    showmsg: t.data.showmsg
                });
            }
        });
    },
    toSalePub: function(a) {
        var t = this;
        wx.navigateTo({
            url: "/weixinmao_house/pages/salepub/index",
            success: function() {
                t.data.showmsg = !0, t.setData({
                    showmsg: t.data.showmsg
                });
            }
        });
    },
    toSaleBuyPub: function(a) {
        var t = this;
        wx.navigateTo({
            url: "/weixinmao_house/pages/salebuypub/index",
            success: function() {
                t.data.showmsg = !0, t.setData({
                    showmsg: t.data.showmsg
                });
            }
        });
    },
    toSaleLetPub: function(a) {
        var t = this;
        wx.navigateTo({
            url: "/weixinmao_house/pages/saleletpub/index",
            success: function() {
                t.data.showmsg = !0, t.setData({
                    showmsg: t.data.showmsg
                });
            }
        });
    },
    goPub: function(a) {
        this.data.showmsg = !1, this.setData({
            showmsg: this.data.showmsg
        });
    },
    closemsg: function(a) {
        this.data.showmsg = !0, this.setData({
            showmsg: this.data.showmsg
        });
    },
    goMap: function(a) {
        wx.openLocation({
            latitude: parseFloat(wx.getStorageSync("companyinfo").lat),
            longitude: parseFloat(wx.getStorageSync("companyinfo").lng),
            scale: 18,
            name: wx.getStorageSync("companyinfo").name,
            address: wx.getStorageSync("companyinfo").address
        });
    },
    onReady: function() {},
    bindInput: function(a) {
        this.setData({
            inputValue: a.detail.value
        }), this.onShow();
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        wx.showNavigationBarLoading(), this.onShow();
    },
    // doCall: function() {
    //     var a = this.data.tel;
    //     wx.makePhoneCall({
    //         phoneNumber: a
    //     });
    // },
    onShareAppMessage: function() {
        return {
            title: wx.getStorageSync("companyinfo").name,
            path: "/weixinmao_jz/pages/index/index"
        };
    }
});