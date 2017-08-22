/**
 * Created by htzhanglong on 2015/8/2.
 */
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','starter.controllers','starter.config','starter.services','starter.directive','starter.share','starter.loading','ngResource','ionicLazyLoad'])

  .run(function($rootScope, $ionicPlatform, Alert,informationWindow, $timeout, $location, $ionicHistory) {
    //// hide splash immediately
    //if(navigator && navigator.splashscreen) {
    //  navigator.splashscreen.hide();
    //}

     $ionicPlatform.ready(function() {
     // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
     // for form inputs)
     if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
       cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
       cordova.plugins.Keyboard.disableScroll(true);
     }
     if (window.StatusBar) {
     // org.apache.cordova.statusbar required
     StatusBar.styleDefault();
     }
   });

    //物理返回按钮控制&双击退出应用
    $ionicPlatform.registerBackButtonAction(function (e) {

      //informationWindow.showOk(keyBoradFlag);

      //判断处于哪个页面时双击退出
      if ($location.path() == '/tab/home' || $location.path() == '/tab/farm' || $location.path() == '/tab/user'|| $location.path() == '/loginRegister'|| $location.path() == '/start') {
        if ($rootScope.backButtonPressedOnceToExit) {
          ionic.Platform.exitApp();
        } else {
          $rootScope.backButtonPressedOnceToExit = true;
          informationWindow.showOk('再按一次退出系统')
          setTimeout(function () {
            $rootScope.backButtonPressedOnceToExit = false;
          }, 2000);
        }
      }else if($location.path() == '/tab/storehouse' || $location.path() == '/tab/cart'){
        if(keyBoradFlag==1){
          keyBoradFlag=0;
          //$rootScope.hideTabs = false;
          //var d1=document.getElementsByClassName("cartContent2")[0];
          //if(d1){
          //  d1.className="has-header cartContent";
          //}
          //var d1=document.getElementsByClassName("storehouseContent2")[0];
          //if(d1){
          //  d1.className="storehouseContent scroll-content ionic-scroll scroll-content-false ng-pristine ng-untouched ng-valid  has-header has-tabs";
          //}
          //var d3=document.getElementsByClassName("tabs-icon-top")[0];
          //  d3.className="tabs-icon-top tabs-stable tabs-color-positive pane false";
        }else{
          if ($rootScope.backButtonPressedOnceToExit) {
            ionic.Platform.exitApp();
          } else {
            $rootScope.backButtonPressedOnceToExit = true;
            informationWindow.showOk('再按一次退出系统')
            setTimeout(function () {
              $rootScope.backButtonPressedOnceToExit = false;
            }, 2000);
          }
        }
      }else if ($ionicHistory.backView()) {
        if(keyBoradFlag==1){
          keyBoradFlag=0;
        }else{
          $ionicHistory.goBack();
        }
      }
      else {
        $rootScope.backButtonPressedOnceToExit = true;
        informationWindow.showOk('再按一次退出系统')
        setTimeout(function () {
          $rootScope.backButtonPressedOnceToExit = false;
        }, 2000);
      }
      e.preventDefault();
      return false;
    }, 101);
 })




    .config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {



        $ionicConfigProvider.views.swipeBackEnabled(false);
        $ionicConfigProvider.platform.ios.tabs.style('standard');
        $ionicConfigProvider.platform.ios.tabs.position('bottom');
        $ionicConfigProvider.platform.android.tabs.style('standard');
        $ionicConfigProvider.platform.android.tabs.position('standard');

        $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
        $ionicConfigProvider.platform.android.navBar.alignTitle('left');

        $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
        $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

        $ionicConfigProvider.platform.ios.views.transition('ios');
        $ionicConfigProvider.platform.android.views.transition('android');
        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            // setup an abstract state for the tabs directive

            .state('tab', {
              url: "/tab",
              abstract: true,
              templateUrl: "templates/tabs.html"
            })

            // Each tab has its own nav history stack:

            //-----------------------首页-----------------------
            .state('tab.home', {
              url: '/home',
              cache:'true',
              nativeTransitions: null,
              views: {
                'tab-home': {
                    templateUrl: 'templates/home/home.html',
                    controller: 'HomeCtrl'
                }
              }
            })

            //广告详情
          .state('tab.advertisementDetail',{
            url:'/advertisementDetail',
            views: {
              'tab-home': {
                templateUrl: 'templates/home/advertisementDetail.html',
                controller: 'advertisementDetailCtrl'
              }
            }
          })

            //预售
          .state('tab.presell',{
            url:'/presell',
            //cache:'false',
            views: {
              'tab-home': {
                templateUrl: 'templates/home/presell.html',
                controller: 'presellCtrl'
              }
            }
          })

          //绿农新品
          .state('tab.lnnewGoods',{
            url:'/lnnewGoods',
            //cache:'false',
            views: {
              'tab-home': {
                templateUrl: 'templates/home/lnnewGoods.html',
                controller: 'lnnewGoodsCtrl'
              }
            }
          })

          //绿农热销
          .state('tab.lnHot',{
            url:'/lnHot',
            //cache:'false',
            views: {
              'tab-home': {
                templateUrl: 'templates/home/lnHot.html',
                controller: 'lnHotCtrl'
              }
            }
          })

          //活动详情
          .state('tab.activeDetail',{
            url:'/activeDetail',
            //cache:'false',
            views: {
              'tab-home': {
                templateUrl: 'templates/home/activeDetail.html',
                controller: 'activeDetailCtrl'
              }
            }
          })

          //商品详情
          .state('tab.homeGoodsDetail',{
            url:'/goodsDetail/:good_id',
            cache:'false',
            views: {
              'tab-home': {
                templateUrl:'templates/storehouse/goodsDetail.html',
                controller:'goodsDetailCtrl'
              }
            }
          })

            //-----------------------货仓-----------------------
            .state('tab.storehouse', {
              url: '/storehouse',
              cache:'true',
              nativeTransitions: null,
              views: {
                'tab-storehouse': {
                  templateUrl: 'templates/storehouse/storehouse.html',
                  controller: 'storehouseCtrl'
                }
              }
            })

            //搜索详情
          .state('tab.searchDetail',{
            url:'/searchDetail',
            cache:'true',
            views: {
              'tab-storehouse': {
                templateUrl:'templates/storehouse/searchDetail.html',
                controller:'searchDetail'
              }
            }
          })


            //商品详情
          .state('tab.goodsDetail',{
            url:'/goodsDetail/:good_id',
            cache:'false',
            views: {
              'tab-storehouse': {
                templateUrl:'templates/storehouse/goodsDetail.html',
                controller:'goodsDetailCtrl'
              }
            }
          })

          //3级商品列表
          .state('tab.threeListGoods',{
            url:'/threeListGoods/:threeId/:name',
            cache:'true',
            views: {
              'tab-storehouse': {
                templateUrl:'templates/storehouse/threeListGoods.html',
                controller:'threeListGoodsCtrl'
              }
            }
          })


          //-----------------------农场-----------------------
            //农场
            .state('tab.farm', {
              url: '/farm',
              cache:'false',
              nativeTransitions: null,
              views: {
                'tab-farm': {
                  templateUrl: 'templates/farm/farm.html',
                  controller: 'farmCtrl'
                }
              }
            })

            //农场详情
          .state('tab.farmDetail',{
            url:'/farmDetail/:farm_id',
            cache:'false',
            views: {
              'tab-farm': {
                templateUrl:'templates/farm/farmDetail.html',
                controller:'farmDetailCtrl'
              }
            }
          })

          //商品详情
          .state('tab.farmGoodsDetail',{
            url:'/goodsDetail/:good_id',
            cache:'false',
            views: {
              'tab-farm': {
                templateUrl:'templates/storehouse/goodsDetail.html',
                controller:'goodsDetailCtrl'
              }
            }
          })


          //-----------------------购物车/下单-----------------------
          //购物车
            .state('tab.cart', {
              url: '/cart',
              cache:'false',
              nativeTransitions: null,
              views: {
                'tab-cart': {
                  templateUrl: 'templates/cart/cart.html',
                  controller: 'cartCtrl'
                }
              }
            })

            //我的订单
          .state('tab.myOrder',{
            url:'/myOrder/:type/:num',
            cache:'false',
            views: {
              'tab-cart': {
                templateUrl: 'templates/cart/myOrder.html',
                controller: 'myOrderCtrl'
              }
            }

          })

          //支付方式
          .state('tab.payWay',{
            url:'/payWay/:type',
            views: {
              'tab-cart': {
                templateUrl: 'templates/cart/payWay.html',
                controller: 'payWayCtrl'
              }
            }
          })






            //-----------------------个人信息-----------------------
            .state('tab.user', {
              url: '/user',
              cache:'false',
              nativeTransitions: null,
              views: {
                'tab-user': {
                  templateUrl: 'templates/user/user.html',
                  controller: 'userCtrl'
                }
              }
            })


            //个人资料
          .state('tab.personal',{
            url:'/personal',
            cache:'false',
            views: {
              'tab-user': {
                templateUrl:'templates/user/personal.html',
                controller:'personalCtrl'
              }
            }
          })

            //待付款
          .state('tab.waitPayment',{
            url:'/waitPayment/:orderEnter',
            cache:false,
            views: {
              'tab-user': {
                templateUrl:'templates/user/waitPayment.html',
                controller:'waitPaymentCtrl'
              }
            }
          })

          //待付款详情
          .state('tab.waitPaymentDetail',{
            url:'/waitPaymentDetail/:order_id',
            views: {
              'tab-user': {
                templateUrl:'templates/user/waitPaymentDetail.html',
                controller:'waitPaymentDetailCtrl'
              }
            }
          })

          //待发货
          .state('tab.waitDeliverGoods',{
            url:'/waitDeliverGoods/:orderEnter',
            cache:false,
            views: {
              'tab-user': {
                templateUrl:'templates/user/waitDeliverGoods.html',
                controller:'waitDeliverGoodsCtrl'
              }
            }
          })

          //待发货详情
          .state('tab.waitDeliverGoodsDetail',{
            url:'/waitDeliverGoodsDetail/:order_id',
            views: {
              'tab-user': {
                templateUrl:'templates/user/waitDeliverGoodsDetail.html',
                controller:'waitDeliverGoodsDetailCtrl'
              }
            }
          })

          //待收货
          .state('tab.waitReceiveGoods',{
            url:'/waitReceiveGoods',
            cache:false,
            views: {
              'tab-user': {
                templateUrl:'templates/user/waitReceiveGoods.html',
                controller:'waitReceiveGoodsCtrl'
              }
            }
          })

          //待收货详情
          .state('tab.waitReceiveGoodsDetail',{
            url:'/waitReceiveGoodsDetail/:order_id',
            views: {
              'tab-user': {
                templateUrl:'templates/user/waitReceiveGoodsDetail.html',
                controller:'waitReceiveGoodsDetailCtrl'
              }
            }
          })

          //已完成
          .state('tab.completed',{
            url:'/completed',
            cache:false,
            views: {
              'tab-user': {
                templateUrl:'templates/user/completed.html',
                controller:'completedCtrl'
              }
            }
          })

          //已完成详情
          .state('tab.completedDetail',{
            url:'/completedDetail/:order_id',
            views: {
              'tab-user': {
                templateUrl:'templates/user/completedDetail.html',
                controller:'completedDetailCtrl'
              }
            }
          })

          //查看我的全部订单
          .state('tab.myAllOrder',{
            url:'/myAllOrder',
            cache:false,
            views: {
              'tab-user': {
                templateUrl:'templates/user/myAllOrder.html',
                controller:'myAllOrderCtrl'
              }
            }
          })

          //配送说明
          .state('tab.distributionDescription',{
            url:'/distributionDescription',
            views: {
              'tab-user': {
                templateUrl:'templates/user/distributionDescription.html',
                controller:'distributionDescriptionCtrl'
              }
            }
          })



            //收货地址管理
            .state('tab.myAddress', {
              url: '/myAddress/:orderEnter',
              cache:false,
              views: {
                'tab-user': {
                  templateUrl: 'templates/user/myAddress.html',
                  controller: 'myAddressCtrl'
                }
              }
            })

            //新增地址信息
            .state('tab.addAddress',{
              url:'/addAddress',
              views: {
                'tab-user': {
                  templateUrl: 'templates/user/addAddress.html',
                  controller: 'addAddressCtrl'
                }
              }
            })

            //修改收货地址信息
            .state('tab.modifyAddress',{
              url:'/modifyAddress/:address_id/:name/:mobile/:address/:street',
              views: {
                'tab-user': {
                  templateUrl: 'templates/user/modifyAddress.html',
                  controller: 'modifyAddressCtrl'
                }
              }
            })

            //地图地址
            .state('tab.mapAddress',{
              url:'/mapAddress',
              views: {
                'tab-user': {
                  templateUrl: 'templates/user/mapAddress.html',
                  controller: 'mapAddressCtrl'
                }
              }
            })

            //我的优惠券
            .state('tab.myCoupon',{
              url:'/myCoupon',
              cache:false,
              views: {
                'tab-user': {
                  templateUrl: 'templates/user/myCoupon.html',
                  controller: 'myCouponCtrl'
                }
              }
            })


            //商品需求反馈
            .state('tab.goodsFeedback',{
              url:'/goodsFeedback',
              views: {
                'tab-user': {
                  templateUrl: 'templates/user/goodsFeedback.html',
                  controller: 'goodsFeedbackCtrl'
                }
              }
            })



            //验证推荐码
            .state('tab.verificationRecommend',{
              url:'/verificationRecommend',
              views: {
                'tab-user': {
                  templateUrl: 'templates/user/verificationRecommend.html',
                  controller: 'verificationRecommendCtrl'
                }
              }
            })

            //更多
            .state('tab.more',{
              url:'/more',
              views: {
                'tab-user': {
                  templateUrl: 'templates/user/more.html',
                  controller: 'moreCtrl'
                }
              }
            })

            //使用反馈
            .state('tab.useFeekback',{
              url:'/useFeekback',
              views: {
                'tab-user': {
                  templateUrl: 'templates/user/useFeekback.html',
                  controller: 'useFeekbackCtrl'
                }
              }
            })

            //系统通知
            .state('tab.systemInformation',{
              url:'/systemInformation',
              views: {
                'tab-user': {
                  templateUrl: 'templates/user/systemInformation.html',
                  controller: 'systemInformationCtrl'
                }
              }
            })

            //常见问题
            .state('tab.oftenQuestion',{
              url:'/oftenQuestion',
              views: {
                'tab-user': {
                  templateUrl: 'templates/user/oftenQuestion.html',
                  controller: 'oftenQuestionCtrl'
                }
              }
            })

            //配送说明
            .state('tab.distributionExplain',{
              url:'/distributionExplain',
              views: {
                'tab-user': {
                  templateUrl: 'templates/user/distributionExplain.html',
                  controller: 'distributionExplainCtrl'
                }
              }
            })

            //退货说明
            .state('tab.returnGoodsExplain',{
              url:'/returnGoodsExplain',
              views: {
                'tab-user': {
                  templateUrl: 'templates/user/returnGoodsExplain.html',
                  controller: 'returnGoodsExplainCtrl'
                }
              }
            })

            //服务范围
            .state('tab.serviseExtent',{
              url:'/serviseExtent',
              views: {
                'tab-user': {
                  templateUrl: 'templates/user/serviseExtent.html',
                  controller: 'serviseExtentCtrl'
                }
              }
            })

            //用户协议
            .state('tab.userAgreement',{
              url:'/userAgreement',
              views: {
                'tab-user': {
                  templateUrl: 'templates/user/userAgreement.html',
                  controller: 'userAgreementCtrl'
                }
              }
            })

            //关于我们
            .state('tab.aboutWe',{
              url:'/aboutWe',
              views: {
                'tab-user': {
                  templateUrl: 'templates/user/aboutWe.html',
                  controller: 'aboutWeCtrl'
                }
              }
            })


            //引导
            .state('start',{
              url:'/start',
              templateUrl:'templates/login/start.html',
              controller:'startCtrl'
            })

            //登录注册
            .state('loginRegister',{
              url:'/loginRegister',
              templateUrl:'templates/login/loginRegister.html',
              controller:'loginRegisterCtrl'
            })

            //登录
            .state('login',{
              url:'/login',
              templateUrl:'templates/login/login.html',
              controller:'loginCtrl'
            })

            //微信登录设置密码
            .state('weichatLoginPassword',{
              url:'/weichatLoginPassword',
              templateUrl:'templates/login/weichatLoginPassword.html',
              controller:'weichatLoginPasswordCtrl'
            })

            //已有账号绑定微信
            .state('alreadyAccount',{
              url:'/alreadyAccount',
              templateUrl:'templates/login/alreadyAccount.html',
              controller:'alreadyAccountCtrl'
            })

            //微信忘记密码
            .state('weichatForget',{
              url:'/weichatForget',
              templateUrl:'templates/login/weichatForget.html',
              controller:'weichatForgetCtrl'
            })

            //注册
            .state('register',{
              url:'/register',
              templateUrl:'templates/login/register.html',
              controller:'registerCtrl'
            })

            //忘记密码
            .state('forget',{
              url:'/forget',
              templateUrl:'templates/login/forget.html',
              controller:'forgetCtrl'
            })

            //查看物流
            .state('tab.logistics',{
              url:'/logistics/:order_id',
              views: {
                'tab-user': {
                  templateUrl: 'templates/user/logistics.html',
                  controller: 'logisticsCtrl'
                }
              }
            })

            //农场预约
            .state('farmBespeak',{
              url:'/farmBespeak/:farmId',
              templateUrl:'templates/farm/farmBespeak.html',
              controller:'farmBespeakCtrl'
            })

            //分享

            //分享商品
            .state('shareGoods', {
              url: '/shareGoods/:good_id',
              cache:'false',
              templateUrl: 'templates/share/shareGoods.html',
              controller: 'shareGoodsCtrl'
            })

            //分享农场
            .state('shareFarm', {
              url: '/shareFarm/:farm_id',
              cache:'false',
              templateUrl: 'templates/share/shareFarm.html',
              controller: 'shareFarmCtrl'
            })

            //分享农场
            .state('shareHome', {
              url: '/shareHome',
              cache:'false',
              templateUrl: 'templates/share/shareHome.html',
              controller: 'shareHomeCtrl'
            })

        // if none of the above states are matched, use this as the fallback
        //$urlRouterProvider.otherwise('/tab/home');
        $urlRouterProvider.otherwise('/start');

    });
