---
title: Webpack
date: '2021-12-02 08:00:00'
sidebar: 'auto'
categories:
 - FrontEnd
tags:
 - vue
publish: true
---
# Webpack

## 一、模块、打包

### 1.模块

#### 1）定义

- ES6之前模块化的开发必须要借助其他的工具，让我们可以进行模块化的开发
- 以前：模块化的开发之后，需要处理模块间各种依赖，并将其进行整合打包
- 使用webpack之后，使我们可以模块化开发，并且会帮助我们处理模块间的依赖关系
- js、css、图片、json文件等等在webpack中都可以当成模块进行使用

### 2.与grunt/gulp的区别

#### 1）定义

- grunt/gulp的核心是Task,配置一系列的task，并且定义task要处理的事务（例如ES6、ts转换，图片压缩，scss转成css）
- grunt/gulp来依次执行这些task，而且让整个流程自动化
- 被称为前端自动化管理工具

#### 2）不同

- grunt/gulp强调的是前端流程的自动化，模块化不是它的核心
- webpack强调模块化开发管理，而文件压缩合并、预处理等功能，是其附带的

![image-20210622191938758](https://man957.oss-cn-hangzhou.aliyuncs.com/img/image-20210622191938758.png)

### 3.webpack的安装

- 首先安装node.js
- 通过node.js进行安装  

```
//全局进行安装
npm install webpack@3.6.0 -g
```

## webpack的使用

### 一、webpack的基本使用

- 通过webpack对文件进行打包，在打包的过程中它会自动处理打包文件中的依赖关系。

````javascript
//通过控制台进行打包
webpack  将要打包的文件  打包后存放的位置
````

#### 1.commonjs的模块化规范

```javascript
//require就相当于import
const {add,mul} = require('./mathUtils.js');
console.log(add(20,30));
console.log(mul(20,30));
```

#### 2.使用ES6的模块化的规范;

````javascript
import {add,mul,height,age,name} from "./info"
console.log(add(20,30));
console.log(mul(20,30));
````

### 二、webpack的配置

```vue
package.json:通过npm init生成的，npm包管理的文件
```

#### 1.配置文件

- 第一种方式

```javascript
第一步 通过配置webpack.config.js文件配置相关的打包的内容
const path = require('path');
module.exports = {
    entry: './src/main.js',
    output: {
        //_dirname代表绝对路径，通过resolve将'dist'动态获取并进行拼接
        path: path.resolve(_dirname,'dist'),
        filename:'bundle.js'
    }
}
第二步 直接在控制台运行 webpack ;

如果不是webpack.config.js则需要执行命令  webpack 文件名
```

- 第二种方式

```javascript
通过向package.json文件映射的方式进行打包
通过在控制运行npm  run build命令进行
```

![image-20210622222107764](https://man957.oss-cn-hangzhou.aliyuncs.com/img/image-20210622222107764.png)

上面的webpack命令会优先去找本地的webpack

- 本地webpack的安装方式

```javascript
安装命令: npm install webpack@3.6.0 --save-dev(安装开发时的依赖)
```

#### 2.loader的使用

- loader作用其实就是对webpack的扩展，一些css格式的文件并不能通过webpack的方式进行打包

##### 1）css loader的使用

````javascript
//第一步 安装css类型文件的打包所需要的配置
安装命令: npm install --save-dev style-loader (安装开发时的依赖)
安装命令: npm install --save-dev css-loader (安装开发时的依赖)
//第二步 在webpack.config.js进行配置
module.exports = {
    entry: './src/main.js',
    output: {
        //_dirname代表绝对路径，通过resolve将'dist'动态获取并进行拼接
        path: path.resolve(_dirname,'dist'),
        filename:'bundle.js'
    },
    //配置css的loader加载文件
    module:{
        rules:[
            {
                //下面的是一个正则表达式，匹配所有的.css文件
                test:/\.css$/,
                //css-loader只负责将css文件进行加载
                //style-loader负责将样式添加到DOM中
                //使用多个loader时，默认从右向左读
                
                use:['style-loader','css-loader']
            }
        ]
    }
}
````

##### 2）less loader的使用

```javascript
//第一步 安装less类型文件的打包所需要的配置
安装命令: npm install --save-dev style-loader (安装开发时的依赖)
安装命令: npm install --save-dev css-loader (安装开发时的依赖)
安装命令: npm install --save-dev less-loader (安装开发时的依赖)
//第二步 在webpack.config.js进行配置
module.exports = {
    entry: './src/main.js',
    output: {
        //_dirname代表绝对路径，通过resolve将'dist'动态获取并进行拼接
        path: path.resolve(_dirname,'dist'),
        filename:'bundle.js'
    },
   
    module:{
        rules:[
            {
                 //配置css的loader加载文件
                //下面的是一个正则表达式，匹配所有的.css文件
                test:/\.css$/,
                //css-loader只负责将css文件进行加载
                //style-loader负责将样式添加到DOM中
                //使用多个loader时，默认从右向左读
                
                use:['style-loader','css-loader']
            },
            {
                test:/\.less$/,
                use:[{
                    loader:"style-loader" // 转化的样式导入到dom文件中
                },{
                    loader:"css-loader" //将css转化为commonjs
                },{
                    loader:"less-loader" //将less进行加载，加载之后将less文件转化为css文件
                }]
            }
        ]
    }
}
```

##### 3）url loader的使用

````javascript
 	{
        test: /\.(png|jpg|gif|jpeg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              //当加载的图片小于limit的时候，编译成base64字符串的形式进行展示
              //大于的时候，需要通过file-loade模块进行加载
              limit: 8192,
              //对打包后的图片自定义的命名
              //打包到img文件夹中，(web.jpeg)其中命名的规则 = web.(hash值).jpeg
              //img/代表的是文件夹
                img/name 代表所有打包的图片命名为name
                [name] 变量，图片原来的属性名
              name: 'img/[name].[hash:8].[ext]'
            }
          }
        ]
      }
