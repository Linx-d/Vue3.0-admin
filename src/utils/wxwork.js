import service from "@/utils/request";

export function jssdk(jsApiList,fun){
    let url = window.location.href;
    console.log(url,"url");
    service.request({
      method:"POST",
      url:"/qywx/getJSSDK?url="+url
    }).then(res =>{
        if(res.code==0){
            let agentConfig = res.data.agentConfig;
            wx.agentConfig ({
                corpid: agentConfig.authCorpId, // 必填，企业微信的corpid，必须与当前登录的企业一致
                agentid: agentConfig.agentId, // 必填，企业微信的应用id （e.g. 1000247）
                timestamp: agentConfig.timestamp, // 必填，生成签名的时间戳
                nonceStr: agentConfig.nonceStr, // 必填，生成签名的随机串
                signature: agentConfig.signature,// 必填，签名，见附录1
                jsApiList:jsApiList,
                success: fun,
                fail: function(res) {
                    if(res.errMsg.indexOf('function not exist') > -1){
                        alert('版本过低请升级')
                        window.location.href = "./empty_page.html";
                    }
                    alert('通过agentConfig注入应用失败' + JSON.stringify(res));
                    window.location.href = "./empty_page.html";
                }
            });
        }
    });
}
