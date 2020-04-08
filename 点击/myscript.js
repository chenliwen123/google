var btn = document.querySelectorAll('.submitBtn___HfugN')[0];

function hahha(){
	btn.click();
}
let s,i=0,x,y; 
    s= setInterval(hahha(),3000);
window.onmousemove=function(event){
		 clearInterval(s);
		 if(i==0){
			x=event.clientX;
			y=event.clientY;
		}
		setInterval(() => {
			
		    if(x===event.clientX&&y===event.clientY){
				i++;
			}	
			if(i>=3){
				i=0;
				s= setInterval(hahha(),3000);
			}
		}, 500);
}

/* setInterval(function(event){
	console.log(event);
	var e=event || window.event;
	x=e.clientX;
	y=e.clientY;
	console.log(e.clientX);
	console.log(e.clientY);
	
},800) */