package com.yl.lvnong;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.widget.Toast;

import org.apache.cordova.CallbackContext;
import org.json.JSONObject;

import java.util.HashMap;

import cn.sharesdk.framework.Platform;
import cn.sharesdk.framework.PlatformActionListener;
import cn.sharesdk.framework.ShareSDK;
import cn.sharesdk.sina.weibo.SinaWeibo;
import cn.sharesdk.tencent.qq.QQ;
import cn.sharesdk.wechat.friends.Wechat;

/**
 * Created by Administrator on 2016/6/14.
 */
public class LoginUtils {

  private static Context mContext;
  private static CallbackContext callbackContext;

  private LoginUtils(){

  }
  private static LoginUtils single = null;

  public static LoginUtils getInstance(Context context, CallbackContext callbackContext){
    mContext = context;
    callbackContext = callbackContext;
    if(single == null){
      single = new LoginUtils();
    }
    return single;
  }

  /**
   * QQ登录
   */
  public void qqLogin(){
    Platform qq = ShareSDK.getPlatform(QQ.NAME);
    qq.SSOSetting(false);  //设置false表示使用SSO授权方式
    qq.showUser(null);
    qq.setPlatformActionListener(new PlatformActionListener() {
      @Override
      public void onComplete(Platform platform, int i, HashMap<String, Object> hashMap) {
        //解析部分用户资料字段
        String id,name,description,profile_image_url;
        id=hashMap.get("id").toString();//ID
        name=hashMap.get("name").toString();//用户名
        description=hashMap.get("description").toString();//描述
        profile_image_url=hashMap.get("profile_image_url").toString();//头像链接
        String str="ID: "+id+";\n"+
          "用户名： "+name+";\n"+
          "描述："+description+";\n"+
          "用户头像地址："+profile_image_url;
      }

      @Override
      public void onError(Platform platform, int i, Throwable throwable) {
      }

      @Override
      public void onCancel(Platform platform, int i) {
      }
    }); // 设置分享事件回调
    qq.authorize();
  }

  /**
   * 微信登录
   */
  public void weiXinLogin(){
    Platform plat = ShareSDK.getPlatform(Wechat.NAME);
    if(plat.isValid()){
      String userId = plat.getDb().getUserId();
    }
    plat.setPlatformActionListener(new PlatformActionListener() {
      @Override
      public void onComplete(Platform platform, int i, HashMap<String, Object> hashMap) {
        String rsStr = "";
        String openId = platform.getDb().getUserId();
        String userName = hashMap.get("nickname").toString();//ID
        String hearUrl = hashMap.get("headimgurl").toString();//ID
        try {
          JSONObject all = new JSONObject();
          JSONObject data = new JSONObject();

          data.put("openId",openId);
          data.put("username",userName);
          data.put("iconURL",hearUrl);
          all.put("data",data);
        rsStr = "----userName="+userName+"----hearUrl="+hearUrl;
        copy(rsStr);Toast.makeText(mContext,all.toString(),Toast.LENGTH_SHORT).show();
          callbackContext.success(all);
        } catch (Exception e) {
          e.printStackTrace();
        }
      }

      @Override
      public void onError(Platform platform, int i, Throwable throwable) {
        Toast.makeText(mContext,throwable.toString(),Toast.LENGTH_SHORT).show();
      }

      @Override
      public void onCancel(Platform platform, int i) {
        Toast.makeText(mContext,"取消",Toast.LENGTH_SHORT).show();
      }
    });
    plat.SSOSetting(false);
    plat.showUser(null);
  }

  private void copy(String copyStr){
    //复制链接
    ClipboardManager myClipboard = (ClipboardManager) mContext.getSystemService(Context.CLIPBOARD_SERVICE);
    ClipData myClip = ClipData.newPlainText("text", copyStr);
    myClipboard.setPrimaryClip(myClip);
  }

  /**
   * 微博登录
   */
  public void shinaLogin(){
    Platform weibo = ShareSDK.getPlatform(SinaWeibo.NAME);
    weibo.SSOSetting(false);  //设置false表示使用SSO授权方式
    weibo.authorize();
    weibo.setPlatformActionListener(new PlatformActionListener() {
      @Override
      public void onComplete(Platform platform, int i, HashMap<String, Object> hashMap) {
      }

      @Override
      public void onError(Platform platform, int i, Throwable throwable) {
      }

      @Override
      public void onCancel(Platform platform, int i) {
      }
    });
    weibo.showUser(null);
  }
}
