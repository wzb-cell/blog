---
title: Promise
date: '2021-12-02 08:00:00'
sidebar: 'auto'
categories:
 - FrontEnd
tags:
 - vue
publish: true
---
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

- Promise .resolve()：将数据包装成Promise对象，并且在内部回调resolve()函数

- Promise .reject()：将数据包装成Promise对象，并且在内部回调reject()函数

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



