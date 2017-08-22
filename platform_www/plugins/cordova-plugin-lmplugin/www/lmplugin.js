cordova.define("cordova-plugin-lmplugin.lmplugin", function(require, exports, module) {
/**
 * Created by Lemon on 16/5/31.
 */
var exec = require('cordova/exec');

module.exports = {

  //分享
  thirdShare:function(message, success, error) {
    exec(success, error,"LMPlugin","ThirdShare", [message]);
  },

  //拨打电话
  callService:function(message, success, error) {
    exec(success, error,"LMPlugin","CallService", [message]);
  },

  //七鱼客服
  qiyuService:function(message, success, error) {
    exec(success, error,"LMPlugin","QiYuService", [message]);
  },

  //支付
  pay:function(message, success, error) {
    exec(success, error,"LMPlugin","Pay", [message]);
  },

  //本地选择图片/相机拍摄
  choosePic:function(message, success, error) {
    exec(success, error,"LMPlugin","ChoosePic", [message]);
  },
               
  //日期选择
  chooseDate:function(message, success, error) {
    exec(success, error,"LMPlugin","ChooseDate", [message]);
  },
               
  //进入地图
  chooseLocation:function(message, success, error) {
    exec(success, error,"LMPlugin","ChooseLocation", [message]);
  },
               
  //得到位置
  getLocation:function(message, success, error) {
    exec(success, error,"LMPlugin","GetLocation", [message]);
  },

  //得到版本号
  getVersion:function(message, success, error) {
    exec(success, error,"LMPlugin","GetVersion", [message]);
  },
               
               
               
}

});