````

- 虽然超过limit限制的图片可以被编译，但是编译后默认访问的位置是html所在的目录下，但是如果打包到其他的地方则会造成文件找不到的问题。需要在webpack.config.js下配置以下属性：

```javascript
module.exports = {
    entry: './src/main.js',
    output: {
        //_dirname代表绝对路径，通过resolve将'dist'动态获取并进行拼接
        path: path.resolve(_dirname,'dist'),
        filename:'bundle.js',
        //为默认的读取的路径，添加指定的前缀
        publicPath:'dist/'
    }
}
```

##### 4）ES6转ES5的Babel

- 原因：因为一些对es6不支持的浏览器，es6语法不能识别

```javascript
//第一步 安装es6转es5打包 所需要的配置
安装命令: npm install --save-dev babel-loader@7 babel-core babel-preset-es2015 (安装开发时的依赖)
//第二步 在webpack.config.js进行配置
module.exports = {
    entry: './src/main.js',
    output: {
        //_dirname代表绝对路径，通过resolve将'dist'动态获取并进行拼接
        path: path.resolve(_dirname,'dist'),
        filename:'bundle.js'
    },
   
    module:{
        rules:[
            {
                 //配置css的loader加载文件
                //下面的是一个正则表达式，匹配所有的.css文件
                test:/\.css$/,
                //css-loader只负责将css文件进行加载
                //style-loader负责将样式添加到DOM中
                //使用多个loader时，默认从右向左读
                
                use:['style-loader','css-loader']
            },
            {
                test:/\.less$/,
                use:[{
                    loader:"style-loader" // 转化的样式导入到dom文件中
                },{
                    loader:"css-loader" //将css转化为commonjs
                },{
                    loader:"less-loader" //将less进行加载，加载之后将less文件转化为css文件
                }]
            }, {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015']
        			}
      			}
    		}
        ]
    }
}
```

##### 5）引入vue.js

````vue
//第一步 安装vue
安装命令: npm install  vue --save (在发布之后也需要使用,所以不是开发时的依赖->只有在在开放时进行使用)
//第二步 导入vue
//默认的话会去node_modules进行查找
import Vue from 'vue'
//第三步  挂载到指定app上，进行展示
````

- 注意事项：1.安装vue版本的默认的是runtime-only版本，不可以有任何的template。只有安装runtime-compiler->代码中，可以有template，因为有complier可以用于编译template

