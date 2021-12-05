---
title: 组件
date: '2021-12-02 08:00:00'
sidebar: 'auto'
categories:
 - FrontEnd
tags:
 - vue
publish: true
---
# vue_组件

## 组件

### 组件的注册

- 创建组件构造器
- 注册组件
- 使用组件

````vue
//使用
<div id='app'>
    <my-cpn></my-cpn>
</div>
//创建
<script>
    //这种注册方式不推荐使用
	const myComponent = Vue.extend({
        template:`
			相似于html中的body
		`
    });
</script>
//注册（起个名字）
Vue.component('my-cpn',myComponent);
let app = new Vue({
	el:'#app'
})
````

第一步通过vue.extend({template:模板代码})，获得组件的容器，第二步通过vue.component(自定义的组件的标签名，容器)；第三步使用组件：<自定义标签名><\自定义标签名>注意：该标签只有在vue的挂载的元素内，浏览器才认识（另外通过该种方式创建的组件是全局组件）,在vue实力内部创建的组件是局部组件

### 父子组件

父组件的挂载的元素使用了组件的话，默认的情况下会先从该挂载的vue实例中的components中寻找局部组件，如果局部组件不存在，则从全局组件中进行查找，如果没找到则会报红

### 全局组件和局部组件
全局组件： 全局都可以使用
局部组件：只有挂载的元素下才可以进行使用

#### 全局组件的语法糖

为了简化注册流程，提供注册语法糖。主要省掉了Vue.extend()的步骤，而是直接使用一个对象来代替

````vue
//语法糖的注册方式（创建和注册放到一块了）
 	Vue.component('my-cpn',{
        template:`
			相似于html中的body	
	`});
//注册局部组件的语法糖与全局的相似
const app = new Vue({
	el:'#app',
	data:{
		message:'星辰大海'
	},
	components:{
		'cpn2':{
        template:`
			相似于html中的body	
	`}
	}
})
````




## 组件模块的分离写法

````vue
	//第一种写法(其中的id属性其实是与自定义的组件名进行绑定的)

	//第三步创建组件的模板
	<script type="text/x-template" id="cpn">
		<div>
        	<h2>组件标题</h2>
        	<p>组件的内容</p>
        </div>
	</script>
	第一步引入vue文件
	<script src='../js/vue.js'></script>
	第二步创建vue实例，然后再创建自己的组件
	<script>
		let app = new vue({
            el: '#app',
            data:{
                message: '前面的征途'
            },
            components:{
                'my-cpn':{
                    template:'#cpn'
                }
            }
        })
	</script>
	//第二种写法
	<template id="myCpn">
        <div>
            <h2>我是组件的第二种方式</h2>
			<p></p>
        </div>
	</template>
````

## 组件数据的存放

### 为什么不放vue实例的data中？

主要原因是：如果所有的数据都存储到这里，会导致区分特别麻烦

### 组件数据的存放的位置

组件自己也有data属性，但是只能存放函数，不能存放对象

但是可以通过这个函数返回一个对象，对象内部保存着数据

````vue
vue.component('cpn',{
	template: '#cpn',
	data() {
		return {
			title :'abc'
		}
	}
})
````

### 组件中为什么data只能是函数？
首先，组件的产生是为了能更好的复用。如果组件的data是一个对象，当所有引用该组件的地方，其实获得是相同的数据对象，所以一改则会改全部。只用通过函数的类型返回个不同的数据对象的时候，才能达到独立处理的效果
## 父子组件的通信
### 为什么要父子组件间进行通信？
按vue自定义的规则来讲，子组件是不能引用父组件或者vue实例的数据。但是正常的情况下，我们往往需要从上层向下层传递数据进行逐级的展示。
### 如何进行父子组件间的通信呢？
#### 父->子   通过props(properties)向子组件传递消息
````vue
const cpn ={
	template: '#cpn',
	//1.数组的方式(缺点：看着有点像字符串，并不知道其属性是什么)
	props: ['cmovies','cmessage'],
	//2.通过对象的方式的进行属性、类型、默认值等的限制（推荐使用）
	props: {
		cmessage:{
			type: String,
			default: 'adad',
			required: true
		}
		//数组和对象的默认值有点特殊,默认值必须是一个函数
		cmoives:{
			type: Array,
			default() {
				return []
			}
		}
	},
	//组件中data必须是函数的属性
	data(){
		return {}
	},
}
````
#### 遇到驼峰表示可能会产生的一些问题
````vue
<div id='app'>
	v-bind是不支持驼峰的，否则会产生找不到该变量
	通过v-bind使其与父组件的data数据进行绑定，从而使得可以进行访问
	<cpn :c-info="info" :child-my-message="message"></cpn>
