/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package com.yl.lvnong;

import android.content.Context;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.widget.Toast;

import com.qiyukf.unicorn.api.ImageLoaderListener;
import com.qiyukf.unicorn.api.SavePowerConfig;
import com.qiyukf.unicorn.api.StatusBarNotificationConfig;
import com.qiyukf.unicorn.api.Unicorn;
import com.qiyukf.unicorn.api.UnicornImageLoader;
import com.qiyukf.unicorn.api.YSFOptions;
import com.umeng.analytics.MobclickAgent;
import com.umeng.message.IUmengUnregisterCallback;
import com.umeng.message.MsgConstant;
import com.umeng.message.PushAgent;

import org.apache.cordova.CordovaActivity;

import cn.sharesdk.framework.ShareSDK;

public class MainActivity extends CordovaActivity
{
    private PushAgent mPushAgent;
    private Context context;
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        context = this;

        mPushAgent = PushAgent.getInstance(this);
        //sdk开启通知声音
        mPushAgent.setNotificationPlaySound(MsgConstant.NOTIFICATION_PLAY_SDK_ENABLE);
        mPushAgent.onAppStart();
        mPushAgent.setPushCheck(true);
        mPushAgent.enable();
        mPushAgent.setUnregisterCallback(new IUmengUnregisterCallback() {
            @Override
            public void onUnregistered(String s) {
                Toast.makeText(context,s,Toast.LENGTH_SHORT).show();
            }
        });
        MobclickAgent.setScenarioType(context, MobclickAgent.EScenarioType.E_UM_NORMAL);
        ShareSDK.initSDK(this);
        Unicorn.init(this, "170a976e7f9fdeab13055b4dc3b315bb", options(), new UnicornImageLoader() {
            @Override
            public Bitmap loadImageSync(String s, int i, int i1) {
                return null;
            }

            @Override
            public void loadImage(String s, int i, int i1, ImageLoaderListener imageLoaderListener) {

            }
        });
        loadUrl(launchUrl);
    }

//    // 如果返回值为null，则全部使用默认参数。
    private YSFOptions options() {
        YSFOptions options = new YSFOptions();
        options.statusBarNotificationConfig = new StatusBarNotificationConfig();
        options.savePowerConfig = new SavePowerConfig();
        return options;
    }

    @Override
    protected void onResume() {
        super.onResume();
        MobclickAgent.onResume(this);
    }

    @Override
    protected void onPause() {
        super.onPause();
        MobclickAgent.onPause(this);
    }

    @Override
  public void onDestroy() {
    super.onDestroy();
    ShareSDK.stopSDK(this);
  }


    //此处是注册的回调处理
    //参考集成文档的1.7.10
    //http://dev.umeng.com/push/android/integration#1_7_10
//    public IUmengRegisterCallback mRegisterCallback = new IUmengRegisterCallback() {
//        @Override
//        public void onRegistered(String registrationId) {
//        }
//    };

}
