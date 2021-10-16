const huya = ['交友','星秀','颜值','二次元']; // 虎牙需要过滤的标签
const douyu = ['舞蹈','颜值','交友','二次元','音乐']; // 斗鱼需要过滤的标签

let listul, pageList;
if (location.host.indexOf("huya") > -1) {
  function aaa() {
    console.log(listul);
    listAll = listul[0].children;
    for (let i = 0; i < listAll.length; ) {
      let nowdata = listAll[i];
      let gameType = nowdata
        .querySelectorAll(".game-type")[0]
        .querySelector("a").innerHTML;
      if (
        huya.indexOf(gameType) > -1
      ) {
        nowdata.remove();
      } else {
        i++;
      }
    }
  }
  /**@function 监听列表是否加载完成 */
  let dingshiqi = setInterval(() => {
    listul = document.querySelectorAll("#js-live-list");
    if (listul.length > 0) {
      clearInterval(dingshiqi);
      aaa();
      bbb();
    }
  }, 500);
  function doSomething() {
    let list_page = document.querySelectorAll(".list-page")[0];
    if (list_page.length == 0) {
      return false;
    }
    list_page.addEventListener("click", function () {
      setTimeout(() => {
        listul = document.querySelectorAll("#js-live-list");
        aaa();
      }, 500);
    });
  }
  function bbb() {
    let ticking = false;
    document
      .querySelectorAll(".js-responded-list")[0]
      .addEventListener("scroll", function (e) {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(function () {
            doSomething();
          });
        }
      });
  }
}else{
	function aaa() {
		listul = document.querySelectorAll("#listAll")[0].querySelectorAll('.ListContent');
    listAll = listul[0].querySelectorAll('.layout-Cover-list')[0].children;
    for (let i = 0; i < listAll.length;i++) {
      let nowdata = listAll[i];
      let gameType = nowdata.querySelectorAll('.DyListCover-zone')[0].innerHTML
      if (
        douyu.indexOf(gameType) > -1
      ) {
        nowdata.style.display="none"
      }
    }
	}
  function bbb() {
		let list_page = document.querySelectorAll(".ListFooter")[0];
    if (list_page.length == 0) {
      return false;
    }
    list_page.addEventListener("click", function () {
      setTimeout(() => {
        aaa();
      }, 500);
    });
  }
	/**@function 监听列表是否加载完成 */
	let dingshiqi = setInterval(() => {
		listul = document.querySelectorAll("#listAll")[0].querySelectorAll('.ListContent');
		if (listul.length > 0) {
			clearInterval(dingshiqi);
			setTimeout(() => {
				aaa()
				bbb()
			}, 2000);
		}
	}, 500);
}
