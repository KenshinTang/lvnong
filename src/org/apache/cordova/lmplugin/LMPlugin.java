package org.apache.cordova.lmplugin;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.Message;
import android.provider.MediaStore;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.text.TextUtils;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.WindowManager;
import android.webkit.MimeTypeMap;
import android.widget.PopupWindow;
import android.widget.TextView;
import android.widget.Toast;

import com.alipay.sdk.app.PayTask;
import com.baidu.location.BDLocation;
import com.baidu.location.BDLocationListener;
import com.baidu.location.LocationClient;
import com.bruce.pickerview.popwindow.DatePickerPopWin;
import com.lidroid.xutils.HttpUtils;
import com.lidroid.xutils.exception.HttpException;
import com.lidroid.xutils.http.RequestParams;
import com.lidroid.xutils.http.ResponseInfo;
import com.lidroid.xutils.http.callback.RequestCallBack;
import com.lidroid.xutils.http.client.HttpRequest;
import com.lljjcoder.citypickerview.widget.CityPickerView;
import com.qiyukf.unicorn.api.ConsultSource;
import com.qiyukf.unicorn.api.Unicorn;
import com.tencent.mm.sdk.modelpay.PayReq;
import com.tencent.mm.sdk.openapi.IWXAPI;
import com.tencent.mm.sdk.openapi.WXAPIFactory;
import com.umeng.analytics.MobclickAgent;
import com.umeng.message.UmengRegistrar;
import com.yl.lvnong.PayResult;
import com.yl.lvnong.R;
import com.yl.lvnong.SignUtils;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Random;

import cn.sharesdk.framework.Platform;
import cn.sharesdk.framework.PlatformActionListener;
import cn.sharesdk.framework.ShareSDK;
import cn.sharesdk.onekeyshare.OnekeyShare;
import cn.sharesdk.wechat.friends.Wechat;

public class LMPlugin extends CordovaPlugin implements PlatformActionListener,Handler.Callback {

  protected CallbackContext currentCallbackContext;
  public static LMPlugin instance = null;
  private static final int SDK_PAY_FLAG = 1;
  private String errorObj = "{\"errorReason\":\"未知错误\"}";
  private String upload_img_url;

  /**
   * 请求类型 1：拍照；2：相册；3：裁剪
   */
  private final int TAKE_TYPE = 1;
  private final int ALBUM_TYPE = 2;
  private final int CROP_TYPE = 3;
  private final int MY_PERMISSIONS_REQUEST_CAMERA_CODE = 4;
  private final int MY_PERMISSIONS_REQUEST_STORAGE_CODE = 5;
  private Bitmap head;//头像Bitmap
  private static String path = "/sdcard/myHead/";//sd路径
  private String filePath = "";
  private String userId;
  private PopupWindow window;
  private LocationClient mLocationClient = null;

  private Handler handler;

  public CallbackContext getCurrentCallbackContext() {
    return currentCallbackContext;
  }
  public void setCurrentCallbackContext(CallbackContext callbackContext){
    this.currentCallbackContext = callbackContext;
  }

  @Override
  public void initialize(CordovaInterface cordova, CordovaWebView webView) {
    super.initialize(cordova, webView);
    instance = this;
  }


