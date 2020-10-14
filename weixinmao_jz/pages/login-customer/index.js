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
  sessionid: "",
  wxInfo: ""
};

Page({
    data:{
        phoneNumber: '',
        phoneBtnContext: '请输入电话号码',
        local_code: ''
    },
    onShow:function(){
      var _this = this;
      wx.login({
        success (res) {
          console.log(res);
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
            showLoading: !1,
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
              console.log(res);
              res.data.errno || (userInfo.memberInfo = res.data.data,  wx.setStorageSync("userInfo", userInfo)), 
               // var userInfo = res.data.data.userinfo;
                //获取用户个人信息
                //保存到全局缓存中
               // wx.setStorageSync("userInfo", userInfo);
               // console.log(res)
                _this.userinfo(detail);
            }
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
            wx.navigateBack({
                delta: 1
            })
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
      bindGetUserInfo: function(e) {
        var _this = this;
        console.log(e);
        var data = e.detail;
        if(data.errMsg == "getUserInfo:ok"){
          _this.localGetUserInfo(data, _this.data.local_code);
        }
      }
});