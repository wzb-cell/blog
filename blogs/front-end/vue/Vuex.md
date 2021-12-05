---
title: vuex
date: '2021-12-02 08:00:00'
sidebar: 'auto'
categories:
 - FrontEnd
tags:
 - vue
publish: true
---
## Vuex

### 一、定义

- Vuex是一个转为Vue.js应用程序开发的状态管理模式
- 状态管理到底是什么？
  - **状态管理模式、集中式存储管理**这些名词听起来就非常高大上，让人捉摸不透。
  - 其实，你可以简单的将其看成把需要多个组件共享的变量全部存储在一个对象里面。
  - 然后，将这个对象放在顶层的Vue实例中，让其他组件可以使用。
  - 那么，多个组件是不是就可以共享这个对象中的所有变量属性了呢？
- 为什么官方还要专门出一个插件Vuex呢？难道我们不能自己封装一个对象来管理吗？
  - 当然可以，只是我们要先想想VueJS带给我们最大的便利是什么呢？没错，就是响应式。
  - 如果你自己封装实现一个对象能不能保证它里面所有的属性做到响应式呢？当然也可以，只是自己封装可能稍微麻烦一些。
  - 不用怀疑，Vuex就是为了提供这样一个在多个组件间共享状态的插件，用它就可以了。

#### 1. 状态管理

- 把需要多个组件共享的变量全部存储在一个对象里面
- 然后将这个对象放在顶层的Vue的实例中，让其他组件可以使用
- 虽然使用prototype（原型），但是却达不到响应式的效果

##### 1）包含的状态

- 登陆状态、商品的收藏、购物车的物品

### 二、Vuex的使用

#### 1. 单页面的状态管理

<img src="https://man957.oss-cn-hangzhou.aliyuncs.com/img/image-20210630171627095.png" alt="image-20210630171627095" style="zoom:120%;float:center" />

- Actions主要是用来处理异步请求的  backend（后端）
- Mutations主要是用来处理同步请求的
- Devtools是用来记录修改日志的

#### 2.多页面的状态管理

##### 1）vuex的安装

```vue
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use('vuex')

const store = new Vuex.Store({
	state:{
		counter:1000
	},
	mutations:{
		//方法
		increment(state){
			state.counter++;
		},
		decrement(state){
			state.counter++;
		}
	},
//主要做一些异步操作
	actions:{
	},
//相当于一些计算属性
	getters:{
	},
//划分不同的模块，对该模块进行相关数据的保存
	modules:{
	}
})

export default store
```

##### 2）vuex的使用

```vue
拿公用的属性
this.$store.state.counter
拿公用的方法
this.$store.commit('increment')
this.$store.commit('decrement')
```

##### 3）State单一状态树

- 如果状态信息是保存到多个Store对象中的，那么之后的管理和维护等等都会变得十分困难
- 所以Vuex也使用了单一状态树来管理应用层级的全部状态
- 单一状态树能够让我们最直接的方式找到某个状态片段，而且在之后的维护和调试过程中，也可以非常方便的管理和维护

##### 4）getters的使用

```js

const store = new Vuex.Store({
	state:{
		counter:1000,
		students:[
			{age:18,name:'zhangsan'},
			{age:17,name:'wangsan'},
			{age:16,name:'lisi'},
			{age:13,name:'mazi'},
]
	},
	mutations:{
		//方法
		increment(state){
			state.counter++;
		},
		decrement(state){
			state.counter++;
		}
	},
//主要做一些异步操作
	actions:{
	},
//相当于一些计算属性(主要是存放一些需要经过处理得到的数据)
	getters:{
		powerCounter(state){
			return state.counter*state.counter
		},
		//通过传递参数拿到我们想要的数据
		moreAgeStu(state){
			return function(age){
				return state.students.filter(s=>s.age>age)
			}
		}
	},
//划分不同的模块，对该模块进行相关数据的保存
	modules:{
	}
})

```

##### 5）Mutation

- Vuex的store状态的更新的唯一方式：提交Mutation
- Mutation主要包括两部分：
  - 字符串的事件类型（type）
  - 一个回调函数（handler），该回调函数的第一个参数就是state
  - 当有多个参数的时候，第一个参数依旧是state，多余的参数后面接着写就可以了。这种现象称为mutation的载荷



