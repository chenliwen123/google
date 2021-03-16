let content_left,formdom;
/**@function 删除dom方法 */
function removeDom() {
  content_left = document.querySelectorAll("#content_left")[0].children;
  for (let i = 0; i < content_left.length; i++) {
    let fontbottom =
      (content_left[i].children[2] &&
        content_left[i].children[2].querySelectorAll("font")[0]) ||
      "";
    let rightfort =
      (content_left[i].children[1] &&
        content_left[i].children[1].children[0] &&
        content_left[i].children[1].children[0].children[1] &&
        content_left[i].children[1].children[0].children[1].children[1] &&
        content_left[
          i
        ].children[1].children[0].children[1].children[1].querySelectorAll(
          "font"
        )[0]) ||
      "";
    if (fontbottom.innerText == "广告" || rightfort.innerText == "广告") {
      content_left[i].style.display = 'none';
    }
  }
  if(!formdom){
    getformdom()
    
  }
}

/**@function 监听列表是否加载完成 */
function runDom(){
  let dingshiqi = setInterval(() => {
    content_left = document.querySelectorAll("#content_left");
    if (content_left.length > 0) {
      clearInterval(dingshiqi);
      removeDom();
    }
  }, 500);
}

/**@function 接收返回过来的值 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
	if(request.cmd == 'switch'){
    if(request.value == true){
      runDom()
    }else{
      window.location.href = window.location.href
    }
  }else if(request.cmd == 'status'){
    if(request.value == true){
      runDom()
    }
  }
});


/**@function 获取状态是否开启 */
chrome.runtime.sendMessage({type:'status'});

function getformdom(){
  formdom = document.querySelectorAll("#form")[0];
  let submit = formdom.querySelectorAll('input[type=submit]')[0];
  let kw = formdom.querySelectorAll('#kw')[0];
  let onediv;
  kw.oninput = function(){
    onediv = formdom.children[0];
    onediv.onclick = function(){
      setTimeout(() => {
        chrome.runtime.sendMessage({type:'status'});
      }, 300);
    }
  }
  kw.onfocus = function(){
    setTimeout(() => {
      onediv = formdom.children[0];
      onediv.onclick = function(){
        setTimeout(() => {
          chrome.runtime.sendMessage({type:'status'});
        }, 300);
      }
    }, 100);
  }
  submit.onclick = function(){
    setTimeout(() => {
      chrome.runtime.sendMessage({type:'status'});
    }, 300);
  }
  
  kw.onkeydown = function(event){
    if(event.keyCode == 13){
      setTimeout(() => {
        chrome.runtime.sendMessage({type:'status'});
      }, 300);
    }
  }
}