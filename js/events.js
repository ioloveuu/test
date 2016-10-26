//绑定
function bind(obj,event,listener){
	if(!obj.event){
		obj.event = {};
	}
	if(!obj.event[event]){
		obj.event[event] = [];
	}
	console.log(obj);
	obj.event[event].push(listener);

}
//触发
function trigger(obj,event){
	try{
		var listeners = obj.event[event];

		for(var i=0;i<listeners.length;i++){
			listeners[i].call(obj);
		}
	}catch(e){
		// console.log('事件'+event+'没有绑定');

		throw new Error('事件'+event+'没有绑定');
	}
}

function off(obj,event,listener){

	try{
		if(!event){
			obj.event = {};
			return;
		}
		if(!listener){
			obj.event[event].length = 0;
			return;
		}
		var index = inArray(obj.event[event],listener);

		if(index != -1){
			obj.event[event].splice(index,1);
		}
	}catch(error){
		console.log(error);
	}
	
}

function inArray(arr,s){
	arr = arr || [];
	for(var i=0;i<arr.length;i++){
		if(arr[i] === s){
			return i;
		}
	}
	return -1;
}
//面对对象封装拖拽函数
var Drag = function(ele){
		this.ele = ele;
		//用来判断是否开启范围限制。
		this.isRange = false;
		this.init();
};
Drag.prototype = {
	constructor: Drag,
	init:function(){
		var self = this;
		this.ele.onmousedown = function(ev){
			var disx = ev.clientX - this.offsetLeft;
			var disy = ev.clientY - this.offsetTop;
			var that = this;
			trigger(self,'dragStart');
			document.onmousemove = function(ev){
				self.x = ev.clientX - disx;
				self.y = ev.clientY - disy;
				
				self.administerRange();

				that.style.left = self.x+'px';
				that.style.top = self.y+'px';
				trigger(self,'dragChange');
			};
			document.onmouseup = function(){

				this.onmousemove = this.onmouseup = null;
				trigger(self,'dragEnd');
			};
		};
	},
	range:function(opt){
		var docele = document.documentElement;
		opt = opt||{};
		opt.minLeft = opt.minLeft||0;
		opt.minTop = opt.minTop||0;
		opt.maxLeft = opt.maxLeft||docele.clientWidth - this.ele.offsetWidth;
		opt.maxTop = opt.maxTop||docele.clientHeight - this.ele.offsetHeight;

		this.opt = opt;
		this.isRange = true;
	},
	administerRange:function(){
		if(!this.isRange)return;

		var opt = this.opt;
		if(this.x<opt.minLeft){
			this.x = opt.minLeft
		}
		if(this.y<opt.minTop){
			this.y = opt.minTop
		}
		if(this.x>opt.maxLeft){
			this.x = opt.maxLeft
		}
		if(this.y>opt.maxTop){
			this.y = opt.maxTop
		}
	}
};
//滑块函数
var Slider = function(opt){

	opt = opt||{};
	this.min = opt.min || 10;
	this.max = opt.max || 100;
	this.value = opt.value || 50;
	this.init(opt.context);
};
Slider.prototype = {
	constructor:Slider,
	init:function(context){
		this.line = document.createElement('div');
		this.slider = this.line.cloneNode();
		this.line.style.cssText = 'width: 100%;height:4px;background:#ccc;position:relative';
		this.slider.style.cssText = 'width: 10px;height: 16px;background: black;position: absolute;left:0;top:-6px';
		this.line.appendChild(this.slider);
		context.appendChild(this.line);
		this.lineWidth = this.line.offsetWidth;
		this.sliderWidth = this.slider.offsetWidth/2;
		this.setValue();

		var self = this;
		var drag = new Drag(this.slider);

		drag.range({
			minLeft:0,
			maxLeft:this.lineWidth - this.slider.offsetWidth,
			minTop:-6,
			maxTop:-6
		});
		bind(drag,'dragStart',function(){
			console.log('开始拖拽');
		});
		bind(drag,'dragChange',function(){
			console.log('拖拽过程中');
			var scale = self.slider.offsetLeft/(self.lineWidth-self.sliderWidth*2);
			console.log(scale)
			self.value = Math.round(scale*(self.max - self.min)+self.min);
			
		});
		bind(drag,'dragEnd',function(){
			console.log('拖拽结束');
			trigger(self,'change');
		});
	},
	setValue:function(){
		//this.value是当前滑块位置
		//当前值在值范围之内所占比例
		var scale = (this.value - this.min)/(this.max - this.min);
		var left = scale*this.lineWidth-this.sliderWidth;

		this.slider.style.left = left+'px';
	},
	on:function(event,listener){
		bind(this,event,listener);
	},
	off:function(event,listener){
		off(this,event,listener);
	}
};