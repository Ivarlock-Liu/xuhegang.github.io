/*
* @Author: xuhegang
* @Date:   2017-06-10 11:38:32
* @Last Modified by:   xuhegang
* @Last Modified time: 2017-06-10 14:01:28
*/
// 获取第一个匹配元素
  $=function(str){return document.querySelector(str)};
 var data=[];
 var renderdata=[];  
  
 function deal(Arrmethod,method){
    return function(){
     	try{
     	var val= typeof method==="function"?method():null;
     	 val.map(function(d){
         Arrmethod.call(data,d);
         Arrmethod.call(renderdata,d);
         });
        render();
        }
      catch(ex) {alert(ex.message)}
    } 
 }
  
 function getInputValue(){
 	var str=$("#inputtext").value.trim();
 	return splitInput(str);
 }

function splitInput(str) {
     return str.split(" ").filter(function(d){
     	if(d!=null&&d!="")return true;
     });   
 }


function render(){
	
	$("#result").innerHTML=renderdata.map(function(d){   //遍历data数组 增加div元素节点
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
       	  	renderdata.splice(i,1);
       	  	render();
       	 }
       }(i)
  }
}

$("#searchBut").onclick=function(){
	var searchval=$("#search").value;
     renderdata=data.map(function(d){
    	return d.replace(new RegExp(searchval,"g"),"<span style='background-color:red'>"+searchval+"</span>");
    });
    render();
}
