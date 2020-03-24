var btn = document.querySelectorAll('li');
function nclickEvent(n,dom,fn) {
	dom.removeEventListener('dblclick',null);
	var n = parseInt(n) < 1 ? 1:parseInt(n),
		count = 0,
		lastTime = 0;//用于记录上次结束的时间
	var handler = function (event) {
		var currentTime = new Date().getTime();//获取本次点击的时间
		count = (currentTime-lastTime) < 300 ? count +1 : 0;//如果本次点击的时间和上次结束时间相比大于300毫秒就把count置0
		lastTime = new Date().getTime();
		if(count>=n-1){
			fn(event,n);
			count = 0;
		}
	};
	dom.addEventListener('click',handler);
}
for(let i=0;i<btn.length;i++){
	nclickEvent(3,btn[i],function (event,n) {
		
	var Url2=btn[i].innerHTML;
	var oInput = document.createElement('input');
	Url2=Url2.substring(12);
	oInput.value = Url2;
	document.body.appendChild(oInput);
	oInput.select(); // 选择对象
	document.execCommand("copy"); // 执行浏览器复制命令
	oInput.style.display="none";
		
})
}