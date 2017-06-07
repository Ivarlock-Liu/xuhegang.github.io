/*
* @Author: xuhegang
* @Date:   2017-06-03 15:56:23
* @Last Modified by:   xuhegang
* @Last Modified time: 2017-06-07 09:59:05
*/
    
    
 // 获取第一个匹配元素
  $=function(str){return document.querySelector(str)};
 var data=[];
    
  
 function deal(Arrmethod,method){
    return function(){
     	try{
     	var val= typeof method==="function"?method():null;
        Arrmethod.call(data,val);
        render();
        }
      catch(ex) {alert(ex.message)}
    } 
 }
  
 function getInputValue(){
 	var val=$("input").value;
 	if(validate(val)){
     return val;
   }else{throw new Error("请出入整数");}
 }

function validate(str) {
      return /^\d+$/.test(str);   
    }


function render(){
	$("#result").innerHTML=data.map(function(d){   //遍历data数组 增加div元素节点
		return "<div>"+d+"</div>";
	}).join("");
	delEvent(); //注册点击删除事件
}
 $("#left-in").onclick=deal([].unshift,getInputValue); 
 $("#right-in").onclick=deal([].push,getInputValue);
 $("#left-out").onclick=deal([].shift);
 $("#right-out").onclick=deal([].pop);

 function delEvent(){
  for(var i=0;i<$("#result").childNodes.length;i++){
  	   // alert($("#result"));
       $("#result").childNodes[i].onclick=function(i){    //闭包
       	  return function(){
       	  	alert(data[i]);
       	  	data.splice(i,1);
       	  	render();
       	  }
       }(i)
  }
}







  