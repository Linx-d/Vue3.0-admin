export function Map(ak) {
  return new Promise(function (resolve, reject) {
       window.init = function () {
      resolve(BMap)
 }
var script = document.createElement("script");
script.type = "text/javascript";
script.src = "http://api.map.baidu.com/api?v=3.0&ak="+'ak'+"&callback=init"; // 使用3.0的 api 定制个性化地图
script.onerror = reject;
document.head.appendChild(script);
})
}
