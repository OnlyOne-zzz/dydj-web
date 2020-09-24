var _Page;

function _defineProperty(a, e, n) {
    return e in a ? Object.defineProperty(a, e, {
        value: n,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : a[e] = n, a;
}

var R_htmlToWxml = require("../../resource/js/htmlToWxml.js"), imageUtil = require("../../resource/js/images.js"), app = getApp();

Page((_defineProperty(_Page = {
    data: {},
    onShow: function(a) {
        var e = this;
        0 < wx.getStorageSync("loginid") && wx.navigateTo({
            url: "/weixinmao_jz/pages/companylogin/index"
        }), app.util.request({
            url: "entry/wxapp/Intro",
            success: function(a) {
                a.data.message.errno || (wx.setStorageSync("companyinfo", a.data.data.intro), 
                e.setData({
                    intro: a.data.data.intro,
                    banners: a.data.data.bannerlist
                }));
            },
            complete: function() {
                wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
            }
        });
    },

    getPhoneNumber2(detail, code){
        app.util.request({
            url: "接口地址",
            data: {
                code: code,
                iv: detail.iv,
                encryptedData: detail.encryptedData
            },
            cachetime: 0,
            showLoading: !1,
            success: function(res) {
                //获取电话号码明文
                //返现到按钮中
            }
        });
    },
    getUserInfo(detail, code){
      //获取本JS全局电话号码
      if(1){  //判断全局电话号码不存在
        wx.showModal({
            title: "提示",
            content: "手机号码不能为空",
            showCancel: !1
        });
      }else{
        app.util.request({
            url: "接口地址",
            data: {
                code: code,
                iv: detail.iv,
                encryptedData: detail.encryptedData,
                phoneNumber:""
            },
            cachetime: 0,
            showLoading: !1,
            success: function(res) {
                //获取用户个人信息
                //保存到全局缓存中
            }
        });
      }
    },
    getPhoneNumber (e) {
        console.log(e)
        console.log(e.detail.errMsg)
        console.log(e.detail.iv)
        console.log(e.detail.encryptedData);
        wx.login({
            success (res) {
              if (res.code) {
                app.util.request({
                    url: "auth/session/openid",
                    data: {
                        code: e || ""
                    },
                    cachetime: 0,
                    showLoading: !1,
                    success: function(e) {
                        console.log(e);

                    }
                });
                //发起网络请求
                console.log(res);
              } else {
                console.log('登录失败！' + res.errMsg)
              }
            }
          })
      },
    goregister: function(a) {
        var e = wx.getStorageSync("companyid"), n = wx.getStorageSync("userInfo");
        app.util.request({
            url: "entry/wxapp/Editcompanyinit",
            data: {
                companyid: e,
                sessionid: n.sessionid,
                uid: n.memberInfo.uid
            },
            success: function(a) {
                a.data.message.errno || (1 == a.data.data.isbind ? wx.showModal({
                    title: "提示",
                    content: "您已经入驻过平台",
                    showCancel: !1
                }) : 2 == a.data.data.isbind ? wx.navigateTo({
                    url: "/weixinmao_jz/pages/paycompanyrole/index"
                }) : 3 == a.data.data.isbind ? wx.showModal({
                    title: "提示",
                    content: "您的入驻信息正在审核中，请耐心等待！",
                    showCancel: !1
                }) : wx.navigateTo({
                    url: "/weixinmao_jz/pages/joinagree/index"
                }));
            }
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
    onLoad: function() {
        wx.setNavigationBarTitle({
            title: wx.getStorageSync("companyinfo").name
        }), 
        wx.setNavigationBarColor({
            frontColor: "#ffffff",
            backgroundColor: "#3C9BDF",
            animation: {
                duration: 400,
                timingFunc: "easeIn"
            }
        })
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        wx.showNavigationBarLoading(), this.onLoad();
    },
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    bindSave: function(a) {
        console.log(a.detail.formId);
        var e = wx.getStorageSync("userInfo"), n = a.detail.value.name, o = a.detail.value.password;
        "" != n ? "" != o ? app.util.request({
            url: "entry/wxapp/companylogin",
            data: {
                name: n,
                password: o,
                uid: e.memberInfo.uid
            },
            success: function(a) {
                if (0 != a.data.errno) return wx.hideLoading(), void wx.showModal({
                    title: "失败",
                    content: a.data.data.msg,
                    showCancel: !1
                });
                1 == a.data.data.error ? wx.showModal({
                    title: "登录提示",
                    content: a.data.data.msg,
                    showCancel: !1
                }) : 2 == a.data.data.error ? wx.navigateTo({
                    url: "/weixinmao_jz/pages/paycompanyrole/index"
                }) : wx.showToast({
                    title: "登录成功",
                    icon: "success",
                    duration: 2e3,
                    success: function() {
                        console.log(a.data.data.loginid), wx.setStorageSync("loginid", a.data.data.loginid), 
                        wx.redirectTo({
                            url: "/weixinmao_jz/pages/companylogin/index"
                        });
                    }
                });
            }
        }) : wx.showModal({
            title: "提示",
            content: "请填写登录密码",
            showCancel: !1
        }) : wx.showModal({
            title: "提示",
            content: "请填写登录账号",
            showCancel: !1
        });
    }
}, "onShareAppMessage", function() {
    return {
        title: "申请入驻" + wx.getStorageSync("companyname").name,
        path: "/weixinmao_zp/pages/message/index"
    };
}), _defineProperty(_Page, "checkuser", function(e) {
    var n = this, a = (e = e, wx.getStorageSync("userInfo"));
    return a ? a.memberInfo.uid ? void app.util.request({
        url: "entry/wxapp/checkuserinfo",
        data: {
            sessionid: a.sessionid,
            uid: a.memberInfo.uid
        },
        success: function(a) {
            0 == a.data.data.error ? (console.log(e), e.doServices()) : 2 == a.data.data.error && e.doServices();
        }
    }) : (console.log("tmddddsssssqqqqs1111"), app.util.getUserInfo(function(a) {
        n.setData({
            userinfo: a
        });
    }), !1) : (console.log("tmddddssssss222222"), app.util.getUserInfo(function(a) {
        e.doServices(), n.setData({
            userinfo: a
        });
    }), !1);
}), _Page));