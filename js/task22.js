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
                if (target && target.tagName === tag.toUpperCase()) {
                    listener.call(target, event);
                }
            })
}

function $(id){
  return document.getElementById(id);
}

var traversalResult=[];
var head=null;
var timer=null;
var root=document.getElementsByClassName("root")[0];
var body=ducument.getElementsByTagName("body")[0];
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
  if(head!=null){
     head.style.backgroundColor="blue";
     timer=setTimeout(function(){
        head.style.backgroundColor="white";
        show();
     }, 1000)
   }
}

delegateEvent(body,"")

getInOrderResult(root);
show();