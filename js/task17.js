/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/
var AqiChartWrap=document.getElementById("aqi-chart-wrap");
var GraTime=document.getElementsByName("gra-time");
var CitySelect=document.getElementById("city-select");
// 事件绑定函数
function addEventHandler(ele, event, hanlder) {
    if (ele.addEventListener) {
        ele.addEventListener(event, hanlder, false);
    } else if (ele.attachEvent) {
        ele.attachEvent("on"+event, hanlder);
    } else  {
        ele["on" + event] = hanlder;
    }
}
// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = ''
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: "北京",
  nowGraTime: "day"
}

/**
 * 渲染图表
 */
function renderChart() {
	var str=""; 
	AqiChartWrap.innerHTML=""; //清空上一次添加的节点
   for(var title in chartData){
   	var div=document.createElement("div");
   	div.title=title+":"+chartData[title];
   	div.style.height=chartData[title];
   	div.style.backgroundColor="#"+ Math.floor(Math.random() * 0xFFFFFF).toString(16);//生成随机颜色
    AqiChartWrap.appendChild(div);
   }
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
  // 确定是否选项发生了变化 
 if(this.value!=pageState.nowGraTime){
 	// 设置对应数据
 	pageState.nowGraTime=this.value;
 	initAqiChartData();
 	// 调用图表渲染函数
 	renderChart();
 }
 
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
   if(this.value!=pageState.nowSelectCity){
 	// 设置对应数据
 	pageState.nowSelectCity=this.value;
 	initAqiChartData();	
 	// 调用图表渲染函数
 	renderChart();
 }
 
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
   for(var i=0;i<GraTime.length;i++){
   addEventHandler(GraTime[i],"click",graTimeChange);
   }
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
   var str="";
    for(var cityname in aqiSourceData){
       str+="<option>"+cityname+"</option>";
    }
    CitySelect.innerHTML=str;
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  addEventHandler(CitySelect,"change",citySelectChange);
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
  chartData={};  //清空chartdate
  var SelCityData=aqiSourceData[pageState.nowSelectCity];
  if(pageState.nowGraTime=="day"){
	chartData=SelCityData;
  }
  if(pageState.nowGraTime=="week"){
  	var weekData=0,dayNum=0,weekNum=1;
    for(var date in SelCityData){
    	dayNum++; 
    	weekData+=SelCityData[date];
        if(new Date(date).getDay()==0){
          chartData[pageState.nowSelectCity+"第"+weekNum+"周品平均污染数据"]=Math.floor(weekData/dayNum);
          weekNum++;
          weekData=0; 
          dayNum=0;
       }
    }
  }
  if(pageState.nowGraTime=="month"){
  	var Fmonth=0,Smonth=0,Tmonth=0;
  	var FmonthNum=0,SmonthNum=0,TmonthNum=0;
    for(var date in SelCityData){
      	if(new Date(date).getMonth()==0){
           Fmonth+=SelCityData[date];
           FmonthNum++;
      	}
      	else if(new Date(date).getMonth()==1){
      	   Smonth+=SelCityData[date];
      	   SmonthNum++;
      	}
      	else{
      	   Tmonth+=SelCityData[date];
      	   TmonthNum++;
      	}
     } 
     chartData[pageState.nowSelectCity+"一月平均污染数据"]=Math.floor(Fmonth/FmonthNum);
     chartData[pageState.nowSelectCity+"二月平均污染数据"]=Math.floor(Smonth/SmonthNum);
     chartData[pageState.nowSelectCity+"三月平均污染数据"]=Math.floor(Tmonth/TmonthNum);
  }
  // console.log(chartData);
}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm();
  initCitySelector();
  initAqiChartData();
  renderChart();
}

init();