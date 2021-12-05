---
title: 模块化开发
date: 2021-12-28
categories:
 - frontEnd
tags:
 - vue
---
## 模块化开发

### 一、模块化

#### 1. 原因：

- 随着ajax的引入，前后端越来越分离。
- 客户端将对服务端请求过来的数据进行加工、处理、渲染，所以导致前端的代码越来越多。工作中项目的开发是多人共同进行的，所以难免会避免不了一些重名的问题（利用的全局变量），若是这样的话默写自己定义的属性可能会被其他的属性进行篡改，导致巨大的问题

#### 2. 解决的方法

- 匿名函数

````javascript
//匿名函数的使用,之所以加分号，是防止js在引入的时候出现冲突
;(function(){})()
//缺点：因为函数自己有自己作用域，所以函数的复用性会变得比较差
````

- 导出对象（模块化的基本封装）
````javaScript
//只需要记住模块化的名字即可，相对大量的变量命名的冲突会少的多
var moduleA = (function(){
    //利用该对象作为模块的出口
    var obj ={};
    obj.flag = true;
    obj.myfunc = function (info){
        console.log(info);
    };
    //返回对象
    return obj;
})();
````

- 模块化规范（CommonJS——>node、AMD、CMD、也有ES6中的Modules）
##### 1）CommonJS(了解)

- 核心：导出和导入

- CommonJS的导出
````javascript
module.exports = {
    flag : true,
    test(a,b){
        return a+b;
    }
}
````

- CommonJS的导入

```javascript
//CommonJS模块
let { test,demo,flag } = require('moduleA');
//等同于
let _mA =require('modeleA');
let test = _mA.test;
let demo = _mA.demo;
let flag = _mA.flag;
```

##### 2）ES6模块化实现

###### export导出

```javascript
//第一步设置引入的文件为module类型，保证js文件的独立性
<script src="./aaa.js" type="module"></script>
//第二步  在js文件中设置导出接口（对象），以至于外面可以访问内容文件
//aaa.js文件的内容
flag: true;
function sum(num1,num2){
    return num1+num2;
}
//第一种导出对象
exports{
    flag,sum，Person
}
//需要注意的是：对象在使用的时候必须new Person()进行创建
//第二种
export var flag = true;
export var height = 180;
//第三种  导出函数/类
export function sum(num1,num2){
    return num1+num2;
}
export class Person(){
    run(){
        console.log("征途将是星辰大海");
    }
}
//第四种  让用户自己定义名字，但是default只能有一个，如果出现多个将会区分不开
const address = "Zhangwan"
export default address;
//默认的使用方式
import ade from "./weizhi.js"(不存在则导入默认的方式)
console.log(ade);


```

###### import导入

```javascript
//导入{}定义的变量
Import {flag，sum} from "./aaa.js"
//全部导入
import * as aaa from "./vue/furture.js"
```

## Promise

### 一、定义

- Promise到底是做什么的呢？是异步编程的一种解决方案（把请求和数据的处理进行了分开处理）

```vue
执行流程：new--->构造函数（1.保存了一些状态信息  2.执行传入的函数）
在执行传入的回调函数时，会传入两个参数，resolve,reject本身又是函数
new Promise((resolve,reject) =>{
	setTimeOut(()=>{
		resolve('Hello World');
		reject('error message');
	},1000)
}).then((data)=>{
	console.log(data);
    console.log(data);
    console.log(data);
    console.log(data);
    console.log(data);
    console.log(data);
}).catch((err)=>{
	console.log(err);
    console.log(err);
    console.log(err);
    console.log(err);
    console.log(err);
    console.log(err);
})
第二种写法：
new Promise((resolve,reject) =>{
	setTimeOut(()=>{
		resolve('Hello World');
		reject('error message');
	},1000)
}).then((data)=>{
	console.log(data);
},err=>{
	console.log(error);
}) 
```



### 二、Promise的使用
#### 1. Promise的链式处理

```vue
<script>
new Promise((resolve,reject)=>{
    setTimeOut(()=>{
        resolve('aaa')
    },1000)
}).then(res=>{
    //自己处理10行代码
    console.log(res,'第一层的10行处理代码');
    return new Promise( resolve=>{
        resolve(res + '111')
    })
}).then(res=>{
    console.log(res,'第二层的10行处理代码');
    
    return new Promise(resolve=>{
        resolve(res +'222')
    })
}).then(res =>{
    console.log(res + '第三层的10行处理代码');
})
//当其中的处理不需要发送到请求的时候可以使用简介的写法
new Promise((resolve,reject)=>{
    setTimeOut(()=>{
        resolve('aaa')
    },1000)
}).then(res=>{
    //自己处理10行代码
    console.log(res,'第一层的10行处理代码');
    //对结果进行第一次处理

//  return new Promise( resolve=>{
//      resolve(res + '111')
    return Promise.resolve(res+'111')//等同于上面注释的代码
    return res+'111'
    })
}).then(res=>{
    console.log(res,'第二层的10行处理代码');
    
    return new Promise(resolve=>{
        resolve(res +'222')
    })
}).then(res =>{
    console.log(res + '第三层的10行处理代码');
})    
</script>
```
#### 2. Promise的all方法的使用

- 原因：当有一个需求需要同时拿到两个数据的时候，在进行下一步的时候，则可以利用promise的all方法

```vue
Promise.all([
	new Promise((resolve,reject) =>{
		$.ajax({
			url:'url1',
			success:function(data){
				resolve(data)
			}
		})
	}),
	new Promise((resolve,reject) =>{
		$.ajax({
			url:'url2',
			success:function(data){
				resolve(data)
			}
		})
	})
]).then(results=>{
	console.log(results);
})
```