  private Handler mHandler = new Handler() {
    @SuppressWarnings("unused")
    public void handleMessage(Message msg) {
      PayResult payResults = new PayResult((String) msg.obj);
      switch (msg.what) {
        case SDK_PAY_FLAG: {
          PayResult payResult = new PayResult((String) msg.obj);
          /**
           * 同步返回的结果必须放置到服务端进行验证（验证的规则请看https://doc.open.alipay.com/doc2/
           * detail.htm?spm=0.0.0.0.xdvAU6&treeId=59&articleId=103665&
           * docType=1) 建议商户依赖异步通知
           */
          String resultInfo = payResult.getResult();// 同步返回需要验证的信息

          String resultStatus = payResult.getResultStatus();
          // 判断resultStatus 为“9000”则代表支付成功，具体状态码代表含义可参考接口文档
          if (TextUtils.equals(resultStatus, "9000")) {
            try {
              JSONObject r = new JSONObject();
              JSONObject jb1 = new JSONObject();
              jb1.put("datas","success");
              r.put("data",jb1);
              getCurrentCallbackContext().success(r);
            }catch (Exception e){

            }
          } else {
            // 判断resultStatus 为非"9000"则代表可能支付失败
            // "8000"代表支付结果因为支付渠道原因或者系统原因还在等待支付结果确认，最终交易是否成功以服务端异步通知为准（小概率状态）
            if (TextUtils.equals(resultStatus, "8000")) {

            } else {
              try{
                JSONObject jb = new JSONObject();
                jb.put("errorReason","支付失败");
                getCurrentCallbackContext().error(jb);
              }catch (Exception e){
              }
              // 其他值就可以判断为支付失败，包括用户主动取消支付，或者系统返回的错误
//              LMPlugin.instance.getCurrentCallbackContext().error(errorObj);
            }
          }
          break;
        }
        default:
          break;
      }
    };
  };
  private void startLocation(){
    Toast.makeText(cordova.getActivity(),"正在获取当前位置...",Toast.LENGTH_SHORT).show();
    // 声明LocationClient类
    mLocationClient = new LocationClient(cordova.getActivity());
    // 注册监听函数
    mLocationClient.registerLocationListener(new BDLocationListener() {
      //1.接收异步返回的定位结果，参数是BDLocation类型参数。
      @Override
      public void onReceiveLocation(BDLocation bdLocation) {
        String lat = String.valueOf(bdLocation.getLatitude());
        String lng = String.valueOf(bdLocation.getLongitude());
        if(lat.equals("") || lng.equals("")){
          //定位失败
        }else{
          //定位成功
//          Toast.makeText(cordova.getActivity(),"经度："+lat+"纬度："+lng,Toast.LENGTH_LONG).show();
          try {
            JSONObject r = new JSONObject();
            JSONObject jb1 = new JSONObject();
            jb1.put("lat",lat);
            jb1.put("long",lng);
            r.put("data",jb1);
            getCurrentCallbackContext().success(r);
          }catch (Exception e){

          }
        }
      }
    });
    mLocationClient.start();
  }

  private static PackageInfo getPackageInfo(Context context) {
    PackageInfo pi = null;

    try {
      PackageManager pm = context.getPackageManager();
      pi = pm.getPackageInfo(context.getPackageName(),
              PackageManager.GET_CONFIGURATIONS);

      return pi;
    } catch (Exception e) {
      e.printStackTrace();
    }

    return pi;
  }

  private void authorize(Platform plat) {
    if(plat.isValid()) {
      String userId = plat.getDb().getUserId();
      if (!TextUtils.isEmpty(userId)) {
        plat.removeAccount(true);
      }
    }
    plat.setPlatformActionListener(this);
    plat.SSOSetting(false);
    plat.showUser(null);
  }


  //授权取消
  @Override
  public void onCancel(Platform plat, int action) {

    handler.sendEmptyMessage(3);

  }
  //授权成功
  @Override
  public void onComplete(Platform plat,int action, HashMap<String, Object> map) {

    Message msg = new Message();
    msg.what = 1;
    msg.obj = new Object[] {plat.getDb().getUserId(), map};
    handler.sendMessage(msg);

  }
  //授权失败
  @Override
  public void onError(Platform plat, int action, Throwable throwable) {

    Message msg = new Message();
    msg.obj = throwable;
    msg.what = 2;
    handler.sendMessage(msg);

  }

  @Override
  public boolean handleMessage(Message msg) {
    switch (msg.what) {
      case 3:
        //授权取消
        try{
          JSONObject jb = new JSONObject();
          jb.put("errorReason","授权取消");
          LMPlugin.instance.getCurrentCallbackContext().error(jb);
        }catch (Exception e){
        }
        break;
      case 2:
        //授权取消
        try{
          JSONObject jb = new JSONObject();
          jb.put("errorReason","授权失败");
          LMPlugin.instance.getCurrentCallbackContext().error(jb);
        }catch (Exception e){
        }
        break;
      case 1:
        Object[] objs = (Object[]) msg.obj;
        HashMap<String, Object> res = (HashMap<String, Object>) objs[1];
        String openId = (String) objs[0];
        String userName = res.get("nickname").toString();//ID
        String hearUrl = res.get("headimgurl").toString();//ID
//        Toast.makeText(cordova.getActivity(), "openId:"+openId+"userName:"+userName+"hearUrl:"+hearUrl, Toast.LENGTH_SHORT).show();
        try {
          JSONObject all = new JSONObject();
          JSONObject data = new JSONObject();

          data.put("openId",openId);
          data.put("username",userName);
          data.put("iconURL",hearUrl);

          all.put("data",data);
          currentCallbackContext.success(all);
        } catch (Exception e) {
          e.printStackTrace();
        }
        break;


    }
    return false;
  }

