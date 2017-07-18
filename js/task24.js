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

//事件代理函数
function delegateEvent(element, tag, eventName, listener) {
            addEventHandler(element, eventName, function () {
                var event = arguments[0] || window.event,
                    target = event.target || event.srcElement;
                if (target && target.type === tag.toLowerCase()) {
                    listener.call(target, event);
                }
            })
}
//根据id获得元素
function $(id){
  return document.getElementById(id);
}

var traversalResult=[];
var head=null;
var timer=null;
var root=document.getElementsByClassName("root")[0];
var body=document.getElementsByTagName("body")[0];
var search=$("search");
//前序遍历
function getPreOrderResult(node) {
         if(node !== null) {
                    traversalResult.push(node);
                    getInOrderResult(node.firstElementChild);
                    getInOrderResult(node.lastElementChild);
          }       
}
//中序遍历
function getInOrderResult(node) {
         if(node !== null) {
                    getInOrderResult(node.firstElementChild);
                    traversalResult.push(node);
                    getInOrderResult(node.lastElementChild);
          }       
}
//后续遍历
function getPostOrderResult(node) {
         if(node !== null) {
                    getInOrderResult(node.firstElementChild);  
                    getInOrderResult(node.lastElementChild);
                    traversalResult.push(node);
          }       
}

function show(){
  head=traversalResult.shift();
  if(head){
  var curval=parseInt(head.firstChild.nodeValue);
  if(curval==search.value){
  	//clearTimeout(timer);
  	head.style.backgroundColor="pink";//因为渲染元素线程问题，保证先渲染
  	setTimeout(function(){alert("查找内容"+curval+"已变为粉色");},0);
  }
  else{
     head.style.backgroundColor="#6fa3ff";     //改变正在遍历的元素的颜色
     timer=setTimeout(function(){
        head.style.backgroundColor="white";   //1s后变为原颜色
        show();
     }, 1000);
   }
 }
}

function reset(){
    clearTimeout(timer);
    traversalResult=[];
    if(head){
    head.style.backgroundColor="white";
    }
}

//根据button的ID分配处理函数
 function distribute(){
  if(this.id=="pre"){
    reset();getPreOrderResult(root);show();
  }
  if(this.id=="inOrder"){
    reset();getInOrderResult(root);show();
  }
  if(this.id=="post"){
    reset();getPostOrderResult(root);show();
  }
 }

 function select(){
   this.style.backgroundColor="pink";
}
delegateEvent(body,"button","click",distribute);
delegateEvent(body,"div","click",select)
