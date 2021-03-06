var R_htmlToWxml = require("../../resource/js/htmlToWxml.js"), imageUtil = require("../../resource/js/images.js"),qqmapsdk, QQMapWX = require("../../resource/js/qqmap-wx-jssdk.min.js"), config = require("../../resource/js/config.js"),app = getApp();
Page({
    data: {
        showmsg: !0,
        istype: 0,
        address:''
    },
    onLoad: function(o) {
        var _this = this;
        qqmapsdk = new QQMapWX({
            key: config.Config.key
        }),
        wx.setNavigationBarTitle({
            title: "技师中心"
        });
        wx.setNavigationBarColor({
            frontColor: "#ffffff",
            backgroundColor: "#3C9BDF",
            animation: {
                duration: 400,
                timingFunc: "easeIn"
            }
        });
        wx.getLocation({
            type: 'wgs84',
                success(res) {
                    const latitude = res.latitude
                    const longitude = res.longitude
                    _this.getLocal(latitude,longitude)
                }
            })
    },
    onReady: function() {},
    toOrderlist: function(o) {
        var a = o.currentTarget.dataset.id;
        console.log(a), wx.navigateTo({
            url: "/weixinmao_house/pages/orderlist/index?id=" + a
        });
    },
    toMynote: function(o) {
        0 == this.data.istype ? wx.navigateTo({
            url: "/weixinmao_jz/pages/mynote/index"
        }) : wx.navigateTo({
            url: "/weixinmao_jz/pages/mycompanynote/index"
        });
    },
    toGetmoney: function() {
        wx.navigateTo({
            url: "/weixinmao_jz/pages/getmoney/index"
        });
    },
    toNoteorder: function(obj) {
        let ordertype = obj.currentTarget.dataset.type;
        wx.navigateTo({
            url: "/weixinmao_jz/pages/noteorder/index?ordertype="+ordertype
        });
    },
    toShopmsg: function(o) {
        wx.navigateTo({
            url: "/weixinmao_jz/pages/shopmsg/index"
        });
    },
    toMyorder: function(o) {
        wx.navigateTo({
            url: "/weixinmao_jz/pages/myorder/index"
        });
    },
    toRoborder: function(o) {
        wx.navigateTo({
            url: "/weixinmao_jz/pages/roborder/index"
        });
    },
    loginout: function(o) {
        wx.removeStorage({
          key: 'loginid',
        }),
        wx.switchTab({
            // url: "/weixinmao_jz/pages/login/index"
            url: "/weixinmao_jz/pages/index/index"
        });
    },
    online: function(a) {
        var _this=this;
        let serviceStatus = a.currentTarget.dataset.status;
        let loginid = wx.getStorageSync("loginid");
        if(serviceStatus==1){
            serviceStatus=2;    
        }else{
            serviceStatus=1;
        }
        let onlineObj= {
            loginid:loginid,
            serviceStatus:serviceStatus
         };
        app.util.request({
            url: "entry/wxapp/NoteOnline",
            data: onlineObj,
            success: function(a) {
                _this.onShow()
            }
        });
    },
    doCall: function() {
       var u = wx.getStorageSync("userInfo"), loginid = wx.getStorageSync("loginid");
       let send= {
            uid: u.memberInfo.uid,
            loginid:loginid,
            address:this.data.address
         };
         console.log(send);
        app.util.request({
            url: "entry/wxapp/SosSend",
            data: send,
            success: function(a) {
                console.log(a)
               console.log("发送报警成功")
            }
        });
    },
    getLocal: function(latitude, longitude) {
        let _this = this;
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function(res) {
              console.log("地址")
            console.log(res);
            // let province = res.result.ad_info.province
            // let city = res.result.ad_info.city
            let address = res.result.address
            _this.setData({
                address:address
            })
          },
          fail: function(res) {
            console.log(res);
          },
          complete: function(res) {
            // console.log(res);
          }
        });
      },
    onShow: function() {
        var a = this, o = wx.getStorageSync("userInfo"), e = wx.getStorageSync("loginid");
        0 < e && app.util.request({
            url: "entry/wxapp/Getnoteinfo",
            data: {
                loginid: e,
                sessionid: o.sessionid,
                uid: o.memberInfo.uid
            },
            success: function(o) {
                console.log(o)
                a.data.istype = o.data.data.companyaccount.type,
                a.setData({
                    companyaccount: o.data.data.companyaccount,
                    isnote: o.data.data.isnote,
                    noteinfo: o.data.data.noteinfo,
                    totalmoney: o.data.data.totalmoney,
                    matchorder: o.data.data.matchorder,
                    msgorder_1: o.data.data.msgorder_1,
                    msgorder_2: o.data.data.msgorder_2,
                    msgorder_3: o.data.data.msgorder_3,
                    msgcount: o.data.data.msgcount,
                    intro: o.data.data.intro
                });
            },
            complete: function() {
                wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
            }
        }), a.setData({
            userinfo: o
        });
    },
    onHide: function() {},
    onUnload: function() {
        wx.reLaunch({
            url: '/weixinmao_jz/pages/index/index'
        })
    },
    onPullDownRefresh: function() {
        this.onShow()
    },
    binduserinfo: function(o) {
        var a = this;
        a.data.showmsg = !1;
        var e = wx.getStorageSync("userInfo"), t = wx.getStorageSync("companyid");
        app.util.request({
            url: "entry/wxapp/getuserinfo",
            data: {
                companyid: t,
                sessionid: e.sessionid,
                uid: e.memberInfo.uid
            },
            success: function(o) {
                a.setData({
                    user: o.data.data,
                    showmsg: a.data.showmsg
                });
            }
        });
    },
    saveuserinfo: function(o) {
        var a = this, e = o.detail.value.name, t = o.detail.value.tel;
        a.data.showmsg = !0;
        var n = wx.getStorageSync("userInfo"), i = wx.getStorageSync("companyid");
        "" != e ? "" != t ? app.util.request({
            url: "entry/wxapp/saveuserinfo",
            data: {
                companyid: i,
                sessionid: n.sessionid,
                uid: n.memberInfo.uid,
                name: e,
                tel: t
            },
            success: function(o) {
                if (0 != o.data.errno) return wx.hideLoading(), void wx.showModal({
                    title: "失败",
                    content: o.data.msg,
                    showCancel: !1
                });
                wx.showToast({
                    title: "操作成功",
                    icon: "success",
                    duration: 2e3
                }), a.setData({
                    showmsg: a.data.showmsg
                });
            }
        }) : wx.showModal({
            title: "提示",
            content: "请填写您的手机号",
            showCancel: !1
        }) : wx.showModal({
            title: "提示",
            content: "请填写您的姓名",
            showCancel: !1
        });
    },
    closemsg: function(o) {
        this.data.showmsg = !0, this.setData({
            showmsg: this.data.showmsg
        });
    },
    onReachBottom: function() {},
    toMycouponlist: function(o) {
        wx.navigateTo({
            url: "/weixinmao_house/pages/couponlist/index"
        });
    },
    Puboldhouse: function(o) {
        wx.navigateTo({
            url: "/weixinmao_house/pages/pub/index"
        });
    },
    onShareAppMessage: function() {},
    checkuser: function(a) {
        var e = this, o = (a = a, wx.getStorageSync("userInfo"));
        return o ? o.memberInfo.uid ? void app.util.request({
            url: "entry/wxapp/checkuserinfo",
            data: {
                sessionid: o.sessionid,
                uid: o.memberInfo.uid
            },
            success: function(o) {
                0 == o.data.data.error ? (console.log(a), a.doServices()) : 2 == o.data.data.error && a.doServices();
            }
        }) : (console.log("tmddddsssssqqqqs1111"), app.util.getUserInfo(function(o) {
            e.setData({
                userinfo: o
            });
        }), !1) : (console.log("tmddddssssss222222"), app.util.getUserInfo(function(o) {
            app.util.request({
                url: "entry/wxapp/checkuserinfo",
                data: {
                    sessionid: o.sessionid,
                    uid: o.memberInfo.uid
                },
                success: function(o) {
                    0 == o.data.data.error ? (console.log(a), a.doServices()) : 2 == o.data.data.error && a.doServices();
                }
            }), e.setData({
                userinfo: o
            });
        }), !1);
    }
});