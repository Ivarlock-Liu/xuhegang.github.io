/*
* @Author: xuhegang
* @Date:   2017-06-07 12:10:18
* @Last Modified by:   xuhegang
* @Last Modified time: 2017-06-18 17:57:35
*/
    // 获取第一个匹配元素
  $=function(str){return document.querySelector(str)};
  var data=[];
  var val="";
  var col={};
 
 function deal(arrmethod,method){
    return function(){
     	try{var val= typeof method==="function"?method():null;
        arrmethod.call(data,val);
        getRandomCol(1,this);
        render();
      }catch(ex){
      	alert(ex.message)
      }
    } 
 }
  
 function getInputValue(){
 	val=parseInt($("input").value);
 	if($("#result").childNodes.length>59) throw new Error("元素队列数最多为60");
 	if(validate(val)){
 	 if(val<10) throw new Error("请输入10-100的数字");
     return val;
   }else{throw new Error("请输入整数");}

 }

function validate(str) {
      return /^\d+$/.test(str);   
    }


function render(){
// $("#result").innerHTML=data.map(function(d){   //遍历data数组 增加div元素节点
// 	return "<div>"+d+"</div>";
// }).join("");
  $("#result").innerHTML="";
  data.map(function(d){                  //遍历data数组 增加div元素节点
  var div=document.createElement("div");
  div.style.height=d+"%";
  div.style.backgroundColor=col[d];
  div.innerHTML="<p>"+d+"</p>";
  $("#result").appendChild(div);
  });
  // $("#result").appendChild(newChild)

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

function getRandomCol(addOneFlag,that){   //建立污染数字值-随机颜色关系 防止排序后颜色错乱
     if(addOneFlag!=1){
	 for(var i=0;i<data.length;i++){
	 	var rand = Math.floor(Math.random() * 0xFFFFFF).toString(16);
	 	if(rand.length==6){    //避免无效颜色值
		col[data[i]]="#"+ rand;
		}else{
			i--;
		}  	
      }
    } else{
    	var num=(that.id==="left-in")?0:data.length-1;
    	var rand=Math.floor(Math.random()* 0xFFFFFF).toString(16)
    		if(rand.length==6)col[data[num]]="#"+rand;
    	    else{ getRandomCol(addOneFlag,that);}
    	}
    }
  
 $("#random").onclick=function(){
  	   data=[];
       for(var i=0;i<60;i++){
       var ranData=parseInt(Math.random()*91)+10;
       data.push(ranData);
       }
       getRandomCol();
       render();
  } 

 $("#sort-data").onclick=function(){
		var i = 0,j = 1,temp;
				len = data.length;
				timer = null;
		timer = setInterval(run,1);
		function run() {
			if (i < len) {
				if (j < len) {
					if (data[i] > data[j]) {
						temp = data[i];
						data[i] = data[j];
						data[j] = temp;
						render();
					}
					j++;
				} else {
					i++;
					j = i + 1;
				}
			} else {
				clearInterval(timer);
			    return;
			}
		}
	}
