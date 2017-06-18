/*
* @Author: xuhegang
* @Date:   2017-06-15 16:47:54
* @Last Modified by:   xuhegang
* @Last Modified time: 2017-06-18 17:40:11
*/
//根据id获得元素
function $(id){
	return document.getElementById(id);
}
//通用事件处理函数
function addEventHandler(ele, event, hanlder) {
    if (ele.addEventListener) {
        ele.addEventListener(event, hanlder, false);
    } else if (ele.attachEvent) {
        ele.attachEvent("on"+event, hanlder);
    } else  {
        ele["on" + event] = hanlder;
    }
}

function getTarget(e){
	   var ev=e||window.event;
       return ev.target||ev.srcElement;
}


function RegEvent(container){
   var container=$(container);
   var displayArea=container.getElementsByClassName("display")[0];
   var inputArea=container.getElementsByClassName("input-text")[0];
   var data=[];
   var that=this;
   //点击事件代理
   var delegateClickEvent=function(){
   	  addEventHandler(container,"click",function(ev){
       var target=getTarget(ev);
       if(target.tagName.toUpperCase()==="SPAN"){
        removeItem(target.value);
       }
       if(target.className==="hobby-btn"){
         var value=inputArea.value;
         addItem(value);
       }
   	  });
   } 
  //键盘事件代理
   var delegateKeyupEvent=function(){
      addEventHandler(container,"keyup",function(ev){
       var target=getTarget(ev);
       if(target.className==="input-text"){ 
       	var value=inputArea.value;
       	if (/[,，]/g.test(value)===true||ev.keyCode === 13||ev.keyCode===32) {		
         addItem(value); 
         inputArea.value="";
        }
       }
   	  });
   }

   var delegateMouseover=function(){
      addEventHandler(container,"mouseover",function(ev) {
         var target=getTarget(ev);
         if(target.tagName.toUpperCase()==="SPAN"){
         	target.style.backgroundColor="blue";
         	target.source=target.innerHTML;
         	target.innerHTML="点击删除: "+target.source;
         }
      });
   }

   var delegateMouseout=function(){
      addEventHandler(container,"mouseout",function(ev) {
         var target=getTarget(ev);
         if(target.tagName.toUpperCase()==="SPAN"){
         	target.style.backgroundColor="red";
         	target.innerHTML=target.source;
         }
      });
   }
   
   function addItem(value){
   	   data=data.concat(splitInput(value)); 
   	  //console.log(data)
   	   data=delRepeat();
   	   render();
   }
   
   function removeItem(value){
       data.splice(data.indexOf(value),1);
       render();
   }

   function render(){
   displayArea.innerHTML=data.map(function(d){   //遍历data数组 增加div元素节点
		return "<span style='background-color:red'>"+d+"</span>"+"&nbsp;&nbsp;";
	}).join("");
   }

   function splitInput(str) {
   return str.split(/[\n,，\s]/g).filter(function(d){
     	if(d!=null&&d!="")return true;
     });
 }

   //数组去重
   function delRepeat(){
     var res = [data[0]];
    for(var i = 1; i < data.length; i++){
     var repeat = false;
       for(var j = 0; j < res.length; j++){
        if(data[i] == res[j]){
         repeat = true;
         break;
       }
     }
     if(!repeat){
      res.push(data[i]);
      }
    } console.log(res);
    return res;
   }

   this.init=function(flag){
   	if(flag===true)delegateKeyupEvent();
   	delegateClickEvent();
   	delegateMouseover();
   	delegateMouseout();
   }
}

 var tag = new RegEvent("tags-container");
 var hobby=new RegEvent("hobbies-container");

 tag.init(true);
 hobby.init();