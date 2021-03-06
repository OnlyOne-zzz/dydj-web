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
var userInfo = {
};

Page({
    data:{
        phoneNumber: '',
        phoneBtnContext: '点击获取您的手机号码',
        local_code: ''
    },
    onShow:function(){
      var _this = this;
      wx.login({
        success (res) {
          _this.data.local_code = res.code;
        }
      })
    },
    onLoad:function(){
      wx.setNavigationBarTitle({
        title: "登录/注册"
    }),wx.setNavigationBarColor({
        frontColor: "#ffffff",
        backgroundColor: "#3C9BDF",
        animation: {
            duration: 400,
            timingFunc: "easeIn"
        }
    });
    },
    // onUnload:function(){
    //   this.jumpPage()
    // },
    // 协议 政策
    xieyi:function(){
      wx.navigateTo({
        url: "/weixinmao_jz/pages/housexy/index"
    });
    },
    zhengce:function(){
      wx.navigateTo({
        url: "/weixinmao_jz/pages/privacy/index"
    });
    },
    localGetPhoneNumber(detail, code){
        var _this = this;
        console.log(_this.data.local_code)
        console.log(detail)
        app.util.request({
            url: "entry/wxapp/DecryptData",
            data: {
                code: encodeURIComponent(code),
                iv: encodeURIComponent(detail.iv),
                encryptedData: encodeURIComponent(detail.encryptedData)
            },
            cachetime: 0,
            success: function(res) {
                var errMsg  = res.errMsg;
                if(errMsg == "request:ok"){
                    var phoneNumber  = res.data.data.phoneNumber;
                    _this.data.phoneNumber = phoneNumber;
                    _this.data.phoneBtnContext = phoneNumber;
                    _this.setData({
                        phoneBtnContext: phoneNumber
                    });
                }
            },
            complete: function() {
              wx.hideNavigationBarLoading(), wx.stopPullDownRefresh()
          }
        });
    },
    localGetUserInfo(detail, code){
        var _this = this;
        var phoneNumber  = _this.data.phoneNumber;
      if(phoneNumber == ''){
        wx.showModal({
            title: "提示",
            content: "手机号码不能为空",
            showCancel: !1
        });
      }else{
        app.util.request({
            url: "auth/session/openid",
            data: {
                code: encodeURIComponent(code)
                // iv: encodeURIComponent(detail.iv),
                // encryptedData: encodeURIComponent(detail.encryptedData),
                // phoneNumber: encodeURIComponent(phoneNumber)
            },
            cachetime: 0,
            showLoading: !1,
            success: function(res) {
              wx.getUserInfo({
                success: function(e) {
                  userInfo.wxInfo = e.userInfo;
                  res.data.errno || (userInfo.memberInfo = res.data.data.userinfo, userInfo.sessionid = res.data.data.sessionid,  wx.setStorageSync("userInfo", userInfo)), 
                  console.log(wx.getStorageSync("userInfo"))
                  _this.userinfo(detail);
                },
                fail: function(e) {},
                complete: function(e) {}
            })}
        });
      }
    },
    userinfo(detail){
      var _this = this;
      app.util.request({
        url: "auth/session/userinfo",
        data: {
          code: encodeURIComponent( _this.data.local_code),
          tel: _this.data.phoneNumber,
          iv: encodeURIComponent(detail.iv),
          encryptedData: encodeURIComponent(detail.encryptedData)
        },
        cachetime: 0,
        showLoading: !1,
        success: function(res) {
           console.log(res);
           var lcoaluserinfo = wx.getStorageSync("userInfo");
           res.data.errno || (lcoaluserinfo.memberInfo = res.data.data.userinfo,  wx.setStorageSync("userInfo", lcoaluserinfo)),
            wx.navigateBack({
                delta: 1
            })
           _this.jumpPage()
        }
    });
    },
    getPhoneNumber (e) {
        var _this = this;
        var data = e.detail;
        if(data.errMsg == "getPhoneNumber:ok"){
          _this.localGetPhoneNumber(data, _this.data.local_code);
        }
      },
      unLogin: function() {
        this.jumpPage()
      },
      jumpPage:function(){
        // let pages = getCurrentPages();
        // let prevPage = pages[pages.length - 2];//上一页
        // let addr = prevPage.route;
        // if(addr=='weixinmao_jz/pages/mymsgorder/index'){
        //   wx.switchTab({
        //     url: '/weixinmao_jz/pages/index/index',
        //   })
        // }else{
          wx.navigateBack({
            delta: 1,
          })
        // }
      },
      bindGetUserInfo: function(e) {
        var _this = this;
        var data = e.detail;
        if(data.errMsg == "getUserInfo:ok"){
          _this.localGetUserInfo(data, _this.data.local_code);
        }
      }
});