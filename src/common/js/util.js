/*
*获取search参数
*/

export function getQuery(paras) {
    var url = window.location.href;
    var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
    var paraObj = {};
    var i, j;
    for (i = 0; j = paraString[i]; i++) {
        paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
    }
    var returnValue = paraObj[paras.toLowerCase()];
    if (returnValue && returnValue.indexOf('#') > -1) {
        returnValue = returnValue.split('#')[0];
    }
    if (typeof(returnValue) == "undefined") {
        return "";
    } else {
        return returnValue;
    }
}

/*
*平台类型判断
*/
let userAgentStr = navigator.userAgent;
export let plat = {
  isIos(){
        if (!!userAgentStr.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
            return true;
        } else {
            return false;
        }
    },
  isAndroid(){
      if (userAgentStr.indexOf('Android') > -1 || userAgentStr.indexOf('Linux') > -1) {
          return true;
      } else {
          return false
      }
    }
}