</div>
<template>
	//模板中当包含多个元素时，必须含有根标签
</template>
//引入vue.js文件
<script src="../js/vue.js"></script>
<script>
	const cpn ={
		template:'#cpn',
		props:{
			cInfo:{
				type:Object,
				default():{
					return();
				}
			}
		}
	}
</script>
````
#### 子->父  通过事件（$emit Events）向父组件发送消息

````vue
<div id='app'>
	v-bind是不支持驼峰的，否则会产生找不到该变量
	通过v-bind使其与父组件的data数据进行绑定，从而使得可以进行访问
	<cpn :c-info="info" :child-my-message="message"></cpn>
</div>
<template>
	//模板中当包含多个元素时，必须含有根标签
</template>
//引入vue.js文件
<script src="../js/vue.js"></script>
<script>
	const cpn ={
		template:'#cpn',
        methods:{
            btnClick(item){
                //向父组件发送事件，另外发送的事件的命名规则暂时不要使用驼峰式（学完Spring Boot可以使用）
                this.$emit('item-click',item);//相当于是一个自定义的事件
                //发送到父组件之后，父组件通过v-on进行监听，如果发送则响应相应的函数进行处理
            }
        }
	}
</script>
````

### v-model本质

````vue

<input type="text" v-model="dnumber2">
//等同于下面这句话
<input type="text" :value="dnumber2" @input="num2Input">
const app = new Vue({
	el:'#app',
	data:{
		num1:1,
		num2:2
	},
	methods:{
		num2change(value){
			return this.dnumber1;
		}
	},
	components:{
		cpn:{
			template:'#cpn',
			props:{
				number1:Number,
				number2:Number
			},
			data(){
				return{
					dnumber1:this.number1,
					dnumber2:this.number2
				}
			},
			methods:{
				num2Input(event){
					this.dnumber1 = event.target.value;
					this.$emit('num2change',this.dnumber1);
				}
			}
		}
	}
})

//第二种实现方式（）通过watch事件进行监听
const app = new Vue({
	el:'#app',
	data:{
		num1:1,
		num2:2
	},
	methods:{
		num2change(value){
			return this.dnumber1;
		}
	},
	components:{
		cpn:{
			template:'#cpn',
			props:{
				number1:Number,
				number2:Number
			},
			data(){
				return{
					dnumber1:this.number1,
					dnumber2:this.number2
				}
			},
			methods:{
				num2Input(event){
					this.dnumber1 = event.target.value;
					this.$emit('num2change',this.dnumber1);
				}
			},
			watch:{
				dnumber1(newValue){
					this.dnumber2 = newValue * 100;
					this.$emit('num1change',newValue);
				},
				dnumber2(newValue){
					this.dnumber1 = newValue / 100;
					this.$emit('num2change',newValue);
				}
			}
		}
	}
})
````

## 父子组件的访问方式

### 父组件访问子组件

#### $children 或$refs(reference)方式

使用$children 或$refs(reference)（翻译为：引用）

使用$children(不推荐)，使用该语法获取其下的所有组件，但是他是对以数组的方式进行返回的。所以当我们对其下的组件进行访问的时候，我们只能通过下标的方式进行。但是一旦子组件增加的时候，所以对应的下标便会发生改变

````
btnClickc(){
	console.log(this.$children);
	for(let c of this.$children){
		console.log(c.name);
		c.showMessage();
	}
}
````

