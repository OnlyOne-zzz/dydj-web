
var QQMapWX = require("../../resource/js/qqmap-wx-jssdk.min.js"),
    config = require("../../resource/js/config.js");


//*********************************字符串经纬度参数请求方式***************************************************************
//当前位置到某几个位置调用示例。多个终点用分号隔开
// calculation('','纬度,经度;纬度,经度', function (dis) {
//     //输出的dis格式示例 ['距离米数']
// },function (errMsg) {
//     //错误信息处理
// });
//**************************************对象经纬度参数请求方式**********************************************************
//当前位置到某几个位置调用示例。多个终点用分号隔开
// var to = [{
//     latitude: '纬度',
//     longitude: '经度'
// }]
// calculation('',to, function (dis) {
//     //输出的dis格式示例 ['距离米数']
// },function (errMsg) {
//     //错误信息处理
// });

//**************************************两个固定点之间请求示例**********************************************************
// calculation('纬度,经度','纬度,经度', function (dis) {
//     //输出的dis格式示例 ['距离米数']
// },function (errMsg) {
//     //错误信息处理
// });




/**
 *
 * @param form 起点坐标位置，起点位置为当前位置就传空串==> ''
 * @param to 终点坐标位置，可传输多个值
 * @param successCallback 成功后的回调
 * @param failCallback 失败回调
 */
calculation = function (form, to, successCallback, failCallback) {
    var qqmapsdk = new QQMapWX({
        key: config.Config.key // 必填
    });
    qqmapsdk.calculateDistance({
        //mode: 'driving',//可选值：'driving'（驾车）、'walking'（步行），不填默认：'walking',可不填
        mode: 'driving',
        //from参数不填默认当前地址
        from: form, //若起点有数据则采用起点坐标，若为空默认当前地址
        to: to, //终点坐标
        success: function (res) {//成功后的回调
            var res = res.result;
            var dis = [];
            for (var i = 0; i < res.elements.length; i++) {
                dis.push(res.elements[i].distance); //将返回数据存入dis数组，
            }
            successCallback(dis);
        },
        fail: function (error) {
            console.error(error);
            failCallback(error);
        },
        complete: function (res) {
            console.log(res);
        }
    });
}
