window.onload = function(){
	var Carousel = document.getElementById("Carousel");//获取轮播图
	var list = document.getElementById("list");//获取轮播图的图片列表
	var Carousel_buttons = 
	document.getElementById("Carousel_buttons").getElementsByTagName("span");//获取小圆按钮
	var prev = document.getElementById("prev");//获取上一个轮播图的按钮
	var next = document.getElementById("next");//获取下一个轮播图的按钮
	var width = -parseInt(Carousel.clientWidth);//获取每次轮播图片移动的宽度，和轮播图的宽度有关
	var Carousel_buttons_sum = Carousel_buttons.length;//获取小圆按钮的个数
	var index = 0;//每一张图片的索引，第一张图片索引为0
	var isanimate = false;//是否在动画中
	var interval ;//定义轮播间隔，可以初始化
	var timer ;//定义定时器

	//初始化,判断是否有Carousel_interval属性(轮播地间隔)，如果有则取整数，如果没有则默认为3秒
	//初始位置和轮播图的宽度有关，即Carousel.clientWidth
	var reg = /^[0-9]*/ ;
	list.style.left = width + 'px';
	interval = parseInt(Carousel.getAttribute('Carousel_interval')) ;
	if(Carousel.getAttribute('Carousel_interval') == null ||
		Carousel.getAttribute('Carousel_interval') ==""){
		interval = 3000;
	}else{
		if(Carousel.getAttribute('Carousel_interval').match(reg) ){
			interval = parseInt(Carousel.getAttribute('Carousel_interval'));
		}else {
			interval = 3000;
		}
	}

	//箭头点击函数
	prev.onclick = function(){
		if(!isanimate){
			animate(-1,width);
		}
	};
	next.onclick = function(){
		if(!isanimate){
			animate(1,width);
		}
	};

	//实现图片轮播效果
	function animate(delta,offset){
		isanimate = true;
		if(delta != 0 && offset != 0){
			var inteval = 12;
			var time = 300;
			var speed = delta * offset / (time / inteval);
			var destinationLeft = parseInt(list.style.left) + offset * delta;
			
			var go = function(){
				var intLeft =  parseInt(list.style.left);
				if((speed > 0 && intLeft < destinationLeft)||
				   (speed < 0 && intLeft > destinationLeft)){
				   	//精准的让图片移动，不会出现偏差
					if((intLeft < destinationLeft && intLeft + speed > destinationLeft)||
						intLeft > destinationLeft && intLeft + speed < destinationLeft){
						list.style.left = destinationLeft+'px';
					}else{
						list.style.left = intLeft + speed + 'px' ;
					}
					setTimeout(go,inteval);
				}else{
					//无缝连接图片
					if(intLeft >= 0){
						list.style.left = width * 4 + 'px' ;
					}else if(intLeft <= (width * 5)){
						list.style.left = width + 'px' ;
					}
					//判断是哪一张图片，对应小圆按钮
					if(delta < 0){
						index = (delta+index) < 0 ? index = Carousel_buttons_sum-1 : (delta+index) ;
					}else if(delta>0){
						index = (delta+index) > Carousel_buttons_sum-1 ? index = 0 : (delta+index) ; 
					}
					showCarousel_buttons(index);
					isanimate = false;
				}
			};
			go();
		}
	}

	//实现轮播图中小圆按钮的变换
	function showCarousel_buttons(index){
		for(var i = 0 ; i < Carousel_buttons_sum;i++){
			Carousel_buttons[i].className = '';
		}
		Carousel_buttons[index].className = 'on';
	}

	//实现轮播图小圆按钮点击功能
	for (var i = 0 ; i <Carousel_buttons_sum ; i++) {
		Carousel_buttons[i].onclick = function(){
			if(!isanimate){
				var myIndex = parseInt(this.getAttribute('index'));
				animate(myIndex-1-index,width);
			}
		};
	}

	//自动播放
	function autoplay(){
		clearInterval(timer);
		timer = setInterval(function(){
			next.onclick();
		},interval);
	}
	function stop(){
		clearInterval(timer);
	}
	
	//实现鼠标移进则停止轮播，移出轮播图则开始轮播
	Carousel.onmouseover = stop;
	Carousel.onmouseout = autoplay;

	autoplay();
}