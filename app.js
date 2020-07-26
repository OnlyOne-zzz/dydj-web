App({
    onLaunch: function() {},
    onShow: function() {},
    onHide: function() {},
    onError: function(o) {},
    util: require("we7/resource/js/util.js"),
    tabBar: {
        color: "#123",
        selectedColor: "#1ba9ba",
        borderStyle: "#1ba9ba",
        backgroundColor: "#fff",
        list: []
    },
    getLocationInfo: function(n) {
        var t = this;
        this.globalData.locationInfo ? n(this.globalData.locationInfo) : wx.getLocation({
            type: "gcj02",
            success: function(o) {
                t.globalData.locationInfo = o, n(t.globalData.locationInfo);
            },
            fail: function() {},
            complete: function() {}
        });
    },
    globalData: {
        userInfo: null
    },
    siteInfo: require("siteinfo.js")
});