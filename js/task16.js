/*
* @Author: xuhegang
* @Date:   2017-05-24 13:28:59
* @Last Modified by:   xuhegang
* @Last Modified time: 2017-06-02 10:45:57
*/

/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};
var str="";
var cityNameflag=false;
var cityPollflag=false;
/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-table表格，增加新增的数据
 */
function addAqiData() {
  
   var newData=[];
   var precityName=document.getElementById("aqi-city-input").value;
   var cityName=precityName.replace(/(^\s*)|(\s*$)/g,"");
   var prepolluNum=document.getElementById("aqi-value-input").value;
   var polluNum=prepolluNum.replace(/(^\s*)|(\s*$)/g,"");
   aqiData[cityName]=polluNum;
   
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
   str="<tr><td>城市</td><td>空气质量</td><td>操作</td></tr>";
   for(var prop in aqiData){
   	str+="<tr><td>"+prop+"</td><td>"+aqiData[prop]+"</td><td><button>删除</button></td></tr>";
   }
   document.getElementById("aqi-table").innerHTML=str;
   // console.log(aqiData);
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
  if(cityNameflag&&cityPollflag){
  addAqiData();
  renderAqiList();
  }
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(e) {
    var e = e || window.event;
    var target = e.target || e.srcElement;
    if(target.nodeName =="BUTTON") {
      var trname=target.parentNode.parentNode.firstChild.innerHTML;
      // tr.parentNode.removeChild(target.parentNode.parentNode);
      // 更新aqidata对象
      delete aqiData[trname];
  }
  renderAqiList();
}

// 输入字符验证函数
function validate(e){
	var precityName=document.getElementById("aqi-city-input").value.replace(/(^\s*)|(\s*$)/g,"");
	var prepolluNum=document.getElementById("aqi-value-input").value.replace(/(^\s*)|(\s*$)/g,"");
    var ev = e || window.event;
    var target = e.target || e.srcElement;
    if(target.id=="aqi-city-input"){
        var chaPattern =/^([\u4E00-\uFA29]*[A-Z]*[a-z]*)+$/; //是否为中英文字符
        if(precityName.length==0){alert("城市名不能为空");}
    	else if(!chaPattern.test(precityName)){alert("城市名必须为中文或英文");}
    	else {cityNameflag=true;}
    }
    if(target.id=="aqi-value-input"){  
    	var numPattern=/^\d+$/;  //是否为大于0的整数
        if(prepolluNum.length==0){alert("污染指数不能为空");}
        else if(!numPattern.test(prepolluNum)){alert("污染指数必须为大于0的整数");}
        else {cityPollflag=true;}
    }
    if(!cityNameflag) document.getElementById("aqi-city-input").value="";
    if(!cityPollflag) document.getElementById("aqi-value-input").value="";
}

function init() {

  // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
 document.getElementById("add-btn").onclick=addBtnHandle;
  // 给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
 document.getElementById("aqi-table").onclick=delBtnHandle;
 // 输入框失去焦点时验证输入合法性
 document.getElementsByTagName("input")[0].onblur=validate;
 document.getElementsByTagName("input")[1].onblur=validate;
}


window.onload=function(){
	
    init();
}
