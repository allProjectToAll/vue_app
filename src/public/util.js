import axios from 'axios';
import store from '../store'
// import {Decimal} from 'decimal.js'
// import {Toast} from 'mint-ui';

let util = {};
const ajaxUrl = process.env.NODE_ENV === 'development' ?'' :'';

util.ajax = axios.create({
  baseURL: ajaxUrl,
  timeout: 30000
});

// http request 拦截器≈

//为了测试 comment by shirley
setTimeout(()=>{
  let temptoken = ``;
  if(process.env.NODE_ENV==='development'){
    store.commit('SET_TOKEN',temptoken) //为了本地测试使用 token
  }
})
util.ajax.interceptors.request.use(
  config => {
    // let token = store.state.user.token || JSON.parse(VueCookies.get('token'));
    if (token) {  // 判断是否存
      // 在token，如果存在的话，则每个http header都加上token
      // config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  err => {
    console.log(err)
    return Promise.reject(err);
  }
);
// http response 拦截器
util.ajax.interceptors.response.use(
  response => {
    // if (true !== response.data.isOk) {
    //   if(response.data.err.message){
      
    //   return Promise.reject(response);
    // }
    return response;
  },
  error => {
    if (error.response) {
      // Message({ message:i18n.t("message.SystermError"), showClose:true, type:'error'});
    }
    return Promise.reject(error.response)   // 返回接口返回的错误信息
  }
);


// util.toFixed = (d,s=0) => {
//   if(!d && d!==0){
//     return 0;
//   }
//   // 不要超过 16 位
//   if (s === 0)
//     return Math.floor(d);
//   let str = util.scientificToNumber(d).toString();
//   let index = str.indexOf('.');
//   if(index !== -1){
//     let num = str.length-index-1; //原有小数位数
//     if(num<s){
//       str = `${str}${'0'.repeat(s-num)}`
//     }else{
//       str = str.slice(0,index+1+s);
//     }
//   }else{
//     str = `${str}.${'0'.repeat(s)}`
//   }
//   return str
// }

// util.scientificToNumber = (value) => {
//   if(!value && value !==0 ){
//     return;
//   }
//   // e-7 e+21
//   let str = value.toString();
//   let eIndex = str.indexOf('e');
//   if(eIndex<0){
//     return value;
//   }
//   let sign = str.substr(eIndex+1,1);
//   let powNum = str.slice(eIndex+2);
//   let arr = [];
//   if(sign === '-'){
//     powNum = powNum - 6;
//     arr = new Decimal(value).mul(Math.pow(10,powNum)).toString().split('');
//     let dotIndex = arr.indexOf('.');
//     arr.splice(dotIndex+1,0,'0'.repeat(powNum));
//   }else{
//     powNum = powNum - 20;
//     arr = new Decimal(value).div(Math.pow(10,powNum)).toString().split('');
//     let dotIndex = arr.indexOf('.');
//     if(dotIndex === -1){
//       arr.push('0'.repeat(powNum));
//     }else{
//       let dotNum = arr.length - dotIndex -1; // 小数位数
//       arr.splice(dotIndex,1); //去掉小数点
//       let diff = dotNum - powNum;
//       if(diff <= 0){
//         arr.splice(arr.length-1,0,'0'.repeat(diff)) // 补齐 0
//       }else{
//         arr.splice(arr.length-1-diff,0,'.') // 加上小数点
//       }
//     }
//   }
//   return arr.join('');
// }

util.browser = browser();
util.browserRedirect = browserRedirect();

function browser(){
  return {
    versions:function(){
      let u = navigator.userAgent, app = navigator.appVersion;
      return {
        trident: u.indexOf('Trident') > -1, //IE内核
        presto: u.indexOf('Presto') > -1, //opera内核
        webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
        mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
        android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
        iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
        iPad: u.indexOf('iPad') > -1, //是否iPad
        webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
        Safari:u.indexOf("Safari") > -1,//是否是safari浏览器
        weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
        qq: u.match(/\sQQ/i) == " qq", //是否QQ
        AZEX: u.indexOf('AZEX') > -1 //是否AZEX
      };
    }(),
    language:(navigator.browserLanguage || navigator.language).toLowerCase()
  }
}

function browserRedirect() {
  let sUserAgent = navigator.userAgent.toLowerCase();
  let bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
  let bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
  let bIsMidp = sUserAgent.match(/midp/i) == "midp";
  let bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
  let bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
  let bIsAndroid = sUserAgent.match(/android/i) == "android";
  let bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
  let bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
  if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
    //移动端
    return 0;
  } else {
    //pc端
    return 1;
  }
}
export default util;

