/**
 * Created by Lemon on 16/7/22.
 */
angular.module('starter.share', ['ionic'])

  //分享商品界面
  .controller('shareGoodsCtrl',function($scope,ENV,$ionicSlideBoxDelegate,$ionicHistory,$state,Storage,$stateParams,productList,informationWindow,CartStorage,getGoodsDetail) {
    $scope.$on('$ionicView.enter', function() {

    })


    $scope.$on('$ionicView.beforeEnter', function() {
      if(navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1){
        $scope.phoneFlag=false;
      }else if(!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
        $scope.phoneFlag=true;
      }

    var ss7=setInterval(function(){
      var e1=document.getElementById("goodsDetailContentScroll2");
      if(e1){
        if($scope.phoneFlag==0){
          $("#goodsDetailContentScroll2").addClass("phoneClass1");
          $("#goodsDetailScroll_2").scroll(function(){
            var t1=document.getElementById("goodsDetailScroll_2");
            var num1=(screen.width-44)/100;
            var num2=t1.scrollTop;
            var num3=parseInt(num2/num1);
            var t2=document.getElementById("goodsDetailTopBar2");
            if(num3<100){
              t2.style.opacity=num3/100;
            }else if(num3>=100){
              t2.style.opacity=1;
            }
          });
        }else if($scope.phoneFlag==1){
          $("#goodsDetailContentScroll2").addClass("phoneClass2");
          e1.children[0].id="goodsDetailContentScrollTwo";
          $("#goodsDetailContentScroll2").scroll(function(){
            var t1=document.getElementById("goodsDetailContentScrollTwo");
            var num1=(screen.width-44)/100;
            var num2=-(parseFloat(t1.style.transform.split(",")[1]));
            var num3=parseInt(num2/num1);
            var t2=document.getElementById("goodsDetailTopBar2");
            if(num3<100){
              t2.style.opacity=num3/100;
            }else if(num3>=100){
              t2.style.opacity=1;
            }
          });
        }
        clearInterval(ss7);
      }
    },1000/60);

      getGoodsDetail.getDetail($stateParams['good_id'],"", function(data){
        $ionicSlideBoxDelegate.$getByHandle("slideimgs").update();
        console.log(data);
        var bb='onload={$(this).fadeTo("slow",1);} style="opacity:0;" src=';
        var aa="<img onerror="+'"'+"this.src='img/lvnongLogo3.png'"+'" ';
        //var aa="<img err-src='img/lvnongLogo3.png' ";
        if(data.description){
          data.description=data.description.replace(/src=/g,bb);
          data.description=data.description.replace(/<img/g,aa);
        }
        if(data.sourceInfo){
          data.sourceInfo=data.sourceInfo.replace(/src/g,bb);
          data.sourceInfo=data.sourceInfo.replace(/<img/g,aa);
        }


        $scope.detail = data;

        var c1=document.getElementsByClassName("goodsDetailWords")[0];
        c1.innerHTML=$scope.detail.description;
        //c1[1].innerHTML=$scope.detail.sourceInfo;

        //console.log($scope.detail.description);
        $scope.detail.farmImage = imgBaseUrl + $scope.detail.farmImage
        for (index in $scope.detail.images) {
          $scope.detail.images[index] = imgBaseUrl +  $scope.detail.images[index]
        }

        console.log(aa);
        //$scope.detail.description=$scope.detail.description.replace(/<img/g,aa);

        var prices = data.prices.reverse();
        $scope.firstPrice = prices.length > 0 ? prices[0] : null
        $scope.lastPrice = prices.length > 1 ? prices[prices.length - 1] : null
        $scope.middlePrices = prices.length > 2 ?prices.slice(1, prices.length - 1) : null
      }, function(){
      })
    })

    $scope.back = function () {
      $ionicHistory.goBack();
    }

    $scope.jsGo=function(data){
      $state.go(data, {});
    }

    $scope.showType=true;

    //商品详情/溯源
    $scope.changeType = function(type) {
      $scope.showType = type == 0 ? true : false;
      if($scope.showType){
        setTimeout(function(){
          var c1=document.getElementsByClassName("goodsDetailWords")[0];
          console.log(111,c1);
          c1.innerHTML=$scope.detail.description;
        },200);
      }else{
        setTimeout(function(){
          var c1=document.getElementsByClassName("goodsDetailWords2")[0];
          console.log(222,c1);
          c1.innerHTML=$scope.detail.sourceInfo;
        },200);
      }
    }

    $scope.goodsAlert=function(){
      informationWindow.showOk("该商品还没有溯源哦");
    }

    //$scope.screenTouch=function(e){
    //  //console.log(11);
    //  $scope.tt2=setInterval(function(){
    //    var t1=document.getElementById("goodsDetailContentScroll2");
    //
    //    var num1=(screen.width-44)/100;
    //    var num2=t1.scrollTop;
    //    var num3=parseInt(num2/num1);
    //    //console.log(screen.width,num1,num2,num3);
    //    var t2=document.getElementById("goodsDetailTopBar2");
    //    if(num3<100){
    //      t2.style.opacity=num3/100;
    //    }else if(num3>=100){
    //      t2.style.opacity=1;
    //    }
    //    //informationWindow.showOk(t1.scrollTop);
    //  },1000/60);
    //}
    //
    //$scope.screenRelease=function(){
    //  //console.log(22);
    //  setTimeout(function(){
    //    clearInterval($scope.tt2);
    //  },500);
    //}

    $scope.download = function() {
      window.location.href='http://a.app.qq.com/o/simple.jsp?pkgname=com.yl.lvnong';
    };
  })

  //分享农场界面
  .controller('shareFarmCtrl',function($scope,ENV,$ionicSlideBoxDelegate,$ionicHistory,$state,Storage,$stateParams,productList,informationWindow,CartStorage,getGoodsDetail,farmDetails) {
    $scope.$on('$ionicView.beforeEnter', function() {
      farmDetails.getFarmDetails($stateParams['farm_id'], function(data){
        $ionicSlideBoxDelegate.$getByHandle("slideimgs2").update();
        var bb='onload={$(this).fadeTo("slow",1);} style="opacity:0;" src=';
        var aa="<img onerror="+'"'+"this.src='img/lvnongLogo3.png'"+'" ';
        data.description=data.description.replace(/src=/g,bb);
        data.description=data.description.replace(/<img/g,aa);

        $scope.farmDetailsArr=data;


        var c1=document.getElementsByClassName("farmDetailDescription")[0];

        //var farmHTML=$scope.farmDetailsArr.description+$scope.farmDetailsArr.description;

        c1.innerHTML=$scope.farmDetailsArr.description;

        var num20=$scope.farmDetailsArr.images.length;
        for(var i=0;i<num20;i++){
          $scope.farmDetailsArr.images[i]=imgBaseUrl+$scope.farmDetailsArr.images[i];
        }
        for(index in $scope.farmDetailsArr.products){
          $scope.farmDetailsArr.products[index].image=imgBaseUrl+$scope.farmDetailsArr.products[index].image;
        }
        console.log($scope.farmDetailsArr);

        var num21=$scope.farmDetailsArr.products.length;
        setTimeout(function(){
          var d1=document.getElementsByClassName("farmDetailImg2")[0].children[0];
          d1.style.width=(100/3*num21)+"%";
          for(var i=0;i<num21;i++){
            d1.children[i].style.width=(100/num21)+"%";
            d1.children[i].style.visibility="visible";
          }
          console.log(d1,num21);
        },200);
      }, function(){
      })
    })

    $scope.back = function () {
      $ionicHistory.goBack();
    }

    $scope.jsGo=function(data){
      $state.go(data, {});
    }

    $scope.download = function() {
      window.location.href='http://a.app.qq.com/o/simple.jsp?pkgname=com.yl.lvnong';
    };

  })

  //分享农场界面
  .controller('shareHomeCtrl',function($scope,$rootScope,ENV,$ionicSlideBoxDelegate,$ionicHistory,$state,Storage,$stateParams,productList,informationWindow,CartStorage,productIndex) {
    $scope.back = function () {
      $ionicHistory.goBack();
    }

    $scope.jsGo=function(data){
      $state.go(data, {});
    }

    productIndex.getProductIndex(function(data){
      $scope.banner = data.banner
      $scope.activity = data.activity
      $scope.suggestProduct = data.suggestProduct

      for(index in $scope.suggestProduct) {
        var dd = new Date($scope.suggestProduct[index].saleTime);
        $scope.suggestProduct[index].saleTime = dd.getFullYear() + "." + (dd.getMonth() + 1) + "." + dd.getDate();
        $scope.suggestProduct[index].image = imgBaseUrl + $scope.suggestProduct[index].image
      }

      for(index in $scope.banner){
        $scope.banner[index].image = imgBaseUrl +$scope.banner[index].image;
      }
      for (index in $scope.activity) {
        $scope.activity[index].image = imgBaseUrl + $scope.activity[index].image
      }

      $ionicSlideBoxDelegate.$getByHandle("slideimgsHome").update();
      $ionicSlideBoxDelegate.$getByHandle("slideimgsHome").loop(true);
      $ionicSlideBoxDelegate.loop();

      console.log($scope.banner, $scope.activity, $scope.suggestProduct);
    }, function(){
    })

    $scope.download = function() {
      window.location.href='http://a.app.qq.com/o/simple.jsp?pkgname=com.yl.lvnong';
    };
  })