````javascript
解决方法：在webpack.config.js文件中修改默认运行的vue版本
module.exports = {
    entry: './src/main.js',
    output: {
        //_dirname代表绝对路径，通过resolve将'dist'动态获取并进行拼接
        path: path.resolve(_dirname,'dist'),
        filename:'bundle.js'
    },
   
    module:{
        rules:[
            {
                 //配置css的loader加载文件
                //下面的是一个正则表达式，匹配所有的.css文件
                test:/\.css$/,
                //css-loader只负责将css文件进行加载
                //style-loader负责将样式添加到DOM中
                //使用多个loader时，默认从右向左读
                
                use:['style-loader','css-loader']
            }
        ]
    },
    resolve:{
        //代表这些文件夹的后缀名可以省略
        extensions:['.js','.css','.vue'],
        alias:{
            'vue$':'vue/dist/vue.esm.js'
        }
    }
}
````

###### el与template的联系

el与template同时存在的话，会直接用template将el进行替换

##### 6）.vue文件的封装

```vue
//第一步 安装.vue封装文件
npm install  --save-dev vue-loader vue-template-compiler
//第二步  进行webpack.config.js配置
 module:{
        rules:[
            { 
                //下面的是一个正则表达式，匹配所有的.vue文件
                test:/\.vue$/,
                //vue-loader
                use:['vue-loader']
				//如果等级太高，必须配一些指定的插件；或者通过降低vue.loader的版本则不需要加载插件
            }
        ]
}
```

#### 3.plugin的使用

##### 1）html的plugin

````vue
//第一步 安装插件
npm install html-webpack-plugin --save-dev
//第二步  先在webpack.config.js引入
const HtmlWebpackPlugin = require('html-webpack-plugin');
//第三步  配置webpack.config.js
 module:{
        rules:[
            { 
                //下面的是一个正则表达式，匹配所有的.vue文件
                test:/\.vue$/,
                //vue-loader
                use:['vue-loader']
				//如果等级太高，必须配一些指定的插件；或者通过降低vue.loader的版本则不需要加载插件
            }
        ],
		plugins:[
			new webpack.BannerPlugin('最终版权归coderwhy'),
			new htmlWebpackPlugin({
				template:'index.html'
			})
		]
 }
````

##### 2）js代码压缩插件

```vue
//第一步 安装插件
//使其与CLI2保持一致(目前阶段不推荐使用，影响代码的调试)
npm install uglifyjs-webpack-plugin@1.1.1  --save-dev
//第二步  先在webpack.config.js引入
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');
//第三步  配置webpack.config.js
 module:{
        rules:[
            { 
                //下面的是一个正则表达式，匹配所有的.vue文件
                test:/\.vue$/,
                //vue-loader
                use:['vue-loader']
				//如果等级太高，必须配一些指定的插件；或者通过降低vue.loader的版本则不需要加载插件
            }
        ],
		plugins:[
			new webpack.BannerPlugin('最终版权归coderwhy'),
			new htmlWebpackPlugin({
				template:'index.html'
			}),
			new UglifyjsWebpackPlugin({
				
			})
		]
 }
```

##### 3）搭载本地服务器

````vue
//第一步 安装插件
npm install webpack-dev-server@2.9.1  --save-dev
//第二步  配置webpack.config.js
 module:{
        rules:[
            { 
                //下面的是一个正则表达式，匹配所有的.vue文件
                test:/\.vue$/,
                //vue-loader
                use:['vue-loader']
				//如果等级太高，必须配一些指定的插件；或者通过降低vue.loader的版本则不需要加载插件
            }
        ],
		plugins:[
			new webpack.BannerPlugin('最终版权归coderwhy'),
			new htmlWebpackPlugin({
				template:'index.html'
			}),
			new UglifyjsWebpackPlugin({
				
			})
		],
        devserver:{
			contentBase:为哪一个文件夹提供本地服务，默认是根文件夹，
			port:端口号
			inline: 页面的实时刷新
			historyApiFallback:在SPA页面中，依赖HTML5的history模式
		},
 }
//第三步  配置package.json文件，使其在终端运行的时候可以访问局部文件
 "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack",
	//--open代表的是：当打开服务器的时候，自动打开网页
	"dev": "webpack-dev-server --open"
  }
