/**
 * Created by htzhanglong on 2015/8/2.
 */
angular.module('starter.controllers', ['ionic'])

    //首页
    .controller('HomeCtrl', function($scope,$rootScope,ENV,$ionicSlideBoxDelegate,$state,productIndex,Storage,CartStorage,$ionicPopup,$ionicHistory,$ionicLoading,informationWindow,appVersionList,userUpdateInfo,productList) {
      //$scope.$on('$ionicView.beforeEnter', function() {
      //  $ionicLoading.show({});
      //})
      //
      //$scope.$on('$ionicView.afterEnter', function() {
      //  $ionicLoading.hide();
      //})

      $scope.user=Storage.get('user');
      if($scope.user){
        $scope.userImg=imgBaseUrl+$scope.user.pic_url;
      }

      console.log($scope.userImg);
      $scope.PlatformFlag=ionic.Platform.isIOS() ? 'i' : 'o';

      if ($ionicHistory.backView() && $ionicHistory.backView().stateId == 'loginRegister') {
        $ionicHistory.clearHistory()
      }

      $scope.$on('$ionicView.beforeEnter', function() {
        $rootScope.hideTabs = false;
      })

      $scope.get=function(){
        console.log();
        console.log(11);
      }

      setTimeout(function(){
        LMPlugin.thirdShare({platform:'version'}, function(result){
          if($scope.user){
            userUpdateInfo.getUserUpdateInfo2($scope.user.userId,$scope.user.realName,$scope.user.nickName,$scope.user.gender,result.data.token,$scope.PlatformFlag, function(data){

            }, function(){
            })
          }

          appVersionList.getAppVersionList(ionic.Platform.isIOS() ? 'i' : 'o',function(data){
            console.log(JSON.stringify(result), data);
            //informationWindow.showThree(JSON.stringify(result));
            if (parseFloat(result.data.version) < parseFloat(data.version)) {
              if (data.update_install == 'y') {
                var alertPopup = $ionicPopup.alert({
                  title: '检查到软件有更新',
                  template: '更新到最新版本',
                  okText: '确认'
                });
                alertPopup.then(function(res) {
                  LMPlugin.thirdShare({platform:'openUrl', para:'http://a.app.qq.com/o/simple.jsp?pkgname=com.yl.lvnong', forceExit:'1'}, function(data){

                  }, function() {

                  });
                  ionic.Platform.exitApp();
                });
              } else {
                var confirmPopup = $ionicPopup.confirm({
                  title: '检查到软件有更新',
                  template: '是否更新到最新版本?',
                  okText: '确认',
                  cancelText: '稍后'
                });
                confirmPopup.then(function(res) {
                  if(res) {
                    LMPlugin.thirdShare({platform:'openUrl', para:'http://a.app.qq.com/o/simple.jsp?pkgname=com.yl.lvnong'}, function(data){

                    }, function() {

                    });
                  } else {
                    console.log('稍后');
                  }
                });
              }
            }
          }, function(){

          });
          LMPlugin.thirdShare({platform:'location'}, function(data){
            console.log(data.data.lat, data.data.long);
            var lvnonglocation=new Object();
            lvnonglocation.lat=data.data.lat;
            lvnonglocation.long=data.data.long;
            Storage.set("lvnonglocation",lvnonglocation);
          }, function() {

          })
        }, function() {

        })
      }, 1000);





      //$scope.$on('$ionicView.enter', function() {
      //
      //  setTimeout(function(){
      //    var d1=document.getElemetById("homeSlideTop");
      //      d1.parent.location.reload();
      //    //$ionicSlideBoxDelegate.$getByHandle("slideimgsHome").loop(true);
      //
      //  },2000);
      //
      //})


      $scope.bannerTop=function(x){
        $rootScope.hideTabs = 'tabs-item-hide';
        console.log(x);
        if(x.type==0){
          $state.go('tab.homeGoodsDetail', {good_id: x.infoId});
        }else if(x.type==1){
          activeImg= x.image;
          $state.go('tab.activeDetail', {});
          activeId= x.infoId;
        }else if(x.type==2){
          $state.go('tab.advertisementDetail', {});
          localStorage.advertisementDetailStorage=JSON.stringify(x.description);
        }
      }

      //$scope.$on('$ionicView.beforeEnter', function() {




        productIndex.getProductIndex(function(data){
          $scope.suggestProduct=[];
          $scope.banner = data.banner
          $scope.activity = data.activity
          for(index in data.suggestProduct){
            if(data.suggestProduct[index].status==0 || data.suggestProduct[index].status==1){
              $scope.suggestProduct.push(data.suggestProduct[index]);
            }
          }


          $scope.goodsIds="";
          for(index in $scope.suggestProduct){
            $scope.goodsIds=$scope.goodsIds+$scope.suggestProduct[index].id+",";
          }
          $scope.goodsIds.substring(0,$scope.goodsIds.length-1);

          console.log($scope.goodsIds);


          console.log(data);
          productList.getProductGetMinPrice($scope.goodsIds,function(data5){
            $scope.suggestProduct=Storage.changeMinPrice($scope.suggestProduct,data5);
          });

          $scope.suggestProduct2=$scope.suggestProduct.slice(0,$scope.suggectFlag);
          console.log($scope.suggestProduct);
          console.log($scope.suggestProduct2);


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

          //var time1=setInterval(function(){
          //  var d1=document.getElementsByClassName("presellListC4");
          //  if(d1){
          //    Storage.imgWH("presellListC4",10);
          //    clearInterval(time1);
          //  }
          //},1000/60);

          console.log($scope.banner, $scope.activity, $scope.suggestProduct);
        }, function(){
        })
      //})

      $scope.loadMoreDataEnable=true;
      $scope.suggectFlag=8;
      $scope.suggestProduct2=[];

      $scope.loadMoreData=function(){
        if($scope.suggectFlag>=30){
          $scope.loadMoreDataEnable=false;
        }
        if($scope.loadMoreDataEnable==true){
          $scope.$broadcast('scroll.infiniteScrollComplete');
          if($scope.suggestProduct!=undefined){
            $scope.suggectFlag=$scope.suggectFlag+30;
            $scope.suggestProduct2=$scope.suggestProduct.slice(0,$scope.suggectFlag);
          }
          $("#infiniteScrollHomeId").css({opacity:1});
        }else if($scope.loadMoreDataEnable==false){
          $("#infiniteScrollHomeId").css({opacity:0});
        }
      }

      //创建商品添加flag
      $scope.$on('$ionicView.enter', function() {
        Storage.resetRedNumberBottom(0);
      })

      $scope.name='HomeCtrl';

      $scope.jsGo=function(data, index){
        $rootScope.hideTabs = 'tabs-item-hide'
        if (data == 'tab.goodsDetail') {
          console.log($scope.suggestProduct[index].id)
          $state.go('tab.goodsDetail', {good_id:$scope.suggestProduct[index].id});
        }else if (data == 'tab.homeGoodsDetail') {
          console.log($scope.suggestProduct[index].id)
          $state.go('tab.homeGoodsDetail', {good_id:$scope.suggestProduct[index].id});
        } else {
          $state.go(data, {})
        }
      }
      $scope.jsGoActive=function(data,aId,image){
        $rootScope.hideTabs = 'tabs-item-hide'
        activeId=aId;
        activeImg=image;
        $state.go(data, {});
      }
      $scope.goSearch=function(){
        $state.go('search', {});
      }

      //
      //productIndex.get();
      //$scope.$on('productIndex.getproductIndex',function(){
      //
      //  $scope.banner = productIndex.getdata().data.banner
      //  $scope.activity = productIndex.getdata().data.activity
      //  $scope.suggestProduct = productIndex.getdata().data.suggestProduct
      //
      //
      //
      //  for(index in $scope.suggestProduct) {
      //    var dd = new Date($scope.suggestProduct[index].saleTime);
      //    $scope.suggestProduct[index].saleTime = dd.getFullYear() + "." + (dd.getMonth() + 1) + "." + dd.getDate();
      //    $scope.suggestProduct[index].image = imgBaseUrl + $scope.suggestProduct[index].image
      //  }
      //
      //  for(index in $scope.banner){
      //    $scope.banner[index].image = imgBaseUrl +$scope.banner[index].image;
      //  }
      //  for (index in $scope.activity) {
      //    $scope.activity[index].image = imgBaseUrl + $scope.activity[index].image
      //  }
      //
      //  $ionicSlideBoxDelegate.$getByHandle("slideimgsHome").update();
      //  $ionicSlideBoxDelegate.$getByHandle("slideimgsHome").loop(true);
      //  console.log($scope.banner, $scope.activity, $scope.suggestProduct);
      //})
      //添加购物车
      $rootScope.texiao1num=0;
      $scope.addCart=function(e,index){
        Storage.clickEffect3(e.target,"presellAddCart");
        CartStorage.addCartWithGood($scope.suggestProduct[index]);

        //var d2=document.createElement("i");
        //d2.className="icon ion-ios-plus-outline iconAnimation1";
        //d2.style.left=(e.clientX- e.offsetX)+"px";
        //d2.style.top=(e.clientY-e.offsetY)+"px";
        //d2.id="texiao1_"+$rootScope.texiao1num;
        //var numleft=e.clientX- e.offsetX;
        //var numtop=e.clientY-e.offsetY;
        //var d3=d2.id;
        //document.body.appendChild(d2);
        //$rootScope.texiao1num++;
        //setTimeout(function(){
        //  d2.style.left=(numleft-8)+"px";
        //  d2.style.top=(numtop-10)+"px";
        //  d2.className="icon ion-ios-plus-outline iconAnimation2";
        //  setTimeout(function(){
        //    $("#"+d3).remove();
        //  },200);
        //},100);
        //informationWindow.showThree("该商品已加入购物车");
        Storage.resetRedNumberBottom(1);
      }

      //联系客服
      $scope.connect = function() {
        LMPlugin.qiyuService({title:'绿农客服', urlString:'https://8.163.com/', sessionTitle:'绿农客服'},
          function(){
            //成功
          },
          function(){
            //失败
            alert(error.errorReason)
          })
      }

    })

    //货仓
    .controller('storehouseCtrl', function($scope,$rootScope,ENV,$state,productQueryCategory,productList,Storage,Cart,CartStorage, searchEvent, Alert,informationWindow,favouriteList) {

      $scope.$on('$ionicView.beforeEnter', function() {
        $rootScope.hideTabs = false;
        $(".presellAllCategory1").css("display","none");
        $(".presellAllCategory2").css("display","none");
      })

      //创建商品添加flag
      $scope.$on('$ionicView.enter', function() {
        Storage.resetRedNumberBottom(0);
        setTimeout(function(){
          $("#storehouseBarId").fadeTo("slow",1);
          $("#storehouseContentId").fadeTo("slow",1);
        },300);
      })

      //$scope.storehouseClearInput=function(){
      //  var d1=document.getElementById("storehouseInput3");
      //    d1.value="";
      //  var d2=document.getElementById("storehouseDiv2");
      //    d2.className="storehouseDivIcon2";
      //}

      $scope.changeKeyword=function(searchName){
        console.log(searchName);
        if(searchName!=""){
          var d1=document.getElementById("storehouseDiv2");
            d1.className="storehouseDivIcon3";
        }else if(searchName==""){
          var d1=document.getElementById("storehouseDiv2");
            d1.className="storehouseDivIcon2";
        }
      }

      $scope.storehouseFocus=function(e){
        console.log($rootScope.hideTabs);
        keyBoradFlag=1;
        //$rootScope.hideTabs = 'tabs-item-hide';
        //var d1=document.getElementsByClassName("storehouseContent")[0];
        //  d1.className="storehouseContent2 scroll-content ionic-scroll scroll-content-false ng-pristine ng-untouched ng-valid  has-header has-tabs";
      }

      $scope.storehouseBlur=function(){
        console.log($rootScope.hideTabs);
        keyBoradFlag=0;
        //$rootScope.hideTabs = false;
        //var d1=document.getElementsByClassName("storehouseContent2")[0];
        //  d1.className="storehouseContent scroll-content ionic-scroll scroll-content-false ng-pristine ng-untouched ng-valid  has-header has-tabs";
      }

      //初始背景颜色
      var si=setInterval(function(){
        console.log(document.getElementsByClassName("storehouseLeftList")[1]);
        var d1=document.getElementsByClassName("storehouseLeftList")[1];
        if(d1!=undefined){
          d1.className="storehouseLeftList storehouseLeftListActive";
          var d30=document.getElementById("storehouseGoodsImg");
            d30.src=$scope.iconImage[1];
          clearInterval(si);
        }
      },100);

      //跳转页面
      $scope.jsGo=function(view, data){
        $rootScope.hideTabs = 'tabs-item-hide';
        $state.go(view, {good_id:$scope.favList ? data.product_id : data.id});
      }

      $scope.jsGo2=function(data,id){
        $rootScope.hideTabs = 'tabs-item-hide';
        //console.log(id,$scope.storehouseCategoryArr[$scope.twoList].name);
        $state.go(data, {threeId:id,name:$scope.storehouseCategoryArr[$scope.twoList].name});
      }
      //请求数据初始化
      $scope.listNo=6;
      $scope.pageNo=1;
      $scope.categoryId=13;
      $scope.categoryArr1=[["销售由低到高","5"],["销售由高到低","6"]];
      $scope.categoryArr2=[["价格由低到高","11"],["价格由高到低","12"]];
      $scope.twoList=1;

      $scope.iconImage=["img/lvnongLogo2.png"];

      //$scope.$on('$ionicView.beforeEnter', function() {
        productQueryCategory.getProductQueryCategory(function(data){
          $scope.storehouseCategoryArr=data;
          for (index in $scope.storehouseCategoryArr) {
            $scope.storehouseCategoryArr[index].image = imgBaseUrl + $scope.storehouseCategoryArr[index].image;
            $scope.storehouseCategoryArr[index].iconImage = imgBaseUrl + $scope.storehouseCategoryArr[index].iconImage;
            $scope.iconImage.push($scope.storehouseCategoryArr[index].image);
            for(x in $scope.storehouseCategoryArr[index].catVOList){
              $scope.storehouseCategoryArr[index].catVOList[x].iconImage = imgBaseUrl + $scope.storehouseCategoryArr[index].catVOList[x].iconImage;
            }
          }
          console.log($scope.iconImage);

          var o1=new Object();
            o1.id=12;
            o1.name="我的收藏";
            o1.iconImage="img/my_sp.png";
          $scope.storehouseCategoryArr.unshift(o1);
          console.log($scope.storehouseCategoryArr);

          $scope.categoryId=$scope.storehouseCategoryArr[1].id;

          $scope.storehouseLeftClickNumId="storehouseLeft_"+$scope.storehouseCategoryArr[1].id;

          //productList.getProductList($scope.categoryId,$scope.listNo,$scope.pageNo, function(data){
          //  $scope.storehouseListArr=data;
          //  for (index in $scope.storehouseListArr) {
          //    $scope.storehouseListArr[index].image = imgBaseUrl + $scope.storehouseListArr[index].image;
          //  }
          //  console.log($scope.storehouseListArr);
          //
          //  //var time1=setInterval(function(){
          //  //  var d1=document.getElementsByClassName("storehouseRightListC1");
          //  //  if(d1){
          //  //    Storage.imgWH2("storehouseRightListC1",0);
          //  //    clearInterval(time1);
          //  //  }
          //  //},1000/60);
          //
          //}, function(){
          //})


          umregister("enterGoodsStore");
        }, function(){
        })
      //})

      //var initBackground=document.getElementsByClassName("storehouseLeftList")[1];
      //种类列表请求
      //queryCategory.get();
      //$scope.$on('queryCategory.getqueryCategory',function(){
      //  $scope.storehouseCategoryArr=queryCategory.getdata().data;
      //  var o1=new Object();
      //    o1.id=12;
      //    o1.name="我的商品";
      //    o1.image="img/my_sp.png";
      //  $scope.storehouseCategoryArr.unshift(o1);
      //  console.log($scope.storehouseCategoryArr);
      //})
      //种类下属列表
      //storehouseList.get($scope.categoryId,$scope.listNo,$scope.pageNo);
      //$scope.$on('storehouseList.getstorehouseList',function(){
      //  $scope.storehouseListArr=storehouseList.getdata().data;
      //  for (index in $scope.storehouseListArr) {
      //    $scope.storehouseListArr[index].image = imgBaseUrl + $scope.storehouseListArr[index].image
      //  }
      //  console.log($scope.storehouseListArr);
      //})
      //我的收藏
      //$scope.$on('favouriteList.getfavouriteList',function(){
      //  $scope.favouriteListArr=favouriteList.getdata().data;
      //  for (index in $scope.favouriteListArr) {
      //    $scope.favouriteListArr[index].image = imgBaseUrl + $scope.favouriteListArr[index].image
      //  }
      //  console.log($scope.favouriteListArr);
      //  $scope.storehouseListArr=$scope.favouriteListArr;
      //})



      //点击种类按钮
      $scope.storehouseLeftClick=function(e,index){
        $scope.twoList=index;
        var d1=document.getElementById($scope.storehouseLeftClickNumId);
        if(e.target.parentElement.id!=""){
          var d2=e.target.parentElement;
        }else{
          var d2=e.target.parentElement.parentElement;
        }
        if(d1.id!=d2.id){
          d1.style.background="white";
          d2.style.background="#E7E6E6";
          $scope.storehouseLeftClickNumId=d2.id;

          var d30=document.getElementById("storehouseGoodsImg");
            d30.src=$scope.iconImage[index];
        }
        var d3=d2.id.split("_")[1];
        if(d3!=12){
          $scope.favList = false
          $scope.categoryId=d2.id.split("_")[1];
          //productList.getProductList($scope.categoryId,$scope.listNo,$scope.pageNo, function(data){
          //  $scope.storehouseListArr=data;
          //  for (index in $scope.storehouseListArr) {
          //    $scope.storehouseListArr[index].image = imgBaseUrl + $scope.storehouseListArr[index].image
          //  }
          //  console.log($scope.storehouseListArr);
          //
          //  //var time1=setInterval(function(){
          //  //  var d1=document.getElementsByClassName("storehouseRightListC1");
          //  //  if(d1){
          //  //    Storage.imgWH2("storehouseRightListC1",0);
          //  //    clearInterval(time1);
          //  //  }
          //  //},1000/60);
          //
          //}, function(){
          //})
        }else{
          if(JSON.parse(localStorage.user)){
            $scope.favList = true
            //favouriteList.get(JSON.parse(localStorage.user).userId);
            favouriteList.getFavouriteList(JSON.parse(localStorage.user).userId, function(data){
              $scope.favouriteListArr=data;
              for (index in $scope.favouriteListArr) {
                $scope.favouriteListArr[index].image = imgBaseUrl + $scope.favouriteListArr[index].image
              }
              console.log($scope.favouriteListArr);
              $scope.storehouseListArr=$scope.favouriteListArr;

              //var time1=setInterval(function(){
              //  var d1=document.getElementsByClassName("storehouseRightListC1");
              //  if(d1){
              //    Storage.imgWH2("storehouseRightListC1",0);
              //    clearInterval(time1);
              //  }
              //},1000/60);

            }, function(){
            })
          }
        }

      }
      ////按销售量排序
      //$scope.storehouseSales=function(e){
      //  var d1=document.getElementsByClassName("storehouseThemeC2");
      //  var num1=d1.length;
      //  for(var i=0;i<num1;i++){
      //    d1[i].className="storehouseThemeC2";
      //  }
      //  e.target.className="storehouseThemeC2 storehouseThemeCActive";
      //  if($scope.listNo!=5 && $scope.listNo!=6){
      //    $scope.listNo=5;
      //  }
      //  if($scope.listNo==6){
      //    $scope.listNo=5;
      //  }else{
      //    $scope.listNo=6;
      //  }
      //  storehouseList.get($scope.categoryId,$scope.listNo,$scope.pageNo);
      //}
      ////按价格排序
      //$scope.storehousePrice=function(e){
      //  var d1=document.getElementsByClassName("storehouseThemeC2");
      //  var num1=d1.length;
      //  for(var i=0;i<num1;i++){
      //    d1[i].className="storehouseThemeC2";
      //  }
      //  e.target.className="storehouseThemeC2 storehouseThemeCActive";
      //  if($scope.listNo!=11 && $scope.listNo!=12){
      //    $scope.listNo=12;
      //  }
      //  if($scope.listNo==11){
      //    $scope.listNo=12;
      //  }else{
      //    $scope.listNo=11;
      //  }
      //  storehouseList.get($scope.categoryId,$scope.listNo,$scope.pageNo);
      //}

      //clear排序
      $scope.storehouseclear=function(){
        $(".presellAllCategory1").css("display","none");
        $(".presellAllCategory2").css("display","none");
      }

      //按销售排序
      $scope.storehouseSales=function(e){
        $(".presellAllCategory1").toggle();
        $(".presellAllCategory2").css("display","none");
        var d1=document.getElementsByClassName("presellThemeC1");
        var num1=d1.length;
        for(var i=0;i<num1;i++){
          d1[i].className="presellThemeC1";
        }
        if(e.target.parentElement.className=="presellThemeC3"){
          d2=e.target.parentElement.parentElement;
        }else{
          d2=e.target.parentElement;
        }
        console.log(d2);
        d2.className="presellThemeC1 presellThemeCActive";
      }

      //按价格排序
      $scope.storehousePrice=function(e){
        $(".presellAllCategory2").toggle();
        $(".presellAllCategory1").css("display","none");
        var d1=document.getElementsByClassName("presellThemeC1");
        var num1=d1.length;
        for(var i=0;i<num1;i++){
          d1[i].className="presellThemeC1";
        }
        if(e.target.parentElement.className=="presellThemeC3"){
          d2=e.target.parentElement.parentElement;
        }else{
          d2=e.target.parentElement;
        }
        console.log(d2);
        d2.className="presellThemeC1 presellThemeCActive";
      }

      //选中列表项1
      $scope.presellListC1=function(x){
        $("#presellThemeFirst").children()[0].innerHTML=x[0];
        $(".presellAllCategory1").toggle();
        if($scope.listNo!=5 && $scope.listNo!=6){
          $scope.listNo=5;
        }
        if($scope.listNo==6){
          $scope.listNo=5;
        }else{
          $scope.listNo=6;
        }
        productList.getProductList($scope.categoryId,$scope.listNo,$scope.pageNo, function(data){
          $scope.storehouseListArr=data;
          for (index in $scope.storehouseListArr) {
            $scope.storehouseListArr[index].image = imgBaseUrl + $scope.storehouseListArr[index].image
          }
          console.log($scope.storehouseListArr);

          //var time1=setInterval(function(){
          //  var d1=document.getElementsByClassName("storehouseRightListC1");
          //  if(d1){
          //    Storage.imgWH2("storehouseRightListC1",0);
          //    clearInterval(time1);
          //  }
          //},1000/60);

        }, function(){
        })
      }

      //选中列表项2
      $scope.presellListC2=function(x){
        $("#presellThemeSecond").children()[0].innerHTML=x[0];
        $(".presellAllCategory2").toggle();
        if($scope.listNo!=11 && $scope.listNo!=12){
          $scope.listNo=12;
        }
        if($scope.listNo==11){
          $scope.listNo=12;
        }else{
          $scope.listNo=11;
        }
        productList.getProductList($scope.categoryId,$scope.listNo,$scope.pageNo, function(data){
          $scope.storehouseListArr=data;
          for (index in $scope.storehouseListArr) {
            $scope.storehouseListArr[index].image = imgBaseUrl + $scope.storehouseListArr[index].image
          }
          console.log($scope.storehouseListArr);

          //var time1=setInterval(function(){
          //  var d1=document.getElementsByClassName("storehouseRightListC1");
          //  if(d1){
          //    Storage.imgWH2("storehouseRightListC1",0);
          //    clearInterval(time1);
          //  }
          //},1000/60);

        }, function(){
        })
      }



      //特效1 index
      $rootScope.texiao1num=0;

      $scope.storehouseAddCart=function(e,index){
        CartStorage.addCartWithGood($scope.storehouseListArr[index])

        var d2=document.createElement("i");
          d2.className="icon ion-ios-plus-outline iconAnimation1";
          d2.style.left=(e.clientX- e.offsetX)+"px";
          d2.style.top=(e.clientY-e.offsetY)+"px";
          d2.id="texiao1_"+$rootScope.texiao1num;
          var numleft=e.clientX- e.offsetX;
          var numtop=e.clientY-e.offsetY;
          var d3=d2.id;
          document.body.appendChild(d2);
          $rootScope.texiao1num++;
        setTimeout(function(){
          d2.style.left=(numleft-8)+"px";
          d2.style.top=(numtop-10)+"px";
          d2.className="icon ion-ios-plus-outline iconAnimation2";
          setTimeout(function(){
            $("#"+d3).remove();
          },200);
        },100);
        Storage.resetRedNumberBottom(1);
      }

      $scope.keyword = {info:''}

      $scope.search = function() {
        $rootScope.hideTabs = 'tabs-item-hide'
        $state.go('tab.searchDetail', {})
        //$state.go('tab.searchDetail', {keyword:$scope.keyword.info})
      }

    })


    //搜索详情
  .controller('searchDetail', function($scope,$rootScope,$state,ENV,$ionicSlideBoxDelegate,$ionicHistory,CartStorage,Storage,searchEvent,Alert,informationWindow, $stateParams,Global,productList) {
    $scope.back = function() {
      $ionicHistory.goBack()
    }

    $scope.$on('$ionicView.beforeEnter', function() {
      Global.removeHistory('tab.searchDetail');
    })

    $scope.$on('$ionicView.enter', function() {
      $("#searchDetailBarId").fadeTo("fast",1);
      $("#searchDetailContentId").fadeTo("fast",1);
    })

    $scope.user=Storage.get('user');
    $scope.userImg=imgBaseUrl+$scope.user.pic_url;

    $scope.clearH=function(){
      var arr2=Storage.get("lvsearch");
        arr2=[];
      $scope.searchhy=arr2;
      if(arr2==[]){
        $scope.searchFlag=false;
      }else{
        $scope.searchFlag=true;
      }
      Storage.set("lvsearch",arr2);
      $scope.searchFlagHY=0;
    }

    $scope.Focus1=function(){
      keyBoradFlag=1;
    }

    $scope.Blur1=function(){
      keyBoradFlag=0;
    }

    $scope.searchResult = false
    //console.log($stateParams)
    //$scope.keyword = $stateParams['keyword']
    $scope.keyword="";

    $scope.changeKeyword = function(keyword) {
      $scope.keyword = keyword;
      if(keyword!=""){
        var d1=document.getElementById("storehouseDiv3");
        d1.className="storehouseDivIcon3";
      }else if(keyword==""){
        var d1=document.getElementById("storehouseDiv3");
        d1.className="storehouseDivIcon2";
      }
    }

    $scope.storehouseClearInput=function(){
      var d1=document.getElementById("storehouseInput4");
        d1.value="";
      var d2=document.getElementById("storehouseDiv3");
        d2.className="storehouseDivIcon2";
      $scope.keyword="";
      $scope.searchResult = false;
    }

    var ss5=setInterval(function(){
      var d1=document.getElementById("storehouseInput4");
      if(d1){
        if(d1.value!=""){
          var d2=document.getElementById("storehouseDiv3");
            d2.className="storehouseDivIcon3";
        }
        clearInterval(ss5);
      }
    },100);

    //searchWithKeyword($scope.keyword)

    $scope.search = function() {
      $scope.keyword=document.getElementById("storehouseInput4").value;
      searchWithKeyword($scope.keyword);
    }

    $scope.search2 = function(k) {
      searchWithKeyword(k)
      var d1=document.getElementById("storehouseInput4");
      d1.value=k;
      var d1=document.getElementById("storehouseDiv3");
      d1.className="storehouseDivIcon3";
    }

    $scope.searchFlagHY=0;
    $scope.searchhy=Storage.get("lvsearch");
    if($scope.searchhy){
      if($scope.searchhy.length>0){
        $scope.searchFlagHY=1;
      }
    }

    function searchWithKeyword(keyword) {
      $scope.AddFlag=true;
      if(keyword!=''){
        var dd1=new Object();
          dd1.searchH=keyword;
        if(Storage.get("lvsearch")==null){
          var arr1=[];
            arr1.unshift(dd1);
          $scope.searchhy=arr1;
          Storage.set("lvsearch",arr1);
        }else{
          var arr2=Storage.get("lvsearch");
          console.log(arr2.length);
          for(index in arr2){
            if(arr2[index].searchH==dd1.searchH){
              $scope.AddFlag=false;
              break;
            }
          }
          if(arr2.length<10 && $scope.AddFlag==true){
            arr2.unshift(dd1);
            $scope.searchhy=arr2;
            Storage.set("lvsearch",arr2);
          }else if(arr2.length>=10 && $scope.AddFlag==true){
            arr2.unshift(dd1);
            arr2.pop();
            $scope.searchhy=arr2;
            Storage.set("lvsearch",arr2);
          }
        }

        if($scope.searchhy){
          if($scope.searchhy.length>0){
            $scope.searchFlagHY=1;
          }
        }

        searchEvent.search(keyword, function(data){
          console.log(data);
          if(data.length > 0) {
            //搜索成功后跳转


            $scope.list=[];

            for(index in data){
              if(data[index].status==0 || data[index].status==1){
                $scope.list.push(data[index]);
              }
            }

            for(index in $scope.list){
              $scope.list[index].image = imgBaseUrl +$scope.list[index].image;
            }

            if($scope.list==false){
              $scope.searchResult = false;
            }else{
              $scope.searchResult = true;
            }

            console.log($scope.list);

            $scope.goodsIds="";
            for(index in $scope.list){
              $scope.goodsIds=$scope.goodsIds+$scope.list[index].id+",";
            }
            $scope.goodsIds.substring(0,$scope.goodsIds.length-1);

            productList.getProductGetMinPrice($scope.goodsIds,function(data5){
              $scope.list=Storage.changeMinPrice($scope.list,data5);
            });

            //var time1=setInterval(function(){
            //  var d1=document.getElementsByClassName("presellListC4");
            //  if(d1){
            //    Storage.imgWH("presellListC4",10);
            //    clearInterval(time1);
            //  }
            //},1000/60);

          } else {
            $scope.searchResult = false
            $scope.list = []
          }
        }, function() {
          $scope.searchResult = false
          $scope.list = []
        })
      }else{
        $scope.list = [];
        $scope.searchResult = false;
      }
    }


    $scope.goDetail = function(data,item) {
      $state.go(data, {good_id:item.id})
    }

    $scope.addCart = function(e, index) {
      Storage.clickEffect3(e.target,"presellAddCart");
      CartStorage.addCartWithGood($scope.list[index]);

      //var d2=document.createElement("i");
      //d2.className="icon ion-ios-plus-outline iconAnimation1";
      //d2.style.left=(e.clientX- e.offsetX)+"px";
      //d2.style.top=(e.clientY-e.offsetY)+"px";
      //d2.id="texiao1_"+$rootScope.texiao1num;
      //var numleft=e.clientX- e.offsetX;
      //var numtop=e.clientY-e.offsetY;
      //var d3=d2.id;
      //document.body.appendChild(d2);
      //$rootScope.texiao1num++;
      //setTimeout(function(){
      //  d2.style.left=(numleft-8)+"px";
      //  d2.style.top=(numtop-10)+"px";
      //  d2.className="icon ion-ios-plus-outline iconAnimation2";
      //  setTimeout(function(){
      //    $("#"+d3).remove();
      //  },200);
      //},100);
      informationWindow.showThree("该商品已加入购物车");
    }

  })


  //农场
    .controller('farmCtrl', function($scope,$rootScope,$state,ENV,$ionicSlideBoxDelegate,$ionicHistory,farmList,Storage,Global) {
      var lc=Storage.get("lvnonglocation");
      $scope.$on('$ionicView.beforeEnter', function() {

        $rootScope.hideTabs = false;
        if(ionic.Platform.isIOS()){
          $scope.farmFlag=true;
        }else{
          $scope.farmFlag=false;
        }

        //变量初始化
        $scope.pageNo=0;
        $scope.categoryId=-1;
        $scope.loadMoreDataEnable=true;
        $scope.farmListArr=[];
        $scope.initFlag=0;
      })

      $scope.jsGo=function(view,data){
        $rootScope.hideTabs = 'tabs-item-hide'
        $state.go(view, {farm_id:data.farmId});
      }


      $scope.loadMoreData = function() {
        if($scope.loadMoreDataEnable==true){
          getData();
          $("#infiniteScrollFarmId").css({display:"flex"});
        }else if($scope.loadMoreDataEnable==false){
          $("#infiniteScrollFarmId").css({display:"none"});
        }
      };

      function getData() {

        $scope.pageNo++;
        console.log($scope.pageNo);

        if(lc){
          farmList.farmQueryCategory(function(data){
            var aa=new Object();
              aa.id="";
              aa.name="全部农场";
            data.unshift(aa);
            console.log(data);
            $scope.classOne=data;
            if($scope.initFlag==0){
              $scope.initFlag=1;
              $scope.categoryId=data[0].id;
            }

            farmList.getFarmList($scope.pageNo,lc.lat,lc.long,$scope.categoryId, function(data){
              for(index in data.results){
                data.results[index].image = imgBaseUrl +data.results[index].image;
                if(data.results[index].distance){
                  data.results[index].distance=(data.results[index].distance/1000).toFixed(3);
                }
              }
              console.log(data);
              for(index in data.results){
                $scope.farmListArr.push(data.results[index]);
              }
              console.log($scope.farmListArr);
              $scope.$broadcast('scroll.infiniteScrollComplete');
              if($scope.pageNo>= data.num_pages){
                $scope.loadMoreDataEnable = false;
              }
            }, function(){
              $scope.$broadcast('scroll.infiniteScrollComplete');
              $scope.loadMoreDataEnable = false;
            })

          }, function(){
          })
        }else{
          farmList.farmQueryCategory(function(data){
            var aa=new Object();
              aa.id="";
              aa.name="全部农场";
              data.unshift(aa);
            console.log(data);
            $scope.classOne=data;
            if($scope.initFlag==0) {
              $scope.initFlag=1;
              $scope.categoryId = data[0].id;
            }

            farmList.getFarmList2($scope.pageNo,$scope.categoryId, function(data){
              for(index in data.results){
                data.results[index].image = imgBaseUrl +data.results[index].image;
              }
              console.log(data);
              for(index in data.results){
                $scope.farmListArr.push(data.results[index]);
              }
              console.log($scope.farmListArr);

              $scope.$broadcast('scroll.infiniteScrollComplete');
              if($scope.pageNo>= data.num_pages){
                $scope.loadMoreDataEnable = false;
              }
              console.log($scope.pageNo,$scope.loadMoreDataEnable);
            }, function(){
              $scope.$broadcast('scroll.infiniteScrollComplete');
              $scope.loadMoreDataEnable = false;
            })

          }, function(){
          })
        }




        //productList.getProductList($scope.threeId,$scope.listNo,$scope.pageNo, function(data){
        //  for (index in data.results) {
        //    data.results[index].image = imgBaseUrl + data.results[index].image;
        //  }
        //  console.log(data);
        //  for(index in data.results){
        //    $scope.storehouseListArr.push(data.results[index]);
        //  }
        //  //$scope.storehouseListArr=data.results;
        //
        //  console.log($scope.storehouseListArr);
        //
        //  $scope.$broadcast('scroll.infiniteScrollComplete');
        //  if($scope.pageNo>= data.num_pages){
        //    $scope.loadMoreDataEnable = false;
        //  }
        //}, function(){
        //  $scope.$broadcast('scroll.infiniteScrollComplete');
        //  $scope.loadMoreDataEnable = false;
        //})

        console.log($scope.loadMoreDataEnable);
      }

      $scope.farmClassSelection=function(){
        $("#farmScrollId").toggle();
      }

      $scope.farmSelectionClassOne=function(x){
        $scope.loadMoreDataEnable=true;
        $("#farmTopC1Id").html(x.name);
        $scope.categoryId= x.id;
        $scope.pageNo=0;
        $scope.farmListArr=[];
        console.log($scope.categoryId);
        //if(lc){
        //  farmList.getFarmList(1,lc.lat,lc.long,$scope.categoryId, function(data){
        //    $scope.farmListArr=data.results;
        //    console.log($scope.farmListArr);
        //    for(index in $scope.farmListArr){
        //      $scope.farmListArr[index].image = imgBaseUrl +$scope.farmListArr[index].image;
        //      if($scope.farmListArr[index].distance){
        //        $scope.farmListArr[index].distance=($scope.farmListArr[index].distance/1000).toFixed(3);
        //      }
        //    }
        //  }, function(){
        //  })
        //}else{
        //  farmList.getFarmList2(1,$scope.categoryId, function(data){
        //    $scope.farmListArr=data.results;
        //    console.log($scope.farmListArr);
        //    for(index in $scope.farmListArr){
        //      $scope.farmListArr[index].image = imgBaseUrl +$scope.farmListArr[index].image;
        //    }
        //  }, function(){
        //  })
        //}
        getData();
        $("#farmScrollId").toggle();
      }

      $scope.clearFarmScroll=function(){
        $("#farmScrollId").css({display:none});
      }

      //$scope.$on('$ionicView.beforeEnter', function() {

      //if(lc){
      //  farmList.farmQueryCategory(function(data){
      //    console.log(data);
      //    $scope.classOne=data;
      //    $scope.categoryId=data[0].id;
      //
      //    farmList.getFarmList($scope.pageNo,lc.lat,lc.long,$scope.categoryId, function(data){
      //      $scope.farmListArr=data.results;
      //      console.log($scope.farmListArr);
      //      for(index in $scope.farmListArr){
      //        $scope.farmListArr[index].image = imgBaseUrl +$scope.farmListArr[index].image;
      //        if($scope.farmListArr[index].distance){
      //          $scope.farmListArr[index].distance=($scope.farmListArr[index].distance/1000).toFixed(3);
      //        }
      //      }
      //    }, function(){
      //    })
      //
      //  }, function(){
      //  })
      //}else{
      //  farmList.farmQueryCategory(function(data){
      //    console.log(data);
      //    $scope.classOne=data;
      //    $scope.categoryId=data[0].id;
      //
      //    farmList.getFarmList2($scope.pageNo,$scope.categoryId, function(data){
      //      $scope.farmListArr=data.results;
      //      console.log($scope.farmListArr);
      //      for(index in $scope.farmListArr){
      //        $scope.farmListArr[index].image = imgBaseUrl +$scope.farmListArr[index].image;
      //      }
      //    }, function(){
      //    })
      //
      //  }, function(){
      //  })
      //}

      //})

      ////获取农场列表
      //$scope.$on('farmList.getfarmList',function(){
      //  $scope.farmListArr=farmList.getdata().data;
      //  console.log($scope.farmListArr);
      //})
      //farmList.get($scope.pageNo);
    })

    //购物车
    .controller('cartCtrl', function($scope,$rootScope,ENV,$ionicSlideBoxDelegate,$ionicPopup,$state,Storage,Cart,Alert,informationWindow,$ionicLoading,$ionicHistory,favouriteBatchAdd,Global) {
      $scope.back = function() {
        $ionicHistory.goBack()
      }

      $scope.$on('$ionicView.beforeEnter', function() {
        $scope.edFlag=0;
        $rootScope.hideTabs = false;
        Storage.remove('SelectedCoupon');
        Storage.remove('orderUseCoupon');
        $scope.edFlag=JSON.parse(localStorage.cart).length;
      })

      $scope.$on('$ionicView.enter', function() {
        Storage.resetRedNumberBottom(0);
        //Global.removeHistory('tab.cart');
        console.log($ionicHistory.viewHistory());
        //if($ionicHistory.viewHistory().backView!=null){
        //  if ($ionicHistory.viewHistory().backView.stateName == 'tab.homeGoodsDetail') {
        //    for(index in $ionicHistory.viewHistory().histories){
        //      delete $ionicHistory.viewHistory().histories[index];
        //    }
        //  }
        //}
        //console.log($ionicHistory.viewHistory());
      })

      //跳转商品详情页面
      $scope.jsGoGoods=function(view, data){
        $rootScope.hideTabs = 'tabs-item-hide'
        $state.go(view, {good_id:data.productId});
      }

      var user = Storage.get('user')
      if(!user || !user.userId) {
        $state.go('login');
      }
      var cart = Storage.get('cart');

      ////请求数据初始化
      $scope.pageNo=1;
      $scope.selectedAll = true;
      $scope.commonLimitCount=[];
      $scope.commonLimitCountArea1=[];
      $scope.commonLimitCountArea2=[];
      $scope.presellLimitCount=[];
      $scope.presellLimitCountArea1=[];
      $scope.presellLimitCountArea2=[];

      $ionicLoading.show();
      //清空购物车
      if(user){
        Cart.clearCart(user.userId, function(){
          $scope.commonCartInitNum = [];
          $scope.commonCartInitNumArea1 = [];
          $scope.commonCartInitNumArea2 = [];
          $scope.preSellCartInitNum = [];
          $scope.preSellCartInitNumArea1 = [];
          $scope.preSellCartInitNumArea2 = [];
          $scope.commomSelected = [];
          $scope.commomSelectedArea1 = [];
          $scope.commomSelectedArea2 = [];
          $scope.preSellSelected = [];
          $scope.preSellSelectedArea1 = [];
          $scope.preSellSelectedArea2 = [];
          $scope.commonAllPrice = 0;
          $scope.commonAllPriceArea1 = 0;
          $scope.commonAllPriceArea2 = 0;
          $scope.preSellAllPrice = 0;
          $scope.preSellAllPriceArea1 = 0;
          $scope.preSellAllPriceArea2 = 0;
          if(cart && cart.length > 0) {
            Cart.addToCart(user.userId, JSON.stringify(cart), function(){
              getCart(function(){
                $ionicLoading.hide()
              })

              umregister("enterCart");
            }, function(){
              $ionicLoading.hide()
            })
          } else {
            $ionicLoading.hide()
          }
        }, function(){
          $ionicLoading.hide()
        })
      }

      //选择/取消勾选
      $scope.selected = function(index, selected, ifPreSell,num) {
        var list = ifPreSell ? (num==1 ? $scope.preSellSelectedArea1 : $scope.preSellSelectedArea2) : (num==1 ? $scope.commomSelectedArea1 : $scope.commomSelectedArea2);
        list[index] = selected;
        $scope.selectedAll = ifSelectedAll();
        refreshPrice();
      }



      //商品数量减少
      $scope.minus=function(e, ifPreSell, index,num){
        if(ifPreSell && num==1){
          buyNum = $scope.preSellCartInitNumArea1[index]>0 ? $scope.preSellCartInitNumArea1[index] = parseInt($scope.preSellCartInitNumArea1[index]) - 1 : $scope.preSellCartInitNumArea1[index]=0;
        }else if(ifPreSell && num==2){
          buyNum = $scope.preSellCartInitNumArea2[index]>0 ? $scope.preSellCartInitNumArea2[index] = parseInt($scope.preSellCartInitNumArea2[index]) - 1 : $scope.preSellCartInitNumArea2[index]=0;
        }else if(!ifPreSell && num==1){
          buyNum = $scope.commonCartInitNumArea1[index]>0 ? $scope.commonCartInitNumArea1[index] = parseInt($scope.commonCartInitNumArea1[index]) - 1 : $scope.commonCartInitNumArea1[index]=0;
        }else if(!ifPreSell && num==2){
          buyNum = $scope.commonCartInitNumArea2[index]>0 ? $scope.commonCartInitNumArea2[index] = parseInt($scope.commonCartInitNumArea2[index]) - 1 : $scope.commonCartInitNumArea2[index]=0;
        }
        var limitAmount = ifPreSell ? (num==1 ? $scope.presellLimitCountArea1[index] : $scope.presellLimitCountArea2[index]) : (num==1 ? $scope.commonLimitCountArea1[index] : $scope.commonLimitCountArea2[index]);
        changeScopeData(ifPreSell, index,buyNum,num);
        console.log(limitAmount,buyNum);
        $scope.checkLimitCount(limitAmount,buyNum, e.target.parentElement.parentElement.children[4]);
        //修改本地数据
        Storage.addOrEditToCart(ifPreSell ? (num==1 ? $scope.preSellArea1[index].productId : $scope.preSellArea2[index].productId) : (num==1 ? $scope.customArea1[index].productId : $scope.customArea2[index].productId), buyNum);
        //改变小红点的值
        Storage.resetRedNumberBottom(1);
        //更新价钱
        refreshPrice();
      }

      //商品数量增加
      $scope.plus=function(e, ifPreSell, index,num){
        var num20=parseInt(e.target.parentElement.parentElement.children[2].children[4].innerText.split(":")[1]);
        var num21=e.target.parentElement.children[1].value;
        if(num20>num21){
          if(ifPreSell && num==1){
            buyNum = $scope.preSellCartInitNumArea1[index] = parseInt($scope.preSellCartInitNumArea1[index])+1;
          }else if(ifPreSell && num==2){
            buyNum = $scope.preSellCartInitNumArea2[index] = parseInt($scope.preSellCartInitNumArea2[index])+1;
          }else if(!ifPreSell && num==1){
            buyNum = $scope.commonCartInitNumArea1[index] = parseInt($scope.commonCartInitNumArea1[index])+1;
          }else if(!ifPreSell && num==2){
            buyNum = $scope.commonCartInitNumArea2[index] = parseInt($scope.commonCartInitNumArea2[index])+1;
          }
          console.log($scope.preSellCartInitNum,$scope.commonCartInitNum);
          var limitAmount = ifPreSell ? (num==1 ? $scope.presellLimitCountArea1[index] : $scope.presellLimitCountArea2[index]) : (num==1 ? $scope.commonLimitCountArea1[index] : $scope.commonLimitCountArea2[index]);
          changeScopeData(ifPreSell, index,buyNum,num);
          $scope.checkLimitCount(limitAmount,buyNum, e.target.parentElement.parentElement.children[4]);
          //修改本地数据
          Storage.addOrEditToCart(ifPreSell ? (num==1 ? $scope.preSellArea1[index].productId : $scope.preSellArea2[index].productId) : (num==1 ? $scope.customArea1[index].productId : $scope.customArea2[index].productId), buyNum);
          //改变小红点的值
          Storage.resetRedNumberBottom(1);
          //更新价钱
          refreshPrice();
        }
      }

      //input框数量变化改变价钱总计
      $scope.cartInputChange=function(id,ifPreSell,index,num){
        //var num20=parseInt(e.target.parentElement.parentElement.children[2].children[4].innerText.split(":")[1]);
        //var num21=e.target.parentElement.children[1].value;
        //console.log(num20,num21);

        var d1=document.getElementById(id);
        var num20=d1.parentElement.parentElement.children[2].children[4].innerText.split(":")[1];
        var num21=parseInt(d1.value);
        //parseInt(d1.value)<1 || d1.value==""
        console.log(num20,num21);
        if(num20<num21){
          d1.value=num20;
        }
        if(d1.value==""){
          var buynum3=ifPreSell ? (num==1 ? $scope.preSellCartInitNumArea1[index]="" : $scope.preSellCartInitNumArea2[index]="") : (num==1 ? $scope.commonCartInitNumArea1[index]="" : $scope.commonCartInitNumArea2[index]="");
        }else{
          var buynum3=ifPreSell ? (num==1 ? $scope.preSellCartInitNumArea1[index]=parseInt(d1.value) : $scope.preSellCartInitNumArea2[index]=parseInt(d1.value)) : (num==1 ? $scope.commonCartInitNumArea1[index]=parseInt(d1.value) : $scope.commonCartInitNumArea2[index]=parseInt(d1.value));
        }
        var limitnum2=parseInt(d1.parentElement.parentElement.children[2].children[3].innerText.split(":")[1]);

        $scope.checkLimitCount(limitnum2,buynum3, d1.parentElement.parentElement.children[4]);
        changeScopeData(ifPreSell, index,buynum3,num);
        ////修改本地数据
        Storage.addOrEditToCart(ifPreSell ? (num==1 ? $scope.preSellArea1[index].productId : $scope.preSellArea2[index].productId) : (num==1 ? $scope.customArea1[index].productId : $scope.customArea2[index].productId), buynum3);
        //改变小红点的值
        Storage.resetRedNumberBottom(1);
        refreshPrice();
      }

      $scope.cartInputFocus=function(){
        //console.log($rootScope.hideTabs);
        keyBoradFlag=1;
        //$rootScope.hideTabs = 'tabs-item-hide';
        //var d1=document.getElementsByClassName("cartContent")[0];
        //d1.className="has-header cartContent2";
      }

      $scope.cartInputBlur=function(id,ifPreSell,index,num){
        //console.log($rootScope.hideTabs);
        keyBoradFlag=0;
        //$rootScope.hideTabs = false;
        //var d1=document.getElementsByClassName("cartContent2")[0];
        //d1.className="has-header cartContent";

        //console.log(111);
        var d1=document.getElementById(id);
        if(d1.value==""){
          console.log(122);
          var buynum3=ifPreSell ? (num==1 ? $scope.preSellCartInitNumArea1[index]=0 : $scope.preSellCartInitNumArea2[index]=0) : (num==1 ? $scope.commonCartInitNumArea1[index]=0 : $scope.commonCartInitNumArea2[index]=0);
          Storage.addOrEditToCart(ifPreSell ? $scope.preSellList[index].productId :$scope.commonList[index].productId, buynum3);
        }
      }

      //编辑
      $scope.editor=function(e){
        Storage.clickEffect("editorCommon");
        if(e.target.innerHTML=="编辑"){
          e.target.innerHTML="完成";
        }else if(e.target.innerHTML=="完成"){
          e.target.innerHTML="编辑";
        }
        $(".cartCollect").toggle();
        $scope.selectedAll = ifSelectedAll()
      }

      //全选
      $scope.cartAllList=function(e){
        $scope.selectedAll = !$scope.selectedAll
        selectedChange($scope.selectedAll)
      }

      //移到收藏夹
      $scope.cartCollect=function(){
        var arr1=document.getElementsByClassName("cartCurrentListC8");
        var num1=arr1.length;
        var arr2=[];
        for(var i=0;i<num1;i++){
          if(arr1[i].children[0].style.display!="none"){
            var d1=new Object();
              d1.userId=user.userId;
              d1.productId=arr1[i].id.split("_")[1];
            arr2.push(d1);
          }
        }
        d2=JSON.stringify(arr2);
        favouriteBatchAdd.addFavouriteBatchAdd(d2, function(data){
          console.log(data);
          informationWindow.showOk('收藏成功');
        }, function(){
        })
      }

      //删除商品
      $scope.cartRemove=function(){
        var cartChecked=Storage.get("cart");
        console.log(cartChecked);
        if(cartChecked!="" && cartChecked!=null){
          var deleteIds = ''
          var deleteProductIds = []
          for (index in $scope.customArea1) {
            if($scope.commomSelectedArea1[index]) {
              deleteIds = deleteIds +  ',' + $scope.customArea1[index].id
              deleteProductIds.push($scope.customArea1[index].productId)
            }
          }
          for (index in $scope.customArea2) {
            if($scope.commomSelectedArea2[index]) {
              deleteIds = deleteIds +  ',' + $scope.customArea2[index].id
              deleteProductIds.push($scope.customArea2[index].productId)
            }
          }
          for (index in $scope.preSellArea1) {
            if($scope.preSellSelectedArea1[index]) {
              deleteIds = deleteIds + ',' + $scope.preSellArea1[index].id
              deleteProductIds.push($scope.preSellArea1[index].productId)
            }
          }
          for (index in $scope.preSellArea2) {
            if($scope.preSellSelectedArea2[index]) {
              deleteIds = deleteIds + ',' + $scope.preSellArea2[index].id
              deleteProductIds.push($scope.preSellArea2[index].productId)
            }
          }
          $ionicLoading.show()
          Cart.deleteCart(user.userId, deleteIds, function(){
            for(index in deleteProductIds) {
              Storage.deleteInCart(parseInt(deleteProductIds[index]))
            }
            getCart(function(succeed){
              $ionicLoading.hide()
            })
            informationWindow.showOk('删除成功')
            $scope.edFlag=JSON.parse(localStorage.cart).length;

            //$scope.commonCartInitNumArea1=[];
            //$scope.commonCartInitNumArea2=[];
            //$scope.preSellCartInitNumArea1 = [];
            //$scope.preSellCartInitNumArea2 = [];
            //$scope.commonLimitCountArea1=[];
            //$scope.commonLimitCountArea2=[];
            //$scope.presellLimitCountArea1=[];
            //$scope.presellLimitCountArea2=[];
          }, function(){
            informationWindow.showError('删除失败')
            $ionicLoading.hide()
          })
        }
      }

      //检查是否大于起批量
      $scope.checkLimitCount=function(limit,buy,c){
        if(limit>buy){
          c.style.visibility="visible";
        }else{
          c.style.visibility="hidden";
        }
      }


      //订单确认
      $scope.goBuy=function(ifPreSell,num){
        if(ifSelectedOne(ifPreSell,num)) {
          //选出勾选商品
          var modifyData = []
          for (index in $scope.preSellArea1) {
            modifyData.push({id:$scope.preSellArea1[index].id, quantity:$scope.preSellArea1[index].quantity})
          }
          for (index in $scope.preSellArea2) {
            modifyData.push({id:$scope.preSellArea2[index].id, quantity:$scope.preSellArea2[index].quantity})
          }
          for (index in $scope.customArea1) {
            modifyData.push({id:$scope.customArea1[index].id, quantity:$scope.customArea1[index].quantity})
          }
          for (index in $scope.customArea2) {
            modifyData.push({id:$scope.customArea2[index].id, quantity:$scope.customArea2[index].quantity})
          }
          //批量更新购物车
          Cart.updateCart(JSON.stringify(modifyData), function(){
            var addData = []
            if (ifPreSell && num==1) {
              //预售1
              for (index in $scope.preSellArea1) {
                if($scope.preSellSelectedArea1[index]) {
                  addData.push({product:$scope.preSellArea1[index], price:$scope.preSellPriceListArea1[index]})
                }
              }
              Storage.set('buyList', addData)
              $rootScope.hideTabs = 'tabs-item-hide'
              $state.go('tab.myOrder', {type:2,num:num});
            } else if (ifPreSell && num==2){
              //预售2
              for (index in $scope.preSellArea2) {
                if($scope.preSellSelectedArea2[index]) {
                  addData.push({product:$scope.preSellArea2[index], price:$scope.preSellPriceListArea2[index]})
                }
              }
              Storage.set('buyList', addData)
              $rootScope.hideTabs = 'tabs-item-hide'
              $state.go('tab.myOrder', {type:2,num:num});
            }else if (!ifPreSell && num==1){
              //普通1
              for (index in $scope.customArea1) {
                if($scope.commomSelectedArea1[index]) {
                  addData.push({product:$scope.customArea1[index], price:$scope.commomPriceListArea1[index]})
                }
              }
              Storage.set('buyList', addData)
              $rootScope.hideTabs = 'tabs-item-hide'
              $state.go('tab.myOrder', {type:1,num:num});
            }else if (!ifPreSell && num==2){
              //普通2
              for (index in $scope.commonList) {
                if($scope.commomSelectedArea2[index]) {
                  addData.push({product:$scope.commonList[index], price:$scope.commomPriceListArea2[index]})
                }
              }
              Storage.set('buyList', addData)
              $rootScope.hideTabs = 'tabs-item-hide'
              $state.go('tab.myOrder', {type:1,num:num});
            }
          }, function(){

          })
        } else {
          informationWindow.showError('请勾选商品或填写正确的购买量');
        }
      }

      //获得起批数量
      $scope.getLimitCount = function(arr) {
        var prices = null;
        if (arr.productPrices.length > 0) {
          var prices = arr.productPrices;
        }
        if (prices && prices.length > 0) {
          return prices[prices.length - 1].limitCount;
        } else {
          return 0;
        }
      }

      //获得购物车
      function getCart(complete) {
        Cart.getCart(user.userId, function(data){
          var deleteIds = '';
          var deleteProductIds = [];
          for (index in data) {
            if(data[index].productStatus == 2) {
              deleteIds = deleteIds + data[index].id + ',';
              deleteProductIds.push(data[index].productId);
            }
          }

          Cart.deleteCart(user.userId, deleteIds, function(){
            for(index in deleteProductIds) {
              Storage.deleteInCart(parseInt(deleteProductIds[index]));
            }
            var d1=document.getElementById("informationWindowId");
            if(d1==null){
              var d1=document.createElement("div");
              d1.id="informationWindowId";
              document.body.appendChild(d1);
              setTimeout(function(){
                setTimeout(function(){
                  $("#informationWindowId").remove();
                },2000);
              },1000);
            }
            Storage.resetRedNumberBottom(1);
          }, function(){
            var d1=document.getElementById("informationWindowId");
            if(d1==null){
              var d1=document.createElement("div");
              d1.id="informationWindowId";
              document.body.appendChild(d1);
              setTimeout(function(){
                setTimeout(function(){
                  $("#informationWindowId").remove();
                },2000);
              },1000);
            }
            $ionicLoading.hide()
          })

          for(index in data){
            data[index].image=imgBaseUrl+data[index].image;
          }
          console.log(data);
          var custom = []
          $scope.customArea1 = []
          $scope.customArea2 = []
          var preSell = []
          $scope.preSellArea1 = []
          $scope.preSellArea2 = []

          $scope.commonCartInitNumArea1=[];
          $scope.commonCartInitNumArea2=[];
          $scope.preSellCartInitNumArea1 = [];
          $scope.preSellCartInitNumArea2 = [];
          $scope.commonLimitCountArea1=[];
          $scope.commonLimitCountArea2=[];
          $scope.presellLimitCountArea1=[];
          $scope.presellLimitCountArea2=[];
          $scope.commomSelectedArea1=[];
          $scope.commomSelectedArea2=[];
          $scope.preSellSelectedArea1=[];
          $scope.preSellSelectedArea2=[];
          for (index in data) {
            if(data[index].productStatus == 1 && data[index].area_id == 1) {
              custom.push(data[index]);
              $scope.customArea1.push(data[index]);
              $scope.commonCartInitNum.push(data[index].quantity);
              $scope.commonCartInitNumArea1.push(data[index].quantity);
              $scope.commonLimitCountArea1.push($scope.getLimitCount(data[index]));
              $scope.commomSelected.push(true);
              $scope.commomSelectedArea1.push(true);
            }else if(data[index].productStatus == 1 && data[index].area_id == 2) {
              custom.push(data[index]);
              $scope.customArea2.push(data[index]);
              $scope.commonCartInitNum.push(data[index].quantity);
              $scope.commonCartInitNumArea2.push(data[index].quantity);
              $scope.commonLimitCountArea2.push($scope.getLimitCount(data[index]));
              $scope.commomSelected.push(true);
              $scope.commomSelectedArea2.push(true);
            }else if(data[index].productStatus == 0 && data[index].area_id == 1) {
              preSell.push(data[index]);
              $scope.preSellArea1.push(data[index]);
              $scope.preSellCartInitNum.push(data[index].quantity);
              $scope.preSellCartInitNumArea1.push(data[index].quantity);
              $scope.presellLimitCountArea1.push($scope.getLimitCount(data[index]));
              $scope.preSellSelected.push(true);
              $scope.preSellSelectedArea1.push(true);
            } else if(data[index].productStatus == 0 && data[index].area_id == 2) {
              preSell.push(data[index]);
              $scope.preSellArea2.push(data[index]);
              $scope.preSellCartInitNum.push(data[index].quantity);
              $scope.preSellCartInitNumArea2.push(data[index].quantity);
              $scope.presellLimitCountArea2.push($scope.getLimitCount(data[index]));
              $scope.preSellSelected.push(true);
              $scope.preSellSelectedArea2.push(true);
            }
          }
          $scope.commonList = [];
          $scope.preSellList = [];
          $scope.commonList = custom;
          $scope.preSellList = preSell;

          selectedChange($scope.selectedAll);

          $scope.SumLimitCountArr=[];
          $scope.SumLimitCountArr=$scope.SumLimitCountArr.concat($scope.commonLimitCountArea1,$scope.commonLimitCountArea2,$scope.presellLimitCountArea1,$scope.presellLimitCountArea2);
          console.log($scope.SumLimitCountArr,$scope.commonCartInitNumArea1,$scope.commonCartInitNumArea2);

          var si2=setInterval(function(){
            if(document.getElementsByClassName("cartCurrentListC9") && document.getElementsByClassName("cartInput")){
              $scope.SumLimitCountArr=[];
              $scope.SumLimitCountArr=$scope.SumLimitCountArr.concat($scope.commonLimitCountArea1,$scope.commonLimitCountArea2,$scope.presellLimitCountArea1,$scope.presellLimitCountArea2);
              console.log($scope.SumLimitCountArr,$scope.commonLimitCountArea1,$scope.commonLimitCountArea2,$scope.presellLimitCountArea1,$scope.presellLimitCountArea2);
              clearInterval(si2);
              var arr1=document.getElementsByClassName("cartCurrentListC9");
              var arr2=document.getElementsByClassName("cartInput");
              var num5=$scope.SumLimitCountArr.length;
              console.log(num5);
              for(var i=0;i<num5;i++){
                //console.log(arr2);
                if(parseInt(arr2[i].value)<$scope.SumLimitCountArr[i]){
                  console.log(22);
                  console.log(index);
                  arr1[i].style.visibility="visible";
                }
              }
            }
          },100);
          refreshPrice();

          //var time1=setInterval(function(){
          //  var d1=document.getElementsByClassName("cartCurrentListC2");
          //  if(d1){
          //    Storage.imgWH2("cartCurrentListC2",0);
          //    clearInterval(time1);
          //  }
          //},1000/60);

          Storage.resetRedNumberBottom(0);
          complete(true)
        }, function(){
          complete(false)
        })
      }

      //更改显示数据
      function changeScopeData(ifPreSell, index, number,num) {
        var amountList = ifPreSell ? (num==1 ? $scope.preSellCartInitNumArea1 : $scope.preSellCartInitNumArea2) : (num==1 ? $scope.commonCartInitNumArea1 : $scope.commonCartInitNumArea2)
        amountList[index] = number
        var list = ifPreSell ? (num==1 ? $scope.preSellArea1 : $scope.preSellArea2) : (num==1 ? $scope.customArea1 : $scope.customArea2)
        list[index].quantity = number
      }

      //刷新所有价格
      function refreshPrice() {
        console.log($scope.preSellSelectedArea1,$scope.preSellSelectedArea2,$scope.commomSelectedArea1,$scope.commomSelectedArea2);

        $scope.commomPriceListArea1 = [];
        $scope.commomPriceListArea2 = [];
        $scope.preSellPriceListArea1 = [];
        $scope.preSellPriceListArea2 = [];
        console.log($scope.preSellSelectedArea1,$scope.preSellSelectedArea2,$scope.commomSelectedArea1,$scope.commomSelectedArea2);
        for(var all = 0; all < 4; all ++) {
          var list = (all <= 1 ? (all == 0 ? $scope.customArea1 : $scope.customArea2) : (all == 2 ? $scope.preSellArea1 : $scope.preSellArea2));
          var resultList = (all <= 1 ? (all == 0 ? $scope.commomPriceListArea1 : $scope.commomPriceListArea2) : (all == 2 ? $scope.preSellPriceListArea1 : $scope.preSellPriceListArea2));
          var sumSelected = (all <= 1 ? (all == 0 ? $scope.commomSelectedArea1 : $scope.commomSelectedArea2) : (all == 2 ? $scope.preSellSelectedArea1 : $scope.preSellSelectedArea2));
          var allPrice = 0;
          for(index in list) {
            var price = -100;
            for (i in list[index].productPrices) {
              if(list[index].quantity >= list[index].productPrices[i].limitCount) {
                price = list[index].productPrices[i].activityPrice;
                break;
              }
            }
            if(list[index].productPrices && list[index].productPrices.length > 0 && price < 0) {
              price = list[index].productPrices[list[index].productPrices.length - 1].activityPrice;
            }
            price = price < 0 ? 0 : price;
            resultList.push(price);
            if(sumSelected[index]){
              allPrice = allPrice + price * list[index].quantity;
              console.log(allPrice,price,list[index].quantity);
            }
            if (all == 0) {
              $scope.commonAllPriceArea1 = allPrice;
            } else if(all == 1){
              $scope.commonAllPriceArea2 = allPrice;
            } else if(all == 2){
              $scope.preSellAllPriceArea1 = allPrice;
            } else if(all == 3){
              $scope.preSellAllPriceArea2 = allPrice;
            }
          }
        }
      }

      //全选/取消全选
      function selectedChange(status) {
        for(var i = 0; i < 4; i ++) {
          var list = (i <= 1 ? (i==0 ? $scope.preSellSelectedArea1 : $scope.preSellSelectedArea2) : (i==2 ? $scope.commomSelectedArea1 : $scope.commomSelectedArea2))
          for(index in list) {
            list[index] = status
          }
        }
      }

      //检查全选状态
      function ifSelectedAll() {
        for(var i = 0; i < 4; i ++) {
          var list = (i <= 1 ? (i==0 ? $scope.preSellSelectedArea1 : $scope.preSellSelectedArea2) : (i==2 ? $scope.commomSelectedArea1 : $scope.commomSelectedArea2))
          for(index in list) {
            if(!list[index]) {
              return false
            }
          }
        }
        return true
      }

      //检查是否有选择一个并且购买量大于起批量
      function ifSelectedOne(ifPreSell,num) {
        var arr1=document.getElementsByClassName("cartCurrentListC9");
        var arr2=document.getElementsByClassName("cartInput2");
        var arr3=document.getElementsByClassName("cartInput3");
        var arr4=document.getElementsByClassName("cartInput4");
        var arr5=document.getElementsByClassName("cartInput5");
        var list = (ifPreSell ? (num==1 ? $scope.preSellSelectedArea1 : $scope.preSellSelectedArea2) : (num==1 ? $scope.commomSelectedArea1 : $scope.commomSelectedArea2));
        var limitCount = (ifPreSell ? (num==1 ? $scope.presellLimitCountArea1 : $scope.presellLimitCountArea2) : (num==1 ? $scope.commonLimitCountArea1 : $scope.commonLimitCountArea2));
        var cartInput = (ifPreSell ? (num==1 ? arr4 : arr5) : (num==1 ? arr2 : arr3));
        var flag=false;
        for(index in list) {
          if(list[index]){
            if(parseInt(cartInput[index].value)<limitCount[index]) {
              return flag=false;
            }else{
              flag=true;
            }
          }
        }
        return flag;
      }

      $scope.cartAlert=function(ifPreSell,index,e){
        var cartAlertArr = (ifPreSell ? $scope.preSellList : $scope.commonList);
        if(!document.getElementById("cartAlert_"+index)){
          var d1=document.createElement("div");
          d1.style.cssText="position:absolute;background: #59A93B;z-index: 10;padding: 10px;color: white;border-radius: 5px;";
          d1.id="cartAlert_"+index;
          d1.style.top=(e.clientY+ 16-e.offsetY)+"px";
          d1.style.left= "40%";
          console.log(cartAlertArr[index]);
          var num1=cartAlertArr[index].productPrices;
          for(i in num1){
            console.log(i);
            var d2=document.createElement("div");
            d2.style.cssText="width:100%;font-size:12px;";
            d2.innerHTML="数量>="+num1[i].limitCount+"&nbsp;&nbsp;&nbsp;&nbsp;价钱:￥"+num1[i].activityPrice;
            d1.appendChild(d2);
          }
          document.body.appendChild(d1);
        }else{
          $("#cartAlert_"+index).remove();
        }
      }
    })

    //个人信息
    .controller('userCtrl', function($scope,Storage,$state,$rootScope,userUserInfo,orderFindUserOrderNumberByUserId) {

      $scope.$on('$ionicView.beforeEnter', function() {
        $rootScope.hideTabs = false;
        var user = Storage.get('user');

        if(!user || !user.userId) {
          $state.go('login')
        }
        if(user){
          $scope.user = user;
          $scope.mobileModify=new Object();
          $scope.mobileModify.mobile=$scope.user.mobile.substring(0,3)+"****"+$scope.user.mobile.substring(7,11);

          if($scope.user.pic_url!=null){
            var aa=$scope.user.pic_url.substring(0,4);
            if(aa=="http"){
              $scope.userImg=$scope.user.pic_url;
            }else{
              $scope.userImg=imgBaseUrl+$scope.user.pic_url;
            }
          }else if($scope.user.pic_url==null){
            $scope.userImg=" ";
          }

          console.log(111,$scope.user);
        }


        orderFindUserOrderNumberByUserId.getOrderFindUserOrderNumberByUserId(user.userId, function(data){
          $scope.orderFindUserOrderNumberByUserIdArr=data;
          console.log(data);
          Storage.resetRedNumberUser("userOrderNumber1",$scope.orderFindUserOrderNumberByUserIdArr.number1);
          Storage.resetRedNumberUser("userOrderNumber2",$scope.orderFindUserOrderNumberByUserIdArr.number2);
          Storage.resetRedNumberUser("userOrderNumber3",$scope.orderFindUserOrderNumberByUserIdArr.number3);
        }, function(){

        })
      })



      //跳转页面
      $scope.jsGo=function(data){
        if(data == 'share') {
          var shareUrl = "http://a.app.qq.com/o/simple.jsp?pkgname=com.yl.lvnong";
          LMPlugin.thirdShare({platform:'all', para:{shareUrl:shareUrl}},
            function(){
              //成功

            },
            function(error) {
              //失败
            }
          )
        } else if (data == 'call') {
          LMPlugin.callService({}, function(){

          }, function() {

          })
        } else {
          $rootScope.hideTabs = 'tabs-item-hide'
          $state.go(data, {});
        }
      }
    })

    //商品详情
    .controller('goodsDetailCtrl',function($scope,ENV,$ionicSlideBoxDelegate,$ionicHistory,$state,$stateParams,getGoodsDetail,Storage,CartStorage,Storage,Global,informationWindow, $rootScope,productList) {
      $scope.showType = true;
      //进入执行
      $scope.$on('$ionicView.enter', function() {
        $rootScope.hideTabs = 'tabs-item-hide';
        Storage.resetRedNumberGoodsDetail("resetRedNumberGoodsDetail");
        //console.log($ionicHistory.viewHistory());
        //if($ionicHistory.viewHistory().backView!=null){
        //  if ($ionicHistory.viewHistory().backView.stateName == 'tab.cart') {
        //    for(index in $ionicHistory.viewHistory().histories){
        //      delete $ionicHistory.viewHistory().histories[index];
        //    }
        //  }
        //}

      })

      $scope.jsGoFarm=function(farm_id){
        $state.go('tab.farmDetail', {farm_id: farm_id});
      }

      $scope.$on('$ionicView.beforeEnter', function() {
        if(navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1){
          $scope.phoneFlag=false;
        }else if(!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
          $scope.phoneFlag=true;
        }
        console.log($scope.phoneFlag);

        var ss6=setInterval(function(){
          var e1=document.getElementById("goodsDetailContentScroll");
          console.log(e1);
          if(e1){
            if($scope.phoneFlag==0){
              //$scope.phoneClass="scroll-content ionic-scroll  has-header has-footer has-tabs phoneClass1";
              $("#goodsDetailContentScroll").addClass("phoneClass1");
              $("#goodsDetailScroll_1").scroll(function(){
                var t1=document.getElementById("goodsDetailScroll_1");
                var num1=(screen.width-44)/100;
                var num2=t1.scrollTop;
                var num3=parseInt(num2/num1);
                var t2=document.getElementById("goodsDetailTopBar");
                if(num3<100){
                  t2.style.opacity=num3/100;
                }else if(num3>=100){
                  t2.style.opacity=1;
                }
              });
            }else if($scope.phoneFlag==1){
              //$scope.phoneClass="scroll-content ionic-scroll  has-header has-footer has-tabs phoneClass2";
              $("#goodsDetailContentScroll").addClass("phoneClass2");
              e1.children[0].id="goodsDetailContentScrollOne";
              $("#goodsDetailContentScroll").scroll(function(){
                var t1=document.getElementById("goodsDetailContentScrollOne");
                var num1=(screen.width-44)/100;
                var num2=-(parseFloat(t1.style.transform.split(",")[1]));
                var num3=parseInt(num2/num1);
                var t2=document.getElementById("goodsDetailTopBar");
                if(num3<100){
                  t2.style.opacity=num3/100;
                }else if(num3>=100){
                  t2.style.opacity=1;
                }
              });
            }
            clearInterval(ss6);
          }
        },1000/60);

        Global.removeHistory('tab.goodsDetail');
        Global.removeHistory('tab.homeGoodsDetail');
        Global.removeHistory('tab.farmGoodsDetail');
        var user = Storage.get('user');
        //if(!user || !user.userId) {
        //  $state.go('login');
        //}
        console.log($ionicHistory.viewHistory());

        //得到商品详情
        if(user){
          getGoodsDetail.getDetail($stateParams['good_id'],JSON.parse(localStorage.user).userId, function(data){
            //$("#goodsDetailTopBar").fadeTo("slow",1);
            //$("#goodsDetailLeftId").fadeTo("slow",1);
            setTimeout(function(){
              $("#goodsDetailRightId").fadeTo("slow",1);
              $("#goodsDetailContentScroll").fadeTo("slow",1);
              $("#goodsDetailBottomId").fadeTo("fast",1);
            },200);

            $ionicSlideBoxDelegate.$getByHandle("slideimgs").update();
            //console.log(data);
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
            console.log(data);


            $scope.detail = data;

            //获得是否收藏
            productList.getProductGetIsFavourite(user.userId,$scope.detail.productId,function(data6){
              console.log(data6);
              $scope.ifCollection=data6;
            })

            var c1=document.getElementsByClassName("goodsDetailWords")[0];
            c1.innerHTML=$scope.detail.description;
            //c1[1].innerHTML=$scope.detail.sourceInfo;

            //console.log($scope.detail.description);
            $scope.detail.farmImage = imgBaseUrl + $scope.detail.farmImage
            for (index in $scope.detail.images) {
              $scope.detail.images[index] = imgBaseUrl +  $scope.detail.images[index]
            }

            console.log($scope.detail.images);

            //$scope.newimages=[];
            //for(index in $scope.detail.images){
            //  $scope.newimages[index]=new Image()
            //  $scope.newimages[index].src=$scope.detail.images[index];
            //  $scope.newimages[index].style.opacity=0;
            //  $scope.newimages[index].onload=function(){
            //    $(this).fadeTo("slow",1);
            //  }
            //}
            //for(var i=0;i<$scope.newimages.length;i++){
            //  //console.log($("#goodsDetailSlide1"));
            //  $("#goodsDetailSlide1").append($scope.newimages[i]);
            //}
            //console.log($scope.newimages);
            //$scope.detail.description=$scope.detail.description.replace(/<img/g,aa);

            var prices = data.prices.reverse();
            $scope.firstPrice = prices.length > 0 ? prices[0] : null
            $scope.lastPrice = prices.length > 1 ? prices[prices.length - 1] : null
            $scope.middlePrices = prices.length > 2 ?prices.slice(1, prices.length - 1) : null

            umregister("enterGoods");
          }, function(){
          })

          //获得是否收藏
          //getGoodsDetail.getIfCollection(user.userId, $stateParams['good_id'], function(data){
          //  $scope.ifCollection = data;
          //}, function(){
          //
          //})
        }else{
          getGoodsDetail.getDetail($stateParams['good_id'],"", function(data){
            //$("#goodsDetailTopBar").fadeTo("slow",1);
            //$("#goodsDetailLeftId").fadeTo("slow",1);
            setTimeout(function(){
              $("#goodsDetailRightId").fadeTo("slow",1);
              $("#goodsDetailContentScroll").fadeTo("slow",1);
              $("#goodsDetailBottomId").fadeTo("fast",1);
            },200);

            $ionicSlideBoxDelegate.$getByHandle("slideimgs").update();
            console.log(data);
            var aa="<img onerror="+'"'+"this.src='img/lvnongLogo3.png'"+'" ';
            //var aa="<img err-src='img/lvnongLogo3.png' ";
            if(data.description && data.sourceInfo){
              data.description=data.description.replace(/<img/g,aa);
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

            umregister("enterGoods");
          }, function(){
          })
        }
      })

      //$scope.$on('$ionicView.afterEnter', function() {
      //  Storage.resetRedNumberGoodsDetail("resetRedNumberGoodsDetail");
      //})





      $scope.getNextLimitCount = function(index) {
        return $scope.middlePrices ? ($scope.middlePrices.length - 1 != index ? $scope.middlePrices[index + 1].limitCount : $scope.lastPrice.limitCount) : 0
      }

      $scope.getLevelData = function(index) {
        if ($scope.detail && $scope.detail.prices.length > 0) {
          return $scope.detail.prices[index]
        } else {
          return 0
        }
      }

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

      //联系客服
      $scope.connect = function() {
          LMPlugin.qiyuService({title:'绿农客服', urlString:'https://8.163.com/', sessionTitle:'绿农客服'},
            function(){
              //成功
            },
            function(){
              //失败
              alert(error.errorReason)
            })
      }

      $scope.share = function() {
        var shareUrl = shareUrlTheme +"shareGoods/"+$scope.detail.productId;
        LMPlugin.thirdShare({platform:'all', para:{shareUrl:shareUrl}},
          function(){
            //成功

          },
          function(error) {
            //失败
          }
        )

      }

      $scope.collection = function() {
        var user = Storage.get('user');
        if(user){
          getGoodsDetail.collection($scope.ifCollection==null,user.userId, $stateParams['good_id'],$scope.ifCollection,function(){
            if($scope.ifCollection==null){
              console.log($scope.ifCollection);
              informationWindow.showOk("商品已收藏");
            }else{
              $scope.ifCollection=null;
              console.log($scope.ifCollection);
              informationWindow.showOk("商品已取消收藏");
            }
            productList.getProductGetIsFavourite(user.userId,$scope.detail.productId,function(data6){
              console.log(data6);
              $scope.ifCollection=data6;
            })
          })
        }
      }
      //添加到购物车
      $scope.addToCart = function() {
        Storage.clickEffect("goodsDetailBottomC3");
        CartStorage.addCartWithGood($scope.detail);
        Storage.resetRedNumberGoodsDetail("resetRedNumberGoodsDetail");
      }

      $scope.goCart = function() {
        if($ionicHistory.viewHistory().backView!=null && $ionicHistory.viewHistory().backView.stateName == 'tab.cart') {
          $ionicHistory.goBack()
        } else {
          //$ionicHistory.clearHistory()
          $state.go('tab.cart')
        }
      }

      $scope.back = function () {
        $ionicHistory.goBack()
      }

      //$scope.screenTouch=function(e){
      //  //console.log(11);
      //  $scope.tt1=setInterval(function(){
      //    var t1=document.getElementById("goodsDetailContentScrollOne");
      //
      //    var num1=(screen.width-44)/100;
      //    var num2=t1.scrollTop;
      //    var num3=parseInt(num2/num1);
      //    console.log(screen.width,num1,num2,num3);
      //    var t2=document.getElementById("goodsDetailTopBar");
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
      //    clearInterval($scope.tt1);
      //  },500);
      //}

    })

    //农场详情
    .controller('farmDetailCtrl',function($scope,$rootScope,ENV,$ionicSlideBoxDelegate,$ionicHistory,$state,$stateParams,farmDetails,$ionicLoading,Global,informationWindow) {
      $scope.back = function () {
        $ionicHistory.goBack();
      }
      $scope.jsGo=function(data){
        if($scope.farmDetailsArr.is_bespeakvisit=='y'){
          $state.go(data, {farmId:$stateParams['farm_id']});
        }else if(!($scope.farmDetailsArr.is_bespeakvisit=='y')){
          informationWindow.showOk('该农场暂不支持预哟');
        }
      }
      $scope.jsGoGoods=function(data,aa) {
        console.log(aa);
        $state.go('tab.farmGoodsDetail', {good_id: aa});
      }

      $scope.share = function() {
        var shareUrl = shareUrlTheme +"shareFarm/" + $scope.farmDetailsArr.farmId;
        LMPlugin.thirdShare({platform:'all', para:{shareUrl:shareUrl}},
          function(){
            //成功

          },
          function(error) {
            //失败
          }
        )

      }

      //$scope.$on('$ionicView.beforeEnter', function() {
      //  farmDetails.get($stateParams['farm_id']);
      //})

      $scope.$on('$ionicView.beforeEnter', function() {
        Global.removeHistory('tab.farmDetail');
        console.log($ionicHistory.viewHistory());

        farmDetails.getFarmDetails($stateParams['farm_id'], function(data){
          setTimeout(function(){
            $("#farmDetailContentId").fadeTo("slow",1);
          },200);

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

          umregister("enterFarm");
        }, function(){
        })
      })

      //获取农场详情
      //$scope.$on('farmDetails.getfarmDetails',function(){
      //  $scope.farmDetailsArr=farmDetails.getdata().data;
      //  var num20=$scope.farmDetailsArr.images.length;
      //  for(var i=0;i<num20;i++){
      //    $scope.farmDetailsArr.images[i]=imgBaseUrl+$scope.farmDetailsArr.images[i];
      //  }
      //  console.log($scope.farmDetailsArr);
      //
      //  var num21=$scope.farmDetailsArr.images.length*2;
      //  var d1=document.getElementsByClassName("farmDetailImg2")[0].children[0];
      //  d1.style.width=(100/3*num21)+"%";
      //  setTimeout(function(){
      //    for(var i=0;i<num21;i++){
      //      d1.children[i].style.width=(100/num21)+"%";
      //      d1.children[i].style.visibility="visible";
      //    }
      //  },200);
      //
      //  console.log(d1,num21);
      //  $ionicLoading.hide();
      //})

    })

    //收货地址管理
    .controller('myAddressCtrl', function($scope,ENV,$ionicSlideBoxDelegate,$ionicHistory,$state,$stateParams ,myAddress, $ionicLoading, Storage,modifyAddress) {
      $scope.back=function(){
        $ionicHistory.goBack();
      }
      //判断是否从myOrder跳转来的
      $scope.$on('$ionicView.enter', function() {
        console.log($ionicHistory.viewHistory());
        if($ionicHistory.viewHistory().backView!=null){
          if ($ionicHistory.viewHistory().backView.stateName == 'tab.myOrder') {
            for(index in $ionicHistory.viewHistory().histories){
              delete $ionicHistory.viewHistory().histories[index];
            }
          }
        }
      })

      $scope.select = function(index,Flag,addressId) {
        addressFlag=Flag;
        console.log(Flag,addressFlag);
        if($stateParams['orderEnter']) {
          Storage.set('orderUseAddress', $scope.addressList[index])
          modifyAddress.modify2(addressId, 1, function(){
            $ionicHistory.goBack();
          }, function(){
          })

        } else {
          $state.go('tab.modifyAddress', {
            address_id:$scope.addressList[index].id,
            name:$scope.addressList[index].name,
            mobile:$scope.addressList[index].mobile,
            address:$scope.addressList[index].address,
            street:$scope.addressList[index].street});
        }
      }

      $scope.jsGo=function(data){
        $state.go(data, {});
      }

      //$scope.jsGo=function(data, index,Flag){
      //  addressFlag=Flag;
      //  if(data == 'tab.modifyAddress') {
      //    $state.go($stateParams['orderEnter'] ? 'tab.orderModifyAddress' : data, {
      //      address_id:$scope.addressList[index].id,
      //      name:$scope.addressList[index].name,
      //      mobile:$scope.addressList[index].mobile,
      //      address:$scope.addressList[index].address});
      //  } else {
      //    $state.go($stateParams['orderEnter'] ? 'tab.orderAddAddress' : data, {});
      //  }
      //}

      var user = Storage.get('user')
      if(user && user.userId) {
        myAddress.getAddress(user.userId, function(data){
          console.log(data);
          $scope.addressList = data;
        }, function(){
        })
      }
    })

    //新增地址信息
    .controller('addAddressCtrl', function($scope,ENV,$ionicSlideBoxDelegate,$ionicHistory,$state,addAddress, Storage,Alert,informationWindow) {

      $scope.back=function(){
        //Storage.remove('mapLocation')
        $ionicHistory.goBack();
      }

      $scope.jsGo=function(){
        LMPlugin.chooseLocation({}, function(data){
          var d1=data.data;
          var d2=document.getElementById("addAddressText");
            d2.value=d1.province+" "+d1.city+" "+d1.district;
        }, function() {

        })
      }

      //监视进入
      //$scope.$on('$ionicView.enter', function() {
      //  var location = Storage.get('mapLocation')
      //  $scope.address = location ? location.address : ''
      //  console.log(location)
      //})

      $scope.name = '';
      $scope.mobile = '';
      $scope.address = '';
      $scope.street = '';
      $scope.addressSum = '';

      $scope.changeName = function(name) {
        $scope.name = name;
      }

      $scope.changeMobile = function(mobile) {
        $scope.mobile = mobile;
      }

      $scope.changeAddress = function(address) {
        $scope.address = address;
      }

      $scope.changeStreet = function(street) {
        $scope.street = street;
      }

      $scope.add = function() {
        var d10=document.getElementById("addAddressText");
          $scope.address=d10.value;
        Storage.clickEffect("editorCommon");
        var user = Storage.get('user');
        if(user && user.userId) {
          if($scope.name && $scope.mobile && $scope.address && $scope.street) {
            addAddress.add(user.userId, $scope.name , $scope.mobile, $scope.address,$scope.street, true, function(){
              $ionicHistory.goBack();
            }, function(){
            })
          } else {
            informationWindow.showError('请将信息填写完整')
          }
        }
      }

    })

    //修改收货地址信息
    .controller('modifyAddressCtrl',function($scope,ENV,$ionicSlideBoxDelegate,$ionicHistory,$state,$stateParams,modifyAddress,Storage,informationWindow,$ionicActionSheet) {

      //监视进入
      //$scope.$on('$ionicView.enter', function() {
      //  var location = Storage.get('mapLocation')
      //  $scope.address = location ? location.address : $stateParams['address']
      //  console.log(location)
      //})

      $scope.name = $stateParams['name'];
      $scope.mobile = parseInt($stateParams['mobile']);
      $scope.address = $stateParams['address'];
      $scope.street = $stateParams['street'];

      $scope.changeName = function(name) {
        $scope.name = name;
      }

      $scope.changeMobile = function(mobile) {
        $scope.mobile = mobile;
      }

      $scope.changeAddress = function(address) {
        $scope.address = address;
      }

      $scope.changeStreet = function(street) {
        $scope.street = street;
      }

      $scope.modify = function(Flag) {
        var d10=document.getElementById("modifyText");
          $scope.address=d10.value;

        console.log(Flag,addressFlag);
        defaultFlag=addressFlag;
        if(Flag){
          defaultFlag=Flag;
        }
        //console.log(addressFlag,defaultFlag);
        Storage.clickEffect("editorCommon");
        var user = Storage.get('user')
        if(user && user.userId) {
          if($scope.name && $scope.mobile && $scope.address && $scope.street) {
            modifyAddress.modify($stateParams['address_id'], $scope.name , $scope.mobile, $scope.address,$scope.street, defaultFlag, function(){
              $ionicHistory.goBack();
            }, function(){
            })
          } else {
            informationWindow.showError('请将信息填写完整')
          }
        }
      }

      $scope.delete=function(){
        var hideSheet=$ionicActionSheet.show({
          buttons: [
            { text: '<div class="shanglaColor">删除</div>' },
            { text: '<div class="shanglaColor2">取消</div>' }
          ],
          buttonClicked: function(index) {
            if(index==0){
              modifyAddress.delete($stateParams['address_id'], function(){
                $ionicHistory.goBack();
              }, function(){
              })
            }
            hideSheet();
          }
        });
      }

      $scope.back = function () {
        Storage.remove('mapLocation')
        $ionicHistory.goBack();
      }

      $scope.jsGo=function(){
        LMPlugin.chooseLocation({}, function(data){
          var d1=data.data;
          var d2=document.getElementById("modifyText");
          d2.value=d1.province+" "+d1.city+" "+d1.district;
        }, function() {

        })
      }

    })

    //商品需求反馈
    .controller('goodsFeedbackCtrl',function($scope,ENV,$ionicSlideBoxDelegate,$ionicHistory,$state,demandFeedbackAddDemandFeedback,Alert,informationWindow,Storage) {
      $scope.back = function () {
        $ionicHistory.goBack();
      }

      $scope.Focus1=function(){
        keyBoradFlag=1;
      }

      $scope.Blur1=function(){
        keyBoradFlag=0;
      }

      //监视进入
      $scope.$on('$ionicView.beforeEnter', function() {
        $scope.user = Storage.get('user');
        console.log($scope.user);
        $scope.goodsFeedbackImg=new Object();
        $scope.goodsFeedbackImg.imgUrl = "img/addpicture.png";

        var si11=setInterval(function(){
          var d1=document.getElementById("goodsFeedbackTopImg");
          if(d1){
            console.log(d1);
            clearInterval(si11);
            d1.src=$scope.goodsFeedbackImg.imgUrl;
          }
        },100);
      })

      $scope.goodsName="";
      $scope.goodsExplain="";
      $scope.goodsDaySum="";
      $scope.goodsAddress="";
      $scope.goodsClass="";
      $scope.goodsImg="";

      $scope.changeGoodsName=function(goodsName){
        $scope.goodsName=goodsName;
      }

      $scope.changeGoodsExplain=function(goodsExplain){
        $scope.goodsExplain=goodsExplain;
      }

      $scope.changeGoodsDaySum=function(goodsDaySum){
        $scope.goodsDaySum=goodsDaySum;
      }

      $scope.changeGoodsAddress=function(goodsAddress){
        $scope.goodsAddress=goodsAddress;
      }

      //$scope.changeGoodsClass=function(goodsClass){
      //  $scope.goodsClass=goodsClass;
      //}

      $scope.personalClick=function(e,goodsClass){
        console.log(e.target.parentElement);
        e.target.parentElement.children[0].checked=true;
        $scope.goodsClass=goodsClass;
      }

      $scope.pickImg = function(){

        //选择相册图片
        //console.log(111);
        //$scope.imgUrl = 'http://img05.tooopen.com/images/20141030/sy_73722719517.jpg';
        //return
        LMPlugin.choosePic({imgUrl:baseUrl + 'demandFeedback/uploadPrint' ,imgName:'imgFile', para:{user_id:$scope.user.userId}},
          function(data){
            //成功
            $scope.goodsFeedbackImg.imgUrl = imgBaseUrl + data.data.url;
            $scope.goodsImg=data.data.url;

            var si11=setInterval(function(){
              var d1=document.getElementById("goodsFeedbackTopImg");
              if(d1){
                console.log(d1);
                clearInterval(si11);
                d1.src=$scope.goodsFeedbackImg.imgUrl;
              }
            },100);
          },
          function(error){
            //失败
            informationWindow.showError(error.errorReason)
          })
      }




      $scope.submit=function(){
        Storage.clickEffect("goodsFeedbackButton");
        console.log($scope.goodsName);
        console.log($scope.goodsExplain);
        console.log($scope.goodsDaySum);
        console.log($scope.goodsAddress);
        console.log($scope.goodsClass);
        console.log($scope.goodsImg);

        if($scope.goodsName=="" || $scope.goodsExplain=="" || $scope.goodsDaySum=="" || $scope.goodsAddress=="" || $scope.goodsClass==""){
          informationWindow.showError("还有未填写的选项");
        }else{
          //LMPlugin.choosePic({imgUrl:baseUrl + "demandFeedback/addDemandFeedback" ,imgName:'imgFile', para:{userId:JSON.parse(localStorage.user).userId,productName:$scope.goodsName,product_explain:$scope.goodsExplain,everyday_consume:$scope.goodsDaySum,address:$scope.goodsAddress,type:$scope.goodsClass}},
          //    function(data){
          //      //成功
          //      $scope.goodsImg = imgBaseUrl + data.data.url;
          //      $ionicHistory.goBack();
          //      informationWindow.showOk("反馈已提交");
          //    },
          //    function(error){
          //      //失败
          //      informationWindow.showError(error.errorReason)
          //    })
          demandFeedbackAddDemandFeedback.addDemandFeedbackAddDemandFeedback(JSON.parse(localStorage.user).userId,$scope.goodsName,$scope.goodsExplain,$scope.goodsDaySum,$scope.goodsAddress,$scope.goodsClass,$scope.goodsImg, function(){
            $ionicHistory.goBack();
            informationWindow.showOk("反馈已提交");
          }, function(){
          })
        }
      }
    })

    //我的优惠券
    .controller('myCouponCtrl',function($scope,ENV,$ionicSlideBoxDelegate,$ionicHistory,$state,Storage,myCoupon, Alert,informationWindow, $stateParams,Global) {
      $scope.$on('$ionicView.enter', function() {
        if($ionicHistory.backView()){
          if ($ionicHistory.backView().stateName == 'tab.myOrder') {
            $scope.orderEnter = true;
          }
          Global.removeHistory('tab.myCoupon');
          console.log($ionicHistory.viewHistory());
        }

        $scope.user = Storage.get('user');
        $scope.noUse = [];
        $scope.use = [];
        $scope.expire = [];
        myCoupon.getCoupon($scope.user.userId, function(data){
          for(index in data) {
            var dd=new Date(data[index].startTime);
            data[index].startTime=dd.getFullYear()+"."+(dd.getMonth()+1)+"."+dd.getDate();
            var dd=new Date(data[index].endTime);
            data[index].endTime=dd.getFullYear()+"."+(dd.getMonth()+1)+"."+dd.getDate();
            if(data[index].status == 0) {
              $scope.noUse.push(data[index]);
            } else if(data[index].status == 1) {
              $scope.use.push(data[index]);
            } else if(data[index].status == 2) {
              $scope.expire.push(data[index]);
            }
          }
          $scope.list = $scope.noUse;
          $scope.selectedEnable = true;
          console.log($scope.noUse,$scope.use,$scope.expire);
        }, function(){
          informationWindow.showError('获取优惠券失败');
        })
      })

      $scope.back = function () {
        $ionicHistory.goBack();
      }
      $scope.noUseCoupon = function(){
        Storage.set('SelectedCoupon', {flag:false});
        Storage.remove('orderUseCoupon')
        $ionicHistory.goBack();
      }
      $scope.noUseCP=function(e){
        var d1=document.getElementsByClassName("myCouponTitleC1");
        var num1=d1.length;
        for(var i=0;i<num1;i++){
          d1[i].className="myCouponTitleC1";
        }
        e.target.className="myCouponTitleC1 myCouponTitleActive";
        $scope.list = $scope.noUse;
        $scope.selectedEnable = true;
      }
      $scope.useCP=function(e){
        var d1=document.getElementsByClassName("myCouponTitleC1");
        var num1=d1.length;
        for(var i=0;i<num1;i++){
          d1[i].className="myCouponTitleC1";
        }
        e.target.className="myCouponTitleC1 myCouponTitleActive";
        $scope.list = $scope.use;
        $scope.selectedEnable = false;
      }
      $scope.expireCP=function(e){
        var d1=document.getElementsByClassName("myCouponTitleC1");
        var num1=d1.length;
        for(var i=0;i<num1;i++){
          d1[i].className="myCouponTitleC1";
        }
        e.target.className="myCouponTitleC1 myCouponTitleActive";
        $scope.list = $scope.expire;
        $scope.selectedEnable = false;
      }

      $scope.select = function(index,limitMoney){
        if($scope.selectedEnable && $scope.orderEnter) {
          if(totalprice>=limitMoney){
            Storage.set('SelectedCoupon', {flag:true});
            Storage.set('orderUseCoupon', $scope.list[index]);
            $ionicHistory.goBack();
          }else{
            informationWindow.showError('未达到该优惠券的使用标准');
          }
        }
      }
    })

    //验证推荐码
    .controller('verificationRecommendCtrl',function($scope,ENV,$ionicSlideBoxDelegate,$ionicHistory,$state, varifyCode, Storage,informationWindow) {
      $scope.back = function () {
        $ionicHistory.goBack();
      }

      $scope.Focus1=function(){
        keyBoradFlag=1;
      }

      $scope.Blur1=function(){
        keyBoradFlag=0;
      }

      $scope.changeCode = function(code) {
        $scope.varifyCode = code
      }

      var user = Storage.get('user')
      $scope.varify = function() {
        varifyCode.varify(user.userId, $scope.varifyCode, function(data){
        informationWindow.showOk("已获得优惠券");
        }, function(){

        })
      }
    })

    //更多
    .controller('moreCtrl',function($scope,ENV,$ionicSlideBoxDelegate,$ionicHistory,$state,Storage,informationWindow) {
      $scope.back = function () {
        $ionicHistory.goBack();
      }

      $scope.jsGo=function(data){
        $state.go(data, {});
      }

      $scope.signOut=function(){
        Storage.remove("user");
        $state.go("loginRegister", {});
      }

      $scope.clear=function(){
        $ionicHistory.clearCache().then(function () {
          informationWindow.showOk("缓存已清除");
        })
      }
    })

    //使用反馈
    .controller('useFeekbackCtrl',function($scope,ENV,$ionicSlideBoxDelegate,$ionicHistory,$state,feedbackAddFeedback,Storage,informationWindow) {
      $scope.back = function () {
        $ionicHistory.goBack();
      }
      $scope.jsGo = function(){
        console.log($scope.content,$scope.contactWay);
        if($scope.content!="" && $scope.contactWay!=""){
          feedbackAddFeedback.addFeedbackAddFeedback($scope.user.userId,$scope.content,$scope.contactWay, function(data){
            $scope.useFeekbackArr=data;
            console.log($scope.useFeekbackArr);
            $ionicHistory.goBack();
            informationWindow.showError("消息发送成功");
          }, function(){
          })
        }else{
          informationWindow.showError("还有未填项");
        }
      }

      $scope.user=Storage.get("user");
      console.log($scope.user);

      $scope.Focus1=function(){
        keyBoradFlag=1;
      }

      $scope.Blur1=function(){
        keyBoradFlag=0;
      }

      $scope.content = '';
      $scope.contactWay = '';

      $scope.changeContent = function(content) {
        $scope.content = content;
      }

      $scope.changeContactWay = function(contactWay) {
        $scope.contactWay = contactWay;
      }




    })

    //系统通知
    .controller('systemInformationCtrl',function($scope,ENV,$ionicSlideBoxDelegate,$ionicHistory,$state,systemNotifyQuerySystemNotify,Storage) {
      $scope.back = function () {
        $ionicHistory.goBack();
      }

      $scope.user=Storage.get("user");

      $scope.$on('$ionicView.beforeEnter', function() {
        systemNotifyQuerySystemNotify.getSystemNotifyQuerySystemNotify($scope.user.userId, function(data){
          $scope.systemInformationArr=data;
          console.log($scope.systemInformationArr);
        }, function(){
        })
      })

    })

    //常见问题
    .controller('oftenQuestionCtrl',function($scope,ENV,$ionicSlideBoxDelegate,$ionicHistory,$state) {
      $scope.back = function () {
        $ionicHistory.goBack();
      }
      $scope.jsGo=function(data){
        $state.go(data, {});
      }
    })

    //配送说明
    .controller('distributionExplainCtrl',function($scope,ENV,$ionicSlideBoxDelegate,$ionicHistory,$state) {
      $scope.back = function () {
        $ionicHistory.goBack();
      }
    })

    //退货说明
    .controller('returnGoodsExplainCtrl',function($scope,ENV,$ionicSlideBoxDelegate,$ionicHistory,$state) {
      $scope.back = function () {
        $ionicHistory.goBack();
      }
    })

    //服务范围
    .controller('serviseExtentCtrl',function($scope,ENV,$ionicSlideBoxDelegate,$ionicHistory,$state) {
      $scope.back = function () {
        $ionicHistory.goBack();
      }
    })

    //用户协议
    .controller('userAgreementCtrl',function($scope,ENV,$ionicSlideBoxDelegate,$ionicHistory,$state) {
      $scope.back = function () {
        $ionicHistory.goBack();
      }
    })

    //关于我们
    .controller('aboutWeCtrl',function($scope,ENV,$ionicSlideBoxDelegate,$ionicHistory,$state) {
      $scope.back = function () {
        $ionicHistory.goBack();
      }
    })

    //广告详情
    .controller('advertisementDetailCtrl',function($scope,ENV,$ionicSlideBoxDelegate,$ionicHistory,$state,Storage) {
      $scope.back = function () {
        $ionicHistory.goBack();
      }

      $scope.$on('$ionicView.beforeEnter', function() {
        var d1=Storage.get("advertisementDetailStorage");
        var aa="<img onerror="+'"'+"this.src='img/lvnongLogo3.png'"+'" ';
        d1=d1.replace(/<img/g,aa);
        console.log(d1);
        var d2=document.getElementById("advertisementDetailStorageSum");
          d2.innerHTML=d1;
      })
    })

    //预售
    .controller('presellCtrl',function($scope,$rootScope,ENV,$ionicSlideBoxDelegate,$ionicHistory,$state,productReadySale,productQueryCategory,Storage,CartStorage,$ionicLoading,informationWindow,productList) {
      $scope.back = function () {
        $ionicHistory.goBack();
      }
      $scope.jsGo=function(view, data){
        if(view == 'tab.homeGoodsDetail') {
          $state.go('tab.homeGoodsDetail',  {good_id:data.id});
        } else if(view == 'tab.cart') {
          $ionicHistory.clearHistory()
          $state.go(view)
        } else {
          $state.go(view)
        }
      }

      //变量初始化
      $scope.categoryId="";
      $scope.sort="";
      $scope.pageNo="0";
      $scope.categoryArr1=[["全部分类",""]];
      $scope.categoryArr2=[["销售价格由低到高","11"],["销售价格由高到低","12"],["配送时间由近到远","13"],["配送时间由远到近","14"]];
      $scope.topId="";
      $scope.categoryArr1Flag="全部分类";
      $scope.categoryArr2Flag="销售价格由低到高";
      $scope.presellDataArr=[];
      $scope.loadMoreDataEnable = true;

      $scope.user=Storage.get('user');
      $scope.userImg=imgBaseUrl+$scope.user.pic_url;

      //监视进入
      $scope.$on('$ionicView.enter', function() {
        Storage.resetRedNumberTop("resetRedNumberTopId1");
        //$scope.loadMoreData();
      })

      $scope.$on('$ionicView.beforeEnter', function() {
        if(ionic.Platform.isIOS()){
          $scope.presellFlag=true;
        }else{
          $scope.presellFlag=false;
        }


        productQueryCategory.getProductQueryCategory(function(data){
          $scope.storehouseCategoryArr=data;
          var num1=$scope.storehouseCategoryArr.length;
          for(var i=0;i<num1;i++){
            var d1=[];
            d1.push($scope.storehouseCategoryArr[i].name,$scope.storehouseCategoryArr[i].id);
            $scope.categoryArr1.push(d1);
          }
          console.log($scope.storehouseCategoryArr);

          umregister("enterPresell");
        }, function(){
        })
      })

      $scope.loadMoreData = function() {
        if($scope.loadMoreDataEnable==true){
          getData();
          $("#infiniteScrollPresellId").css({display:"flex"});
        }else if($scope.loadMoreDataEnable==false){
          $("#infiniteScrollPresellId").css({display:"none"});
        }
      };

      function getData() {

        $scope.pageNo++;
        console.log($scope.pageNo);

        productReadySale.getProductReadySale($scope.categoryId,$scope.sort,$scope.pageNo, function(data){
          console.log(data);
          //$scope.presellDataArr=data.results;
          var num1=data.results.length;
          for(var i=0;i<num1;i++){
            data.results[i].image = imgBaseUrl +data.results[i].image;
            var dd=new Date(data.results[i].saleTime);
            data.results[i].saleTime=dd.getFullYear()+"."+(dd.getMonth()+1)+"."+dd.getDate();
            //$scope.presellDataArr[i].saleTime=new Date($scope.presellDataArr[i].saleTime).toLocaleString().split("上午")[0].split("下午")[0].replace(/\//g,".");
          }
          for(index in data.results){
            if(data.results[index].status==0 || data.results[index].status==1){
              $scope.presellDataArr.push(data.results[index]);
            }
          }

          $scope.goodsIds="";
          for(index in $scope.presellDataArr){
            $scope.goodsIds=$scope.goodsIds+$scope.presellDataArr[index].id+",";
          }
          $scope.goodsIds.substring(0,$scope.goodsIds.length-1);

          productList.getProductGetMinPrice($scope.goodsIds,function(data5){
            $scope.presellDataArr=Storage.changeMinPrice($scope.presellDataArr,data5);
          });

          console.log($scope.presellDataArr);
          $scope.$broadcast('scroll.infiniteScrollComplete');
          if($scope.pageNo>= data.num_pages){
            $scope.loadMoreDataEnable = false;
          }
        }, function(){
        })


        //productNewList.getProductNewList($scope.categoryId,$scope.sort,$scope.pageNo, function(data){
        //  console.log(data);
        //  //$scope.presellDataArr=data.results;
        //  var num1=data.results.length;
        //  for(var i=0;i<num1;i++){
        //    data.results[i].image = imgBaseUrl +data.results[i].image;
        //    //var dd=new Date($scope.presellDataArr[i].saleTime);
        //    //$scope.presellDataArr[i].saleTime=dd.getFullYear()+"."+(dd.getMonth()+1)+"."+dd.getDate();
        //    //$scope.presellDataArr[i].saleTime=new Date($scope.presellDataArr[i].saleTime).toLocaleString().split("上午")[0].split("下午")[0].replace(/\//g,".");
        //  }
        //  for(index in data.results){
        //    $scope.presellDataArr.push(data.results[index]);
        //  }
        //  console.log($scope.presellDataArr);
        //  $scope.$broadcast('scroll.infiniteScrollComplete');
        //  if($scope.pageNo>= data.num_pages){
        //    $scope.loadMoreDataEnable = false;
        //  }
        //}, function(){
        //})

        console.log($scope.loadMoreDataEnable);
      }



      //种类列表请求
      //queryCategory.get();
      //$scope.$on('queryCategory.getqueryCategory',function(){
      //
      //  queryCategory.getdata().data;
      //  $scope.storehouseCategoryArr=queryCategory.getdata().data;
      //  console.log($scope.storehouseCategoryArr);
      //  var num1=$scope.storehouseCategoryArr.length;
      //  for(var i=0;i<num1;i++){
      //    var d1=[];
      //    d1.push($scope.storehouseCategoryArr[i].name,$scope.storehouseCategoryArr[i].id);
      //    $scope.categoryArr1.push(d1);
      //  }
      //
      //  console.log($scope.categoryArr1);
      //})



      ////初始商品列表
      //productReadySale.get($scope.categoryId,$scope.sort,1);
      //$scope.$on('productReadySale.getproductReadySale',function(){
      //  $scope.presellDataArr=productReadySale.getdata().data;
      //  console.log($scope.presellDataArr);
      //  var num1=$scope.presellDataArr.length;
      //  for(var i=0;i<num1;i++){
      //    var dd=new Date($scope.presellDataArr[i].saleTime);
      //    $scope.presellDataArr[i].saleTime=dd.getFullYear()+"."+(dd.getMonth()+1)+"."+dd.getDate();
      //    //$scope.presellDataArr[i].saleTime=new Date($scope.presellDataArr[i].saleTime).toLocaleString().split("上午")[0].split("下午")[0].replace(/\//g,".");
      //  }
      //})

      //消失弹窗
      $scope.clearWindows=function(){
        $(".presellAllCategory1").css("display","none");
        $(".presellAllCategory2").css("display","none");
      }

      //选择商品种类
      $scope.presellList=function(e){
        $(".presellAllCategory1").toggle();
        $(".presellAllCategory2").css("display","none");
        var d1=document.getElementsByClassName("presellThemeC1");
        var num1=d1.length;
        for(var i=0;i<num1;i++){
          d1[i].className="presellThemeC1";
        }
        if(e.target.parentElement.className=="presellThemeC3"){
          d2=e.target.parentElement.parentElement;
        }else{
          d2=e.target.parentElement;
        }
        console.log(d2);
        d2.className="presellThemeC1 presellThemeCActive";
      }

      //按价格时间排序
      $scope.presellPriceTime=function(e){
        $(".presellAllCategory2").toggle();
        $(".presellAllCategory1").css("display","none");
        var d1=document.getElementsByClassName("presellThemeC1");
        var num1=d1.length;
        for(var i=0;i<num1;i++){
          d1[i].className="presellThemeC1";
        }
        if(e.target.parentElement.className=="presellThemeC3"){
          d2=e.target.parentElement.parentElement;
        }else{
          d2=e.target.parentElement;
        }
        console.log(d2);
        d2.className="presellThemeC1 presellThemeCActive";
      }

      //选中列表项1
      $scope.presellListC1=function(x){
        $scope.categoryArr1Flag=x[0];
        $("#presellThemeFirst").children()[0].innerHTML=x[0];
        $(".presellAllCategory1").toggle();
        $scope.categoryId=x[1];
        $scope.pageNo=0;
        $scope.presellDataArr=[];
        $scope.loadMoreDataEnable = true;
        getData();
        //productReadySale.getProductReadySale($scope.categoryId,$scope.sort,$scope.pageNo, function(data){
        //  $scope.presellDataArr=data.results;
        //  var num1=$scope.presellDataArr.length;
        //  for(var i=0;i<num1;i++){
        //    $scope.presellDataArr[i].image = imgBaseUrl +$scope.presellDataArr[i].image;
        //    var dd=new Date($scope.presellDataArr[i].saleTime);
        //    $scope.presellDataArr[i].saleTime=dd.getFullYear()+"."+(dd.getMonth()+1)+"."+dd.getDate();
        //    //$scope.presellDataArr[i].saleTime=new Date($scope.presellDataArr[i].saleTime).toLocaleString().split("上午")[0].split("下午")[0].replace(/\//g,".");
        //  }
        //  console.log($scope.presellDataArr);
        //
        //  //var time1=setInterval(function(){
        //  //  var d1=document.getElementsByClassName("presellListC4");
        //  //  if(d1){
        //  //    Storage.imgWH("presellListC4",10);
        //  //    clearInterval(time1);
        //  //  }
        //  //},1000/60);
        //
        //}, function(){
        //})
      }

      //选中列表项2
      $scope.presellListC2=function(x){
        $scope.categoryArr2Flag=x[0];
        $("#presellThemeSecond").children()[0].innerHTML=x[0];
        $(".presellAllCategory2").toggle();
        $scope.sort=x[1];
        $scope.pageNo=0;
        $scope.presellDataArr=[];
        $scope.loadMoreDataEnable = true;
        getData();
        //productReadySale.getProductReadySale($scope.categoryId,$scope.sort,$scope.pageNo, function(data){
        //  $scope.presellDataArr=data.results;
        //  var num1=$scope.presellDataArr.length;
        //  for(var i=0;i<num1;i++){
        //    $scope.presellDataArr[i].image = imgBaseUrl +$scope.presellDataArr[i].image;
        //    var dd=new Date($scope.presellDataArr[i].saleTime);
        //    $scope.presellDataArr[i].saleTime=dd.getFullYear()+"."+(dd.getMonth()+1)+"."+dd.getDate();
        //    //$scope.presellDataArr[i].saleTime=new Date($scope.presellDataArr[i].saleTime).toLocaleString().split("上午")[0].split("下午")[0].replace(/\//g,".");
        //  }
        //  console.log($scope.presellDataArr);
        //
        //  //var time1=setInterval(function(){
        //  //  var d1=document.getElementsByClassName("presellListC4");
        //  //  if(d1){
        //  //    Storage.imgWH("presellListC4",10);
        //  //    clearInterval(time1);
        //  //  }
        //  //},1000/60);
        //
        //}, function(){
        //})
      }

      //添加购物车
      $rootScope.texiao1num=0;
      $scope.addCart=function(e, index){
        Storage.clickEffect3(e.target,"presellAddCart");
        CartStorage.addCartWithGood($scope.presellDataArr[index]);

        //var d2=document.createElement("i");
        //d2.className="icon ion-ios-plus-outline iconAnimation1";
        //d2.style.left=(e.clientX- e.offsetX)+"px";
        //d2.style.top=(e.clientY-e.offsetY)+"px";
        //d2.id="texiao1_"+$rootScope.texiao1num;
        //var numleft=e.clientX- e.offsetX;
        //var numtop=e.clientY-e.offsetY;
        //var d3=d2.id;
        //document.body.appendChild(d2);
        //$rootScope.texiao1num++;
        //setTimeout(function(){
        //  d2.style.left=(numleft-8)+"px";
        //  d2.style.top=(numtop-10)+"px";
        //  d2.className="icon ion-ios-plus-outline iconAnimation2";
        //  setTimeout(function(){
        //    $("#"+d3).remove();
        //  },200);
        //},100);
        informationWindow.showThree("该商品已加入购物车");
        Storage.resetRedNumberTop("resetRedNumberTopId1");
      }
    })

    //绿农新品
    .controller('lnnewGoodsCtrl',function($scope,$rootScope,ENV,$ionicSlideBoxDelegate,$ionicHistory,$state,productNewList,productQueryCategory,Storage,CartStorage,$ionicLoading,informationWindow,productList) {
      $scope.back = function () {
        $ionicHistory.goBack();
      }
      $scope.jsGo=function(view, data){
        if(view == 'tab.homeGoodsDetail') {
          $state.go('tab.homeGoodsDetail',  {good_id:data.id});
        } else if(view == 'tab.cart') {
          $ionicHistory.clearHistory()
          $state.go(view)
        } else {
          $state.go(view)
        }
      }

      //变量初始化
      $scope.categoryId="";
      $scope.sort="";
      $scope.pageNo="0";
      $scope.categoryArr1=[["全部分类",""]];
      $scope.categoryArr2=[["价格由低到高","11"],["价格由高到低","12"]];
      $scope.topId="";
      $scope.categoryArr1Flag="全部分类";
      $scope.categoryArr2Flag="价格由低到高";
      $scope.presellDataArr=[];
      $scope.loadMoreDataEnable = true;

      $scope.user=Storage.get('user');
      $scope.userImg=imgBaseUrl+$scope.user.pic_url;

      //监视进入
      $scope.$on('$ionicView.enter', function() {
        Storage.resetRedNumberTop("resetRedNumberTopId2");
        //$scope.loadMoreData();
      })

      $scope.$on('$ionicView.beforeEnter', function() {
        if(ionic.Platform.isIOS()){
          $scope.presellFlag=true;
        }else{
          $scope.presellFlag=false;
        }

        //productNewList.getProductNewList($scope.categoryId,$scope.sort,$scope.pageNo, function(data){
        //  console.log(data);
        //  $scope.presellDataArr=data.results;
        //  var num1=$scope.presellDataArr.length;
        //  for(var i=0;i<num1;i++){
        //    $scope.presellDataArr[i].image = imgBaseUrl +$scope.presellDataArr[i].image;
        //    var dd=new Date($scope.presellDataArr[i].saleTime);
        //    $scope.presellDataArr[i].saleTime=dd.getFullYear()+"."+(dd.getMonth()+1)+"."+dd.getDate();
        //    //$scope.presellDataArr[i].saleTime=new Date($scope.presellDataArr[i].saleTime).toLocaleString().split("上午")[0].split("下午")[0].replace(/\//g,".");
        //  }
        //  console.log($scope.presellDataArr);
        //  //var time1=setInterval(function(){
        //  //  var d1=document.getElementsByClassName("presellListC4");
        //  //  if(d1){
        //  //    Storage.imgWH("presellListC4",10);
        //  //    clearInterval(time1);
        //  //  }
        //  //},1000/60);
        //}, function(){
        //})
        productQueryCategory.getProductQueryCategory(function(data){
          $scope.storehouseCategoryArr=data;
          var num1=$scope.storehouseCategoryArr.length;
          for(var i=0;i<num1;i++){
            var d1=[];
            d1.push($scope.storehouseCategoryArr[i].name,$scope.storehouseCategoryArr[i].id);
            $scope.categoryArr1.push(d1);
          }
          console.log($scope.storehouseCategoryArr);

          umregister("enterNewGoods");
        }, function(){
        })
      })

      $scope.loadMoreData = function() {
        if($scope.loadMoreDataEnable==true){
          getData();
          $("#infiniteScrollInnewId").css({display:"flex"});
        }else if($scope.loadMoreDataEnable==false){
          $("#infiniteScrollInnewId").css({display:"none"});
        }
      };

      function getData() {

        $scope.pageNo++;
        console.log($scope.pageNo);


        productNewList.getProductNewList($scope.categoryId,$scope.sort,$scope.pageNo, function(data){
          console.log(data);
          //$scope.presellDataArr=data.results;
          var num1=data.results.length;
          for(var i=0;i<num1;i++){
            data.results[i].image = imgBaseUrl +data.results[i].image;
            //var dd=new Date($scope.presellDataArr[i].saleTime);
            //$scope.presellDataArr[i].saleTime=dd.getFullYear()+"."+(dd.getMonth()+1)+"."+dd.getDate();
            //$scope.presellDataArr[i].saleTime=new Date($scope.presellDataArr[i].saleTime).toLocaleString().split("上午")[0].split("下午")[0].replace(/\//g,".");
          }
          for(index in data.results){
            if(data.results[index].status==0 || data.results[index].status==1){
              $scope.presellDataArr.push(data.results[index]);
            }
          }

          $scope.goodsIds="";
          for(index in $scope.presellDataArr){
            $scope.goodsIds=$scope.goodsIds+$scope.presellDataArr[index].id+",";
          }
          $scope.goodsIds.substring(0,$scope.goodsIds.length-1);

          productList.getProductGetMinPrice($scope.goodsIds,function(data5){
            $scope.presellDataArr=Storage.changeMinPrice($scope.presellDataArr,data5);
          });

          console.log($scope.presellDataArr);
          $scope.$broadcast('scroll.infiniteScrollComplete');
          if($scope.pageNo>= data.num_pages){
            $scope.loadMoreDataEnable = false;
          }
        }, function(){
        })

        console.log($scope.loadMoreDataEnable);
      }

      ////种类列表请求
      //queryCategory.get();
      //$scope.$on('queryCategory.getqueryCategory',function(){
      //  queryCategory.getdata().data.shift();
      //  $scope.storehouseCategoryArr=queryCategory.getdata().data;
      //  console.log($scope.storehouseCategoryArr);
      //  var num1=$scope.storehouseCategoryArr.length;
      //  for(var i=0;i<num1;i++){
      //    var d1=[];
      //    d1.push($scope.storehouseCategoryArr[i].name,$scope.storehouseCategoryArr[i].id);
      //    $scope.categoryArr1.push(d1);
      //  }
      //
      //  console.log($scope.categoryArr1);
      //})
      //
      ////初始商品列表
      //productNewList.get($scope.categoryId,$scope.sort,1);
      //$scope.$on('productNewList.getproductNewList',function(){
      //  $scope.presellDataArr=productNewList.getdata().data;
      //  console.log($scope.presellDataArr);
      //  var num1=$scope.presellDataArr.length;
      //  for(var i=0;i<num1;i++){
      //    var dd=new Date($scope.presellDataArr[i].saleTime);
      //    $scope.presellDataArr[i].saleTime=dd.getFullYear()+"."+(dd.getMonth()+1)+"."+dd.getDate();
      //    //$scope.presellDataArr[i].saleTime=new Date($scope.presellDataArr[i].saleTime).toLocaleString().split("上午")[0].split("下午")[0].replace(/\//g,".");
      //  }
      //    $ionicLoading.hide();
      //})

      //消失弹窗
      $scope.clearWindows=function(){
        $(".presellAllCategory1").css("display","none");
        $(".presellAllCategory2").css("display","none");
      }

      //选择商品种类
      $scope.presellList=function(e){
        $(".presellAllCategory1").toggle();
        $(".presellAllCategory2").css("display","none");
        var d1=document.getElementsByClassName("presellThemeC1");
        var num1=d1.length;
        for(var i=0;i<num1;i++){
          d1[i].className="presellThemeC1";
        }
        if(e.target.parentElement.className=="presellThemeC3"){
          d2=e.target.parentElement.parentElement;
        }else{
          d2=e.target.parentElement;
        }
        console.log(d2);
        d2.className="presellThemeC1 presellThemeCActive";
      }

      //按价格时间排序
      $scope.presellPriceTime=function(e){
        $(".presellAllCategory2").toggle();
        $(".presellAllCategory1").css("display","none");
        var d1=document.getElementsByClassName("presellThemeC1");
        var num1=d1.length;
        for(var i=0;i<num1;i++){
          d1[i].className="presellThemeC1";
        }
        if(e.target.parentElement.className=="presellThemeC3"){
          d2=e.target.parentElement.parentElement;
        }else{
          d2=e.target.parentElement;
        }
        console.log(d2);
        d2.className="presellThemeC1 presellThemeCActive";
      }

      //选中列表项1
      $scope.presellListC1=function(x){
        $scope.categoryArr1Flag=x[0];
        $("#presellThemeFirst").children()[0].innerHTML=x[0];
        $(".presellAllCategory1").toggle();
        $scope.categoryId=x[1];
        $scope.pageNo=0;
        $scope.presellDataArr=[];
        $scope.loadMoreDataEnable = true;
        getData();
        //productNewList.getProductNewList($scope.categoryId,$scope.sort,$scope.pageNo, function(data){
        //  console.log(data);
        //  $scope.presellDataArr=data.results;
        //  var num1=$scope.presellDataArr.length;
        //  for(var i=0;i<num1;i++){
        //    $scope.presellDataArr[i].image = imgBaseUrl +$scope.presellDataArr[i].image;
        //    var dd=new Date($scope.presellDataArr[i].saleTime);
        //    $scope.presellDataArr[i].saleTime=dd.getFullYear()+"."+(dd.getMonth()+1)+"."+dd.getDate();
        //    //$scope.presellDataArr[i].saleTime=new Date($scope.presellDataArr[i].saleTime).toLocaleString().split("上午")[0].split("下午")[0].replace(/\//g,".");
        //  }
        //  console.log($scope.presellDataArr);
        //
        //  //var time1=setInterval(function(){
        //  //  var d1=document.getElementsByClassName("presellListC4");
        //  //  if(d1){
        //  //    Storage.imgWH("presellListC4",10);
        //  //    clearInterval(time1);
        //  //  }
        //  //},1000/60);
        //
        //}, function(){
        //})
      }

      //选中列表项2
      $scope.presellListC2=function(x){
        $scope.categoryArr2Flag=x[0];
        $("#presellThemeSecond").children()[0].innerHTML=x[0];
        $(".presellAllCategory2").toggle();
        $scope.sort=x[1];
        $scope.pageNo=0;
        $scope.presellDataArr=[];
        $scope.loadMoreDataEnable = true;
        getData();
        //productNewList.getProductNewList($scope.categoryId,$scope.sort,$scope.pageNo, function(data){
        //  console.log(data);
        //  $scope.presellDataArr=data.results;
        //  var num1=$scope.presellDataArr.length;
        //  for(var i=0;i<num1;i++){
        //    $scope.presellDataArr[i].image = imgBaseUrl +$scope.presellDataArr[i].image;
        //    var dd=new Date($scope.presellDataArr[i].saleTime);
        //    $scope.presellDataArr[i].saleTime=dd.getFullYear()+"."+(dd.getMonth()+1)+"."+dd.getDate();
        //    //$scope.presellDataArr[i].saleTime=new Date($scope.presellDataArr[i].saleTime).toLocaleString().split("上午")[0].split("下午")[0].replace(/\//g,".");
        //  }
        //  console.log($scope.presellDataArr);
        //
        //  //var time1=setInterval(function(){
        //  //  var d1=document.getElementsByClassName("presellListC4");
        //  //  if(d1){
        //  //    Storage.imgWH("presellListC4",10);
        //  //    clearInterval(time1);
        //  //  }
        //  //},1000/60);
        //
        //}, function(){
        //})
      }

      //添加购物车
      $rootScope.texiao1num=0;
      $scope.addCart=function(e,index){
        Storage.clickEffect3(e.target,"presellAddCart");
        CartStorage.addCartWithGood($scope.presellDataArr[index]);

        //var d2=document.createElement("i");
        //d2.className="icon ion-ios-plus-outline iconAnimation1";
        //d2.style.left=(e.clientX- e.offsetX)+"px";
        //d2.style.top=(e.clientY-e.offsetY)+"px";
        //d2.id="texiao1_"+$rootScope.texiao1num;
        //var numleft=e.clientX- e.offsetX;
        //var numtop=e.clientY-e.offsetY;
        //var d3=d2.id;
        //document.body.appendChild(d2);
        //$rootScope.texiao1num++;
        //setTimeout(function(){
        //  d2.style.left=(numleft-8)+"px";
        //  d2.style.top=(numtop-10)+"px";
        //  d2.className="icon ion-ios-plus-outline iconAnimation2";
        //  setTimeout(function(){
        //    $("#"+d3).remove();
        //  },200);
        //},100);
        informationWindow.showThree("该商品已加入购物车");
        Storage.resetRedNumberTop("resetRedNumberTopId2");
      }
    })

    //绿农热销
    .controller('lnHotCtrl',function($scope,$rootScope,ENV,$ionicSlideBoxDelegate,$ionicHistory,$state,productHotList,productQueryCategory,CartStorage,Storage,$ionicLoading,informationWindow,productList) {
      $scope.back = function () {
        $ionicHistory.goBack();
      }
      $scope.jsGo=function(view, data){
        if(view == 'tab.homeGoodsDetail') {
          $state.go('tab.homeGoodsDetail',  {good_id:data.id});
        } else if(view == 'tab.cart') {
          $ionicHistory.clearHistory()
          $state.go(view)
        } else {
          $state.go(view)
        }
      }

      //变量初始化
      $scope.categoryId="";
      $scope.sort="";
      $scope.pageNo="0";
      $scope.categoryArr1=[["全部分类",""]];
      $scope.categoryArr2=[["价格由低到高","11"],["价格由高到低","12"]];
      $scope.topId="";
      $scope.categoryArr1Flag="全部分类";
      $scope.categoryArr2Flag="价格由低到高";
      $scope.loadMoreDataEnable=true;
      $scope.presellDataArr=[];
      $scope.loadMoreDataEnable = true;

      $scope.user=Storage.get('user');
      $scope.userImg=imgBaseUrl+$scope.user.pic_url;

      //监视进入
      $scope.$on('$ionicView.enter', function() {
        Storage.resetRedNumberTop("resetRedNumberTopId3");
        //$scope.loadMoreData();
      })

      $scope.$on('$ionicView.beforeEnter', function() {
        if(ionic.Platform.isIOS()){
          $scope.presellFlag=true;
        }else{
          $scope.presellFlag=false;
        }


        productQueryCategory.getProductQueryCategory(function(data){
          $scope.storehouseCategoryArr=data;
          var num1=$scope.storehouseCategoryArr.length;
          for(var i=0;i<num1;i++){
            var d1=[];
            d1.push($scope.storehouseCategoryArr[i].name,$scope.storehouseCategoryArr[i].id);
            $scope.categoryArr1.push(d1);
          }
          console.log($scope.storehouseCategoryArr);

          umregister("enterHotSell");
        }, function(){
        })
      })

      $scope.loadMoreData = function() {
        if($scope.loadMoreDataEnable==true){
          getData();
          $("#infiniteScrollInhotId").css({display:"flex"});
        }else if($scope.loadMoreDataEnable==false){
          $("#infiniteScrollInhotId").css({display:"none"});
        }
      };

      function getData() {

        $scope.pageNo++;
        console.log($scope.pageNo);

        productHotList.getProductHotList($scope.categoryId,$scope.sort,$scope.pageNo, function(data){
          console.log(data);
          //$scope.presellDataArr=data.results;
          var num1=data.results.length;
          for(var i=0;i<num1;i++){
            data.results[i].image = imgBaseUrl +data.results[i].image;
            var dd=new Date(data.results[i].saleTime);
            //$scope.presellDataArr[i].saleTime=dd.getFullYear()+"."+(dd.getMonth()+1)+"."+dd.getDate();
            //$scope.presellDataArr[i].saleTime=new Date($scope.presellDataArr[i].saleTime).toLocaleString().split("上午")[0].split("下午")[0].replace(/\//g,".");
          }
          for(index in data.results){
            if(data.results[index].status==0 || data.results[index].status==1){
              $scope.presellDataArr.push(data.results[index]);
            }
          }

          $scope.goodsIds="";
          for(index in $scope.presellDataArr){
            $scope.goodsIds=$scope.goodsIds+$scope.presellDataArr[index].id+",";
          }
          $scope.goodsIds.substring(0,$scope.goodsIds.length-1);

          productList.getProductGetMinPrice($scope.goodsIds,function(data5){
            $scope.presellDataArr=Storage.changeMinPrice($scope.presellDataArr,data5);
          });

          console.log($scope.presellDataArr);
          $scope.$broadcast('scroll.infiniteScrollComplete');
          if($scope.pageNo>= data.num_pages){
            $scope.loadMoreDataEnable = false;
          }
        }, function(){
        })

        //productNewList.getProductNewList($scope.categoryId,$scope.sort,$scope.pageNo, function(data){
        //  console.log(data);
        //  //$scope.presellDataArr=data.results;
        //  var num1=data.results.length;
        //  for(var i=0;i<num1;i++){
        //    data.results[i].image = imgBaseUrl +data.results[i].image;
        //    //var dd=new Date($scope.presellDataArr[i].saleTime);
        //    //$scope.presellDataArr[i].saleTime=dd.getFullYear()+"."+(dd.getMonth()+1)+"."+dd.getDate();
        //    //$scope.presellDataArr[i].saleTime=new Date($scope.presellDataArr[i].saleTime).toLocaleString().split("上午")[0].split("下午")[0].replace(/\//g,".");
        //  }
        //  for(index in data.results){
        //    $scope.presellDataArr.push(data.results[index]);
        //  }
        //  console.log($scope.presellDataArr);
        //  $scope.$broadcast('scroll.infiniteScrollComplete');
        //  if($scope.pageNo>= data.num_pages){
        //    $scope.loadMoreDataEnable = false;
        //  }
        //}, function(){
        //})

        console.log($scope.loadMoreDataEnable);
      }

      ////种类列表请求
      //queryCategory.get();
      //$scope.$on('queryCategory.getqueryCategory',function(){
      //  queryCategory.getdata().data.shift();
      //  $scope.storehouseCategoryArr=queryCategory.getdata().data;
      //  console.log($scope.storehouseCategoryArr);
      //  var num1=$scope.storehouseCategoryArr.length;
      //  for(var i=0;i<num1;i++){
      //    var d1=[];
      //    d1.push($scope.storehouseCategoryArr[i].name,$scope.storehouseCategoryArr[i].id);
      //    $scope.categoryArr1.push(d1);
      //  }
      //
      //  console.log($scope.categoryArr1);
      //})

      //初始商品列表
      //productHotList.get($scope.categoryId,$scope.sort,1);
      //$scope.$on('productHotList.getproductHotList',function(){
      //  $scope.presellDataArr=productHotList.getdata().data;
      //  console.log($scope.presellDataArr);
      //  var num1=$scope.presellDataArr.length;
      //  for(var i=0;i<num1;i++){
      //    var dd=new Date($scope.presellDataArr[i].saleTime);
      //    $scope.presellDataArr[i].saleTime=dd.getFullYear()+"."+(dd.getMonth()+1)+"."+dd.getDate();
      //    //$scope.presellDataArr[i].saleTime=new Date($scope.presellDataArr[i].saleTime).toLocaleString().split("上午")[0].split("下午")[0].replace(/\//g,".");
      //  }
      //    $ionicLoading.hide();
      //})

      //消失弹窗
      $scope.clearWindows=function(){
        $(".presellAllCategory1").css("display","none");
        $(".presellAllCategory2").css("display","none");
      }

      //选择商品种类
      $scope.presellList=function(e){
        $(".presellAllCategory1").toggle();
        $(".presellAllCategory2").css("display","none");
        var d1=document.getElementsByClassName("presellThemeC1");
        var num1=d1.length;
        for(var i=0;i<num1;i++){
          d1[i].className="presellThemeC1";
        }
        if(e.target.parentElement.className=="presellThemeC3"){
          d2=e.target.parentElement.parentElement;
        }else{
          d2=e.target.parentElement;
        }
        console.log(d2);
        d2.className="presellThemeC1 presellThemeCActive";
      }

      //按价格时间排序
      $scope.presellPriceTime=function(e){
        $(".presellAllCategory2").toggle();
        $(".presellAllCategory1").css("display","none");
        var d1=document.getElementsByClassName("presellThemeC1");
        var num1=d1.length;
        for(var i=0;i<num1;i++){
          d1[i].className="presellThemeC1";
        }
        if(e.target.parentElement.className=="presellThemeC3"){
          d2=e.target.parentElement.parentElement;
        }else{
          d2=e.target.parentElement;
        }
        console.log(d2);
        d2.className="presellThemeC1 presellThemeCActive";
      }

      //选中列表项1
      $scope.presellListC1=function(x){
        $scope.categoryArr1Flag=x[0];
        $("#presellThemeFirst").children()[0].innerHTML=x[0];
        $(".presellAllCategory1").toggle();
        $scope.categoryId=x[1];
        $scope.pageNo=0;
        $scope.presellDataArr=[];
        $scope.loadMoreDataEnable = true;
        getData();
        //productHotList.getProductHotList($scope.categoryId,$scope.sort,$scope.pageNo, function(data){
        //  $scope.presellDataArr=data.results;
        //  var num1=$scope.presellDataArr.length;
        //  for(var i=0;i<num1;i++){
        //    $scope.presellDataArr[i].image = imgBaseUrl +$scope.presellDataArr[i].image;
        //    var dd=new Date($scope.presellDataArr[i].saleTime);
        //    $scope.presellDataArr[i].saleTime=dd.getFullYear()+"."+(dd.getMonth()+1)+"."+dd.getDate();
        //    //$scope.presellDataArr[i].saleTime=new Date($scope.presellDataArr[i].saleTime).toLocaleString().split("上午")[0].split("下午")[0].replace(/\//g,".");
        //  }
        //  console.log($scope.presellDataArr);
        //
        //  //var time1=setInterval(function(){
        //  //  var d1=document.getElementsByClassName("presellListC4");
        //  //  if(d1){
        //  //    Storage.imgWH("presellListC4",10);
        //  //    clearInterval(time1);
        //  //  }
        //  //},1000/60);
        //
        //}, function(){
        //})
      }

      //选中列表项2
      $scope.presellListC2=function(x){
        $scope.categoryArr2Flag=x[0];
        $("#presellThemeSecond").children()[0].innerHTML=x[0];
        $(".presellAllCategory2").toggle();
        $scope.sort=x[1];
        $scope.pageNo=0;
        $scope.presellDataArr=[];
        $scope.loadMoreDataEnable = true;
        getData();
        //productHotList.getProductHotList($scope.categoryId,$scope.sort,$scope.pageNo, function(data){
        //  $scope.presellDataArr=data.results;
        //  var num1=$scope.presellDataArr.length;
        //  for(var i=0;i<num1;i++){
        //    $scope.presellDataArr[i].image = imgBaseUrl +$scope.presellDataArr[i].image;
        //    var dd=new Date($scope.presellDataArr[i].saleTime);
        //    $scope.presellDataArr[i].saleTime=dd.getFullYear()+"."+(dd.getMonth()+1)+"."+dd.getDate();
        //    //$scope.presellDataArr[i].saleTime=new Date($scope.presellDataArr[i].saleTime).toLocaleString().split("上午")[0].split("下午")[0].replace(/\//g,".");
        //  }
        //  console.log($scope.presellDataArr);
        //
        //  //var time1=setInterval(function(){
        //  //  var d1=document.getElementsByClassName("presellListC4");
        //  //  if(d1){
        //  //    Storage.imgWH("presellListC4",10);
        //  //    clearInterval(time1);
        //  //  }
        //  //},1000/60);
        //
        //}, function(){
        //})
      }

      //添加购物车
      $rootScope.texiao1num=0;
      $scope.addCart=function(e,index){
        Storage.clickEffect3(e.target,"presellAddCart");
        CartStorage.addCartWithGood($scope.presellDataArr[index]);

        //var d2=document.createElement("i");
        //d2.className="icon ion-ios-plus-outline iconAnimation1";
        //d2.style.left=(e.clientX- e.offsetX)+"px";
        //d2.style.top=(e.clientY-e.offsetY)+"px";
        //d2.id="texiao1_"+$rootScope.texiao1num;
        //var numleft=e.clientX- e.offsetX;
        //var numtop=e.clientY-e.offsetY;
        //var d3=d2.id;
        //document.body.appendChild(d2);
        //$rootScope.texiao1num++;
        //setTimeout(function(){
        //  d2.style.left=(numleft-8)+"px";
        //  d2.style.top=(numtop-10)+"px";
        //  d2.className="icon ion-ios-plus-outline iconAnimation2";
        //  setTimeout(function(){
        //    $("#"+d3).remove();
        //  },200);
        //},100);
        informationWindow.showThree("该商品已加入购物车");
        Storage.resetRedNumberTop("resetRedNumberTopId3");
      }
    })

    //活动详情Ctrl
    .controller('activeDetailCtrl',function($scope,$rootScope,ENV,$ionicSlideBoxDelegate,$ionicHistory,$state,Storage,productActivityProduct,CartStorage,$ionicLoading,informationWindow,productList) {
      $scope.back = function () {
        $ionicHistory.goBack();
      }
      $scope.jsGo=function(view, data){
        if(view == 'tab.homeGoodsDetail') {
          $state.go('tab.homeGoodsDetail',  {good_id:data.id});
        } else if(view == 'tab.cart') {
          $ionicHistory.clearHistory()
          $state.go(view)
        } else {
          $state.go(view)
        }
      }
      //变量初始化
      $scope.pageNo=1;
      $scope.active_img=activeImg;

      $scope.user=Storage.get('user');
      $scope.userImg=imgBaseUrl+$scope.user.pic_url;

      //监视进入
      $scope.$on('$ionicView.enter', function() {
        Storage.resetRedNumberTop("resetRedNumberTopId4");
      })

      $scope.$on('$ionicView.beforeEnter', function() {
        productActivityProduct.getProductActivityProduct(activeId,$scope.pageNo, function(data){
          $scope.productActivityProductArr=[];
          for(index in data){
            if(data[index].status==0 || data[index].status==1){
              $scope.productActivityProductArr.push(data[index]);
            }
          }

          $scope.goodsIds="";
          for(index in $scope.productActivityProductArr){
            $scope.goodsIds=$scope.goodsIds+$scope.productActivityProductArr[index].id+",";
          }
          $scope.goodsIds.substring(0,$scope.goodsIds.length-1);

          productList.getProductGetMinPrice($scope.goodsIds,function(data5){
            $scope.productActivityProductArr=Storage.changeMinPrice($scope.productActivityProductArr,data5);
          });


          console.log($scope.productActivityProductArr);
          for(index in $scope.productActivityProductArr){
            $scope.productActivityProductArr[index].image = imgBaseUrl +$scope.productActivityProductArr[index].image;
          }
          //var time1=setInterval(function(){
          //  var d1=document.getElementsByClassName("presellListC4");
          //  if(d1){
          //    Storage.imgWH("presellListC4",10);
          //    clearInterval(time1);
          //  }
          //},1000/60);

          umregister("enterActivity");
        }, function(){
        })
      })


      //种类列表请求
      //productActivityProduct.get(activeId,$scope.pageNo);
      //$scope.$on('productActivityProduct.getproductActivityProduct',function(){
      //  $scope.productActivityProductArr=productActivityProduct.getdata().data;
      //  console.log($scope.productActivityProductArr);
      //    $ionicLoading.hide();
      //})
      //添加购物车
      $rootScope.texiao1num=0;
      $scope.addCart=function(e,index){
        Storage.clickEffect3(e.target,"presellAddCart");
        CartStorage.addCartWithGood($scope.productActivityProductArr[index]);

        //var d2=document.createElement("i");
        //d2.className="icon ion-ios-plus-outline iconAnimation1";
        //d2.style.left=(e.clientX- e.offsetX)+"px";
        //d2.style.top=(e.clientY-e.offsetY)+"px";
        //d2.id="texiao1_"+$rootScope.texiao1num;
        //var numleft=e.clientX- e.offsetX;
        //var numtop=e.clientY-e.offsetY;
        //var d3=d2.id;
        //document.body.appendChild(d2);
        //$rootScope.texiao1num++;
        //setTimeout(function(){
        //  d2.style.left=(numleft-8)+"px";
        //  d2.style.top=(numtop-10)+"px";
        //  d2.className="icon ion-ios-plus-outline iconAnimation2";
        //  setTimeout(function(){
        //    $("#"+d3).remove();
        //  },200);
        //},100);
        informationWindow.showThree("该商品已加入购物车");
        Storage.resetRedNumberTop("resetRedNumberTopId4");
      }
    })

    //我的订单
    .controller('myOrderCtrl',function($scope,$rootScope,ENV,$ionicSlideBoxDelegate,$ionicHistory,$state, $stateParams, Storage, myAddress, myCoupon, orderEvent,Alert,informationWindow,PayEvent) {



      //$scope.$on('$ionicView.enter', function() {
      //  console.log($ionicHistory.viewHistory());
      //  if($ionicHistory.viewHistory().forwardView!=null){
      //    if ($ionicHistory.viewHistory().forwardView.stateName == 'tab.myAddress') {
      //      delete $ionicHistory.viewHistory().histories.ion6;
      //    }
      //  }
      //})



      Storage.remove('orderUseAddress');

      $scope.$on('$ionicView.beforeEnter', function() {
        //Storage.set('SelectedCoupon', {flag:false});
        //var couponFlag==false;
        $scope.defaultCoupon = 0;

        console.log(localStorage.payWay);
        if(localStorage.payWay==undefined){
          console.log(111);
          var payWay=new Object();
            payWay.type=0;
          Storage.set('payWay',payWay);
        }else{
          console.log(222);
          var payWay = Storage.get('payWay');
          console.log(payWay);
        }
        $scope.payType = payWay.type;

        //var address = Storage.get('orderUseAddress');
        //console.log(address);
        //if (address) {
        //  $scope.defaultAddress = address;
        //}
        if(localStorage.SelectedCoupon){
          if(Storage.get('SelectedCoupon').flag==true){
            $scope.defaultCoupon = 1;
            var couponFlag=Storage.get('SelectedCoupon').flag;
            console.log(couponFlag);
            if(couponFlag){
              var coupon = Storage.get('orderUseCoupon');
              $scope.coupon = coupon;
              console.log($scope.coupon);
            }
          }
        }

        refreshPrice();
      })

      $scope.user = Storage.get('user');
      var buyList = Storage.get('buyList');
      var productList = [];
      var priceList = [];
      var allPrice = 0;
      for(index in buyList) {
        productList.push(buyList[index].product);
        priceList.push(buyList[index].price);
        allPrice = allPrice + parseFloat(buyList[index].price) * parseFloat(buyList[index].product.quantity);
      }
      $scope.productList = productList;
      console.log($scope.productList);

      $scope.wuliuId="";
      for(index in $scope.productList){
        //$scope.wuliuId.push($scope.productList[index].productId);
        $scope.wuliuId=$scope.wuliuId+$scope.productList[index].id+",";
      }
      console.log($scope.wuliuId);

      $scope.priceList = priceList;
      $scope.allPrice = allPrice;
      totalprice=$scope.allPrice;
      //配置默认设置
      getDefaultAddress(
        getDefaultCoupon()
      )

      $scope.back = function () {
        $ionicHistory.goBack();
      }
      $scope.jsGo=function(view){
        console.log(view)
        if(view == 'tab.payWay') {
          $state.go(view, {type:$scope.payType});
        }else {
          $state.go(view, {orderEnter:true});
        }
      }

      $scope.changeRemark = function(remark) {
        $scope.remark = remark
      }

      //提交订单
      $scope.submitNow = function() {
        Storage.clickEffect("myorderSumC4");
        //跳转到待收货
        if(!$scope.defaultAddress) {
          informationWindow.showError('请设置送货地址')
          return
        }
        var ids = ''
        for(index in $scope.productList) {
          ids = ids + ',' + $scope.productList[index].id
        }
        orderEvent.submit($scope.user.userId, $scope.defaultAddress.id, $stateParams['type'], ids, $scope.coupon ? $scope.coupon.id : '', $scope.remark ? $scope.remark : '',$stateParams['num'], function(data){
          for(index in $scope.productList) {
            Storage.deleteInCart($scope.productList[index].productId)
          }
          if ($scope.payType == 0) {
            //支付宝
            PayEvent.payWithAlipay(data.id, data.payableMenoy, function(){
              informationWindow.showOk('支付成功')
              //支付成功
              $state.go('tab.waitDeliverGoods', {orderEnter:true})
            }, function(){
              //支付失败
              $state.go('tab.waitPayment', {orderEnter:true})
            })
          } else if ($scope.payType == 1) {
            //微信
            PayEvent.getPreparePayOrder(data.id, function(order){
              console.log(order)
              PayEvent.payWithWechat(order, function(){
                informationWindow.showOk('支付成功')
                //支付成功
                $state.go('tab.waitDeliverGoods', {orderEnter:true})
              }, function(){
                //支付失败
                $state.go('tab.waitPayment', {orderEnter:true})
              })
            }, function() {
              //获取预支付订单失败
            })
          } else {
            informationWindow.showError('支付方式错误')
          }

        }, function(){

        })
      }

      $scope.wuliuPrice=0;

      //获取默认地址
      function getDefaultAddress(complete) {
        $scope.defaultAddress = null
        myAddress.getAddress($scope.user.userId, function(data){
          for (index in data) {
            if(data[index].defaultFlag == 1) {
              Storage.set('orderUseAddress', data[index])
              $scope.defaultAddress = data[index];
              console.log($scope.defaultAddress);
              break
            }
          }
          complete;
          orderEvent.getOrderComputeExpressMoney($scope.wuliuId,$scope.defaultAddress.id, function(data){
            console.log(data);
            $scope.wuliuPrice=data;
            refreshPrice();
          }, function(){

          })
        }, function(){
          informationWindow.showError('获取默认地址失败')
        })
      }

      //获取默认优惠券
      function getDefaultCoupon() {
        $scope.coupon = null;
        $scope.defaultCoupon = 0;

        myCoupon.getCouponGetDefaultCoupon($scope.user.userId,$scope.allPrice, function(data){
          console.log(data);
          $scope.defaultCoupon = 1;
          var d1=Storage.get('SelectedCoupon');
          console.log(d1);
          if(d1==null){
            $scope.coupon = data;
            Storage.set('orderUseCoupon', data);
            refreshPrice();
          }
        }, function(){
          //informationWindow.showError('没有可用的优惠券');
          var d1=document.createElement("div");
          d1.id="informationWindowId";
          document.body.appendChild(d1);
          setTimeout(function(){
            $("#informationWindowId").remove();
          },2000);
        })
      }

      //刷新价格
      function refreshPrice() {
        $scope.finallyPrice = $scope.allPrice - ($scope.coupon ? $scope.coupon.lessMoney : 0) + $scope.wuliuPrice;
      }

    })

    //支付方式
    .controller('payWayCtrl',function($scope,ENV,$ionicSlideBoxDelegate,$ionicHistory,$state,$stateParams,Storage) {
      $scope.type = $stateParams['type'];
      $scope.back = function (index) {
        if(index>=0){
          console.log(index);
          var payWay=Storage.get('payWay');
          payWay.type=index;
          Storage.set('payWay', payWay);
        }
        $ionicHistory.goBack();
      }
      $scope.jsGo=function(data){
        $state.go(data, {});
      }
    })

    //地图地址
    .controller('mapAddressCtrl',function($scope,$timeout,ENV,$ionicSlideBoxDelegate,$ionicHistory,$state, Alert,informationWindow, $ionicLoading, Storage) {
      $scope.back = function () {
        $ionicHistory.goBack();
      }
      var allOverlay = []

      // 百度地图API功能
      var map = new BMap.Map("baiduMap");
      map.addEventListener("click", function(e){
        $ionicLoading.show({
          template: '正在解析...'
        })
        map.centerAndZoom(e.point,18);
        locationPoint(e.point)
      });

      var point = new BMap.Point(104.072366,30.662055);
      map.centerAndZoom(point,18);

      $ionicLoading.show({
        template: '正在定位...'
      })
      var geolocation = new BMap.Geolocation();
      //开始定位
      geolocation.getCurrentPosition(function(r){
        if(this.getStatus() == BMAP_STATUS_SUCCESS){
          console.log('定位成功')
          console.log(r)
          //定位成功
          locationPoint(r.point)
        }
        else {
          $ionicLoading.hide()
          informationWindow.showError('定位失败')
          console.log('failed'+this.getStatus())
          //关于状态码
          //BMAP_STATUS_SUCCESS	检索成功。对应数值“0”。
          //BMAP_STATUS_CITY_LIST	城市列表。对应数值“1”。
          //BMAP_STATUS_UNKNOWN_LOCATION	位置结果未知。对应数值“2”。
          //BMAP_STATUS_UNKNOWN_ROUTE	导航结果未知。对应数值“3”。
          //BMAP_STATUS_INVALID_KEY	非法密钥。对应数值“4”。
          //BMAP_STATUS_INVALID_REQUEST	非法请求。对应数值“5”。
          //BMAP_STATUS_PERMISSION_DENIED	没有权限。对应数值“6”。(自 1.1 新增)
          //BMAP_STATUS_SERVICE_UNAVAILABLE	服务不可用。对应数值“7”。(自 1.1 新增)
          //BMAP_STATUS_TIMEOUT	超时。对应数值“8”。(自 1.1 新增)
        }
      },{enableHighAccuracy: true})


      $scope.chooseAddress = function(address) {
        Storage.set('mapLocation', $scope.aroundList[index])
        $ionicHistory.goBack()
      }


      function locationPoint(point) {

        for (index in allOverlay) {
          map.removeOverlay(allOverlay[index]);
        }
        allOverlay = []

        var geoc = new BMap.Geocoder();
        geoc.getLocation(point, function(rs){
          $ionicLoading.hide()
          console.log(rs)
          $scope.myLocation = rs.address
          $scope.aroundList = rs.surroundingPois
          $scope.aroundList = $scope.aroundList.length > 5 ? $scope.aroundList.splice(0, 5) : $scope.aroundList
          for (index in $scope.aroundList) {
            var img = 'img/location_' + index + '.png'
            $scope.aroundList[index].img = img
            var myIcon = new BMap.Icon(
                img,
                new BMap.Size(23, 31), {
                  offset: new BMap.Size(12, 31), // 指定定位位置
                  imageOffset: new BMap.Size(0, 0) // 设置图片偏移
                });
            var marker = new BMap.Marker($scope.aroundList[index].point,{icon:myIcon});
            map.addOverlay(marker);
            allOverlay.push(marker)
          }
          var mk = new BMap.Marker(point);
          map.addOverlay(mk);
          map.centerAndZoom(point,18);
          allOverlay.push(mk)
          console.log($scope.aroundList)
        });
      }

    })

    //待付款
    .controller('waitPaymentCtrl',function($scope,ENV,$ionicSlideBoxDelegate,$ionicHistory,$state,orderList,orderUpdateOrder, $stateParams, $ionicActionSheet, Alert,informationWindow,PayEvent,$ionicLoading,Storage,Global) {
      $scope.back = function () {
        if($stateParams['orderEnter']) {
          $ionicHistory.clearHistory()
          $state.go('tab.cart')
        } else{
          $ionicHistory.goBack();
        }
      }
      $scope.jsGo=function(data, order_id){
        $state.go(data, {order_id:order_id});
      }



      $scope.$on('$ionicView.beforeEnter', function() {
        $scope.waitPaymentFlag=0;
        $scope.pageNo=0;
        $scope.orderListArr=[];
        $scope.loadMoreDataEnable=true;
        Global.removeHistory('tab.waitPayment');
      })

      $scope.loadMoreData = function() {
        if($scope.loadMoreDataEnable==true){
          getData();
        }else if($scope.loadMoreDataEnable==false){

        }
      };

      function getData() {
        $scope.pageNo++;
        console.log($scope.pageNo);

        orderList.getOrderList(JSON.parse(localStorage.user).userId,1,$scope.pageNo, function(data){
          console.log(data);

          for(i in data.results) {
            for (j in data.results[i].list){
              data.results[i].list[j].image = imgBaseUrl + data.results[i].list[j].image
            }
          }

          for(index in data.results){
            $scope.orderListArr.push(data.results[index]);
          }
          console.log($scope.orderListArr);
          $scope.$broadcast('scroll.infiniteScrollComplete');
          if($scope.pageNo>= data.num_pages){
            $scope.loadMoreDataEnable = false;
          }

          if($scope.orderListArr.length==0){
            //informationWindow.showError("亲，目前还没有待付款的内容哟!");
            $scope.waitPaymentFlag=1;
          }

        }, function(){
          //informationWindow.showError("亲，目前还没有待付款的内容哟!");
          $scope.waitPaymentFlag=1;
        })

        console.log($scope.loadMoreDataEnable);
      }

      //获取所有订单
      //$scope.$on('orderList.getorderList',function(){
      //  $scope.orderListArr=orderList.getdata().data;
      //  $scope.orderTime=[];
      //  $scope.orderFinishTime=[];
      //  for(i in $scope.orderListArr) {
      //    $scope.orderListArr[i].finish_time=$scope.orderListArr[i].created_time+86400000;
      //    $scope.orderFinishTime.push($scope.orderListArr[i].finish_time/1000);
      //    $scope.orderTime=Storage.timeSurplus($scope.orderFinishTime);
      //    for (j in $scope.orderListArr[i].list){
      //      $scope.orderListArr[i].list[j].image = imgBaseUrl + $scope.orderListArr[i].list[j].image
      //    }
      //  }
      //
      //  setInterval(function(){
      //    $scope.orderTime=Storage.timeSurplus($scope.orderFinishTime);
      //    console.log($scope.orderTime);
      //  },1000*60);
      //
      //
      //  console.log($scope.orderListArr);
      //  $ionicLoading.hide();
      //})

      //获取订单商品列表
      //$scope.getGoodsList = function(index) {
      //  return $scope.orderListArr[index].list
      //}


      //orderList.get(JSON.parse(localStorage.user).userId,1);

      //取消订单
      $scope.cancel=function(order_id,index2){
        var hideSheet=$ionicActionSheet.show({
          buttons: [
            { text: '<div class="shanglaColor">确认</div>' },
            { text: '<div class="shanglaColor2">返回</div>' }
          ],
          buttonClicked: function(index) {
            if(index==0){
              orderUpdateOrder.modifyOrderUpdateOrder(order_id,9, function(data){
                $scope.orderListArr[index2].status=9;
                console.log($scope.orderListArr);
              }, function(){
              })
              informationWindow.showOk("您已经取消订单");
            }
            hideSheet();
          }
        });
      }

      //取消订单
      //$scope.$on('orderUpdateOrder.getorderUpdateOrder',function(){
      //  $scope.orderUpdateOrderArr=orderUpdateOrder.getdata().data;
      //  console.log($scope.orderUpdateOrderArr);
      //})


      //var hideSheet=$ionicActionSheet.show({
      //  buttons: [
      //    { text: '<div class="shanglaColor">删除</div>' },
      //    { text: '<div class="shanglaColor2">取消</div>' }
      //  ],
      //  buttonClicked: function(index) {
      //    if(index==0){
      //      modifyAddress.delete($stateParams['address_id'], function(){
      //        $ionicHistory.goBack();
      //      }, function(){
      //      })
      //    }
      //    hideSheet();
      //  }
      //});

      //付款
      $scope.payNow = function(order_no,payable_menoy,order_id) {
        // 显示操作表
        $ionicActionSheet.show({
          buttons: [
            { text: '<div class="shanglaColor2">支付宝支付</div>' },
            { text: '<div class="shanglaColor2">微信支付</div>' },
          ],
          cancelText: '取消',
          buttonClicked: function(index) {
            if (index == 0) {
              //支付宝
              PayEvent.payWithAlipay(order_id, payable_menoy, function(){
                //支付成功

                //orderList.getOrderList(JSON.parse(localStorage.user).userId,1, function(data){
                //  $scope.orderListArr=data.results;
                //  console.log($scope.orderListArr);
                //  for(i in $scope.orderListArr) {
                //    for (j in $scope.orderListArr[i].list){
                //      $scope.orderListArr[i].list[j].image = imgBaseUrl + $scope.orderListArr[i].list[j].image;
                //    }
                //  }
                //}, function(){
                //})

                $scope.pageNo=0;
                $scope.orderListArr=[];
                $scope.loadMoreDataEnable=true;
                getData();

              }, function(){
                //支付失败
              })
            } else {
              //微信
              PayEvent.getPreparePayOrder(order_id, function(data){
                console.log(data)
                PayEvent.payWithWechat(data, function(){
                  //支付成功
                  //$scope.orderListArr[index2].status=2;
                  $scope.pageNo=0;
                  $scope.orderListArr=[];
                  $scope.loadMoreDataEnable=true;
                  getData();
                }, function(){
                  //支付失败
                })
              }, function() {
                //获取预支付订单失败
              })
            }
            return true
          }
        });
      }

    })

    //待付款详情
    .controller('waitPaymentDetailCtrl',function($scope,ENV,$ionicSlideBoxDelegate,$ionicHistory,$state,orderUpdateOrder,orderDetails, $stateParams,$ionicActionSheet,Alert,informationWindow,PayEvent,$ionicLoading,Storage) {
      $scope.back = function () {
        clearInterval($scope.ss2);
        $ionicHistory.goBack();
      }
      $scope.jsGo=function(data){
        clearInterval($scope.ss2);
        $state.go(data, {});
      }

      $scope.jsGoCall=function(){
        LMPlugin.callService({}, function(){

        }, function() {

        })
      }

      $scope.$on('$ionicView.beforeEnter', function() {
        orderDetails.getOrderDetails($stateParams['order_id'], function(data){
          $scope.orderDetailsArr=data;

          $scope.orderTime=[];
          $scope.orderFinishTime=[];

          for(index in $scope.orderDetailsArr.list) {
            $scope.orderDetailsArr.list[index].image = imgBaseUrl + $scope.orderDetailsArr.list[index].image
          }
          console.log($scope.orderDetailsArr);

          //var time1=setInterval(function(){
          //  var d1=document.getElementsByClassName("myAllOrderListC1");
          //  if(d1){
          //    Storage.imgWH2("myAllOrderListC1",0);
          //    clearInterval(time1);
          //  }
          //},1000/60);


            $scope.orderDetailsArr.finish_time=$scope.orderDetailsArr.created_time+86400000;
            $scope.orderFinishTime.push($scope.orderDetailsArr.finish_time/1000);
            $scope.orderTime=Storage.timeSurplus($scope.orderFinishTime)[0];
            var ss1=setInterval(function(){
              var d1=document.getElementById("myAllOrderTime");
              if(d1){
                d1.innerHTML="订单将在"+$scope.orderTime.h+"小时"+$scope.orderTime.m+"分钟"+$scope.orderTime.s+"秒关闭";
                clearInterval(ss1);
              }
            },50);

            console.log($scope.orderTime);



          $scope.ss2=setInterval(function(){
            $scope.orderTime=Storage.timeSurplus($scope.orderFinishTime)[0];
            var d1=document.getElementById("myAllOrderTime");
              d1.innerHTML="订单将在"+$scope.orderTime.h+"小时"+$scope.orderTime.m+"分钟"+$scope.orderTime.s+"秒关闭";
            //console.log($scope.orderTime);
          },1000);

        }, function(){
        })
      })

      //取消订单
      $scope.cancel=function(order_id){
        var hideSheet=$ionicActionSheet.show({
          buttons: [
            { text: '<div class="shanglaColor">确认</div>' },
            { text: '<div class="shanglaColor2">返回</div>' }
          ],
          buttonClicked: function(index) {
            if(index==0){
              orderUpdateOrder.modifyOrderUpdateOrder(order_id,9, function(data){

              }, function(){
              })
              informationWindow.showOk("您已经取消订单");
              $ionicHistory.goBack();
            }
            hideSheet();
          }
        });
      }

      ////取消订单
      //$scope.cancel=function(order_id){
      //
      //  informationWindow.showOk("您已经取消订单");
      //}

      //取消订单
      //$scope.$on('orderUpdateOrder.getorderUpdateOrder',function(){
      //  $scope.orderUpdateOrderArr=orderUpdateOrder.getdata().data;
      //  console.log($scope.orderUpdateOrderArr);
      //})

      //获取所有订单详情
      //$scope.$on('orderDetails.getorderDetails',function(){
      //  $scope.orderDetailsArr=orderDetails.getdata().data;
      //  for(index in $scope.orderDetailsArr.list) {
      //    $scope.orderDetailsArr.list[index].image = imgBaseUrl + $scope.orderDetailsArr.list[index].image
      //  }
      //  console.log($scope.orderDetailsArr);
      //  $ionicLoading.hide();
      //})
      //orderDetails.get($stateParams['order_id']);

      //付款
      $scope.payNow = function() {
        // 显示操作表
        $ionicActionSheet.show({
          buttons: [
            { text: '<div class="shanglaColor2">支付宝支付</div>' },
            { text: '<div class="shanglaColor2">微信支付</div>' },
          ],
          cancelText: '取消',
          buttonClicked: function(index) {
            if (index == 0) {
              //支付宝
              PayEvent.payWithAlipay($scope.orderDetailsArr.order_id, $scope.orderDetailsArr.payable_menoy , function(){
                //支付成功
                $ionicHistory.goBack();
              }, function(){
                //支付失败
              })
            } else {
              //微信
              PayEvent.getPreparePayOrder($scope.orderDetailsArr.order_id, function(data){
                console.log(data)
                PayEvent.payWithWechat(data, function(){
                  //支付成功
                  $ionicHistory.goBack();
                }, function(){
                  //支付失败
                })
              }, function() {
                //获取预支付订单失败
              })
            }
            return true
          }
        });
      }




    })

    //待发货
    .controller('waitDeliverGoodsCtrl',function($scope,ENV,$ionicSlideBoxDelegate,$ionicHistory,$state,orderList, $stateParams,$ionicLoading,Alert,informationWindow,orderRemindDeliverGoods,$ionicActionSheet,Storage,Global) {
      $scope.back = function () {
        if($stateParams['orderEnter']) {
          $ionicHistory.clearHistory()
          $state.go('tab.cart')
        } else{
          $ionicHistory.goBack();
        }
      }
      $scope.jsGo=function(data, order_id){
        $state.go(data, {order_id:order_id});
      }

      $scope.$on('$ionicView.beforeEnter', function() {
        $scope.waitDeliverGoodsFlag=0;
        $scope.pageNo=0;
        $scope.orderListArr=[];
        $scope.loadMoreDataEnable=true;
        Global.removeHistory('tab.waitDeliverGoods');
      })

      $scope.loadMoreData = function() {
        if($scope.loadMoreDataEnable==true){
          getData();
        }else if($scope.loadMoreDataEnable==false){

        }
      };

      function getData() {
        $scope.pageNo++;
        console.log($scope.pageNo);

        orderList.getOrderList(JSON.parse(localStorage.user).userId,2,$scope.pageNo, function(data){
          console.log(data);

          for(i in data.results) {
            for (j in data.results[i].list){
              data.results[i].list[j].image = imgBaseUrl + data.results[i].list[j].image
            }
          }

          for(index in data.results){
            $scope.orderListArr.push(data.results[index]);
          }
          console.log($scope.orderListArr);
          $scope.$broadcast('scroll.infiniteScrollComplete');
          if($scope.pageNo>= data.num_pages){
            $scope.loadMoreDataEnable = false;
          }

          if($scope.orderListArr.length==0){
            //informationWindow.showError("亲，目前还没有待发货的内容哟!");
            $scope.waitDeliverGoodsFlag=1;
          }

        }, function(){
          //informationWindow.showError("亲，目前还没有待发货的内容哟!");
          $scope.waitDeliverGoodsFlag=1;
        })

        console.log($scope.loadMoreDataEnable);
      }

      $scope.remark="";

      $scope.alertInfo=function(order_id){
        var hideSheet=$ionicActionSheet.show({
          buttons: [
            { text: '<div class="shanglaColor">确认</div>' },
            { text: '<div class="shanglaColor2">返回</div>' }
          ],
          buttonClicked: function(index) {
            if(index==0){
              orderRemindDeliverGoods.addOrderRemindDeliverGoods(order_id,JSON.parse(localStorage.user).userId,$scope.remark, function(data){
                $scope.storehouseListArr=data;
                console.log($scope.storehouseListArr);
                informationWindow.showOk("提醒发货信息已发出");
              }, function(){
              })
            }
            hideSheet();
          }
        });
      }

      //获取所有订单
      //$scope.$on('orderList.getorderList',function(){
      //  $scope.orderListArr=orderList.getdata().data;
      //  for(i in $scope.orderListArr) {
      //    for (j in $scope.orderListArr[i].list) {
      //      $scope.orderListArr[i].list[j].image = imgBaseUrl + $scope.orderListArr[i].list[j].image
      //    }
      //  }
      //  console.log($scope.orderListArr);
      //  $ionicLoading.hide();
      //})

      //获取订单商品列表
      //$scope.getGoodsList = function(index) {
      //  return $scope.orderListArr[index].list
      //}

      //orderList.get(JSON.parse(localStorage.user).userId,2);
    })

    //待发货详情
    .controller('waitDeliverGoodsDetailCtrl',function($scope,ENV,$ionicSlideBoxDelegate,$ionicHistory,$state,orderDetails,$stateParams,$ionicLoading,Alert,informationWindow,orderRemindDeliverGoods,$ionicActionSheet,Storage) {
      $scope.back = function () {
        $ionicHistory.goBack();
      }
      $scope.jsGo=function(data){
        $state.go(data, {});
      }

      $scope.jsGoCall=function(){
        LMPlugin.callService({}, function(){

        }, function() {

        })
      }

      $scope.$on('$ionicView.beforeEnter', function() {
        orderDetails.getOrderDetails($stateParams['order_id'], function(data){
          $scope.orderDetailsArr=data;

          for(index in $scope.orderDetailsArr.list) {
            $scope.orderDetailsArr.list[index].image = imgBaseUrl + $scope.orderDetailsArr.list[index].image
          }
          console.log($scope.orderDetailsArr);

          //var time1=setInterval(function(){
          //  var d1=document.getElementsByClassName("myAllOrderListC1");
          //  if(d1){
          //    Storage.imgWH2("myAllOrderListC1",0);
          //    clearInterval(time1);
          //  }
          //},1000/60);
        }, function(){
        })
      })

      $scope.remark="";

      $scope.alertInfo=function(order_id){
        var hideSheet=$ionicActionSheet.show({
          buttons: [
            { text: '<div class="shanglaColor">确认</div>' },
            { text: '<div class="shanglaColor2">返回</div>' }
          ],
          buttonClicked: function(index) {
            if(index==0){
              orderRemindDeliverGoods.addOrderRemindDeliverGoods(order_id,JSON.parse(localStorage.user).userId,$scope.remark, function(data){
                $scope.storehouseListArr=data;
                console.log($scope.storehouseListArr);
                informationWindow.showOk("提醒发货信息已发出");
              }, function(){
              })
            }
            hideSheet();
          }
        });
      }

      //获取所有订单详情
      //$scope.$on('orderDetails.getorderDetails',function(){
      //  $scope.orderDetailsArr=orderDetails.getdata().data;
      //  for(index in $scope.orderDetailsArr.list) {
      //    $scope.orderDetailsArr.list[index].image = imgBaseUrl + $scope.orderDetailsArr.list[index].image
      //  }
      //  console.log($scope.orderDetailsArr);
      //  $ionicLoading.hide();
      //})
      //orderDetails.get($stateParams['order_id']);
    })

    //待收货
    .controller('waitReceiveGoodsCtrl',function($scope,ENV,$ionicSlideBoxDelegate,$ionicHistory,$state,orderList,Alert,informationWindow,orderUpdateOrder, orderEvent,$ionicLoading,$ionicActionSheet,Storage) {
      $scope.back = function () {
        $ionicHistory.goBack();
      }
      $scope.jsGo=function(data, order_id){
        $state.go(data, {order_id:order_id});
      }

      $scope.$on('$ionicView.beforeEnter', function() {
        $scope.waitReceiveGoodsFlag=0;
        $scope.pageNo=0;
        $scope.orderListArr=[];
        $scope.loadMoreDataEnable=true;
      })

      $scope.loadMoreData = function() {
        if($scope.loadMoreDataEnable==true){
          getData();
        }else if($scope.loadMoreDataEnable==false){

        }
      };

      function getData() {
        $scope.pageNo++;
        console.log($scope.pageNo);

        orderList.getOrderList(JSON.parse(localStorage.user).userId,3,$scope.pageNo, function(data){
          console.log(data);

          for(i in data.results) {
            for (j in data.results[i].list){
              data.results[i].list[j].image = imgBaseUrl + data.results[i].list[j].image
            }
          }

          for(index in data.results){
            $scope.orderListArr.push(data.results[index]);
          }
          console.log($scope.orderListArr);
          $scope.$broadcast('scroll.infiniteScrollComplete');
          if($scope.pageNo>= data.num_pages){
            $scope.loadMoreDataEnable = false;
          }

          if($scope.orderListArr.length==0){
            //informationWindow.showError("亲，目前还没有待收货的内容哟!");
            $scope.waitReceiveGoodsFlag=1;
          }

        }, function(){
          //informationWindow.showError("亲，目前还没有待收货的内容哟!");
          $scope.waitReceiveGoodsFlag=1;
        })

        console.log($scope.loadMoreDataEnable);
      }

      //确认收货
      $scope.confirmReceive=function(order_id,index2){
        var hideSheet=$ionicActionSheet.show({
          buttons: [
            { text: '<div class="shanglaColor">确认</div>' },
            { text: '<div class="shanglaColor2">返回</div>' }
          ],
          buttonClicked: function(index) {
            if(index==0){
              orderEvent.confirmReceive(order_id, function(){
                $scope.orderListArr[index2].status=4;
                informationWindow.showOk("您已经确认收货");
              }, function(){
              })
            }
            hideSheet();
          }
        });
      }
    })

    //待收货详情
    .controller('waitReceiveGoodsDetailCtrl',function($scope,ENV,$ionicSlideBoxDelegate,$ionicHistory,$state,orderDetails,Alert,informationWindow,orderUpdateOrder,$stateParams,orderEvent,$ionicLoading,$ionicActionSheet,Storage) {
      $scope.back = function () {
        $ionicHistory.goBack();
      }
      $scope.jsGo=function(data,order_id){
        $state.go(data, {order_id:order_id});
      }

      $scope.jsGoCall=function(){
        LMPlugin.callService({}, function(){

        }, function() {

        })
      }

      $scope.$on('$ionicView.beforeEnter', function() {
        orderDetails.getOrderDetails($stateParams['order_id'], function(data){
          $scope.orderDetailsArr=data;

          for(index in $scope.orderDetailsArr.list) {
            $scope.orderDetailsArr.list[index].image = imgBaseUrl + $scope.orderDetailsArr.list[index].image
          }
          console.log($scope.orderDetailsArr);

          //var time1=setInterval(function(){
          //  var d1=document.getElementsByClassName("myAllOrderListC1");
          //  if(d1){
          //    Storage.imgWH2("myAllOrderListC1",0);
          //    clearInterval(time1);
          //  }
          //},1000/60);
        }, function(){
        })
      })

      //获取所有订单详情
      //$scope.$on('orderDetails.getorderDetails',function(){
      //  $scope.orderDetailsArr=orderDetails.getdata().data;
      //  for(index in $scope.orderDetailsArr.list) {
      //    $scope.orderDetailsArr.list[index].image = imgBaseUrl + $scope.orderDetailsArr.list[index].image
      //  }
      //  console.log($scope.orderDetailsArr);
      //  $ionicLoading.hide();
      //})
      //orderDetails.get($stateParams['order_id']);

      //确认收货
      $scope.confirmGoods=function(order_id){
        var hideSheet=$ionicActionSheet.show({
          buttons: [
            { text: '<div class="shanglaColor">确认</div>' },
            { text: '<div class="shanglaColor2">返回</div>' }
          ],
          buttonClicked: function(index) {
            if(index==0){
              orderEvent.confirmReceive(order_id, function(){
                informationWindow.showOk("您已经确认收货");
                $ionicHistory.goBack();
              }, function(){
              })
            }
            hideSheet();
          }
        });
      }
    })

    //已完成
    .controller('completedCtrl',function($scope,ENV,$ionicSlideBoxDelegate,$ionicHistory,$state,orderList,$ionicLoading,Storage,informationWindow) {
      $scope.back = function () {
        $ionicHistory.goBack();
      }
      $scope.jsGo=function(data, order_id){
        $state.go(data, {order_id:order_id});
      }

      $scope.$on('$ionicView.beforeEnter', function() {
        $scope.completedFlag=0;
        $scope.pageNo=0;
        $scope.orderListArr=[];
        $scope.loadMoreDataEnable=true;
      })

      $scope.loadMoreData = function() {
        if($scope.loadMoreDataEnable==true){
          getData();
        }else if($scope.loadMoreDataEnable==false){

        }
      };

      function getData() {
        $scope.pageNo++;
        console.log($scope.pageNo);

        orderList.getOrderList(JSON.parse(localStorage.user).userId,4,$scope.pageNo, function(data){
          console.log(data);

          for(i in data.results) {
            for (j in data.results[i].list){
              data.results[i].list[j].image = imgBaseUrl + data.results[i].list[j].image
            }
          }

          for(index in data.results){
            $scope.orderListArr.push(data.results[index]);
          }
          console.log($scope.orderListArr);
          $scope.$broadcast('scroll.infiniteScrollComplete');
          if($scope.pageNo>= data.num_pages){
            $scope.loadMoreDataEnable = false;
          }

          if($scope.orderListArr.length==0){
            //informationWindow.showError("亲，目前还没有已完成的内容哟!");
            $scope.completedFlag=1;
          }

        }, function(){
          //informationWindow.showError("亲，目前还没有已完成的内容哟!");
          $scope.completedFlag=1;
        })

        console.log($scope.loadMoreDataEnable);
      }

    })

    //已完成详情
    .controller('completedDetailCtrl',function($scope,ENV,$ionicSlideBoxDelegate,$ionicHistory,$state,orderDetails,$stateParams,$ionicLoading,Storage) {
      $scope.back = function () {
        $ionicHistory.goBack();
      }
      $scope.jsGo=function(data){
        $state.go(data, {});
      }

      $scope.jsGoCall=function(){
        LMPlugin.callService({}, function(){

        }, function() {

        })
      }

      $scope.$on('$ionicView.beforeEnter', function() {
        orderDetails.getOrderDetails($stateParams['order_id'], function(data){
          $scope.orderDetailsArr=data;

          for(index in $scope.orderDetailsArr.list) {
            $scope.orderDetailsArr.list[index].image = imgBaseUrl + $scope.orderDetailsArr.list[index].image
          }
          console.log($scope.orderDetailsArr);

          //var time1=setInterval(function(){
          //  var d1=document.getElementsByClassName("myAllOrderListC1");
          //  if(d1){
          //    Storage.imgWH2("myAllOrderListC1",0);
          //    clearInterval(time1);
          //  }
          //},1000/60);
        }, function(){
        })
      })

      //获取所有订单详情
      //$scope.$on('orderDetails.getorderDetails',function(){
      //  $scope.orderDetailsArr=orderDetails.getdata().data;
      //  for(index in $scope.orderDetailsArr.list) {
      //    $scope.orderDetailsArr.list[index].image = imgBaseUrl + $scope.orderDetailsArr.list[index].image
      //  }
      //  console.log($scope.orderDetailsArr);
      //  $ionicLoading.hide();
      //})
      //orderDetails.get($stateParams['order_id']);
    })

    //我的全部订单
    .controller('myAllOrderCtrl',function($scope,ENV,$ionicSlideBoxDelegate,$ionicHistory,$state,orderList,orderUpdateOrder, Storage, orderEvent,$ionicLoading,Alert,informationWindow,orderRemindDeliverGoods,$ionicActionSheet,PayEvent) {
      $scope.back = function () {
        $ionicHistory.goBack();
      }
      $scope.jsGo=function(data,order_id){
        $state.go(data, {order_id:order_id});
      }
      $scope.$on('$ionicView.beforeEnter', function() {
        $scope.myAllOrderFlag=-1;
        $scope.pageNo=0;
        $scope.orderListArr=[];
        $scope.loadMoreDataEnable=true;

        //getOrderListWithStatus(orderStatusFlag);
        console.log(orderStatusFlag);
        var d1=document.getElementsByClassName("myAllOrderTopThemeC1");
        console.log(d1);
        var num1=d1.length;
        for(var i=0;i<num1;i++){
          d1[i].className="myAllOrderTopThemeC1";
        }
        if(orderStatusFlag==""){
          d1[0].className="myAllOrderTopThemeC1 myAllOrderTopThemeC1Active";
        }else{
          d1[orderStatusFlag].className="myAllOrderTopThemeC1 myAllOrderTopThemeC1Active";
        }
      })

      $scope.loadMoreData = function() {
        if($scope.loadMoreDataEnable==true){
          getData();
          $("#infiniteScrollMyAllOrderId").css({display:"flex"});
        }else if($scope.loadMoreDataEnable==false){
          $("#infiniteScrollMyAllOrderId").css({display:"none"});
        }
      };

      function getData() {
        $scope.pageNo++;
        console.log($scope.pageNo);
        getOrderListWithStatus(orderStatusFlag);


        //orderList.getOrderList(JSON.parse(localStorage.user).userId,4,$scope.pageNo, function(data){
        //  console.log(data);
        //
        //  for(i in data.results) {
        //    for (j in data.results[i].list){
        //      data.results[i].list[j].image = imgBaseUrl + data.results[i].list[j].image
        //    }
        //  }
        //
        //  for(index in data.results){
        //    $scope.orderListArr.push(data.results[index]);
        //  }
        //  console.log($scope.orderListArr);
        //  $scope.$broadcast('scroll.infiniteScrollComplete');
        //  if($scope.pageNo>= data.num_pages){
        //    $scope.loadMoreDataEnable = false;
        //  }
        //
        //  if($scope.orderListArr.length==0){
        //    informationWindow.showError("亲，目前还没有已完成的内容哟!");
        //    $scope.completedFlag=1;
        //  }
        //
        //}, function(){
        //  informationWindow.showError("亲，目前还没有已完成的内容哟!");
        //  $scope.completedFlag=1;
        //})
        //
        //console.log($scope.loadMoreDataEnable);
      }

      //getOrderListWithStatus('')

      //换标题Active
      $scope.checkActive=function(e,num){
        $scope.status = num;
        $scope.pageNo=0;
        $scope.orderListArr=[];
        $scope.loadMoreDataEnable=true;

        //getOrderListWithStatus($scope.status);

        orderStatusFlag=$scope.status;
        getData();


        var d1=document.getElementsByClassName("myAllOrderTopThemeC1");
        var num1=d1.length;
        for(var i=0;i<num1;i++){
          d1[i].className="myAllOrderTopThemeC1";
        }
        e.target.className="myAllOrderTopThemeC1 myAllOrderTopThemeC1Active";
      }

      function getOrderListWithStatus(status) {
        orderList.getOrderList(JSON.parse(localStorage.user).userId,status,$scope.pageNo, function(data){
          console.log(data);
          //$scope.orderListArr=data.results;
          for(i in data.results) {
            for (j in data.results[i].list) {
              data.results[i].list[j].image = imgBaseUrl + data.results[i].list[j].image
            }
          }

          for(index in data.results){
            $scope.orderListArr.push(data.results[index]);
          }
          console.log($scope.orderListArr);
          $scope.$broadcast('scroll.infiniteScrollComplete');
          if($scope.pageNo>= data.num_pages){
            $scope.loadMoreDataEnable = false;
          }

          $scope.myAllOrderFlag=-1;

          if($scope.orderListArr.length==0 && orderStatusFlag==''){
            $scope.myAllOrderFlag=0;
            //informationWindow.showError("亲，目前还没有订单的内容哟!");
          }else if($scope.orderListArr.length==0 && orderStatusFlag==1){
            $scope.myAllOrderFlag=1;
            //informationWindow.showError("亲，目前还没有待付款的内容哟!");
          }else if($scope.orderListArr.length==0 && orderStatusFlag==2){
            $scope.myAllOrderFlag=2;
            //informationWindow.showError("亲，目前还没有待发货的内容哟!");
          }else if($scope.orderListArr.length==0 && orderStatusFlag==3){
            $scope.myAllOrderFlag=3;
            //informationWindow.showError("亲，目前还没有待收货的内容哟!");
          }else if($scope.orderListArr.length==0 && orderStatusFlag==4){
            $scope.myAllOrderFlag=4;
            //informationWindow.showError("亲，目前还没有已完成的内容哟!");
          }
        }, function(){
        })
      }

      //function getOrderListWithStatus(status) {
      //  console.log(status);
      //  var user = Storage.get('user')
      //  orderList.getList(user.userId, status, function(data){
      //    $scope.list = data
      //    console.log(data);
      //    for(i in $scope.list) {
      //      for (j in $scope.list[i].list) {
      //        $scope.list[i].list[j].image = imgBaseUrl + $scope.list[i].list[j].image
      //      }
      //    }
      //    $ionicLoading.hide();
      //  }, function(){
      //
      //  })
      //}

      //付款
      $scope.payNow = function(order_no,payable_menoy,order_id) {
        // 显示操作表
        $ionicActionSheet.show({
          buttons: [
            { text: '<div class="shanglaColor2">支付宝支付</div>' },
            { text: '<div class="shanglaColor2">微信支付</div>' },
          ],
          cancelText: '取消',
          buttonClicked: function(index) {
            if (index == 0) {
              //支付宝
              PayEvent.payWithAlipay(order_id, payable_menoy , function(){
                //支付成功
                //$scope.orderListArr[index2].status=10;
                $scope.pageNo=0;
                $scope.orderListArr=[];
                $scope.loadMoreDataEnable=true;
                getData();
              }, function(){
                //支付失败
              })
            } else {
              //微信
              PayEvent.getPreparePayOrder(order_id, function(data){
                console.log(data)
                PayEvent.payWithWechat(data, function(){
                  //支付成功
                  //$scope.orderListArr[index2].status=10;

                  $scope.pageNo=0;
                  $scope.orderListArr=[];
                  $scope.loadMoreDataEnable=true;
                  getData();
                }, function(){
                  //支付失败
                })
              }, function() {
                //获取预支付订单失败
              })
            }
            return true
          }
        });
      }

      //取消订单
      $scope.cancel=function(order_id,index2){
        var hideSheet=$ionicActionSheet.show({
          buttons: [
            { text: '<div class="shanglaColor">确认</div>' },
            { text: '<div class="shanglaColor2">返回</div>' }
          ],
          buttonClicked: function(index) {
            if(index==0){
              orderUpdateOrder.modifyOrderUpdateOrder(order_id,9, function(data){
                $scope.orderListArr[index2].status=10;
                $scope.pageNo=0;
                $scope.orderListArr=[];
                $scope.loadMoreDataEnable=true;
                getData();
              }, function(){
              })
              informationWindow.showOk("您已经取消订单");
            }
            hideSheet();
          }
        });
      }

      ////取消订单
      //$scope.cancel=function(order_id,index){
      //  getOrderListWithStatus($scope.status)
      //  informationWindow.showOk("您已经取消订单");
      //}

      //确认收货
      $scope.confirmGoods=function(order_id,index2){
        var hideSheet=$ionicActionSheet.show({
          buttons: [
            { text: '<div class="shanglaColor">确认</div>' },
            { text: '<div class="shanglaColor2">返回</div>' }
          ],
          buttonClicked: function(index) {
            if(index==0){
              orderEvent.confirmReceive(order_id, function(){
                informationWindow.showOk("您已经确认收货");
                $scope.orderListArr[index2].status=10;
                $scope.pageNo=0;
                $scope.orderListArr=[];
                $scope.loadMoreDataEnable=true;
                getData();
              }, function(){
              })
            }
            hideSheet();
          }
        });
      }

      $scope.remark="";

      $scope.alertInfo=function(order_id){
        var hideSheet=$ionicActionSheet.show({
          buttons: [
            { text: '<div class="shanglaColor">确认</div>' },
            { text: '<div class="shanglaColor2">返回</div>' }
          ],
          buttonClicked: function(index) {
            if(index==0){
              orderRemindDeliverGoods.addOrderRemindDeliverGoods(order_id,JSON.parse(localStorage.user).userId,$scope.remark, function(data){
                $scope.storehouseListArr=data;
                console.log($scope.storehouseListArr);
                informationWindow.showOk("提醒发货信息已发出");
              }, function(){
              })
            }
            hideSheet();
          }
        });
      }
    })

    //个人资料
    .controller('personalCtrl',function($scope,ENV,$ionicSlideBoxDelegate,$ionicHistory,$state,userUserInfo,userUpdateInfo,Storage,Alert,informationWindow) {
      $scope.user = Storage.get('user');
      $scope.mobileModify=new Object();
      $scope.mobileModify.mobile=$scope.user.mobile.substring(0,3)+"****"+$scope.user.mobile.substring(7,11);
      console.log($scope.user);

      $scope.Focus1=function(){
        keyBoradFlag=1;
      }

      $scope.Blur1=function(){
        keyBoradFlag=0;
      }

      $scope.token="";
      $scope.PlatformFlag="";

      setTimeout(function(){
        LMPlugin.thirdShare({platform:'version'}, function(result){
          $scope.token=result.data.token;
          $scope.PlatformFlag=ionic.Platform.isIOS() ? 'i' : 'o';
        }, function() {

        })
      }, 1000);

      //获取个人信息
      $scope.$on('$ionicView.beforeEnter', function() {
        userUserInfo.getUserUserInfo($scope.user.userId, function(data){
          $scope.userRequireArr=data;
          //$scope.realName=$scope.userRequireArr.realName;
          //$scope.nickName=$scope.userRequireArr.nickName;
          //$scope.mobile=$scope.userRequireArr.mobile;
          $scope.personalImg=new Object();
          if($scope.userRequireArr.pic_url!=null){
            var aa=$scope.userRequireArr.pic_url.substring(0,4);
            if(aa=="http"){
              $scope.personalImg.imgUrl=$scope.userRequireArr.pic_url;
            }else{
              $scope.personalImg.imgUrl=imgBaseUrl+$scope.userRequireArr.pic_url;
            }
          }else if($scope.userRequireArr.pic_url==null){
            $scope.personalImg.imgUrl=" ";
          }

          //$scope.personalImg.imgUrl = imgBaseUrl + $scope.userRequireArr.pic_url;
          var c1=document.getElementById("woman");
          var c2=document.getElementById("man");
          if($scope.userRequireArr.gender=="男"){
            c2.checked=true;
          }else if($scope.userRequireArr.gender=="女"){
            c1.checked=true;
          }

          //user.realName = $scope.userRequireArr.realName
          //user.nickName = $scope.userRequireArr.nickName
          //user.gender = $scope.userRequireArr.gender
          //user.mobile = $scope.userRequireArr.mobile
          //user.avatar = $scope.userRequireArr.avatar

          //Storage.set('user', $scope.user);
          console.log($scope.userRequireArr);

          var si10=setInterval(function(){
            var d1=document.getElementById("personalTopImg");
            if(d1){
              console.log(d1);
              clearInterval(si10);
              d1.src=$scope.personalImg.imgUrl;
            }
          },100);

        }, function(){
        })
      })

      $scope.personalClick=function(e){
        console.log(e.target.parentElement);
        e.target.parentElement.children[0].checked=true;
      }


      //userRequire.get(user.userId);
      //$scope.$on('userRequire.getuserRequire',function(){
      //  $scope.userRequireArr=userRequire.getdata().data;
      //  console.log($scope.userRequireArr);
      //  $scope.realName=$scope.userRequireArr.realName;
      //  $scope.nickName=$scope.userRequireArr.nickName;
      //  $scope.mobile=$scope.userRequireArr.mobile;
      //  $scope.imgUrl = imgBaseUrl + $scope.userRequireArr.avatar
      //  var c1=document.getElementById("woman");
      //  var c2=document.getElementById("man");
      //  if($scope.userRequireArr.gender=="男"){
      //    c2.checked=true;
      //  }else if($scope.userRequireArr.gender=="女"){
      //    c1.checked=true;
      //  }
      //
      //  user.realName = $scope.userRequireArr.realName
      //  user.nickName = $scope.userRequireArr.nickName
      //  user.gender = $scope.userRequireArr.gender
      //  user.mobile = $scope.userRequireArr.mobile
      //  user.avatar = $scope.userRequireArr.avatar
      //  Storage.set('user', user)
      //})


      //修改个人信息
      //$scope.$on('userUpdate.getuserUpdate',function(){
      //  $scope.userUpdateArr=userUpdate.getdata();
      //  console.log($scope.userUpdateArr);
      //})

      $scope.changeRealName = function(name) {
        $scope.userRequireArr.realName=name;
      }

      $scope.changeNickName = function(name) {
        $scope.userRequireArr.nickName=name;
      }

      $scope.ceshi=function(){
        console.log(111);
      }

      $scope.pickImg = function(){

        //选择相册图片
        //console.log(111);
        //$scope.imgUrl = 'http://img05.tooopen.com/images/20141030/sy_73722719517.jpg';
        //return
        LMPlugin.choosePic({imgUrl:baseUrl + 'user/uploadPrint' ,imgName:'imgFile', para:{user_id:$scope.user.userId}},
          function(data){
            //成功
            $scope.personalImg.imgUrl = imgBaseUrl + data.data.url;

            var si10=setInterval(function(){
              var d1=document.getElementById("personalTopImg");
              if(d1){
                console.log(d1);
                clearInterval(si10);
                d1.src=$scope.personalImg.imgUrl;
              }
            },100);


            $scope.user.pic_url=data.data.url;
            Storage.set("user",$scope.user);
          },
          function(error){
            //失败
            informationWindow.showError(error.errorReason)
          })
      }


      //$scope.pickImg=function(){
      //  $scope.imgUrl="http://a2.att.hudong.com/68/74/05300439213381133523747871500.jpg";
      //}


      //保存个人信息
      $scope.back = function () {
        var c1=document.getElementById("woman");
        var c2=document.getElementById("man");
        if(c1.checked==true){
          $scope.userRequireArr.gender=2;
        }else if(c2.checked==true){
          $scope.userRequireArr.gender=1;
        }else{
          $scope.userRequireArr.gender=0;
        }
        //userUpdate.get(localStorage.userId,$scope.realName,$scope.nickName,$scope.gender);
        userUpdateInfo.getUserUpdateInfo($scope.user.userId,$scope.userRequireArr.realName,$scope.userRequireArr.nickName,$scope.userRequireArr.gender,$scope.token,$scope.PlatformFlag, function(data){
          $scope.userUpdateArr=data;
          console.log($scope.userUpdateArr);
        }, function(){
        })
        $ionicHistory.goBack();
      }


    })

    //配送说明
    .controller('distributionDescriptionCtrl',function($scope,ENV,$ionicSlideBoxDelegate,$ionicHistory,$state) {
      $scope.back = function () {
        $ionicHistory.goBack();
      }
    })

    //登录注册
    .controller('loginRegisterCtrl',function($scope,ENV,$ionicSlideBoxDelegate,$ionicHistory,$state,Storage,appVersionList) {
      $scope.$on('$ionicView.beforeEnter', function() {
        $scope.showAll = false;
        var user = Storage.get('user');
        if(user && user.userId) {
          $state.go('tab.home');
          return
        }
        $scope.showAll = true;

        //var aa=new Date().getTime();
        //var bb=1478077747609-1000*60*60*24*5;
        //if(aa>bb){
        //  $scope.loginFlag=1;
        //}else{
        //  $scope.loginFlag=0;
        //}

        appVersionList.getAppVersionList(ionic.Platform.isIOS() ? 'i' : 'o',function(data){
          console.log(data,parseFloat(data.version));
          if (parseFloat(data.version)<2.5) {
            $scope.loginFlag=0;
          }else if(parseFloat(data.version)>=2.5){
            $scope.loginFlag=1;
          }
        })

      })

      $scope.$on('$ionicView.enter', function() {
        setTimeout(function(){
          LMPlugin.thirdShare({platform:'version'}, function(result){
            Storage.set('lvnongVersionResult', result);
          }, function() {

          })
        }, 100);
      })

      $scope.back = function () {
        $ionicHistory.goBack();
      }
      $scope.jsGo=function(data){
        $state.go(data, {});
      }
    })

    //登录
    .controller('loginCtrl',function($scope,ENV,$ionicSlideBoxDelegate,$ionicHistory,$state,UserLogin, Storage, Alert,informationWindow,Cart,$ionicLoading) {
      $scope.back = function () {
        $ionicHistory.goBack();
      }
      $scope.jsGo=function(data){
        $state.go(data, {});
      }


      $scope.$on('$ionicView.beforeEnter', function() {
        $ionicLoading.hide();
        $scope.version=Storage.get('lvnongVersionResult');
        $scope.PlatformFlag=ionic.Platform.isIOS() ? 'i' : 'o';
        $scope.PlatformFlag2 = true;
        if (ionic.Platform.isIOS()) {
          $scope.PlatformFlag2=$scope.version ? ($scope.version.data.wechatInstall ? true : false) : true;
        }
      })



      $scope.Focus1=function(){
        keyBoradFlag=1;
      }

      $scope.Blur1=function(){
        keyBoradFlag=0;
      }

      $scope.phone="";
      $scope.password="";
      $scope.password2="";

      $scope.changePhone=function(phone){
        $scope.phone=phone;
      }

      $scope.changePassword=function(password){
        $scope.password=password;
        $scope.password2=hex_md5(password);
      }

      //用户登录
      //$scope.touch=function(){
      //  console.log(11);
      //  Storage.clickEffect("loginThemeLoginButton");
      //}

      $scope.login = function() {
        Storage.clickEffect("loginThemeLoginButton");

        if($scope.phone!="" && $scope.password!=""){
          UserLogin.login($scope.phone, $scope.password2, function(data){
            console.log(data)
            if (data && data.userId) {
              Storage.set('user', data);
              Storage.remove("cart");
              Cart.getCart(data.userId, function(data2){
                console.log(data2);
                var cartSum=[];
                for(x in data2){
                  console.log(x);
                  var d1=new Object();
                  d1.productId= data2[x].productId;
                  d1.quantity= data2[x].quantity;
                  cartSum.push(d1);
                }
                console.log(cartSum);
                Storage.set("cart",cartSum);
                Storage.resetRedNumberBottom(0);
              }, function(){
              })

              $ionicHistory.clearHistory();
              $state.go('tab.home');
            } else {
              informationWindow.showError('服务器异常')
            }
          }, function(){
          })
        }else{
          informationWindow.showError('有未填写的选项');
        }
      }

      $scope.weichat=function(){
        $ionicLoading.show();
        LMPlugin.thirdShare({platform:'thirdLogin'}, function(result){
          Storage.set("lvnongWeichat",result);
          UserLogin.weichatCheckTellphone(result.data.openId, function(data){
            if(data!=null){
              informationWindow.showOk("登录成功");
              if (data && data.userId) {
                Storage.set('user', data);
                Storage.remove("cart");
                Cart.getCart(data.userId, function(data2){
                  console.log(data2);
                  var cartSum=[];
                  for(x in data2){
                    console.log(x);
                    var d1=new Object();
                    d1.productId= data2[x].productId;
                    d1.quantity= data2[x].quantity;
                    cartSum.push(d1);
                  }
                  console.log(cartSum);
                  Storage.set("cart",cartSum);
                  Storage.resetRedNumberBottom(0);
                }, function(){
                })

                $ionicHistory.clearHistory();
                $state.go('tab.home');
              } else {
                informationWindow.showError('服务器异常')
              }
            }else{
              informationWindow.showOk("没有绑定微信");
              $state.go('weichatLoginPassword', {});
            }
            $ionicLoading.hide();

          }, function(){
            $ionicLoading.hide();
          })

        }, function() {
          $ionicLoading.hide();
        })
      }
    })

    //微信登录设置密码
    .controller('weichatLoginPasswordCtrl',function($scope,ENV,$ionicSlideBoxDelegate,$ionicHistory,$state,UserLogin,Storage,informationWindow,Cart) {
      $scope.back = function () {
        $ionicHistory.goBack();
      }

      $scope.jsGo=function(data){
        $state.go(data, {});
      }

      $scope.PlatformFlag=ionic.Platform.isIOS() ? 'i' : 'o';

      $scope.phone="";
      $scope.code="";
      $scope.password="";
      $scope.password2="";

      $scope.changePhone=function(phone){
        $scope.phone=phone;
      }

      $scope.changeCode=function(code){
        $scope.code=code;
      }

      $scope.changePassword=function(password){
        $scope.password=password;
        $scope.password2=hex_md5(password);
      }

      $scope.requireCode=function(){
        if(weiChatFlag==true){
          UserLogin.getUserGetWeixinMobileCode($scope.phone, function(){
            if(weiChatFlag==true){
              weiChatFlag=false;
              setTimeout(function(){
                weiChatFlag=true;
              },1000*60+1000);
            }
            Storage.clickEffect4("weichatLoginPasswordSumC5");
            informationWindow.showOk('发送成功')
          }, function(data){
            if(data=="账户已存在"){
              informationWindow.showOk('已有账号在已有账号界面绑定');
              $state.go('alreadyAccount', {});
            }
          })
        }else{
          informationWindow.showOk('发送请求间隔太短,请稍后再试');
        }
      }

      $scope.registerUser = function() {
        $scope.version=Storage.get('lvnongVersionResult');
        $scope.weichatIn=Storage.get('lvnongWeichat');
        if($scope.phone!="" && $scope.password!="" && $scope.code!="" && $scope.password.length>=6 && $scope.password.length<=12){
          UserLogin.weichatlogin($scope.weichatIn.data.openId,$scope.weichatIn.data.username,$scope.weichatIn.data.iconURL,$scope.token,$scope.PlatformFlag,$scope.phone, $scope.password2, $scope.code, function(data){
            console.log(data);
            if (data && data.userId) {
              Storage.set('user', data);
              Storage.remove("cart");
              Cart.getCart(data.userId, function(data2){
                console.log(data2);
                var cartSum=[];
                for(x in data2){
                  console.log(x);
                  var d1=new Object();
                  d1.productId= data2[x].productId;
                  d1.quantity= data2[x].quantity;
                  cartSum.push(d1);
                }
                console.log(cartSum);
                Storage.set("cart",cartSum);
                Storage.resetRedNumberBottom(0);
              }, function(){
              })

              $ionicHistory.clearHistory();
              $state.go('tab.home');
            } else {
              informationWindow.showError('服务器异常')
            }
          }, function(){
          })
        }else if($scope.password.length<6 || $scope.password.length>12){
          if($scope.password.length==0){
            informationWindow.showError('有未填写的选项');
          }else{
            informationWindow.showError('密码至少6位,至多12位');
          }
        }else{
          informationWindow.showError('有未填写的选项');
        }
      }

      //UserLogin.weichatlogin(result.data.openId,result.data.username,result.data.iconURL ,$scope.version.data.token,$scope.version.data.PlatformFlag, function(data){
      //
      //}, function(){
      //  $ionicLoading.hide();
      //})

    })

    //已有账号绑定微信
    .controller('alreadyAccountCtrl',function($scope,ENV,$ionicSlideBoxDelegate,$ionicHistory,$state,Storage,UserLogin,Cart,informationWindow) {
      $scope.back = function () {
        $ionicHistory.goBack();
      }

      $scope.jsGo=function(data){
        $state.go(data, {});
      }

      $scope.PlatformFlag=ionic.Platform.isIOS() ? 'i' : 'o';

      $scope.phone="";
      $scope.password="";
      $scope.password2="";

      $scope.changePhone=function(phone){
        $scope.phone=phone;
      }

      $scope.changePassword=function(password){
        $scope.password=password;
        $scope.password2=hex_md5(password);
      }

      $scope.registerUser = function() {
        $scope.weichatIn=Storage.get('lvnongWeichat');
        if($scope.phone!="" && $scope.password!="" && $scope.password.length>=6 && $scope.password.length<=12){
          UserLogin.addUserWeixinBinding($scope.weichatIn.data.openId,$scope.weichatIn.data.username,$scope.weichatIn.data.iconURL,$scope.phone, $scope.password2, function(data){
            console.log(data);
            if (data && data.userId) {
              Storage.set('user', data);
              Storage.remove("cart");
              Cart.getCart(data.userId, function(data2){
                console.log(data2);
                var cartSum=[];
                for(x in data2){
                  console.log(x);
                  var d1=new Object();
                  d1.productId= data2[x].productId;
                  d1.quantity= data2[x].quantity;
                  cartSum.push(d1);
                }
                console.log(cartSum);
                Storage.set("cart",cartSum);
                Storage.resetRedNumberBottom(0);
              }, function(){
              })

              $ionicHistory.clearHistory();
              $state.go('tab.home');
            } else {
              informationWindow.showError('服务器异常')
            }
          }, function(){
          })
        }else if($scope.password.length<6 || $scope.password.length>12){
          if($scope.password.length==0){
            informationWindow.showError('有未填写的选项');
          }else{
            informationWindow.showError('密码至少6位,至多12位');
          }
        }else{
          informationWindow.showError('有未填写的选项');
        }
      }
    })

    //微信忘记密码
    .controller('weichatForgetCtrl',function($scope,ENV,$ionicSlideBoxDelegate,$ionicHistory,$state,orderSelectLogisticsInfo,$stateParams,informationWindow,UserLogin,ForgetPassword,Storage) {
      $scope.back = function () {
        $ionicHistory.goBack();
      }

      $scope.jsGo=function(data){
        $state.go(data, {});
      }

      $scope.PlatformFlag=ionic.Platform.isIOS() ? 'i' : 'o';

      $scope.phone="";
      $scope.code="";
      $scope.password="";
      $scope.password2="";

      $scope.changePhone=function(phone){
        $scope.phone=phone;
      }

      $scope.changeCode=function(code){
        $scope.code=code;
      }

      $scope.changePassword=function(password){
        $scope.password=password;
        $scope.password2=hex_md5(password);
      }

      $scope.requireCode=function(){
        if(registerFlag==true) {
          ForgetPassword.getSmsCode($scope.phone, function () {
            if (registerFlag == true) {
              registerFlag = false;
              setTimeout(function () {
                registerFlag = true;
              }, 1000*60 + 1000);
            }
            Storage.clickEffect4("weichatLoginPasswordSumC5");
            informationWindow.showOk('发送成功')
          }, function () {
          })
        }else{
          informationWindow.showOk('发送请求间隔太短,请稍后再试');
        }
      }

      $scope.resetPassword = function() {
        //Storage.clickEffect("registerThemeLoginButton");
        if($scope.phone!="" && $scope.password!="" && $scope.code!="" && $scope.password.length>=6 && $scope.password.length<=12){
          ForgetPassword.resetPassword($scope.phone, $scope.code, $scope.password2, function(){
            informationWindow.showOk("修改密码成功");
            $ionicHistory.goBack();
          }, function(){
          })
        }else if($scope.password){
          if($scope.password.length<6 || $scope.password.length>12){
            informationWindow.showError('密码至少6位,至多12位');
          }
        }else{
          informationWindow.showError('有未填写的选项');
        }
      }



    })

    //注册
    .controller('registerCtrl',function($scope,ENV,$ionicSlideBoxDelegate,$ionicHistory,$state, Register,Alert,informationWindow,Storage,Cart) {
      $scope.back = function () {
        $ionicHistory.goBack();
      }
      $scope.jsGo=function(data){
        $state.go(data, {});
      }

      $scope.$on('$ionicView.beforeEnter', function() {
        $scope.registerAgreeFlag=true;
      })

      $scope.resigterAgree=function(){
        $scope.registerAgreeFlag=!$scope.registerAgreeFlag;
      }

      $scope.resigterScan=function(){
        $state.go('tab.userAgreement', {});
      }

      $scope.Focus1=function(){
        keyBoradFlag=1;
      }

      $scope.Blur1=function(){
        keyBoradFlag=0;
      }

      setTimeout(function(){
        LMPlugin.thirdShare({platform:'version'}, function(result){
          $scope.token=result.data.token;
          $scope.PlatformFlag=ionic.Platform.isIOS() ? 'i' : 'o';
        }, function() {

        })
      }, 1000);

      $scope.phone="";
      $scope.code="";
      $scope.password="";
      $scope.password2="";
      $scope.token="";
      $scope.PlatformFlag="";

      $scope.changePhone=function(phone){
        $scope.phone=phone;
      }

      $scope.changePassword=function(password){
        $scope.password=password;
        $scope.password2=hex_md5(password);
      }

      $scope.changeCode=function(code){
        $scope.code=code;
      }

      $scope.getSmsCode=function() {
        if(registerFlag==true){
          Register.getSmsCode($scope.phone, function(){
            if(registerFlag==true){
              registerFlag=false;
              setTimeout(function(){
                registerFlag=true;
              },1000*60+1000);
            }
            Storage.clickEffect2("registerThemeList3");
            informationWindow.showOk('发送成功')
          }, function(){
          })
        }else{
          informationWindow.showOk('发送请求间隔太短,请稍后再试');
        }
      }


      $scope.registerUser = function() {
        Storage.clickEffect("registerThemeLoginButton");

        if($scope.phone!="" && $scope.password!="" && $scope.code!="" && $scope.password.length>=6 && $scope.password.length<=12 && $scope.registerAgreeFlag==true){
          Register.registerUser($scope.phone, $scope.password2, $scope.code,$scope.token,$scope.PlatformFlag, function(data){
            console.log(data);
            if (data && data.userId) {
              Storage.set('user', data);
              Storage.remove("cart");
              Cart.getCart(data.userId, function(data2){
                console.log(data2);
                var cartSum=[];
                for(x in data2){
                  console.log(x);
                  var d1=new Object();
                  d1.productId= data2[x].productId;
                  d1.quantity= data2[x].quantity;
                  cartSum.push(d1);
                }
                console.log(cartSum);
                Storage.set("cart",cartSum);
                Storage.resetRedNumberBottom(0);
              }, function(){
              })

              $ionicHistory.clearHistory();
              $state.go('tab.home');
            } else {
              informationWindow.showError('服务器异常')
            }
          }, function(){
          })
        }else if($scope.password.length<6 || $scope.password.length>12){
          if($scope.password.length==0){
            informationWindow.showError('有未填写的选项或未勾选用户协议');
          }else{
            informationWindow.showError('密码至少6位,至多12位');
          }
        }else{
          informationWindow.showError('有未填写的选项或未勾选用户协议');
        }
      }
    })

    //忘记密码
    .controller('forgetCtrl',function($scope,ENV,$ionicSlideBoxDelegate,$ionicHistory,$state,ForgetPassword,Alert,informationWindow,Storage) {
      $scope.back = function () {
        $ionicHistory.goBack();
      }

      $scope.jsGo=function(data){
        $state.go(data, {});
      }

      $scope.Focus1=function(){
        keyBoradFlag=1;
      }

      $scope.Blur1=function(){
        keyBoradFlag=0;
      }

      $scope.phone="";
      $scope.code="";
      $scope.password="";
      $scope.password2="";

      $scope.changePhone=function(phone){
        $scope.phone=phone;
      }

      $scope.changePassword=function(password){
        $scope.password=password;
        $scope.password2=hex_md5(password);
      }

      $scope.changeCode=function(code){
        $scope.code=code;
      }

      $scope.getSmsCode=function(){
        if(registerFlag==true) {
          ForgetPassword.getSmsCode($scope.phone, function () {
            if (registerFlag == true) {
              registerFlag = false;
              setTimeout(function () {
                registerFlag = true;
              }, 1000*60 + 1000);
            }
            Storage.clickEffect2("forgetThemeList3");
            informationWindow.showOk('发送成功')
          }, function () {
          })
        }else{
          informationWindow.showOk('发送请求间隔太短,请稍后再试');
        }
      }

      $scope.resetPassword = function() {
        Storage.clickEffect("registerThemeLoginButton");
        if($scope.phone!="" && $scope.password!="" && $scope.code!="" && $scope.password.length>=6 && $scope.password.length<=12){
          ForgetPassword.resetPassword($scope.phone, $scope.code, $scope.password2, function(){
            informationWindow.showOk("修改密码成功");
            $ionicHistory.goBack();
          }, function(){
          })
        }else if($scope.password){
          if($scope.password.length<6 || $scope.password.length>12){
            informationWindow.showError('密码至少6位,至多12位');
          }
        }else{
          informationWindow.showError('有未填写的选项');
        }
      }
    })

    //查看物流
    .controller('logisticsCtrl',function($scope,ENV,$ionicSlideBoxDelegate,$ionicHistory,$state,orderSelectLogisticsInfo,$stateParams) {
      $scope.back = function () {
        $ionicHistory.goBack();
      }

      $scope.jsGo=function(data){
        $state.go(data, {});
      }

      $scope.$on('$ionicView.beforeEnter', function() {
        orderSelectLogisticsInfo.getOrderSelectLogisticsInfo($stateParams['order_id'], function(data){
          $scope.orderSelectLogisticsInfoArr=data;
          console.log($scope.orderSelectLogisticsInfoArr);
        }, function(){
        })
      })
    })

    //农场预约
    .controller('farmBespeakCtrl',function($scope,ENV,$ionicSlideBoxDelegate,$ionicHistory,$state,Storage,Alert,informationWindow,bespeakvisit,$stateParams) {
      $scope.back = function () {
        $ionicHistory.goBack();
      }
      //$scope.jsGo=function(data){
      //  Storage.clickEffect("farmDetailBespeakButton");
      //  //$ionicHistory.goBack();
      //}
      $scope.requireCode=function(){
        if(FarmOrderFlag==true){
          bespeakvisit.getBespeakvisitGetBespeakVisitCode($scope.mobile, function(){
            if(FarmOrderFlag==true){
              FarmOrderFlag=false;
              setTimeout(function(){
                FarmOrderFlag=true;
              },1000*60+1000);
            }
            Storage.clickEffect2("farmBespeakListC7");
            informationWindow.showOk('发送成功')
          }, function(){
          })
        }else{
          informationWindow.showOk('发送请求间隔太短,请稍后再试');
        }
      }

      $scope.visit_namel="";
      $scope.visit_count="";
      $scope.mobile="";
      $scope.code="";
      $scope.visit_time="";
      $scope.mode=" ";

      $scope.changeVisit_namel=function(visit_namel){
        $scope.visit_namel=visit_namel;
      }

      $scope.changeVisit_count=function(visit_count){
        $scope.visit_count=visit_count;
      }

      $scope.changeMobile=function(mobile){
        $scope.mobile=mobile;
      }

      $scope.changeCode=function(code){
        $scope.code=code;
      }

      //$scope.changeVisit_time=function(e){
      //  $scope.visit_time=e.target.value;
      //}

      $scope.selectedDate = function(e) {
        LMPlugin.chooseDate({}, function(date){
          //Alert.showOk(date.data)
          //$scope.visit_time = date.data
          e.target.value= date.data;
          $scope.visit_time=date.data;
        }, function() {

        })
      }

      //$scope.changeMode=function(mode){
      //  $scope.mode=mode;
      //}

      $scope.personalClick=function(e,mode){
        console.log(e.target.parentElement);
        e.target.parentElement.children[0].checked=true;
        $scope.mode=mode;
      }

      $scope.submit=function(){
        Storage.clickEffect("farmDetailBespeakButton");
        console.log($scope.visit_namel);
        console.log($scope.visit_count);
        console.log($scope.mobile);
        console.log($scope.code);
        console.log($scope.visit_time);
        console.log($scope.mode);

        if($scope.visit_namel=="" || $scope.visit_count=="" || $scope.mobile=="" || $scope.code=="" || $scope.visit_time=="" || $scope.mode==""){
          informationWindow.showError("还有未填写的选项");
        }else{
          bespeakvisit.addBespeakvisitAddBespeakVisit($stateParams['farmId'],$scope.visit_namel,$scope.visit_count,$scope.mobile,$scope.code,$scope.visit_time,$scope.mode, function(){
            $ionicHistory.goBack();
            informationWindow.showOk("申请已提交");
          }, function(){
          })
        }
      }

    })

    //引导
    .controller('startCtrl',function($scope,ENV,$ionicSlideBoxDelegate,$ionicHistory,$state,Storage,appVersionList) {
      $scope.$on('$ionicView.beforeEnter', function() {
        var aa=Storage.get("lvnongFlag");
        var user = Storage.get('user');
        console.log(user);
        console.log(aa);
        if(aa==null || aa.Flag==0){
          var aa=new Object();
          aa.Flag=0;
          Storage.set("lvnongFlag",aa);
          $scope.showAllStart=true;
        }else if(aa.Flag==1 && user==null){
          $state.go("loginRegister", {});
          $scope.showAllStart=false;
        }else if(aa.Flag==1 && user!=null){
          $state.go("tab.home", {});
          $scope.showAllStart=false;
        }

        //var aa=new Date().getTime();
        //var bb=1478077747609-1000*60*60*24*5;
        //if(aa>bb){
        //  $scope.loginFlag=1;
        //}else{
        //  $scope.loginFlag=0;
        //}

        appVersionList.getAppVersionList(ionic.Platform.isIOS() ? 'i' : 'o',function(data){
          console.log(data,parseFloat(data.version));
          if (parseFloat(data.version)<2.5) {
            $scope.loginFlag=0;
          }else if(parseFloat(data.version)>=2.5){
            $scope.loginFlag=1;
          }
        })

      })

      $scope.$on('$ionicView.enter', function() {
        setTimeout(function(){
          LMPlugin.thirdShare({platform:'version'}, function(result){
            Storage.set('lvnongVersionResult', result);
          }, function() {

          })
        }, 100);
      })


      $scope.back = function () {
        $ionicHistory.goBack();
      }
      $scope.jsGo=function(data){
        $state.go(data, {});
        var aa=Storage.get("lvnongFlag");
        aa.Flag=1;
        Storage.set("lvnongFlag",aa);
      }


    })

    //3级商品列表
  .controller('threeListGoodsCtrl',function($scope,ENV,$ionicSlideBoxDelegate,$ionicHistory,$state,Storage,$stateParams,productList,informationWindow,CartStorage) {
    $scope.$on('$ionicView.beforeEnter', function() {
      $scope.threeId = $stateParams['threeId'];
      $scope.name = $stateParams['name'];
      $scope.listNo=6;
      $scope.pageNo=0;
      console.log($scope.threeId,$scope.name);
      $scope.loadMoreDataEnable = true;
    })

    $scope.storehouseListArr=[];

    $scope.user=Storage.get('user');
    $scope.userImg=imgBaseUrl+$scope.user.pic_url;

    //$scope.$on('$ionicView.enter', function() {
    //  $scope.loadMoreData();
    //})

    $scope.loadMoreData = function() {
      if($scope.loadMoreDataEnable==true){
        getData();
      }else if($scope.loadMoreDataEnable==false){

      }
    };

    function getData() {

      $scope.pageNo++;
      console.log($scope.pageNo);

      productList.getProductList($scope.threeId,$scope.listNo,$scope.pageNo, function(data){
        for (index in data.results) {
          data.results[index].image = imgBaseUrl + data.results[index].image;
        }
        console.log(data);

        for(index in data.results){
          if(data.results[index].status==0 || data.results[index].status==1){
            $scope.storehouseListArr.push(data.results[index]);
          }
        }

        $scope.goodsIds="";
        for(index in $scope.storehouseListArr){
          $scope.goodsIds=$scope.goodsIds+$scope.storehouseListArr[index].id+",";
        }
        $scope.goodsIds.substring(0,$scope.goodsIds.length-1);

        productList.getProductGetMinPrice($scope.goodsIds,function(data5){
          $scope.storehouseListArr=Storage.changeMinPrice($scope.storehouseListArr,data5);
        });

        //$scope.storehouseListArr=data.results;

        console.log($scope.storehouseListArr);

        $scope.$broadcast('scroll.infiniteScrollComplete');
        if($scope.pageNo>= data.num_pages){
          $scope.loadMoreDataEnable = false;
        }
      }, function(){
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $scope.loadMoreDataEnable = false;
      })

      console.log($scope.loadMoreDataEnable);
    }

    //productList.getProductList($scope.threeId,$scope.listNo,$scope.pageNo, function(data){
    //  console.log(data);
    //  $scope.storehouseListArr=data.results;
    //  for (index in $scope.storehouseListArr) {
    //    $scope.storehouseListArr[index].image = imgBaseUrl + $scope.storehouseListArr[index].image;
    //  }
    //  console.log($scope.storehouseListArr);
    //}, function(){
    //})

    $scope.back = function () {
      $ionicHistory.goBack();
    }
    $scope.jsGo=function(data,x){
      $state.go(data, {good_id: x.id});
    }

    $scope.addCart=function(e, index){
      Storage.clickEffect3(e.target,"presellAddCart");
      CartStorage.addCartWithGood($scope.storehouseListArr[index]);
      informationWindow.showThree("该商品已加入购物车");
    }
  })