###### Mutation的提交风格

```vue
//1.普通的提交方式
this.$store.commit('incrementCount',count)

//2.特殊的提交方式
this.$store.commit({
	type:incrementCount,
	count,//ES6的增强写法
	age:18
})
当在后面接受前面提交的参数时，是以对象的方式进行接受的
```

###### Mutation的响应规则

- 提前在store中初始化好所需的属性
- 当给state中的对象添加新属性时，使用下面的方式：
  - 使用Vue.set(obj , 'newProp' ,  123)
  - 给info赋值一个新的对象  state.info = {....state.info , 'height' :payload.height}
- 当给state中的对象删除属性的时候
  - Vue.delete(obj , 'prop')

###### Mutation常量类型

- 在开发项目的时候，mutation江湖存在很多的事件类型（其中的方法名称），为了避免在书写过程中不小心出现错误，所以会采用常量的方法进行替换

###### Mutation同步函数

- 主要的原因时当我们使用devtools时，devtools可以帮助我们捕捉到mutation的快照
- 但是如果是异步操作，那么devtools将不能很好的追踪到这个操作什么时候会被完成

##### 6）action的使用

###### 定义

- 组件中，如果发送的请求是同步的请求，组件自己可以直接向mutation发送，但是如果是异步请求，必须先经过Action进行出处理，否则异步传输devtools无法检测到这个数据发生改变。
- 需求：如果异步执行发生成功的时候，想要告诉外面里面已经执行完毕。可以通过传入函数的方式进行执行，当action中提交完毕之后，便可以调用该函数，从而达到消息传递的效果

###### 利用Promise执行成功时的通知

```vue
//第一步 ：组件执行dispatch方法
updateInfo(){
	this.$store
	.dispatch('aUpdataInfo','我是携带的信息')
//通过then方法对返回的结果进行处理
	.then(res =>{
		console.log('里面完成了提交');
		console.log(res);
	})	
}

//第二步 ： Action对于组件分配的异步请求进行处理
Action :{
	aUpdataInfo(context,payload){
		return new Promise((resolve,reject)=>{
			setTimeout(()=>{
				context.commit('updateInfo');
				console.log(payload);
				resolve("1111111")/返回请求后的结果
			},1000)
		})

}

}
```

##### 7）modules的使用

```vue
const moduleA = {
    state:{
         name:'zhangsan'
    },
	mutations:{
		//方法
		updataName(state,payload){
			state.name = payload
		}
	},
//主要做一些异步操作
	actions:{
		aUpdateName(context){
			//模块的只能提交到自己的mutations里
			context.commit('updateName','wangwu')
		}
	},
//相当于一些计算属性(主要是存放一些需要经过处理得到的数据)
	getters:{
		//state模块本身状态
		//getters 模块a本身的
		//rootState代表可以访问父元素状态
		fullname3(state,getters,rootState){
			
		}
	},
}
const store = new Vuex.Store({
	state:{
		counter:1000,
		students:[
			{age:18,name:'zhangsan'},
			{age:17,name:'wangsan'},
			{age:16,name:'lisi'},
			{age:13,name:'mazi'},
		]
	},
	mutations:{
		//方法
		increment(state){
			state.counter++;
		},
		decrement(state){
			state.counter++;
		}
	},
//主要做一些异步操作
	actions:{
		//数据的
	},
//相当于一些计算属性(主要是存放一些需要经过处理得到的数据)
	getters:{
		powerCounter(state){
			return state.counter*state.counter
		},
		//通过传递参数拿到我们想要的数据
		moreAgeStu(state){
			return function(age){
				return state.students.filter(s=>s.age>age)
			}
		}
	},
//划分不同的模块，对该模块进行相关数据的保存
	modules:{
		a:moduleA
	}
})
```

###### 对象的解构

```vue
const moduleA ={
	// ...
	action :{
		increment({state,commit,rootState}){
			if(state.count == 1000){
				commit('incrementAdd')
			}
		}
	}
}
```

- 对象的解构

```vue 
const obj ={
	name: 'kobe',
	age : 30
}
const {name , age} =obj
```

- 数组的解构（用的比较少）

```vue
const  names = ['why','kobe','james'];
const [name1,name2,name3] = names;
```

