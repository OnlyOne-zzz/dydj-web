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

Page({
    data:{
        phoneNumber: '',
        phoneBtnContext: '请输入电话号码'
    },
    localGetPhoneNumber(detail, code){
        var _this = this;
        console.log(detail)
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
                var errmsg  = res.errMsg;
                if(errmsg == 'ok'){
                    var phoneNumber  = res.phoneNumber;
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
            url: "接口地址",
            data: {
                code: code,
                iv: detail.iv,
                encryptedData: detail.encryptedData,
                phoneNumber: phoneNumber
            },
            cachetime: 0,
            showLoading: !1,
            success: function(res) {
                var data = res.userInfo;
                //获取用户个人信息
                //保存到全局缓存中
                wx.setStorageSync("userInfo", data);
            }
        });
      }
    },
    getPhoneNumber (e) {
        var _this = this;
        wx.login({
            success (res) {
              if (res.code) {
                _this.localGetPhoneNumber(e.detail, res.code);
              } else {
                console.log('登录失败！' + res.errMsg)
                wx.showToast({
                    title:"登录失败"
                  })
              }
            }
          })
      },
      getUserInfo (e) {
        var _this = this;
        wx.login({
            success (res) {
              if (res.code) {
                _this.localGetUserInfo(e.detail, res.code);
              } else {
                console.log('登录失败！' + res.errMsg)
                wx.showToast({
                    title:"登录失败"
                  })
              }
            }
          })
      }
});