使用$refs=> 对象类型，默认是一个空的对象 必须给其子组件写属性ref=' ',产生唯一的标识(通过给这个标识，从而达到避免上面情况的发生)！！！经常使用

````vue
console.log(this.$refs.aaa.name);
````

### 子组件访问父组件

#### $parent 或者$root方式

使用$parent 或者$root

访问父组件$parent(因为耦合性太强不推荐使用)，若是访问了父组件，但是访问了父组件的某些属性，如果要是把他放到其他的组件中，但是其父组件不一定有其相关的属性

访问根组件$root(this.$root.message)(用的相对比较少)

### 组件化高级

#### slot插槽的基本使用

插槽的定义：将共性抽取到组件，将不同暴露为插槽。一旦我们预留了插槽，就可以让使用者更具自己得需求，决定插槽中插入什么内容

````vue
<slot></slot>
<div id="app">
    <cpn></cpn>//不写的话使用默认值
    <cpn><p>自定义的卡槽接口</p></cpn>//如果里面有多个元素标签，全部作为替换元素
</div>
<template id="cpn">
	<div>
        <h1>未来</h1>
        <p>征途将是星辰大海</p>
        <slot><button>默认值</button></slot>
    </div>
</template>
````

具名插槽：

````vue
<div id="app">
    <cpn></cpn>//不写的话使用默认值
    <cpn><p solt="left">自定义的卡槽接口</p></cpn>//替换指定插槽的值
</div>
<template id="cpn">
	<div>
        <h1>未来</h1>
        <p>征途将是星辰大海</p>
        <slot name="left"><button>左边</button></slot>
        <slot name="center"><button>中间</button></slot>
        <slot name="right"><button>右边</button></slot>
    </div>
</template>
````

### 编译的作用域

```vue
//vue实例的作用域（只会在vue实例的data里面拿数据）
<div id="app">
    <cpn v-show="isShow"></cpn>
    <cpn v-for="item in names"></cpn>
    //属性里面的变量isShow和names都是将从data中进行拿
</div>

//局部作用域，如果是组件内部模板使用了某些变量将优先从组件的内部的函数data中获取属性
<template id="cpn">
	<div>
       <h1>未来的征途将是星辰大海</h1> 
       <button v-show="isShow">按钮</button>
        //这里面的isShow属性将从cpn组件中的data()进行拿去
    </div>
</template>
```
### 作用域插槽
定义：父组件替换插槽的标签，内容由子组件进行提供。（父组件对子组件的展示效果不满意，需要自定义展示效果，但是数据的来源依然是子组件）
````vue
第二步  先使用，后修改自己想要的样式
<cpn>
<div>
    //为了更好的兼容所有的版本，vue2.多之后  直接修改即可
    //绑定插槽对象，获取子组件中的数据
    <template slot-scope="scope">
		<span v-for="item in scope.data">{{item}} - </span>
		//join(指定数据以某种方式进行链接)
		<span>{{slot.data.join(" * ")}}</span>
    </template>
</div>
</cpn>

第一步 将展示的内容放入插槽，只用这样我们才能有自定义的权限
<template id="cpn">
	<div>
       <h1>未来的征途将是星辰大海</h1> 
       <button v-show="isShow">按钮</button>
       	<slot>
       		//绑定组件中的数据
       		<ul :data="dataSource">
       			<li v-for="item in dataSource">{{item}}</li>
       		<ul>
		</slot>
    </div>
</template>
````

### 组件常见问题

1. 如果要给插槽绑定元素的时候需要给插槽另外嵌套一个元素标签，在元素标签里面对其操作。因为插槽里面执行相关操作，不一定会被实现
2. 组件数据的来源，默认的情况下，只与作用域有关——即所属于的模板用自己的数据，如果里面嵌套了其他的组件默认也是使用包装组件的数据
3. 作用域插槽更多是对子组件的展示效果不太满意，从而通过作用域插槽的方式对子组件数据的展示效果进行修改。