````

#### 4.webpack配置分离

````vue
//公共时的依赖
base.config.js
//开发时的配置
dev.config.js
//生产时的依赖
prod.config.js
//通过webpack-merge将需要配置信息进行合并
//第一步 进行安装
npm install webpack-merge --save-dev
//第二步  导入需要的配置
const webpackMerge = require('uglifyjs-webpack-plugin');
const baseConfig = require('./base.config');

//第三步 配置进行合并
module.exports = webpackMerge(baseConfig,{
	plugins:[
		new UglifyjsWebpackPlugin()
	]
})
//第四步 配置package.json
"scripts":{
	"build":"webpack --config ./build/prod.config.js",
	"dev":"webpack-dev-server --open --config ./build/dev.config.js"
}
````

#### 5.Vue CLI（脚手架）

##### 1）定义

- CLI——Command-Line Interface,命令行界面，俗称脚手架

- 脚手架的存在是为了避免我们手动配置webpack的相关配置，可以搭建Vue开发环境以及对应的webpack的配置
- Vue CLI ——>webpack——>Node

##### 2）使用

```vue
//第一步  在终端里面进行安装
npm install @vue/cli -g
//检查是否安装成功
vue --version  
```

如果想在vue3的基础上使用vue2，那么将通过以下指令进行安装

```vue
npm install @vue/cli-init -g
```

vue CLI3进行项目的初始化

````vue
 vue create 项目的名称
````

vue CLI2进行项目的初始化

```vue
vue init webpack 项目的名称
```

#####  3）runtime-complier和runtime-only的区别

![image-20210703160456035](https://man957.oss-cn-hangzhou.aliyuncs.com/img/image-20210703160456035.png)

```vue
runtime-complier(v1)
template -> ast(抽象语法树) ->render(渲染函数) -> vdom(虚拟DOM) ->UI
runtime-only(v2)(1.性能更高  2.下面的代码量更少)
render -> vdom ->UI
```

```vue
两者的区别主要在main.js里面
runtime-complier中
new Vue({
	el:'#app',
	template:'<App/>',/第二步 再使用
	components:{ APP }//第一步：先注册
})

runtime-only里面
new Vue({
	el:'app',
	render:h=>{h(App)}
})
```



##### 4）render函数

```vue
runtime-only
new Vue({
	el:'app',
	render: function(createElement){
		//1.普通的用法：createElement('标签'),'标签的属性',[''])
		return createElement('h2',
		{class:'box'},
		['hello world',createElement('button',['按钮'])])
		//第二种方法 直接往里面传组件
		return createElement(app);
	}
})

//通过el对元素进行挂载，其底层执行的是$mount('#app')
new Vue({
	render:function(createElement){
		createElement(App)
	}
}).$mount('#app')
```

##### 5）管理自己的项目

- cli3通过终端的vue ui命令来管理本地的项目

```vue
vue ui
```

- 在modules文件夹里面找@vue ->cli-service ->webpack.config,js ->lib/Service

##### 6）补充：箭头函数

```vue
//第一种
cosnt aaa = function(){}
//第二种
对象字面量中定义函数
const  obj ={
	bbb: function(){

	},
	bbb(){

	}
}
//第三种(ES6中的箭头函数)
const ccc = (参数列表) =>{}
当执行体只含有一行的时候
const ccc = (num1,num2) =>num1*num2 等同于下面
const ccc = (num1,num2) =>{
 	console.log(num1*num2);
}
一个参数的时候小括号是可以省略掉的
```

- 什么时候使用？定时器可以使用，对象字面量中不推荐使用
- 箭头函数中的this是如何查找的？ 向外层作用域中，一层层的查找this，直到有this的定义(遇到回调函数就是window，遇到箭头函数接着往上找)

```vue
const obj ={
	aaa(){
		setTimeout(function(){
			setTimeout(function(){
				console.log(this);//window
			}),	
			setTimeout(function(){
				console.log(this);//window
			})	
		}),
		setTimeout(() => {
			setTimeout(function(){
				console.log(this);//window
			}),	
			setTimeout(function(){
				console.log(this);//object
			})	
		}),
	}
}
```