  public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
    setCurrentCallbackContext(callbackContext);
    handler = new Handler(this);
    if ("ThirdShare".equals(action)) {
//      LoginUtils.getInstance(cordova.getActivity(),mCallbackContext).qqLogin();

      //构建返回参数
//            JSONObject r = new JSONObject();
      //成功回调－－{"data":{}}
//            callbackContext.success(r);
      //失败回调－－{"errorReason":"未知错误"}
//            callbackContext.error(r);
//      [{"platform":"all","para":{"shareUrl":"http:\/\/120.26.95.163:8080\/lvnong\/www\/index.html#\/shareGoods\/24"}}]
      try {
        JSONObject jb = args.getJSONObject(0);
        if("version".equals(jb.getString("platform"))){
          try{
            JSONObject resultJs = new JSONObject();
            String versionName = getPackageInfo(cordova.getActivity()).versionName;
            int versionCode = getPackageInfo(cordova.getActivity()).versionCode;
            String token = UmengRegistrar.getRegistrationId(cordova.getActivity());
            resultJs.put("version",versionName);
            resultJs.put("platform","android");
            resultJs.put("token",token);
            JSONObject jbbbb = new JSONObject();
            jbbbb.put("data",resultJs);
            getCurrentCallbackContext().success(jbbbb);
          }catch (Exception e){}
        }else if ("registerEvent".equals(jb.getString("platform"))){
          MobclickAgent.onEvent(cordova.getActivity(),jb.getString("eventName"));
        } else if("location".equals(jb.getString("platform"))){
          startLocation();
        }else if("openUrl".equals(jb.getString("platform"))){
          String loadUrl = jb.getString("para");
          Intent intent = new Intent(Intent.ACTION_VIEW);
          intent.setData(Uri.parse(loadUrl));
          cordova.getActivity().startActivity(intent);
        }else if ("thirdLogin".equals(jb.getString("platform"))){
          authorize(new Wechat(cordova.getActivity()));
        }else{
          JSONObject jbb = jb.getJSONObject("para");
          String shareUrl = jbb.getString("shareUrl");
          showShare(callbackContext,shareUrl);
        }

      }catch (Exception e){}
    }
    else if ("GetLocation".equals(action)){
      startLocation();
    }else if ("ChooseLocation".equals(action)){
      CityPickerView cityPickerView=new CityPickerView(cordova.getActivity());
      cityPickerView.show();
      cityPickerView.setOnCityItemClickListener(new CityPickerView.OnCityItemClickListener() {
        @Override
        public void onSelected(String... citySelected) {
//          tvResult.setText("选择结果：\n省："+citySelected[0]+"\n市："+citySelected[1]+"\n区："+citySelected[2]+"\n邮编："+citySelected[3]);
//          Toast.makeText(cordova.getActivity(),citySelected[0]+citySelected[1]+citySelected[2],Toast.LENGTH_LONG).show();
          try {
            JSONObject r = new JSONObject();
            JSONObject jb1 = new JSONObject();
            jb1.put("province",citySelected[0]);
            jb1.put("city",citySelected[1]);
            jb1.put("district",citySelected[2]);
            r.put("data",jb1);
            getCurrentCallbackContext().success(r);
          }catch (Exception e){

          }
//          {data:{province:"asdasd", city:"dasdas", district:"asdasds"}}

        }
      });
    }else if ("ChooseDate".equals(action)){
      selectDate();
    }else if ("ChoosePic".equals(action)){

      //[{"imgUrl":"","imgName":"","para":{"a":"a"}}]

      //[{"imgUrl":"http:\/\/112.74.66.98:19080\/lvnong\/mobile\/user\/uploadPrint",
      // "imgName":"imgFile",
      // "para":{"user_id":24}}]

      JSONObject jb = args.getJSONObject(0);
      upload_img_url = jb.getString("imgUrl");
      JSONObject jb2 = jb.getJSONObject("para");
      userId = jb2.getString("user_id");
      showPopupWindow();
//      takePhoto();

//      Intent takeIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
//      takeIntent.putExtra(MediaStore.EXTRA_OUTPUT, Uri.fromFile(new File(Environment.getExternalStorageDirectory(),
//        "head.jpg")));
//      startActivityForResult(takeIntent, TAKE_TYPE);

//      Intent pickIntent = new Intent(Intent.ACTION_PICK, null);
//      pickIntent.setDataAndType(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, "image/*");
//      cordova.startActivityForResult((LMPlugin)this,pickIntent,8);

    } else if ("CallService".equals(action)) {
      showCall(callbackContext);
    } else if ("QiYuService".equals(action)) {
      //[{"title":"七鱼金融","urlString":"https:\/\/8.163.com\/","sessionTitle":"七鱼金融"}]
      try {
        JSONObject jb = args.getJSONObject(0);
        showQiYuService(jb.getString("title"), jb.getString("urlString"), jb.getString("sessionTitle"), callbackContext);
      } catch (Exception e) {
      }
    } else if ("Pay".equals(action)) {
      JSONObject jb = args.getJSONObject(0);
      String type = jb.getString("platform");
      if(type.equals("alipay")){
        final String jb2 = jb.getString("para");
        Runnable payRunnable = new Runnable() {
          @Override
          public void run() {
            PayTask alipay = new PayTask(cordova.getActivity());
            String result = alipay.pay(jb2,true);
            Message msg = new Message();
            msg.what = SDK_PAY_FLAG;
            msg.obj = result;
            mHandler.sendMessage(msg);
          }
        };
        Thread payThread = new Thread(payRunnable);
        payThread.start();

      }else if (type.equals("wechatpay")){

        //[{"platform":"wechatpay",
        // "para":{"package":"Sign=WXPay",
        //          "appid":"wxfbd3f435afc28be1",
        //            "sign":"809991C957D5AF405B78B10F2D540DA2",
        //            "partnerid":"1297716501",
        //              "prepayid":null,
        //              "noncestr":"r6f480cm5iuaztgdabg0bjb2sy6egym8",
        //                "timestamp":1466497931}}]
//        {"platform":"wechatpay",
//                "para":{"package":"Sign=WXPay",
//                "appid":"wxda6a63de5500e7d2",
//                "sign":"ED24E1F9DA8DBA7D8CFCD2C9F439498E",
//                "partnerid":"1372588302",
//                "prepayid":"wx201608191904113b825079660459722358",
//                "noncestr":"eqf6hm3cluacblgdiwyiga8ctefhg848","timestamp":1471604651}}
        JSONObject jbb = jb.getJSONObject("para");
        String app_id = jbb.getString("appid");
        IWXAPI iwxapi = WXAPIFactory.createWXAPI(cordova.getActivity(), app_id);
        iwxapi.registerApp(app_id);
        PayReq payRequest = new PayReq();
        payRequest.appId = app_id;
        payRequest.partnerId = jbb.getString("partnerid");
        payRequest.prepayId = jbb.getString("prepayid");
        payRequest.nonceStr = jbb.getString("noncestr");
        payRequest.timeStamp = jbb.getString("timestamp");
        payRequest.sign = jbb.getString("sign");
        payRequest.packageValue = jbb.getString("package");
        //发起请求
        iwxapi.sendReq(payRequest);
      }
    }

