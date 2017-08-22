/**
 * Created by htzhanglong on 2015/8/2.
 */
angular.module('starter.services', [])
  //通用
  .factory('Storage', function() {
    return {
      set: function(key, data) {
        return window.localStorage.setItem(key, window.JSON.stringify(data));
      },
      get: function(key) {

        return window.JSON.parse(window.localStorage.getItem(key));
      },
      remove: function(key) {
        return window.localStorage.removeItem(key);
      },
      //添加到本地购物车
      addOrEditToCart: function(productId, quantity) {
        var cart = window.JSON.parse(window.localStorage.getItem('cart'));
        cart = cart ? cart : []
        var exist = false
        for (index in cart) {
          if(cart[index].productId == productId) {
            exist = true
            cart[index].quantity = quantity
            break
          }
        }
        if (!exist) {
          cart.push({productId:productId, quantity:quantity})
        }
        console.log(cart);
        window.localStorage.setItem('cart', window.JSON.stringify(cart))
      },
      //从本地购物车中删除
      deleteInCart: function(productId) {
        console.log(productId,111);
        var index = - 100
        var cart = window.JSON.parse(window.localStorage.getItem('cart'));
        for (i in cart) {
          if(cart[i].productId==productId) {
            index = i
            break
          }
        }
        if(index >= 0) {
          cart.splice(index, 1)
        }
        window.localStorage.setItem('cart', window.JSON.stringify(cart))
      },
      //得到当前购物车某商品数量
      getCurrentAmountInCart: function(productId) {
        var quantity = 0
        var cart = window.JSON.parse(window.localStorage.getItem('cart'));
        for (i in cart) {
          if(cart[i].productId==productId) {
            quantity = cart[i].quantity
            break
          }
        }
        return quantity
      },
      //重设小红点bottom
      resetRedNumberBottom:function(flag){
        var cart = this.get('cart');
        if (cart!=null && cart.length>0) {
          var d6=document.getElementById("cartAddFlag");
          var d7=document.getElementsByClassName("tab-nav")[0];
          if(d6==null){
            var d6=document.createElement("div");
            d6.id="cartAddFlag";
            d6.className="cartAddFlagCommon1";
            d6.innerHTML=0;
            if(cart.length>0){
              d6.className="cartAddFlagCommon2";
              var number=0;
              for(index in cart) {
                number = number + cart[index].quantity;
              }
              number<=999 ? d6.innerHTML=number : d6.innerHTML="...";
            }
            d7.appendChild(d6);
          }else{
            if(flag){
              var d6=document.getElementById("cartAddFlag");
              if(cart.length>0){
                d6.className="cartAddFlagCommon1_2";
                setTimeout(function(){
                  d6.className="cartAddFlagCommon2";
                },300);
                var number=0;
                for(index in cart) {
                  number = number + cart[index].quantity;
                }
                number<=999 ? d6.innerHTML=number : d6.innerHTML="...";
              }
            }else{
              var d6=document.getElementById("cartAddFlag");
              if(cart.length>0){
                d6.className="cartAddFlagCommon2";
                var number=0;
                for(index in cart) {
                  number = number + cart[index].quantity;
                }
                number<=999 ? d6.innerHTML=number : d6.innerHTML="...";
              }
            }
          }
        }else if(cart!=null && cart.length==0){
          var d6=document.getElementById("cartAddFlag");
          if(d6){
            d6.className="cartAddFlagCommon1";
          }
        }
      },
      //重设小红点top
      resetRedNumberTop:function(id){
        var cart = this.get('cart');
        if (cart!=null && cart.length>0) {
          var d6=document.getElementById(id+"_Top");
          var d7=document.getElementById(id);
          if(d6==null){
            var d6=document.createElement("div");
            d6.id=id+"_Top";
            d6.className="cartAddFlagCommon3";
            d6.innerHTML=0;
            if(cart.length>0){
              d6.className="cartAddFlagCommon4";
              var number=0;
              for(index in cart) {
                number = number + cart[index].quantity;
              }
              number<=999 ? d6.innerHTML=number : d6.innerHTML="...";
            }
            d7.appendChild(d6);
          }else{
            var d6=document.getElementById(id+"_Top");
            if(cart.length>0){
              d6.className="cartAddFlagCommon3_4";
              setTimeout(function(){
                d6.className="cartAddFlagCommon4";
              },300);
              var number=0;
              for(index in cart) {
                number = number + cart[index].quantity;
              }
              number<=999 ? d6.innerHTML=number : d6.innerHTML="...";
            }
          }
        }else if(cart!=null && cart.length==0){
          var d6=document.getElementById(id+"_Top");
          if(d6){
            d6.className="cartAddFlagCommon3";
          }
        }
      },
      //重设小红点goodsDetail
      resetRedNumberGoodsDetail:function(id){
        var cart = this.get('cart');
        console.log(222,cart);
        if (cart!=null && cart.length>0) {
          console.log(333);
          var d6=document.getElementsByClassName(id+"_Bottom");
          var d7=document.getElementsByClassName(id);
          var d6_num=d6.length;
          var d7_num=d7.length;
          console.log(d6);
          if(d6_num<d7_num){
            console.log(555);
            var d6=document.createElement("div");
            d6.className="cartAddFlagCommon5 "+id+"_Bottom";
            d6.innerHTML=0;
            if(cart.length>0){
              d6.className="cartAddFlagCommon6 "+id+"_Bottom";
              var number=0;
              for(index in cart) {
                number = number + cart[index].quantity;
              }
              number<=999 ? d6.innerHTML=number : d6.innerHTML="...";
            }
            //for(var i=0;i<d7_num;i++){
              d7[d7_num-1].appendChild(d6);
            //}
          }else{
            console.log(666);
            var d6=document.getElementsByClassName(id+"_Bottom")[0];
            if(cart.length>0){
              var number=0;
              for(index in cart) {
                number = number + cart[index].quantity;
              }
              //var d6_num=d6.length;
              //for(var i=0;i<d6_num;i++){
                d6.className="cartAddFlagCommon5_6 "+id+"_Bottom";
                setTimeout(function(){
                  d6.className="cartAddFlagCommon6 "+id+"_Bottom";
                },300);
                number<=999 ? d6.innerHTML=number : d6.innerHTML="...";
              //}
            }
          }
        }else if(cart!=null && cart.length==0){
          console.log(444);
          var d6=document.getElementsByClassName(id+"_Bottom");
          if(d6){
            var d6_num=d6.length;
            for(var i=0;i<d6_num;i++){
              d6[i].className="cartAddFlagCommon5 "+id+"_Bottom";
            }
          }
        }
      },
      //重设小红点user
      resetRedNumberUser:function(id,number){
        if (number>0) {
          var d2=document.getElementById(id);
          var d1=document.createElement("div");
            d1.id=id+"C1";
            d1.className="userOrderC1";
            d1.innerHTML=number<=99 ? number : "...";
          d2.appendChild(d1);
        }else if(number==0){
          d3=id+"C1";
          $("#"+d3).remove();
        }
      },
      //按钮点击效果1
      clickEffect:function(classN){
        var d1=document.getElementsByClassName(classN)[0];
          d1.className=classN+" clickEffectActiveCommon1";
          setTimeout(function(){
            d1.className=classN;
            d1.style.transition="0.3s";
          },300);
      },
      //按钮点击效果2
      clickEffect2:function(classN){
        var d1=document.getElementsByClassName(classN)[0];
          d1.className=classN+" clickEffectActiveCommon2";
          var x=1*60;
          var si3=setInterval(function(){
            x=x-1;
            d1.innerHTML=x+"秒后重发";
            if(x==0){
              clearInterval(si3);
            }
          },1000*1);
          var si4=setTimeout(function(){
            console.log(d1,classN);
            d1.className=classN;
            d1.innerHTML="获取验证码";
          },1000*61+1000);
      },
      //按钮点击效果3
      clickEffect3:function(e,classN){
        console.log(e);
        e.className=classN+" clickEffectActiveCommon1";
        setTimeout(function(){
          e.className=classN;
          e.style.transition="0.3s";
        },300);
      },
      //按钮点击效果4
      clickEffect4:function(classN){
        var d1=document.getElementsByClassName(classN)[0];
        d1.className=classN+"";
        var x=1*60;
        var si3=setInterval(function(){
          x=x-1;
          d1.innerHTML=x+"秒后重发";
          if(x==0){
            clearInterval(si3);
          }
        },1000*1);
        var si4=setTimeout(function(){
          console.log(d1,classN);
          d1.className=classN;
          d1.innerHTML="获取验证码";
        },1000*61+1000);
      },
      //重新计算倒计时间
      timeSurplus:function(finishTime){
        var num1=finishTime.length;
        var num2=new Date()/1000;
        var returndata=[];
        for(var i=0;i<num1;i++){
          var timeSurplus=finishTime[i]-num2;
          var d1=new Object();
          d1.h=parseInt(timeSurplus/(60*60));
          d1.m=parseInt(timeSurplus/60%60);
          d1.s=parseInt(timeSurplus%60);
          returndata.push(d1);
        }
        return returndata;
      },
      //图片自适应1
      imgWH:function(classNameWH,subtract){
        var d1=document.getElementsByClassName(classNameWH);
        var num1=screen.width/2-subtract*2;
        var num2=d1.length;
        console.log(d1,num1);
        for(var i=0;i<num2;i++){
          d1[i].style.height=num1+"px";
        }
      },
      //图片自适应2
      imgWH2:function(classNameWH,subtract){
        var d1=document.getElementsByClassName(classNameWH);
        var widthNum=d1[0].clientWidth;
        console.log(widthNum);
        var num1=widthNum-subtract*2;
        var num2=d1.length;
        console.log(d1,num1);
        for(var i=0;i<num2;i++){
          d1[i].style.height=num1+"px";
        }
      },
      //换最小价格
      changeMinPrice:function(obj,data5){
        var dict = {};
        for (var i in data5) {
          dict[data5[i].productId] = data5[i].price;
        }
        for (var i in obj) {
          obj[i].newPrice = dict[obj[i].id];
        }
        return obj;
      },
    };
  })

  //Cart
  .factory('CartStorage', function($resource, $rootScope, ENV, Storage, Alert,informationWindow) {
    return {
      //添加到购物车(传入商品)
      addCartWithGood: function(item) {
        if(item.status == 1 || item.status == 0) {
          //正常出售/预售
        } else {
          informationWindow.showError('商品状态有问题')
          return
        }
        var amount = Storage.getCurrentAmountInCart(item.id ? item.id : (item.product_id ? item.product_id : item.productId));
        var limitCount = parseInt(item.limitCount);
        console.log(limitCount);
        var stock = parseInt(item.stock)
        if (limitCount <= stock) {
          if (amount < limitCount) {
            Storage.addOrEditToCart(item.id ? item.id : (item.product_id ? item.product_id : item.productId), limitCount);
            informationWindow.showThree("该商品已加入购物车");
          } else {
            if (amount < stock) {
              Storage.addOrEditToCart(item.id ? item.id : (item.product_id ? item.product_id : item.productId), amount + 1);
              informationWindow.showThree("该商品已加入购物车");
            } else {
              informationWindow.showError('库存不足')
            }
          }
        } else {
          informationWindow.showError('库存不足')
        }
      }
    }
  })

  //网络请求
  .factory('HttpRequest', function($resource, $rootScope, ENV, Storage, $http, $ionicLoading,informationWindow) {
    return {
      get:function(url, params, success, error) {
        console.log(url, JSON.stringify(params));
        $ionicLoading.show()
        return $http({
          url:url,
          method:'GET',
          timeout: 10000,
          params:params
        }).success(function(data, status) {
          if(status == 200 && data.code == 1) {
            success(data.data)
          } else {
            error(data.msg)
            informationWindow.showOk(data.msg);
          }
          $ionicLoading.hide()
        }).error(function(data, status){
          error('网络不给力,请稍后再试')
          informationWindow.showError('网络不给力,请稍后再试');
          $ionicLoading.hide()
        })
      },
      post:function(url, params, success, error) {
        console.log(url, JSON.stringify(params));
        $ionicLoading.show()
        return $http({
          url:url,
          method:'POST',
          timeout: 5000,
          params:params
        }).success(function(data, status) {
          console.log(data);
          if(status == 200 && data.code == 1) {
            success(data.data)
          } else {
            error(data.msg)
            informationWindow.showOk(data.msg);
          }
          $ionicLoading.hide()
        }).error(function(data, status){
          console.log(url, JSON.stringify(params));
          error('网络不给力,请稍后再试')
          informationWindow.showError('网络不给力,请稍后再试');
          $ionicLoading.hide()
        })
      },
      noLoadingGet:function(url, params, success, error) {
        console.log(url, JSON.stringify(params));
        return $http({
          url:url,
          method:'GET',
          timeout: 5000,
          params:params
        }).success(function(data, status) {
          if(status == 200 && data.code == 1) {
            success(data.data)
          } else {
            error(data.msg)
            informationWindow.showOk(data.msg);
          }
        }).error(function(data, status){
          error('网络不给力,请稍后再试')
          informationWindow.showError('网络不给力,请稍后再试');
        })
      },
      noLoadingPost:function(url, params, success, error) {
        console.log(url, JSON.stringify(params));
        return $http({
          url:url,
          method:'POST',
          timeout: 5000,
          params:params
        }).success(function(data, status) {
          if(status == 200 && data.code == 1) {
            success(data.data)
          } else {
            error(data.msg)
            informationWindow.showOk(data.msg);
          }
        }).error(function(data, status){
          error('网络不给力,请稍后再试')
          informationWindow.showError('网络不给力,请稍后再试');
        })
      },
    }
  })

  //弹窗
  .factory('Alert', function(){
    return {
      showOk:function(msg) {
        $.amaran({
          'message':msg,
          'position'  :'top right',
          'inEffect'  :'slideRight'
        });
      },
      showError:function(msg) {
        $.amaran({
          'position'  :'top right',
          'inEffect'  :'slideRight',
          'theme'     :'colorful',
          'content'   :{
            bgcolor:'#ff0000',
            message:msg
          },
        })
      }
    }
  })

  //消息弹窗
  .factory('informationWindow', function(){
    return {
      showOk:function(msg) {
        var d1=document.getElementById("informationWindowId");
        if(d1==null){
          var d1=document.createElement("div");
          d1.id="informationWindowId";
          d1.className="informationWindowCommon1";
          d1.innerHTML=msg;
          document.body.appendChild(d1);
          setTimeout(function(){
            d1.className="informationWindowCommon2";
            setTimeout(function(){
              $("#informationWindowId").remove();
            },2000);
          },1000);
        }
      },
      showError:function(msg) {
        var d1=document.getElementById("informationWindowId");
        if(d1==null){
          var d1=document.createElement("div");
          d1.id="informationWindowId";
          d1.className="informationWindowCommon1";
          d1.innerHTML=msg;
          document.body.appendChild(d1);
          setTimeout(function(){
            d1.className="informationWindowCommon2";
            setTimeout(function(){
              $("#informationWindowId").remove();
            },2000);
          },1000);
        }
      },
      showThree:function(msg) {
        var d1=document.getElementById("informationWindowId");
        var d1=document.createElement("div");
        d1.id="informationWindowId";
        d1.className="informationWindowCommon1";
        d1.innerHTML=msg;
        document.body.appendChild(d1);
        setTimeout(function(){
          d1.className="informationWindowCommon2";
          setTimeout(function(){
            $("#informationWindowId").remove();
          },1000);
        },1000);
      },
    }
  })

  //支付
  .factory('PayEvent', function($resource, $rootScope, ENV, Storage, HttpRequest, Alert,informationWindow,$ionicLoading) {
    return {
      //payWithAlipay:function(order_id, price, success, error) {
      //  HttpRequest.post(ENV.orderUpdateOrder, {orderId:order_id, status:2}, success, error)
      //},
      //payWithWechat:function(para, success, error) {
      //  success()
      //},
      //getPreparePayOrder:function(order_id, success, error){
      //  HttpRequest.post(ENV.orderUpdateOrder, {orderId:order_id, status:2}, success, error)
      //},

      //支付宝支付
      payWithAlipay:function(order_id, price, success, error) {
        HttpRequest.post(ENV.payGetOrderInfoByAliPay, {order_id:order_id}, function(data10){
          $ionicLoading.show();
          LMPlugin.pay({
              platform: 'alipay',
              para:data10
            },
            function () {
              //成功
              success();
              $ionicLoading.hide();
            },
            function (msg) {
              informationWindow.showError(msg.errorReason);
              //失败
              error(msg);
              $ionicLoading.hide();
            })
        })
      },
      //微信支付
      payWithWechat:function(para, success, error) {
        $ionicLoading.show();
        console.log()
        LMPlugin.pay({
          platform:'wechatpay',
          para:para
        },
          function(){
            //成功
            success()
            $ionicLoading.hide();
          },
          function(msg){
            informationWindow.showError(msg.errorReason)
            //失败
            error(msg)
            $ionicLoading.hide();
          })
      },
      //获取微信预支付订单
      getPreparePayOrder:function(order_id, success, error){
        HttpRequest.post(ENV.getWechatOrder, {order_id:order_id}, success, error)
      }

    }
  })

  //用户注册
  .factory('Register', function($resource, $rootScope, ENV, Storage, HttpRequest) {
    return {
      getSmsCode:function(mobile, success, error) {
        HttpRequest.get(ENV.getSmsCode, {mobile:mobile}, success, error)
      },
      registerUser:function(mobile, password, code,deviceToken,deviceType, success, error) {
        HttpRequest.post(ENV.registerUser, {mobile:mobile, passWord:password, code:code,deviceToken:deviceToken,deviceType:deviceType}, success, error)
      }
    }
  })

  //找回密码
  .factory('ForgetPassword', function($resource, $rootScope, ENV, Storage, HttpRequest) {
    return {
      getSmsCode:function(mobile, success, error) {
        HttpRequest.get(ENV.resetPasswordGetSmsCode, {mobile:mobile}, success, error)
      },

      resetPassword:function(mobile, captcha, newWord, success, error) {
        HttpRequest.post(ENV.resetPassword, {mobile:mobile, captcha:captcha, newWord:newWord}, success, error)
      }
    }
  })

  //用户登录
  .factory('UserLogin', function($resource, $rootScope, ENV, Storage, HttpRequest) {
    return {
      login:function(mobile, password, success, error) {
        HttpRequest.post(ENV.userLogin, {mobile:mobile, passWord:password}, success, error)
      },
      weichatlogin:function(unionid, nickname,headimgurl,deviceToken,deviceType,mobile,password,code, success, error) {
        HttpRequest.noLoadingPost(ENV.userWechatInfoLogin, {unionid:unionid, nickname:nickname,headimgurl:headimgurl,deviceToken:deviceToken,deviceType:deviceType,mobile:mobile,password:password,code:code}, success, error)
      },
      weichatCheckTellphone:function(unionid, success, error) {
        HttpRequest.noLoadingPost(ENV.userWeixinMobileIsExist, {unionid:unionid}, success, error)
      },
      getUserGetWeixinMobileCode:function(mobile, success, error) {
        HttpRequest.noLoadingGet(ENV.userGetWeixinMobileCode, {mobile:mobile}, success, error)
      },
      addUserWeixinBinding:function(unionid,nickname,headimgurl,mobile,password, success, error) {
        HttpRequest.noLoadingGet(ENV.userWeixinBinding, {unionid:unionid,nickname:nickname,headimgurl:headimgurl,mobile:mobile,password:password}, success, error)
      }
    }
  })

  //商品详情接口
  .factory('getGoodsDetail', function($resource, $rootScope,ENV, HttpRequest) {
    return {
      getDetail: function(good_id,user_id, success, error) {
        HttpRequest.get(ENV.goodsDetail, {productId:good_id,user_id:user_id}, success, error)
      },
      getIfCollection:function(user_id, good_id, success, error) {
        HttpRequest.noLoadingGet(ENV.ifCollection, {userId: user_id,productId:good_id}, success, error)
      },
      collection: function(add,user_id, good_id,favouriteId, success, error) {
        HttpRequest.post(add ? ENV.addToCollection : ENV.deleteInCollection,add ? {userId:user_id,productId:good_id}:{favouriteId:favouriteId}, success, error)
      },
    }
  })

  //购物车
  .factory('Cart', function($resource, $rootScope,ENV, HttpRequest) {
    return{
      clearCart:function(user_id, success, error) {
        HttpRequest.noLoadingPost(ENV.clearCart, {userId:user_id}, success, error)
      },
      addToCart:function(user_id, data, success, error) {
        HttpRequest.noLoadingPost(ENV.addToCart, {userId:user_id, shopCarData:data}, success, error)
      },
      getCart:function(user_id, success, error) {
        HttpRequest.noLoadingGet(ENV.getCart, {userId:user_id, pageNo:1}, success, error)
      },
      deleteCart:function(user_id, cart_ids, success, error) {
        HttpRequest.noLoadingPost(ENV.deleteCart, {userId:user_id, cartIds:cart_ids}, success, error)
      },
      updateCart:function(data, success, error) {
        HttpRequest.post(ENV.updateCart, {shopCarData:data}, success, error)
      }
    }
  })

  //货仓分类
  .factory('productQueryCategory', function($resource, $rootScope,ENV, HttpRequest) {
    return {
      getProductQueryCategory: function(success, error) {
        HttpRequest.get(ENV.productQueryCategory, {}, success, error)
      }
    }
  })

  //商品列表
  .factory('productList', function($resource, $rootScope,ENV, HttpRequest) {
    return {
      getProductList: function(categoryId,sort,pageNo,success, error) {
        HttpRequest.noLoadingGet(ENV.productList, {categoryId:categoryId,sort:sort,pageNo:pageNo}, success, error)
      },
      getProductGetMinPrice: function(productids,success, error) {
        HttpRequest.noLoadingGet(ENV.productGetMinPrice, {productids:productids}, success, error)
      },
      getProductGetIsFavourite: function(user_id,product_id,success, error) {
        HttpRequest.noLoadingGet(ENV.productGetIsFavourite, {user_id:user_id,product_id:product_id}, success, error)
      },
    }
  })

  //
  .factory('orderEvent', function($resource, $rootScope,ENV,Storage,HttpRequest) {
    return{
      submit:function(user_id, address_id, type, shopCar_ids, coupon_id, remark,area_id, success, error){
        HttpRequest.noLoadingPost(ENV.submitOrder, {userId:user_id, addressId:address_id, type:type, shopCarIds:shopCar_ids, couponId:coupon_id, remark:remark,area_id:area_id}, success, error)
      },
      confirmReceive:function(order_id, success, error) {
        HttpRequest.post(ENV.orderUpdateOrder, {orderId:order_id, status:4}, success, error)
      },
      getOrderComputeExpressMoney:function(shopCarIds,addressId, success, error) {
        HttpRequest.get(ENV.orderComputeExpressMoney, {shopCarIds:shopCarIds, addressId:addressId}, success, error)
      },
    }
  })

  //个人资料
  .factory('userUserInfo', function($resource, $rootScope,ENV, HttpRequest) {
    return {
      getUserUserInfo: function(userId, success, error) {
        HttpRequest.get(ENV.userUserInfo, {userId:userId}, success, error)
      }
    }
  })

  //修改个人资料
  .factory('userUpdateInfo', function($resource, $rootScope,ENV, HttpRequest) {
    return {
      getUserUpdateInfo: function(userId,realName,nickName,gender,deviceToken,deviceType, success, error) {
        HttpRequest.post(ENV.userUpdateInfo, {userId:userId,realName:realName,nickName:nickName,gender:gender,deviceToken:deviceToken,deviceType:deviceType}, success, error)
      },
      getUserUpdateInfo2: function(userId,realName,nickName,gender,deviceToken,deviceType, success, error) {
        HttpRequest.noLoadingPost(ENV.userUpdateInfo, {userId:userId,realName:realName ? realName : '',nickName:nickName ? nickName : '',gender:gender=='保密' ? 0 : gender=='男' ? 1 : 2 ,deviceToken:deviceToken ? deviceToken : '',deviceType:deviceType ? deviceType : ''}, success, error)
      }
    }
  })

  //商品预售
  .factory('productReadySale', function($resource, $rootScope,ENV, HttpRequest) {
    return {
      getProductReadySale: function(categoryId,sort,pageNo, success, error) {
        HttpRequest.noLoadingGet(ENV.productReadySale, {categoryId:categoryId,sort:sort,pageNo:pageNo}, success, error)
      }
    }
  })

  //商品新品
  .factory('productNewList', function($resource, $rootScope,ENV, HttpRequest) {
    return {
      getProductNewList: function(categoryId,sort,pageNo, success, error) {
        HttpRequest.noLoadingGet(ENV.productNewList, {categoryId:categoryId,sort:sort,pageNo:pageNo}, success, error)
      }
    }
  })

  //商品热品
  .factory('productHotList', function($resource, $rootScope,ENV, HttpRequest) {
    return {
      getProductHotList: function(categoryId,sort,pageNo, success, error) {
        HttpRequest.noLoadingGet(ENV.productHotList, {categoryId:categoryId,sort:sort,pageNo:pageNo}, success, error)
      }
    }
  })

  //订单列表
  .factory('orderList', function($resource, $rootScope,ENV, HttpRequest) {
    return {
      getOrderList: function(userId,status,page, success, error) {
        HttpRequest.noLoadingGet(ENV.orderList, {userId:userId,status:status,page:page}, success, error)
      }
    }
  })

  //农场列表
  .factory('farmList', function($resource, $rootScope,ENV, HttpRequest) {
    return {
      getFarmList: function(pageNo,lat,lng,categoryId, success, error) {
        HttpRequest.noLoadingGet(ENV.farmList, {pageNo:pageNo,lat:lat,lng:lng,categoryId:categoryId}, success, error)
      },
      getFarmList2: function(pageNo,categoryId, success, error) {
        HttpRequest.noLoadingGet(ENV.farmList, {pageNo:pageNo,categoryId:categoryId}, success, error)
      },
      farmQueryCategory: function(success, error) {
        HttpRequest.noLoadingGet(ENV.farmQueryCategory, {}, success, error)
      }
    }
  })

  //农场详情
  .factory('farmDetails', function($resource, $rootScope,ENV, HttpRequest) {
    return {
      getFarmDetails: function(farmId, success, error) {
        HttpRequest.get(ENV.farmDetails, {farmId:farmId}, success, error)
      }
    }
  })

  //首页数据
  .factory('productIndex', function($resource, $rootScope,ENV, HttpRequest) {
    return {
      getProductIndex: function(success, error) {
        HttpRequest.get(ENV.productIndex, {}, success, error)
      }
    }
  })

  //活动
  .factory('productActivityProduct', function($resource, $rootScope,ENV, HttpRequest) {
    return {
      getProductActivityProduct: function(activityId,pageNo,success, error) {
        HttpRequest.get(ENV.productActivityProduct, {activityId:activityId,pageNo:pageNo}, success, error)
      }
    }
  })

  //订单状态修改
  .factory('orderUpdateOrder', function($resource, $rootScope,ENV, HttpRequest) {
    return {
      modifyOrderUpdateOrder: function(orderId,status,success, error) {
        HttpRequest.post(ENV.orderUpdateOrder, {orderId:orderId,status:status}, success, error)
      }
    }
  })

  //订单详情
  .factory('orderDetails', function($resource, $rootScope,ENV, HttpRequest) {
    return {
      getOrderDetails: function(orderId,success, error) {
        HttpRequest.get(ENV.orderDetails, {orderId:orderId}, success, error)
      }
    }
  })

  //我的收藏
  .factory('favouriteList', function($resource, $rootScope,ENV, HttpRequest) {
    return {
      getFavouriteList: function(userId, success, error) {
        HttpRequest.get(ENV.favouriteList, {userId:userId}, success, error)
      },
    }
  })

  //我的地址
  .factory('myAddress', function($resource, $rootScope,ENV, HttpRequest) {
    return {
      getAddress: function(user_id, success, error) {
        HttpRequest.get(ENV.getAddress, {userId:user_id}, success, error)
      },
      deleteAddress: function(address_id, succedd, error) {
        HttpRequest.post(ENV.deleteAddress, {addressId:address_id}, success, error)
      }
    }
  })

  //添加地址
  .factory('addAddress', function($resource, $rootScope,ENV, HttpRequest) {
    return {
      add: function(user_id, name, mobile, address,street, defaultFlag, success, error) {
        HttpRequest.post(ENV.addAddress, {userId:user_id, name:name, mobile:mobile, address:address,street:street, defaultFlag:defaultFlag ? 1 : 0}, success, error)
      },
    }
  })

  //修改地址
  .factory('modifyAddress', function($resource, $rootScope,ENV, HttpRequest) {
    return {
      modify: function(address_id, name, mobile, address,street, defaultFlag, success, error) {
        HttpRequest.post(ENV.modifyAddress, {addressId:address_id, name:name, mobile:mobile, address:address,street:street, defaultFlag:defaultFlag ? 1 : 0}, success, error)
      },
      modify2: function(address_id, defaultFlag, success, error) {
        HttpRequest.post(ENV.modifyAddress, {addressId:address_id, defaultFlag:defaultFlag ? 1 : 0}, success, error)
      },
      delete: function(address_id, success, error) {
        HttpRequest.post(ENV.deleteAddress, {addressId:address_id}, success, error)
      },
    }
  })

  //优惠券
  .factory('myCoupon', function($resource, $rootScope,ENV, HttpRequest) {
    return {
      getCoupon: function(user_id, success, error) {
        HttpRequest.get(ENV.getCoupon, {userId:user_id}, success, error)
      },
      getCouponGetDefaultCoupon: function(userId,price, success, error) {
        HttpRequest.get(ENV.couponGetDefaultCoupon, {userId:userId,price:price}, success, error)
      },
    }
  })

  //推广码
  .factory('varifyCode', function($resource, $rootScope,ENV, HttpRequest) {
    return {
      varify: function(user_id, code, success, error) {
        HttpRequest.get(ENV.varifyCode, {userId:user_id, code:code}, success, error)
      },
    }
  })

  //搜索
  .factory('searchEvent', function($resource, $rootScope,ENV, HttpRequest) {
    return {
      search: function(keyword, success, error) {
        HttpRequest.get(ENV.search, {keyword:keyword}, success, error)
      },
    }
  })

  //删除路由
  .factory('Global',function($rootScope,$resource,$ionicHistory){
    return {
      //根据app里面的名字的state名删除历史
      removeHistory:function(stateName) {
        for(i in $ionicHistory.viewHistory().histories) {
          var history = []
          for (j in $ionicHistory.viewHistory().histories[i].stack) {
            if ($ionicHistory.viewHistory().histories[i].stack[j].stateName != stateName) {
              history.push($ionicHistory.viewHistory().histories[i].stack[j])
            }
          }
          $ionicHistory.viewHistory().histories[i].stack = history
        }
      }
    }
  })

  //提醒发货
  .factory('orderRemindDeliverGoods', function($resource, $rootScope,ENV, HttpRequest) {
    return {
      addOrderRemindDeliverGoods: function(order_id,user_id,remark, success, error) {
        HttpRequest.post(ENV.orderRemindDeliverGoods, {order_id:order_id,user_id:user_id,remark:remark}, success, error)
      },
    }
  })

  //商品需求反馈
  .factory('demandFeedbackAddDemandFeedback', function($resource, $rootScope,ENV, HttpRequest) {
    return {
      addDemandFeedbackAddDemandFeedback: function(userId,productName,product_explain,everyday_consume,address,type,imgFile, success, error) {
        HttpRequest.get(ENV.demandFeedbackAddDemandFeedback, {userId:userId,productName:productName,product_explain:product_explain,everyday_consume:everyday_consume,address:address,type:type,imgFile:imgFile}, success, error)
      },
    }
  })

  //农场预约
  .factory('bespeakvisit', function($resource, $rootScope,ENV, HttpRequest) {
    return {
      addBespeakvisitAddBespeakVisit: function(farm_id,visit_namel,visit_count,mobile,code,visit_time,mode, success, error) {
        HttpRequest.post(ENV.bespeakvisitAddBespeakVisit, {farm_id:farm_id,visit_namel:visit_namel,visit_count:visit_count,mobile:mobile,code:code,visit_time:visit_time,mode:mode}, success, error)
      },
      getBespeakvisitGetBespeakVisitCode: function(mobile, success, error) {
        HttpRequest.get(ENV.bespeakvisitGetBespeakVisitCode, {mobile:mobile}, success, error)
      },
    }
  })

  //查询物流
  .factory('orderSelectLogisticsInfo', function($resource, $rootScope,ENV, HttpRequest) {
    return {
      getOrderSelectLogisticsInfo: function(order_id, success, error) {
        HttpRequest.get(ENV.orderSelectLogisticsInfo, {order_id:order_id}, success, error)
      },
    }
  })

  //批量添加收藏
  .factory('favouriteBatchAdd', function($resource, $rootScope,ENV, HttpRequest) {
    return {
      addFavouriteBatchAdd: function(favouriteData, success, error) {
        HttpRequest.post(ENV.favouriteBatchAdd, {favouriteData:favouriteData}, success, error)
      },
    }
  })

  //意见反馈
  .factory('feedbackAddFeedback', function($resource, $rootScope,ENV, HttpRequest) {
    return {
      addFeedbackAddFeedback: function(userId,content,contactWay, success, error) {
        HttpRequest.post(ENV.feedbackAddFeedback, {userId:userId,content:content,contactWay:contactWay}, success, error)
      },
    }
  })

  //系统通知
  .factory('systemNotifyQuerySystemNotify', function($resource, $rootScope,ENV, HttpRequest) {
    return {
      getSystemNotifyQuerySystemNotify: function(userId, success, error) {
        HttpRequest.get(ENV.systemNotifyQuerySystemNotify, {userId:userId}, success, error)
      },
    }
  })

  //软件更新
  .factory('appVersionList', function($resource, $rootScope,ENV, HttpRequest) {
    return {
      getAppVersionList: function(type, success, error) {
        HttpRequest.get(ENV.appVersionList, {type:type}, success, error)
      },
    }
  })

  //用户订单分类数量
  .factory('orderFindUserOrderNumberByUserId', function($resource, $rootScope,ENV, HttpRequest) {
    return {
      getOrderFindUserOrderNumberByUserId: function(user_id, success, error) {
        HttpRequest.get(ENV.orderFindUserOrderNumberByUserId, {user_id:user_id}, success, error)
      },
    }
  })
