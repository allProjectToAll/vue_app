export default function(win){
    /**
     * @type {Window} _window 要操作的window对象
     * @type {Document} _document 要操作的document文档对象
     * @type {Element} _body 要操作的body对象
     * @type {Object} flex 进行适配操作的对象
     */
    var _window = /Window|global/i.test({}.toString.call(win).slice(8, -1)) ? win : window;
    var _document = _window.document;
    var _body = _document.body;
    var flex = {
      /**
       *
       * @param {Number} designWidth 配置设计稿的宽度，默认为750
       * @param {Number} minWidth    配置当可视区域大于最大宽度时默认以多少宽度显示，即最小显示宽度，默认为设计稿宽的1/2 即一半
       * @param {Number} maxWidth    配置最大的宽度，当可视区域宽度超过此最大限制时强制设置body的宽度为最小宽度，以保持最佳显示。
       */
      resize:function(designWidth, minWidth, maxWidth){
        //未指定设计稿宽则默认为750
        designWidth = designWidth - 0 || 375;
        //未指定最小显示宽度则默认为设计稿一半
        minWidth = minWidth -0 || designWidth*2 ;
        //未指定最大宽度，即PC与移动端区分的最大宽度值，默认为768 ，即ipad依然正常缩放显示，而ipad pro则视为PC
        maxWidth = maxWidth -0 || 750;
        var resize;
        resize = function () {
          //如果body的可视宽度大于最大宽度重置body宽度为最小宽且居中
          if (_body.clientWidth > maxWidth) {
            _body.style.cssText += 'width:' + 375 + 'px;background-color:#eee;';
            //console.log(_body.clientWidth);
          }
          //同时限制html body溢出隐藏，因此缩放后的container已经超出body和html范围

          _document.documentElement.style.cssText += _body.style.cssText += 'margin:0 auto;-webkit-overflow-scrolling: touch;';
          /**
           * @type {Element} container body的第一个子元素 所有内容必须写在body中的第一个子元素中
           * @type {Number}  clientWidth body的可视区域宽度
           * @type {Number}  clientHeight body的可视区域高度
           * @type {Number}  scale 需要缩放的比例， 可视区域的宽/设计稿的宽得到一个缩放比值。 假设设计稿750 body 375 则 375/750=0.5 则窗口需要缩小0.5倍才正好适配body的宽度
           * @type {Number}  zoom  高度需要放大的比例，当进行scale缩放时导致高度跟着缩放，为了让高度适应屏幕高度达到百分百的高必须将高度值*放大比例进行高度补偿。假设body高度750 scale0.5之后高度只有375半屏高度，因此先将高度750*2 然后再scale0.5保持高度依然是一屏高。
           */
          var container = _body.firstElementChild;
          var clientWidth = _body.innerWidth || _body.clientWidth;
          var clientHeight = _body.innerHeight || _body.clientHeight;
          var scale = clientWidth / designWidth;
          var zoom = designWidth / clientWidth;
          //console.log(designWidth, clientWidth, scale);

          //设置body的第一个子元素节点的宽高缩放等属性完成适配初始化,container窗口将替代body成为主容器，默认允许溢出且溢出滚动
          container.style.cssText+='zoom:'+scale+';width:'+375+'px;';
        };
        var ver = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
        ver = ver?parseInt(ver[1], 10):0;
        var stopDrop=function () {
          _document.addEventListener('touchmove', function(evt) {
            if(ver<10){
              return
            }else {
              if(!evt._isScroller) {
                evt.preventDefault()
              }
            }
          },{passive: false});
        };
        if(_body){
          //body加载立即执行重置
          resize(375,null,375);
          //stopDrop()

        }else{
          //body未加载待DOM加载完成后设置
          _document.addEventListener('DOMContentLoaded', function(){
            _body = _document.body;
            resize(375,null,375);
            //stopDrop()
          });
        }
        //窗口变化时重新检测调整适配
        _window.addEventListener('resize', function(){
          resize(375,null,375);
          if (/Android [4-6]/.test(navigator.appVersion)) { // 解决 Android 手机输入框被挡住问题，未测试，comment by sherry
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
              window.setTimeout(function () {
                document.activeElement.scrollIntoViewIfNeeded(true)
              }, 0)
            }
          }
          // location.reload(true) 此行代码会导致 Android 端弹出软键盘时，不断 reload, comment by shriley
        });
      }
    };
    return flex;
  }