    return true;
  }

  /**
   * 选择日期
   */
  private void selectDate() {
    SimpleDateFormat formatter = new SimpleDateFormat ("yyyy-MM-dd");
    Date curDate = new Date(System.currentTimeMillis());//获取当前时间
    String str = formatter.format(curDate);
    DatePickerPopWin pickerPopWin = new DatePickerPopWin.Builder(cordova.getActivity(), new DatePickerPopWin.OnDatePickedListener() {
      @Override
      public void onDatePickCompleted(int year, int month, int day, String dateDesc) {
//        matchInfoBirth.setText(dateDesc);
        try {
          JSONObject r = new JSONObject();
          r.put("data",dateDesc);
          getCurrentCallbackContext().success(r);
        }catch (Exception e){

        }
      }
    }).textConfirm("确定") //text of confirm button
            .textCancel("取消") //text of cancel button
            .btnTextSize(16) // button text size
            .viewTextSize(25) // pick view text size
            .colorCancel(Color.parseColor("#999999")) //color of cancel button
            .colorConfirm(Color.parseColor("#009900"))//color of confirm button
            .minYear(1990) //min year in loop
            .maxYear(2550) // max year in loop
            .dateChose(str) // date chose when init popwindow
            .build();
    pickerPopWin.showPopWin(cordova.getActivity());
  }

  /**
   * 拍照
   */
  private void takePhoto(){
    window.dismiss();
    Intent takeIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
    takeIntent.putExtra(MediaStore.EXTRA_OUTPUT, Uri.fromFile(new File(Environment.getExternalStorageDirectory(),
            "lvnong.jpg")));
    cordova.startActivityForResult((LMPlugin)this,takeIntent,TAKE_TYPE);
  }

  /**
   * 相册
   */
  private void chosePhoto(){
    window.dismiss();
    Intent albumIntent = new Intent(Intent.ACTION_PICK, null);
    albumIntent.setDataAndType(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, "image/*");
    cordova.startActivityForResult((LMPlugin)this,albumIntent,ALBUM_TYPE);
  }

  /**
   * 调用系统的裁剪
   */
  public void cropPhoto(Uri uri) {
    Intent intent = new Intent("com.android.camera.action.CROP");
    intent.setDataAndType(uri, "image/*");
    intent.putExtra("crop", "true");
    // aspectX aspectY 是宽高的比例
    intent.putExtra("aspectX", 1);
    intent.putExtra("aspectY", 1);
    // outputX outputY 是裁剪图片宽高
    intent.putExtra("outputX", 150);
    intent.putExtra("outputY", 150);
    intent.putExtra("return-data", true);
    cordova.startActivityForResult((LMPlugin)this,intent,3);
  }

  /**
   * 保存图片到sd卡
   */
  private void setPicToView(Bitmap mBitmap) {
    String sdStatus = Environment.getExternalStorageState();
    if (!sdStatus.equals(Environment.MEDIA_MOUNTED)) { // 检测sd是否可用
      return;
    }
    FileOutputStream b = null;
    File file = new File(path);
    file.mkdirs();// 创建文件夹
    String fileName = path + "lvnong.jpg";//图片名字
    filePath = fileName;
    try {
      b = new FileOutputStream(fileName);
      mBitmap.compress(Bitmap.CompressFormat.JPEG, 100, b);// 把数据写入文件
    } catch (FileNotFoundException e) {
      e.printStackTrace();
    } finally {
      try {
        //关闭流
        b.flush();
        b.close();
      } catch (IOException e) {
        e.printStackTrace();
      }
    }
  }

  /**
   * 申请拍照权限
   */

  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent intent) {
    super.onActivityResult(requestCode, resultCode, intent);

    switch (requestCode){
      case TAKE_TYPE:
        if(resultCode == -1){
          File temp = new File(Environment.getExternalStorageDirectory()
                  + "/lvnong.jpg");
          cropPhoto(Uri.fromFile(temp));//裁剪图片
        }
        break;
      case ALBUM_TYPE:
        if (resultCode == -1) {
          cropPhoto(intent.getData());//裁剪图片
        }
        break;
      case CROP_TYPE:
        if (intent != null) {
          Bundle extras = intent.getExtras();
          head = extras.getParcelable("data");
          if (head != null) {
            /**
             * 上传服务器代码
             *  <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
             <uses-permission android:name="android.permission.MOUNT_UNMOUNT_FILESYSTEMS"/>
             */
            //Android 6.0 需要检查权限 ，对于没有权限的需要先申请权限
            if(ContextCompat.checkSelfPermission(cordova.getActivity(),Manifest.permission.WRITE_EXTERNAL_STORAGE)!= PackageManager.PERMISSION_GRANTED){
              //申请拍照权限
              ActivityCompat.requestPermissions(cordova.getActivity(),new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE},MY_PERMISSIONS_REQUEST_STORAGE_CODE);
            }else{
              setPicToView(head);//保存在SD卡中
            }

            uploadPrint(filePath);
//            userImg.setImageBitmap(head);
          }
        }
        break;
    }
    if (requestCode == 8){
      if(resultCode == 0){
        try{
          JSONObject jb = new JSONObject();
          jb.put("errorReason","上传取消");
          LMPlugin.instance.currentCallbackContext.error(jb);
        }catch (Exception e1){
        }
      }else if (resultCode == -1){
        Uri uri = intent.getData();
        String imageUrl = intent.getStringExtra("uriString");//
        uploadPrint(imageUrl);
      }
    }
  }

  /**
   * 拼接URL
   * @param baseUrl 接口请求地址
   * @param params 请求参数
   * @return 拼接的url
   */
  private static String getUrl(String baseUrl ,HashMap<String, String> params) {
    String url = baseUrl;
    // 添加url参数
    if (params != null) {
      Iterator<String> it = params.keySet().iterator();
      StringBuffer sb = null;
      while (it.hasNext()) {
        String key = it.next();
        String value = params.get(key);
        if (sb == null) {
          sb = new StringBuffer();
          sb.append("?");
        } else {
          sb.append("&");
        }
        sb.append(key);
        sb.append("=");
        sb.append(value);
      }
      url += sb.toString();
    }
    return url;
  }

  /**
   * 上传头像
   */
  private void uploadPrint(String filePath) {
    HashMap<String,String> params = new HashMap<String, String>();
    params.put("user_id",userId);
    RequestParams requestParams = new RequestParams();
    String sendUrl = getUrl(upload_img_url,params);
    String mime= MimeTypeMap.getSingleton().getMimeTypeFromExtension("png");
    requestParams.addBodyParameter("imgFile",new File(filePath),mime);

    HttpUtils httpUtils = new HttpUtils();
    httpUtils.send(HttpRequest.HttpMethod.POST, sendUrl, requestParams,new RequestCallBack<Object>() {
      @Override
      public void onSuccess(ResponseInfo<Object> responseInfo) {
        Log.d("xx","success");
        try {
          JSONObject resultJb = new JSONObject(responseInfo.result.toString());
          JSONObject sendJb = resultJb.getJSONObject("data");
          JSONObject r = new JSONObject();
          r.put("data",sendJb);
          currentCallbackContext.success(r);
        }catch(Exception e){
          e.printStackTrace();
        }
      }

      @Override
      public void onFailure(HttpException e, String s) {
        Log.d("xx","error");
      }
    });
  }

  /**
   * call
   */
  private void showCall(CallbackContext callbackContext) {
    String number = "4000723125";
    Intent intent = new Intent(Intent.ACTION_CALL,Uri.parse("tel:"+number));
    //检查权限
//    if (ActivityCompat.checkSelfPermission(cordova.getActivity(), Manifest.permission.CALL_PHONE) != PackageManager.PERMISSION_GRANTED) {
    try{
      JSONObject jb = new JSONObject();
      jb.put("errorReason","异常");
      callbackContext.error(jb);
    }catch (Exception e){
    }
//    }
    try{
      cordova.getActivity().startActivity(intent);
      callbackContext.success();
    }catch (Exception e){
      Log.d("异常：",e.toString());
      try{
        JSONObject jb = new JSONObject();
        jb.put("errorReason","异常");
        callbackContext.error(jb);
      }catch (Exception e1){
      }
    }
  }

  /**
   * 七鱼客服
   */
  private void showQiYuService(String title,String url,String sessionTitle,CallbackContext callbackContext){
    // 设置访客来源，标识访客是从哪个页面发起咨询的，三个参数分别为来源页面的url，来源页面标题，来源页面额外信息（可自由定义）
    // 请注意： 调用该接口前，应先检查Unicorn.isServiceAvailable(), 如果返回为false，该接口不会有任何动作
    try{
      ConsultSource source = new ConsultSource(url, sessionTitle, "custom information string");
      Unicorn.isServiceAvailable();
      Unicorn.openServiceActivity(cordova.getActivity(), // 上下文
              title, // 聊天窗口的标题
              source // 咨询的发起来源，包括发起咨询的url，title，描述信息等
      );
      try{
        JSONObject jb = new JSONObject();
        jb.put("data","{}");
        callbackContext.success(jb);
      }catch (Exception e){
      }
    }catch (Exception e1){
      try{
        JSONObject jb = new JSONObject();
        jb.put("errorReason","分享取消");
        callbackContext.error(jb);
      }catch (Exception e){
      }
    }

  }

  private void showPopupWindow(){
    // 利用layoutInflater获得View
    LayoutInflater inflater = LayoutInflater.from(cordova.getActivity());
    View view = inflater.inflate(R.layout.popup_layout, null);
// 下面是两种方法得到宽度和高度 getWindow().getDecorView().getWidth()
    window = new PopupWindow(view,
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.WRAP_CONTENT);
    // 设置popWindow弹出窗体可点击，这句话必须添加，并且是true
    window.setFocusable(true);
    // 实例化一个ColorDrawable颜色为半透明
    ColorDrawable dw = new ColorDrawable(0xb0000000);
    window.setBackgroundDrawable(dw);
    // 设置popWindow的显示和消失动画
    window.setAnimationStyle(R.style.mypopwindow_anim_style);
    // 在底部显示
    window.showAtLocation(cordova.getActivity().getCurrentFocus(),
            Gravity.BOTTOM, 0, 0);

    TextView tv_1 = (TextView) view.findViewById(R.id.first);
    tv_1.setOnClickListener(new View.OnClickListener() {
      @Override
      public void onClick(View view) {
        //Android 6.0 需要检查权限 ，对于没有权限的需要先申请权限
        if(ContextCompat.checkSelfPermission(cordova.getActivity(),Manifest.permission.CAMERA)!= PackageManager.PERMISSION_GRANTED){
          //申请拍照权限
          ActivityCompat.requestPermissions(cordova.getActivity(),new String[]{Manifest.permission.CAMERA},MY_PERMISSIONS_REQUEST_CAMERA_CODE);
        }else{
          //拍照
          takePhoto();
        }
      }
    });
    TextView tv_2 = (TextView) view.findViewById(R.id.second);
    tv_2.setOnClickListener(new View.OnClickListener() {
      @Override
      public void onClick(View view) {
        //从相册选择
        chosePhoto();
      }
    });
    TextView tv_3 = (TextView) view.findViewById(R.id.thread);
    tv_3.setOnClickListener(new View.OnClickListener() {
      @Override
      public void onClick(View view) {
        //取消
        window.dismiss();
      }
    });
  }


  /**
   * 处理运行时权限回调
   * @param requestCode
   * @param permissions
   * @param grantResults
   * @throws JSONException
   */
  @Override
  public void onRequestPermissionResult(int requestCode, String[] permissions, int[] grantResults) throws JSONException {
    switch (requestCode){
      case MY_PERMISSIONS_REQUEST_CAMERA_CODE:{
        if (grantResults.length>0 && grantResults[0] == PackageManager.PERMISSION_GRANTED){
          //权限申请成功
          takePhoto();
        }else{
          //权限申请失败
        }
      }
      break;
      case MY_PERMISSIONS_REQUEST_STORAGE_CODE:{
        if (grantResults.length>0 && grantResults[0] == PackageManager.PERMISSION_GRANTED){
          //权限申请成功
          setPicToView(head);//保存在SD卡中
        }else{
          //权限申请失败
        }
      }
    }
    super.onRequestPermissionResult(requestCode, permissions, grantResults);
  }

  /**
   * 三方分享
   */
  private void showShare(final CallbackContext callbackContext,String url) {
    ShareSDK.initSDK(cordova.getActivity());
    OnekeyShare oks = new OnekeyShare();
    //关闭sso授权
    oks.disableSSOWhenAuthorize();
// 分享时Notification的图标和文字  2.5.9以后的版本不调用此方法
//    oks.setNotification(R.Rdrawable.ic_launcher, getString(R.string.app_name));
    // title标题，印象笔记、邮箱、信息、微信、人人网和QQ空间使用
    oks.setTitle("最贴心的一站式采购平台");
    oks.setText("第一家在食材生态链领域实现全流程把控，全品类供应，大数据支撑，一站式采购，大物流到店的全新食材供销配置体系的平台");
    oks.setUrl(url);
    // titleUrl是标题的网络链接，仅在人人网和QQ空间使用
    oks.setTitleUrl(url);
    // text是分享文本，所有平台都需要这个字段
//    http://120.26.95.163:8080/lvnong/www/img/collection2.png  测试
    // 正式
    oks.setImageUrl("http://120.26.95.163:8080/lvnong/www/img/icon.png");
    // imagePath是图片的本地路径，Linked-In以外的平台都支持此参数
//    oks.setImagePath("/sdcard/test.jpg");//确保SDcard下面存在此张图片
    // url仅在微信（包括好友和朋友圈）中使用
    // comment是我对这条分享的评论，仅在人人网和QQ空间使用
//    oks.setComment("最贴心的一站式采购平台");
    // site是分享此内容的网站名称，仅在QQ空间使用
//    oks.setSite("最贴心的一站式采购平台");
    // siteUrl是分享此内容的网站地址，仅在QQ空间使用
//    oks.setSiteUrl(url);
// 启动分享GUI
    oks.setCallback(new PlatformActionListener() {
      @Override
      public void onComplete(Platform platform, int i, HashMap<String, Object> hashMap) {
        try{
          JSONObject jb = new JSONObject();
          jb.put("data","{}");
          callbackContext.success(jb);
        }catch (Exception e){
        }
      }

      @Override
      public void onError(Platform platform, int i, Throwable throwable) {
        try{
          JSONObject jb = new JSONObject();
          jb.put("errorReason","分享失败");
          callbackContext.error(jb);
        }catch (Exception e){
        }
      }

      @Override
      public void onCancel(Platform platform, int i) {
        try{
          JSONObject jb = new JSONObject();
          jb.put("errorReason","分享取消");
          callbackContext.error(jb);
        }catch (Exception e){
        }

      }
    });
    oks.show(cordova.getActivity());
  }

  /**
   * create the order info. 创建订单信息
   *
   */
  public String getOrderInfo(String partner ,String seller,String subject, String body, String price,String tradeNo,String notifyUrl) {
    // 合作者身份ID
    String orderInfo = "partner=" + "\"" +partner  + "\"";
    // 卖家支付宝账号
    orderInfo += "&seller_id=" + "\"" + seller + "\"";
    // 商户网站唯一订单号
    orderInfo += "&out_trade_no=" + "\"" + tradeNo + "\"";
    // 商品名称
    orderInfo += "&subject=" + "\"" + subject + "\"";
    // 商品详情
    orderInfo += "&body=" + "\"" + body + "\"";
    // 商品金额
    orderInfo += "&total_fee=" + "\"" + price + "\"";
    // 服务器异步通知页面路径
    orderInfo += "&notify_url=" + "\"" + notifyUrl
            + "\"";
    // 接口名称， 固定值
    orderInfo += "&service=\"mobile.securitypay.pay\"";
    // 支付类型， 固定值
    orderInfo += "&payment_type=\"1\"";
    // 参数编码， 固定值
    orderInfo += "&_input_charset=\"utf-8\"";
    // 设置未付款交易的超时时间
    // 默认30分钟，一旦超时，该笔交易就会自动被关闭。
    // 取值范围：1m～15d。
    // m-分钟，h-小时，d-天，1c-当天（无论交易何时创建，都在0点关闭）。
    // 该参数数值不接受小数点，如1.5h，可转换为90m。
//    orderInfo += "&it_b_pay=\""+timeout+"\"";
    // 支付宝处理完请求后，当前页面跳转到商户指定页面的路径，可空
    orderInfo += "&return_url=\"m.alipay.com\"";
    // 调用银行卡支付，需配置此参数，参与签名， 固定值
    // orderInfo += "&paymethod=\"expressGateway\"";
    return orderInfo;
  }

  /**
   * get the out_trade_no for an order. 获取外部订单号
   *
   */
  public String getOutTradeNo(String tradeNo) {
//    SimpleDateFormat format = new SimpleDateFormat("MMddHHmmss",
//      Locale.getDefault());
//    Date date = new Date();
//    String key = format.format(date);
    Random r = new Random();
    tradeNo = tradeNo + r.nextInt();
    tradeNo = tradeNo.substring(0, 16);
    return tradeNo;
  }

  /**
   * sign the order info. 对订单信息进行签名
   *
   * @param content
   * 待签名订单信息
   */
  public String sign(String content,String rsa_private) {
    return SignUtils.sign(content, rsa_private);
  }

  /**
   * get the sign type we use. 获取签名方式
   *
   */
  public String getSignType() {
    return "sign_type=\"RSA\"";
  }

}
