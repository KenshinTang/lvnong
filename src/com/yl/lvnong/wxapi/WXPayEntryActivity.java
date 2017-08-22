package com.yl.lvnong.wxapi;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;

import com.tencent.mm.sdk.constants.ConstantsAPI;
import com.tencent.mm.sdk.modelbase.BaseReq;
import com.tencent.mm.sdk.modelbase.BaseResp;
import com.tencent.mm.sdk.openapi.IWXAPI;
import com.tencent.mm.sdk.openapi.IWXAPIEventHandler;
import com.tencent.mm.sdk.openapi.WXAPIFactory;

import org.apache.cordova.lmplugin.LMPlugin;
import org.json.JSONObject;

public class WXPayEntryActivity extends Activity implements IWXAPIEventHandler{


	private static final String TAG = "MicroMsg.SDKSample.WXPayEntryActivity";

    private IWXAPI api;

    private Context mContext;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mContext = this;
      SharedPreferences sp = this.getSharedPreferences("PAY_APP_ID",
        Context.MODE_PRIVATE);
      String app_id = sp.getString("pay_appId","");
        api = WXAPIFactory.createWXAPI(this, "wxda6a63de5500e7d2");
        api.handleIntent(getIntent(), this);
    }

	@Override
	protected void onNewIntent(Intent intent) {
		super.onNewIntent(intent);
		setIntent(intent);
        api.handleIntent(intent, this);
	}

	@Override
	public void onReq(BaseReq req) {
	}

	@Override
	public void onResp(BaseResp resp) {

	if (resp.getType() == ConstantsAPI.COMMAND_PAY_BY_WX) {
      if(resp.errCode == 0){
          try {
          JSONObject r = new JSONObject();
          JSONObject jb1 = new JSONObject();
          jb1.put("datas","success");
          r.put("data",jb1);
          LMPlugin.instance.getCurrentCallbackContext().success(r);
      }catch (Exception e){

      }
      }else{
          try{
              JSONObject jb = new JSONObject();
              jb.put("errorReason","支付失败");
              LMPlugin.instance.getCurrentCallbackContext().error(jb);
          }catch (Exception e){
          }
      }
		}
        finish();
	}
}
