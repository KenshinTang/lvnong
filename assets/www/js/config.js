/**
 * Created by htzhanglong on 2015/8/2.
 */
var configMod=angular.module("starter.config", []);

//测试服务器
var baseUrl = "http://112.74.66.98:19080/lvnong/mobile/"
var baseUrl2 = "http://112.74.66.98:19080/lvnong/mobile/v2/"
var imgBaseUrl = "http://112.74.66.98:19080/img/"

//正式服务器
//var baseUrl = "http://120.26.95.163:8080/lvnong/mobile/"
//var baseUrl2 = "http://120.26.95.163:8080/lvnong/mobile/v2/"
//var imgBaseUrl = "http://120.26.95.163:8080/img/"

var shareUrlTheme = "http://www.lvnong100.com:8080/lvnong/www/index.html#/"
var registerFlag=true;
var FarmOrderFlag=true;
var weiChatFlag=true;
var activeId=0;
var activeImg="";
var orderId=0;
var addressFlag=false;
var orderStatusFlag="";
var totalprice=0;
var keyBoradFlag=0;

configMod.constant("ENV", {

  "debug": false,

  'newGoods':baseUrl + "goods/queryNewGoods",
  'activity':baseUrl + "goods/queryIndexGoodsList",

  //获取用户验证码
  'getSmsCode':baseUrl + "register/captcha",
  //注册
  'registerUser':baseUrl + "register/register",
  //找回密码获取用户验证码
  'resetPasswordGetSmsCode':baseUrl + "security/resetPasswordCaptcha",
  //找回密码
  'resetPassword':baseUrl + "security/resetPassWord",
  //登录
  'userLogin':baseUrl + "user/login",

  //商品详情接口
  'goodsDetail':baseUrl2 + "product/details",
  //是否收藏该商品
  'ifCollection':baseUrl + "favourite/getProductIsCollection",
  //添加到收藏
  'addToCollection':baseUrl + "favourite/add",
  //从收藏中删除
  'deleteInCollection':baseUrl + "favourite/delete",

  //我的地址
  'getAddress':baseUrl + "address/list",
  //新增地址
  'addAddress':baseUrl + "address/add",
  //修改地址
  'modifyAddress':baseUrl + "address/update",
  //删除地址
  'deleteAddress':baseUrl + "address/delete",

  //清空购物车
  'clearCart':baseUrl + "cart/emptyShopCar",
  //批量新增到购物车
  'addToCart':baseUrl + "cart/batchAddShopCars",
  //拿到购物车
  'getCart':baseUrl + "cart/list",
  //批量删除购物车
  'deleteCart':baseUrl + "cart/deletes",
  //批量更新购物车
  'updateCart':baseUrl + "cart/batchUpdateShopCars",
  //提交订单
  'submitOrder':baseUrl + "order/commonSubmit",
  //获得优惠券
  'getCoupon':baseUrl + "coupon/list",
  //搜索
  'search':baseUrl2 + "product/search",
  //推广码
  'varifyCode':baseUrl + "coupon/addCode",

  //获取微信预支付订单
  'getWechatOrder':baseUrl + "pay/weixinUnifiedOrder",
  //支付宝回调地址
  'alipayNotify':baseUrl + "pay/aLiPayNotify",

  //商品预售
  'productReadySale':baseUrl2 + "product/readySale",
  //货仓分类
  'productQueryCategory':baseUrl2 + "product/queryCategory",
  //商品列表
  'productList':baseUrl2 + "product/list",
  //个人资料
  'userUserInfo':baseUrl + "user/userInfo",
  //修改个人资料
  'userUpdateInfo':baseUrl + "user/updateInfo",
  //商品新品
  'productNewList':baseUrl2 + "product/newList",
  //商品热品
  'productHotList':baseUrl2 + "product/hotList",
  //订单列表
  'orderList':baseUrl + "order/list",
  //农场列表
  'farmList':baseUrl2 + "farm/list",
  //农场详情
  'farmDetails':baseUrl2 + "farm/details",
  //首页数据
  'productIndex':baseUrl2 + "product/index",
  //活动
  'productActivityProduct':baseUrl2 + "product/activityProduct",
  //订单状态修改
  'orderUpdateOrder':baseUrl + "order/updateOrder",
  //订单详情
  'orderDetails':baseUrl + "order/details",
  //我的收藏
  'favouriteList':baseUrl + "favourite/list",
  //提醒发货
  'orderRemindDeliverGoods':baseUrl + "order/remindDeliverGoods",
  //商品需求反馈
  'demandFeedbackAddDemandFeedback':baseUrl + "demandFeedback/addDemandFeedback",
  //农场预约
  'bespeakvisitAddBespeakVisit':baseUrl + "bespeakvisit/addBespeakVisit",
  //预约验证码
  'bespeakvisitGetBespeakVisitCode':baseUrl + "bespeakvisit/getBespeakVisitCode",
  //获得默认优惠券
  'couponGetDefaultCoupon':baseUrl + "coupon/getDefaultCoupon",
  //查询物流
  'orderSelectLogisticsInfo':baseUrl + "order/selectLogisticsInfo",
  //批量添加收藏
  'favouriteBatchAdd':baseUrl + "favourite/batchAdd",
  //意见反馈
  'feedbackAddFeedback':baseUrl + "feedback/addFeedback",
  //系统通知
  'systemNotifyQuerySystemNotify':baseUrl + "systemNotify/querySystemNotify",
  //软件更新
  'appVersionList':baseUrl + "appVersion/list",
  //用户订单分类数量
  'orderFindUserOrderNumberByUserId':baseUrl + "order/findUserOrderNumberByUserId",
  //计算物流
  'orderComputeExpressMoney':baseUrl + "order/computeExpressMoney",
  //农场得到一级分类
  'farmQueryCategory':baseUrl2 + "farm/queryCategory",
  //微信登录
  'userWechatInfoLogin':baseUrl + "user/wechatInfoLogin",
  //微信验证是否存在
  'userWeixinMobileIsExist':baseUrl + "user/weixinMobileIsExist",
  //微信验证短信
  'userGetWeixinMobileCode':baseUrl + "user/getWeixinMobileCode",
  //已有账户绑定微信
  'userWeixinBinding':baseUrl + "user/weixinBinding",
  //查找商品最小金额
  'productGetMinPrice':baseUrl2 + "product/getMinPrice",
  //查找商品是否收藏
  'productGetIsFavourite':baseUrl2 + "product/getIsFavourite",
  //查找商品是否收藏
  'payGetOrderInfoByAliPay':baseUrl + "pay/getOrderInfoByAliPay",

  'version':'1.0.1'
});



function umregister(name) {
  setTimeout(function(){
    LMPlugin.thirdShare({platform:'registerEvent', eventName:name}, function(data){}, function() {});
  }, 1000);
}
