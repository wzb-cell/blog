---
title: spring
date: '2021-12-04 08:00:00'
sidebar: 'auto'
categories:
 - BackEnd
tags:
 - spring
 - backEnd
publish: true
---
# Spring

## 一、Spring简介

- 分层的Java SE/EE应用full-stack轻量级开源框架，以IoC（Inverse Of Control：控制反转）和AOP（Aspect Oriented Programming：面向切面编程）为内核
- 展现了展现层SpringMVC和持久层Spring JDBCTemplate 以及 业务层事务管理等众多的企业级应用技术，还能整合开源世界众多著名的第三方框架和类库，逐渐称为使用最多的Java EE企业应用开源框架。

### 1. Spring的优点

- 方便解耦，简化开发
  - 通过Spring 提供的IoC容器，可以将对象间的依赖关系交由Spring进行控制，避免硬编码所造成的过度耦合。
- AOP编程的支持
  - 通过Spring的AOP功能，方便进行面向切面编程，许多不容易用传统OOP实现的功能可以通过AOP轻松实现
- 声明式事务的支持
  - 可以将我们从繁琐的事务管理代码中解脱出来，通过声明式方式灵活的进行事务管理，提高开发效率和质量
- 方便程序的测试
  - 可以用非容器依赖的编程方式进行几乎所有的测试工作，测试不再是昂贵的操作，而是随手可做的事情
- 方便集成各种优秀的框架
  - Spring对各种优秀框架（Struts 、 Hibernate 、 Hessian 、Quartz等）的支持
- 降低JavaEE API 的使用难度
  - Spring对 JavaEE API （如JDBC、JavaMail、远程调用等）进行了薄薄的封装层，使这些API的使用难度大为降低

### 2. Spring的体系结构

![Spring的体系结构](https://man957.oss-cn-hangzhou.aliyuncs.com/img/image-20210817165930514.png)

### 3. Spring程序开发步骤

- 导入Spring开发的基本包坐标（要使用框架就得先导包）
- 编写Dao接口和实现类
- 创建Spring核心配置文件
- 在Spring配置文件中配置UserDaoImpl
- 使用Spring的API获得Bean实例

![Spring程序的开发步骤](https://man957.oss-cn-hangzhou.aliyuncs.com/img/image-20210817171610864.png)

### 4. Spring配置文件

#### 4.1Bean标签范围配置

-  scope：值对象的作用范围，取值如下：
   - singleton 默认值，单例的（在加载配置文件的时候进行创建bean）
     - Bean的生命周期
     - 对象创建：当应用加载，创建容器时，对象就被创建了
     - 对象运行：只要容器在，对象一直活着
     - 对象销毁：当应用卸载时，销毁容器时，对象就被销毁了
   - prototype 多例的（在获取Bean对象的时候进行创建getBean）
     - Bean的声明周期
     - 对象创建：当使用对象时，创建新的对象实例
     - 对象运行：只要对象在使用中，就一直活着
     - 对象销毁：当对象长时间不用时，将会被Java的垃圾回收器回收
   - request  session  web项目中，Spring创建一个Bean的对象，将对象分别存入到request域中 
   - global session web项目中，应用在Portlet环境，如果没有Portlet环境那么globalSession 相当于session 

#### 4.2 Bean生命周期配置

init-method:指定类中的初始化方法名称

destroy-method: 指定类中销毁方法名称

```java
XML文件中
   <bean id="UserDao" class="com.example.spring_ioc.dao.impl.UserDaoImpl" init-method="init" destroy-method="destory"></bean>
```

#### 4.3 Bean实例化的三种方式

- 无参构造方法实例化（常用的）
- 工厂静态方法实例化

```java
<bean id="UserDao" class="com.example.spring_ioc.factory.StaticFactory" factory-method="getUserDao"></bean>
```

- 工厂实例方法实例化

```java
第一步创建工厂对象
<bean id="factory" class="com.example.spring_ioc.factory.DynamicFactory"></bean>
第二步从工厂的实例化方法中获取userDao对象
<bean id="userDao" factory-bean="factory" factory-method="getUserDao"></bean>
```

#### 4.4 Bean的依赖注入分析

容器内部的注入主要是通过容器内部进行注入，而不是通过容器的外部程序进行组合

- 依赖注入的优点
  - IOC(控制反转)的具体实现
  - 在编写程序时，通过控制反转，把对象的创建交给了Spring，但是代码中不可能出现没有依赖的情况。IOC解耦只是降低他们的依赖关系，但是不会消除。例如：业务层仍会调用持久层的方法。
  - 通过的将业务层和持久层的依赖关系转交的给Spring进行管理，在代码的开发的时候，只需要把关注点放在业务层上，框架会自动的将持久层的对象传入到业务层中

- 构造方法

```java
//IOC容器中依赖的注入
<bean id="userDao" class="com.example.spring_ioc.dao.UserDaoImpl" >
<bean id="userService" class="com.example.spring_ioc.service.UserServiceImpl">
    //如果该Bean中默认什么都不写，默认是去找无参构造，需要访问有参构造，则通过以下的方式进行访问
    //使用UserServiceImpl中的构造方法进行注入，此时的name代表属性名，userDao代表引用的对象
	<constructor-arg name="userDao" ref="userDao"></constructor-arg>    
</bean>
```



- set方法（推荐使用）

```java
public class UserServiceImpl implements UserService {
    private  UserDao userDao;

    public void setUserDao(UserDao userDao) {
        this.userDao = userDao;
    }

    @Override
    public void save() {
        userDao.save();
    }
}

//IOC容器中依赖的注入
<bean id="userDao" class="com.example.spring_ioc.dao.UserDaoImpl" >
<bean id="userService" class="com.example.spring_ioc.service.UserServiceImpl">
    //使用UserServiceImpl中的setUserDao这个方法进行注入,注入所需要的userDao对象用ref进行引入
	<property name="userDao" ref="userDao"></property>    
</bean>
    
    
    
//利用p命名空间的方式进行，省略property标签
    <beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:p="http://www.springframework.org/schema/p"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
           
<bean id="userService" class="com.example.spring_ioc.service.UserServiceImpl" p:userDao-ref="userDao"</bean>
</beans>
```

#### 4.5 Bean的依赖注入的数据类型

- 普通数据类型

```java
//通过set的方式进行注入
<bean id="userService" class="com.example.spring_ioc.service.UserServiceImpl">
    //使用UserServiceImpl中的setUserName这个方法进行注入,注入所需要的基本数据类型用value进行引入
	<property name="userName" value="userDao"></property>
    <property name="age" value="18"></property>
</bean>
```

- 引用数据类型
- 集合数据类型

```java
 <bean id="userDao" class="com.example.spring_ioc.dao.impl.UserDaoImpl">
            <property name="strList">
                <list>
                    <value>aaa</value>
                    <value>bbb</value>
                    <value>ccc</value>
                </list>
            </property>
            <property name="userMap">
                <map>
                    <entry key="user1" value-ref="user1" ></entry>
                    <entry key="user2" value-ref="user2" ></entry>
                </map>
            </property>
            <property name="properties">
                <props>
                    <prop key="aaa" >ppp1</prop>
                    <prop key="bbb" >ppp2</prop>
                    <prop key="ccc" >ppp3</prop>
                </props>
            </property>
        </bean>
        <bean id="user1" class="com.example.spring_ioc.domain.User">
            <property name="addr" value="Luoyang"></property>
            <property name="name" value="xiaoming"></property>
        </bean>
        <bean id="user2" class="com.example.spring_ioc.domain.User">
            <property name="addr" value="beijing"></property>
            <property name="name" value="xiaohong"></property>
        </bean>
        <bean id="userService" class="com.example.spring_ioc.service.UserServiceImpl">
            <constructor-arg name="userDao" ref="userDao"/>
        </bean>
```

#### 4.6 引入其他配置文件（分模块进行开发）

- 实际的开发中，Spring的配置内容非常的多，这就导致了Spring配置很繁杂且体积很大，所以，可以将部分配置拆解到其他配置文件中，而在Spring主配置文件中通过import标签进行加载

```javaj
<import resource="applicationContext-xxx.xml"/>
```

#### 4.7 Spring 的重点配置

![image-20210818003806915](https://man957.oss-cn-hangzhou.aliyuncs.com/img/image-20210818003806915.png)

#### 4.8 Spring相关的API

ApplicationContext的实现类

- ClassPathXmlApplicationContext : 它是从类的根路径下加载配置文件（推荐使用）
- FileSystemXmlApplicationContext : 它是从磁盘路径上加载配置文件，配置文件可以在磁盘的任意位置(但是是绝对的路径)
- AnnotatConfigApplicationContext：当使用注解配置容器对象时，需要使用此类来创建Spring容器。它用注解进行读取

getBean()方法的使用

```java
//第一种方式：通过ID进行的
UserService userService =  (UserService)app.getBean("userService")
//第二种方式：通过类型进行(存在一种弊端，当该类型有多个的时候会因为找不到而报错)
    UserService userService =  app.getBean(UserService.class)
```

## 二、Spring配置数据源

### 1. 数据源（连接池）的作用

- 数据源（连接池）是提高程序性能出现的
- 事先实例化数据源，初始化部分了解资源
- 使用连接资源时从数据源中获取
- 使用完毕之后将连接资源归还给数据源

常见的数据源（连接池）：DBCP、C3P0、BoneCP、Druid
数据库和连接池区别：
如果数据是水，数据库就是水库，数据源就是连接水库的管道，终端用户看到的数据集是管道里流出来的水。
数据库连接池负责分配、管理和释放数据库连接，它允许应用程序重复使用一个现有的数据库连接，而不是再重新建立一个；释放空闲时间超过最大空闲时间的数据库连接来避免因为没有释放数据库连接而引起的数据库连接遗漏。这项技术能明显提高对数据库操作的性能。

### 2. 数据的开发步骤

- 导入数据源的坐标和数据库驱动坐标
- 创建数据源对象
- 设置数据源的基本连接数据
- 使用数据源获取连接资源和归还连接资源

### 3. Spring配置数据源

```java
1）导入Spring坐标。
    <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-context</artifactId>
            <version>5.2.10.RELEASE</version>
    </dependency>
2）编写Dao接口和实现类（因为导入的是外来包，可以省略这一步）
3）创建Spring核心配置文件并进行配置
    <bean id="dataSource" class="com.mchange.v2.c3p0.ComboPooledDataSource">
        <property name="driverClass" value="com.mysql.jdbc.Driver"></property>
        <property name="jdbcUrl" value="jdbc:mysql://localhost:3306/jdbc_test"></property>
        <property name="user" value="root"></property>
        <property name="password" value="123456"></property>
    </bean>
4）使用Spring的API获得Bean实例
        ApplicationContext app = new ClassPathXmlApplicationContext("applicationContext.xml");
        DataSource dataSource = (DataSource) app.getBean("dataSource");
        Connection connection = dataSource.getConnection();
        System.out.println(connection);
        connection.close();
```

- XML中加载properties文件

```xml
1）配置命名空间
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
         http://www.springframework.org/schema/context  http://www.springframework.org/schema/context/spring-context.xsd">
2）加载外部的properties文件
   <!--   加载外部的propertis文件-->
    <context:property-placeholder location="classpath:jdbc.properties"></context:property-placeholder>
    //通过${}去访问的配置文件，其中{key}
    <bean id="dataSource" class="com.mchange.v2.c3p0.ComboPooledDataSource">
        <property name="driverClass" value="${jdbc.driver}"></property>
        <property name="jdbcUrl" value="${jdbc.url}"></property>
        <property name="user" value="${jdbc.username}"></property>
        <property name="password" value="${jdbc.password}"></property>
    </bean>
```

## 三、Spring注解开发

### 1.Spring原始注解

 Spring是轻代码而重配置的框架，配置比较繁重，影响开发效率，所以注解开发是一种趋势，注解代替xml配置文件可以简化配置，提高开发效率.

<img src="https://man957.oss-cn-hangzhou.aliyuncs.com/img/image-20210818161838360.png" alt="image-20210818161838360" style="zoom:150%;" />

-  原始注解替换的注意事项（使用注解的方式进行，setXxx的方法可以省略）

```java
1)第一步将Spring中配置文件中的Bean用注解进行替换
//<bean id="userService" class="com.panda.service.impl.UserServiceImpl"></bean> 用下面这句话进行替换
@Component("userService")
public class UserServiceImpl implements UserService {
    //<property name="userDao" ref="userDao"></property> 用下面这句话进行替换
    @Autowired //按照数据类型从Spring容器中进行匹配的
    @Qualifier("userDao")//是按照id值从容器中进行匹配的 但是主要此处@qualifier结合@Autowired一起使用 
    //通过id进行匹配    @Resource(name="userDao")`
    private UserDao userDao;
    public void setUserDao(UserDao userDao) {
        this.userDao = userDao;
    }
    @Override
    public void save() {
        userDao.save();
    }
}
2）在Spring配置组件扫描（告诉Spring去那些包下进行对象的创建）
    com.panda包下的所有对象进行创建
   <context:component-scan base-package="com.panda"
```

- 总结：
  - 注入Bean的时候若想通过类型进行注入的话，只需要写Autowired
  - 若想通过名称进行注入，则采用Autowired和qualifier进行 就等于`@Resource(name="userDao")`

- 其他注解

```java
普通注解(从配置文件中的寻找key为jdbc.driver的值，但是首先要保证数据)
    @value("${jdbc.driver}")
Bean的作用范围
@Service("userService")
@scope("prototype")
//@scope("singleton")
public class UserServiceImpl implements UserService {
```

### 2. Spring的新注解

解决非定义的注解，第三方引入的代码

<img src="https://man957.oss-cn-hangzhou.aliyuncs.com/img/image-20210818185908034.png" alt="image-20210818185908034" style="zoom:150%;" />

- ControllerAdvice
  - 作用:全局异常处理、全局数据绑定、全局数据预处理

## 四、Spring整合Junit

### 1.出现的问题及解决方法

```java
ApplicationContext ac = new ClassPathXmlApplicationContext("bean.xml");
IAccountService service = ac.getBean("accountService",IAccountService.class);
//这两行代码的作用是获取容器，如果不写的话，直接会提示空指针异常。。所以又不能轻易删除
```

- 解决的措施
  - 让SpringJunit负责创建Spring容器，但是需要将配置文件的名称告诉它
  - 将需要进行测试Bean直接在测试类中进行注入

### 2. Spring集成Junit步骤

- 导入Spring集成Junit的坐标
- 使用@Runwith注解替换原来的运行期
- 使用@ContextConfiguration制定配置文件或配置类
- 使用@Autowired注入需要测试的对象
- 创建测试方法进行测试

## 五、Spring与Web环境集成

### 1. ApplicationContext应用上下文获取方式

应用上下文对象时通过new ClasspathXmlApplicationContext(spring配置文件)方式获取的，但是每次从容器中获得Bean时都要编写new    ClasspathXmlApplicationContext(spring配置文件)，这样的弊端时配置文件加载多次，应用上下文对象创建多次

在Web项目中，可以使用ServletContextListener监听Web应用的启动，我们可以在Web应用启动时，就加载Spring的配置文件，创建应用上下文对象ApplicationContext，在将其存储到最大的域servletContext域中，这样就可以在任意位置从域中获得应用上下文ApplicationContext对象了。

### 2. Spring提供获取应用上下文的工具

Spring提供了一个监听器ContextLoaderListener就是对上述功能的封装，该监听器内部加载Spring配置文件，创建应用上下文对象，并存储到ServletContext域中，提供了一个客户端工具WebApplicationContextUtils供使用者获得应用上下文对象。
### 3. 导入Spring集成web的坐标
```XML
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-web</artifactId>
    <version>5.0.5.RELEASE</version>
</dependency>
```
### 4.配置ContextLoaderListener监听器
```XML
<!--全局参数-->
<!--配置全局参数的主要原因：降低Spring容器与配置文件的耦合性，从而提高开发效率-->
<context-param>
    <param-name>contextConfigLocation</param-name>
    <param-value>classpath:applicationContext.xml</param-value>
</context-param>
<!--Spring的监听器-->
<listener>
	<listener-class>
       org.springframework.web.context.ContextLoaderListener
   </listener-class>
 </listener>
```

### 5. 通过工具获得应用上下文对象
```java
ApplicationContext applicationContext =    
    WebApplicationContextUtils.getWebApplicationContext(servletContext);
    Object obj = applicationContext.getBean("id");
```
需要做的只用两件事：

- 在web.xml中配置ContextLoaderListener监听器（导入spring-web坐标）
- 使用WebApplicationContextUtils获得应用上下文对象ApplicationContext

## 六、 SpringMVC 简介

### 1. SpringMVC概述

SpringMVC是一种基于Java的实现MVC设计模型的请求驱动类型的轻量级的Web框架，属于SpringFrameWork的后续产品，已经融合在Spring Web Flow中。

![image-20210830114649442](https://man957.oss-cn-hangzhou.aliyuncs.com/img/image-20210830114649442.png)

### 2. SpringMVC入门步骤
![image2-20210830114649442](https://man957.oss-cn-hangzhou.aliyuncs.com/img/springmvc.png)
开发步骤:

- 导入SpringMVC相关坐标（引入Spring-web的的包）
- 配置SpringMVC核心控制器DispathcerServlet（打开包使用里面的内容）
- 创建Controller类和视图页面
- 使用注解配置Controller类中业务方法的映射地址
- 配置SpringMVC核心文件spring-mvc.xml
- 客户端发送请求测试

### 3. SpringMVC的执行流程

![image-20210830165248216](https://man957.oss-cn-hangzhou.aliyuncs.com/img/image-20210830165248216.png)

### 4. SpringMVC注解解析

@RequestMapping

作用：用于建立请求URL和处理请求方法之间的对应关系

位置：

- 类上，请求URL的第一季访问目录。此处不写的话，就相当于应用的根目录
- 方法上，请求URL的第二级访问目录，与类上的使用@RequestMapping标注的一级目录一起组成访问虚拟路径

属性：

- value：用于指定请求的URL。它和path属性的作用是一样的
- method：用于指定请求的方式
- params：用于指定限制请求参数的条件。它支持简单的表达式。要求请求参数的key和value必须和配置的一模一样
  - 例1：params={“accountName”}，表示请求参数必须有accountName
  - 例2：params={"money!100"},n表示请求参数中money不能是100（<b>不经常使用</b>）

视图解析器：

- REDIRECT_URL_PREFIX = "redirect" --重定向前缀
- FORWARD_URL_PREFIX = "forward"  --转发前缀（默认值）

```java
组件扫描的两种方式：
    <!--对controller进行扫描-->
    <context:component-scan base-package="com.panda.controller"/>
    <!--对controller进行扫描的第二种方式-->
    <context:component-scan base-package="com.panda">
        <context:include-filter type="annotation" expression="org.springframework.stereotype.Controller"/>
    </context:component-scan>
    <!--配置内部资源视图解析器-->
    <bean id="viewResolver" class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <property name="prefix" value="/jsp/"></property>
        <property name="suffix" value=".jsp"></property>
    </bean>
```

## 七、SpringMVC的数据响应

### 1. SPringMVC的数据响应方式

- 页面跳转

  - 直接返回字符串

  ```java
  web-inf(处于保护状态的文件夹，外界不可以直接访问);
  转发：forward:/WEB-INF/views/index.jsp;
  重定向： redirect:/index.jsp
  ```

  - 通过ModelAndView对象返回

  ```java
  /*
  	Model:模型 作用封装数据
  	View:视图 作用展示数据
  */
  //第一种方式
  @RequestMapping("/user")
  ModelAndView modelAndView = new ModelAndView();
  //设置数据模型
  modelAndView.addObejct(key:"username",Value:"用户名");
  modelAndView.setViewName("index");//数据的渲染可以直接通过el表达式的时候获得相应的值
  return modelAndView;
  //第二种方式
  @RequestMapping(value="/quick")
  //当Spring检测到有参数，则会从Spring容器中直接自动注入
  public ModelAndView save2(ModelAndView modelAndView){
      //设置数据模型
  	modelAndView.addObejct(key:"username",Value:"用户名");
  	modelAndView.setViewName("index");//数据的渲染可以直接通过el表达式的时候获得相应的值
      return modelAndView;
  }
  //第三种方式
  @RequestMapping(value="quick3")
  public ModelAndView save3(Model model){
      model.addattribute(key:"username",Value:"用户名");
      return modelAndView;
  }
  ```

- 回写数据

  - 直接返回字符串（主要是用于返回json字符串）

  ```java
  //引入JSON工具
  <dependency>
      <groupId>com.fasterxml.jackson.core</groupId>
      <artifactId>jackson-core</artifactId>
      <version>2.9.0</version>
  </dependency>
  @RequestMapping(value="quick3")
  @ResponseBody //告知SpringMVC框架，不进行视图跳转 直接进行数据响应
  public String save3(){
      return "hello itheima";
  }
  //返回一个JSON字符串
  @RequestMapping(value="quick4")
  @ResponseBody //告知SpringMVC框架，不进行视图跳转 直接进行数据响应
  public String save4(){
      User user = new User();
      user.setUsername("lisi");
      user.setAge(30);
      //使用JSON的转换工具将对象转换成JSON格式字符串再返回
      ObjectMapper objectMapper = new ObjectMapper();
      String json = objectMapper.writeValueAsString(user);
      return json;
  }
  ```

  - 返回对象或集合

  ```java
  //返回一个JSON字符串
  @RequestMapping(value="quick4")
  @ResponseBody //告知SpringMVC框架，不进行视图跳转 直接进行数据响应
  //期望自动将对象转换为JSON字符串
  public User save4(){
      User user = new User();
      user.setUsername("lisi");
      user.setAge(30);
      return user;
  }
  ```

  ```xml
  <!--配置处理器映射器-->
  <bean class="org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter">
  	<property name="messageConverters">
      	<list>
          	<bean class="org.springframework.http.converter.json.MappingJackson2HttpMessageConverter">				</bean>
          </list>
      </property>
  </bean>
  ```

  可以利用MVC的注解驱动，直接代替上面繁琐的操作
  ![注解驱动的作用](https://man957.oss-cn-hangzhou.aliyuncs.com/img/annotation-driven.png)
  ```xml
  <beans xmlns:mvc="http://www.springframework.org/schema/mvc"
         xsi:schemaLocation="http://www.springframework.org/schema/mvc http://www.springframework.org/schema/mvc/spring-mvc.xsd">
      
      <!--SpringMVC的注解驱动-->
      <mvc:annotation-driven/>
      
  ```

### 2.SpringMVC获得请求参数

#### 2.1获得基本类型参数

- 简单参数可以直接获取并进行自动匹配

#### 2.2获得pojo类型参数

注意：pojo参数的属性名与请求参数的name一致，参数值会自动映射匹配

```java
  http://localhost:8080/quick9?username=zhangsan&age=12
  
  @RequestMapping("/quick10")
  @ResponseBody
  //请求的参数会默认注入到User对象的属性中
  public void quickMethod10(User user){
      System.put.println(User);
  }
```

#### 2.3获得数组类型参数

#### 2.4获得集合类型参数

```java
  //使用ajax提交时，可以指定contentType为json形式，name在方法参数位置使用@RequestBody可以直接接收集合数据而无需使用POJO进行包装
  @RequestMapping("/quick13")
  @ResponseBody
  //@RequestBody List<User> userList表示将请求体直接封装在userList当中
  public void quickMethod13(@RequestBody List<User> userList){
      System.out.println(userList)
  }
```

#### 2.5获取不到静态资源的处理方法

```xml
  <!--开发资源的访问-->
  <mvc:resources mapping="/js/**" location="/js/"/>
  <mvc:resources mapping="/img/**" location="/img/"/>
  
  <!--第二种方式-->
  <!--如果前段控制器找不到，则交由Tomcat进行查找-->
  <mvc:default-servlet-handler/>
```

#### 2.6请求数据乱码问题

```xml
  <filter>
      <filter-name>encodingFilter</filter-name>
      <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
      <init-param>
          <param-name>encoding</param-name>
          <param-value>UTF-8</param-value>
      </init-param>
      <init-param>
          <param-name>forceEncoding</param-name>
          <param-value>true</param-value>
      </init-param>
  </filter>
  <filter-mapping>
  <filter-name>encodingFilter</filter-name>
  <url-pattern>*.do</url-pattern>
  </filter-mapping>
```

#### 2.7参数绑定注解@RequestParam

- value
- require
- defaultValue

```java
  @RequestMapping("/quick10")
  @ResponseBody
  //将name参数得值注入到username中，但不是必须，如果没有传值的话，默认为zhangsan 
  public void quickMethod10(@RequestParam(value="name",require="false",defaultValue="zhangsan")Username username){
      System.put.println(User);
  }
```

#### 2.8获得Restful风格的参数

  - Restful是一种软件架构风格、设计风格，而不是标准，只是提供了一组设计原则和约束条件。主要用于客户端和服务器交互类的软件，基于这个风格设计的软件可以更简洁，更有层次，更易于实现缓存机制等。
  - Restful风格的请求是使用“URL+请求方式”表示一次请求的目的，HTTP协议里面四个表示操作方式的动词如下：
    - get:用于获取资源
    - post:用于新建资源
    - put:用于更新资源
    - delete:用于删除资源

```java
//localhost:8080/user/quick17/zhangsan
@RequestMapping(value="/quick17/{username}")
@ResponseBody
public void save17(@PathVariable(value="username")String name){
    System.out.println(username);
}
```

#### 2.9自定义类型转换器

- 第一步 定义转化器类实现Converter接口
- 第二步 在spring-mvc配置文件中声明转换器
- 第三步 在<annotation-driven>中引用转换器

#### 2.10获得Servlet相关API

SpringMVC支持使用原始ServletAPI对象作为控制器的方法的参数进行注入，常用的对象如下：

- HttpServletRequest
- HttpServletResponse
- HttpSession

#### 2.11获得请求头

@CookieValue---------可以获得指定Cookie的值

@CookieValue注解的属性如下：

- value:指定cookie的名称
- required:是否必须携带此cookie

#### 2.12文件上传

- 文件上传原理

```java
//当form表单修改为多部分表单时，request.getParameter()将失效
//enctype="application/x-www-form-urlencoded"时，form表单的正文内容格式是：key=value&key=value
//当form表单的enctype取值为Mutilpart/form-data时，请求正文内容就变成多部分形式
```

![image-20211002105123988](https://man957.oss-cn-hangzhou.aliyuncs.com/img/image-20211002105123988.png)

- 单文件上传的步骤

```xml
//第一步 导入fileupload和io坐标
<dependency>
    <groupId>commons-fileupload</groupId>
    <artifactId>commons-fileupload</artifactId>
    <version>1.2.2</version>
</dependency>
<dependency>
    <groupId>commons-io</groupId>
    <artifactId>commons-io</artifactId>
    <version>2.4</version>
</dependency>
//第二步 配置文件上传解析器
<bean id="multipartResolver">
	class="org.springframework.web.multipart.commons.CommonsMultipartResolver"
    <!--上传文件总大小-->
    <property name="maxUploadSize" value="5242800">
    <!--上传文件总大小-->
    <property name="maxUploadSizePerFile" value="5242800">
    <!--上传文件总大小-->
    <property name="defaultEncoding" value="UTF-8">
</bean>
//第三步 编写文件上传代码
@RequestMapping(value="/quick22")
@ResponnseBody
public void save22(String usernmame,MultipartFile uploadFile){
	System.out.println(username);
    System.out.println(uploadFile);
}
```

- 多文件上传实现

```xml
@RequestMapping(value="/quick22")
@ResponnseBody
public void save22(String usernmame,MultipartFile uploadFile,MultipartFile uploadFile2){
	System.out.println(username);
    System.out.println(uploadFile);
	System.out.println(uploadFile2);
}
```

## 八、Spring Template基本使用

### 1. JdbcTemplate开发步骤

- 第一步 导入spring-jdbc和spring-tx(底层用到事务)坐标

```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-jdbc</artifactId>
    <version>5.0.5.RELEASE</version>
</dependency>
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-tx</artifactId>
    <version>5.0.5.RELEASE</version>
</dependency>
```



- 第二步 创建数据库表和实体

- 第三步 创建jdbcTemplate对象

```
//配置数据源
ComboPooledDataSource dataSource = new ComboPooledDataSource();
dataSource.setDriverClass('com.mysql.jdbc.Driver');
dataSouce.setJdbcUrl("jdbc:mysql://localhost:3306/test");
dataSource.setUser("root");
dataSource.setPassword("123456");
JdbcTemplate jdbcTemplate = new JdbcTemplate();
//设置数据源，知道数据库在那里
jdbcTemplate.setDataSourcec();
```

- 第四步 执行数据库操作
  - 更新操作：jdbcTemplate.update(sql,params)
  - 查询操作：jdbcTemplate.query(sql,Mapper—>实体属性的行映射BeanPropertyRowMapper,params—>对应sql的占位符)     jdbcTemplate.queryForObject(sql,Mapper,params)

```java
int row = jdbcTemplate.update("insert into accout value(?,?)","tom",5000);
System.out.println(row);
```

### 2.Spring产生JdbcTemplate对象

我们可以将JdbcTemplate的创建权交给Spring，将数据源DataSource的创建权也交给Spring，在Spring容器内部将数据源DataSource注入到JdbcTemplate模板对象中，配置如下：

```xml
<!--数据源DataSource-->
 	<!--数据源对象-->
    <bean id="dataSource" class="com.mchange.v2.c3p0.ComboPooledDataSource">
        <property name="driverClass" value="com.mysql.jdbc.Driver"/>
        <property name="jdbcUrl" value="jdbc:mysql://localhost:3306/sqldemo?serverTimezone=UTC"/>
        <property name="user" value="root"/>
        <property name="password" value="123456"/>
    </bean>
    <!--Jdbc模板对象-->
    <bean id="jdbcTemplate" class="org.springframework.jdbc.core.JdbcTemplate">
        <property name="dataSource" ref="dataSource"/>
    </bean>
```

## 九、SpringMVC拦截器

### 1.拦截器

#### 1.1拦截器的作用

- 对于访问目标资源进行了一些干预，拦截器AOP思想的具体体现？？？

#### 1.2拦截器和过滤器的区别

![image-20211002190226519](https://man957.oss-cn-hangzhou.aliyuncs.com/img/image-20211002190226519.png)

<b>拦截器要注意放行的问题，即什么时候使用默认的静态Servlet进行处理</b>

#### 1.3 拦截器方法说明

![image-20211002212456881](https://man957.oss-cn-hangzhou.aliyuncs.com/img/image-20211002212456881.png)

#### 1.4 自定义拦截器步骤

- 创建拦截器类并实现HandlerInterceptor接口
- 配置拦截器
- 测试拦截器的拦截效果

## 十、Spring的AOP

### 1. AOP简介

AOP是OOP的延续，是软件开发中的一个热点，也是Spring框架中的一个重要内容，是函数式编程的一种衍生范性。利用AOP可以对业务逻辑的各个部分进行隔离，从而使得业务逻辑各部分之间的耦合度降低，提高程序的可重用性，同事提高了开发的效率。

<b>即面向切面编程是通过配置的方式将A模块功能配置到B模块中，而不是引用的方式，减少代码</b>

### 2.AOP的作用及其优势

- 作用：在程序运行期间，在不修改源码的情况下对方法进行功能增强
- 优势：减少重复代码，提高开发效率，并且便于维护
- 目标+增强 === 切面
- **如果不采用AOP的方式，想要对其他的功能进行增强的时候，只能通过引用或者复写的方式进行实现，既增加了代码行数，也增加功能之间的耦合性。通过AOP的实现，实际上就是通过配置文件的方式将部分功能进行结合，而实现了功能增强的需求**

### 3.AOP的底层实现

AOP的动态代理技术

- JDK代理：基于接口的动态代理技术

```java
//目标对象
final Target target = new Target();

//增强对象
final Advice advice = new Advice();

//返回值 就是动态生成的代理对象
TargetInterface proxy = (TargetInterface) Proxy.newProxyInstance(
    target.getClass().getClassLoader(),//目标对象类加载器
    target.getClass().getInterfaces(),//目标对象相同的接口字节码对象数组
    new InvocationHandler() {
        //调用代理对象的任何方法 实质执行的都是invoke方法
        public Object invoke(Object proxy,Method method,Object[] args) throws Throwable{
            advice.before();//前置增强
            Object invoke = method.invoke(target, args);//执行目标方法
            advice.afterReturning();//后置增强
            return invoke;
        }
    }
)
```



- cglib代理：基于父类的动态代理技术

```java
//目标对象
final Target target = new Target();

//增强对象
final Advice advice = new Advice();
//返回值  就是动态生成的代理对象  基于cglib
//1 创建增强器
Enhancer enhancer = new Enhancer();
//2 设置父类（目标）
enhancer.setSuperclass(Target.class);
//3 设置回调
enhancer.setCallback(new MethodInterceptor()){
    public Object intercept (Object proxy,Method method, Object[] args,MethodProxy methodproxy)throws Throwable{
        advice.before();//执行前置
        Object invoke = method.invoke(target, args);
        advice.afterReturning();//执行后置
        return invoke;
    }
}
//4 创建代理对象
Target proxy = (Target)enhancer.create();

//5 测试
proxy.save();
```



![image-20211003092553278](https://man957.oss-cn-hangzhou.aliyuncs.com/img/image-20211003092553278.png)



### 4. AOP的相关概念

![image-20211003112216012](https://man957.oss-cn-hangzhou.aliyuncs.com/img/image-20211003112216012.png)

### 5.AOP开发明确的事项

- 需要编写的内容
  - 编写核心业务代码（目标类的目标方法）
  - 编写切面类，切面类中是有通知（增强功能方法）
  - 在配置文件中，配置织入关系，即将那些通知和那些连接点进行结合
- AOP技术实现的内容
  - Spring框架监控切入点方法的执行。一旦监控到切入点方法被运行，使用代理机制，动态的创建目标对象的代理对象，根据通知类别，在代理对象的对应位置，将通知对应的功能织入，完成完整的代码逻辑运行。
- AOP底层使用那种代理方式
  - 在Spring中，框架会根据目标类是否实现了接口来决定采用那种动态代理的方式。

### 6.XML方式实现AOP

```xml
<!--第一步 引入坐标-->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-context</artifactId>
            <version>5.0.5.RELEASE</version>
        </dependency>
        <dependency>
            <groupId>org.aspectj</groupId>
            <artifactId>aspectjweaver</artifactId>
        </dependency>

<!--第二步 xml记性配置-->
<!--目标对象-->
<bean id="target" class="com.panda.aop.Target"></bean>
<!--切面对象-->
<bean id="myAspect" class="com.panda.aop.MyAspect"></bean>
<!--配置织入：告诉Spring框架 那些方法（切点）需要进行那些增强（前置、后置...）-->
<aop:config>
	<!--声明切面-->
    <aop:aspect ref="myAspect">
        <!--切面 = 切点 + 通知-->
        <aop:before method="before" pointcut="execution(public void com.panda.aop.Target.save())">
        </aop:before>
    </aop:aspect>
</aop:config>
```

### 7.XML配置AOP详解

- 切点表达式的写法

  - 表达式的语法

  ```xml
  execution([修饰符可有可无]返回值类型 包名.类名.方法名（参数）)
  ```

  - 返回值类型、包名、类名、方法名可以使用星号*代表任意
  - 包名和类名之间一个点.代表当前包下的类，两个点..表示当前包及其包下的类
  - 参数列表可以使用两个点..表示任意个数，任意类型的参数列表

  ```xml
  execution(* com.panda.aop..*.*(**))
  ```

- 通知的类型

![image-20211004104157360](https://man957.oss-cn-hangzhou.aliyuncs.com/img/image-20211004104157360.png)

- 抽取切点表达式

```xml
<aop:pointcut id="myPointcut" expression="execution(* com.panda.aop.*.*(..))"
```

 ### 8.基于注解的AOP开发

#### 8.1 快速入门

- 创建目标接口和目标类（内部有切点）
- 创建切面类（内部有增强的方法）
- 将目标类和切面类的对象创建权交给spring（两种的方式——xml进行配置或者使用注解@Component的方式注入到容器中）
- 在切面类中使用注解配置织入关系（@Aspect 或者 @Before ）
- 在配置文件中开启组件扫描和AOP的自动代理？？？（需要的先引入命名context和aop的命名空间，分别包含组件扫描标签和自动代理标签）

```xml
<!--组件扫描-->
<context:component-scan base-package="com.panda.anno"/>

<!--aop自动代理-->
<aop:aspectj-autoproxy/>
```

- 测试

#### 8.2注解配置AOP详解

- 注解通知的类型

![image-20211004111719078](https://man957.oss-cn-hangzhou.aliyuncs.com/img/image-20211004111719078.png)

- 切点表达式的抽取

同XML配置AOP一样，我们可以将切点表达式进行抽取。抽取方式是在切面内定义方法，在该方法上使用@Pointcut注解定义切点表达式，然后在增强注解中进行引用。具体如下：

```java
@Component("myAspect")
@Aspect
public class MyAspect{
    @Before("MyAspect.myPoint()")
    public void before(){
        System.out.println("前置代码增强");
    }
    @Pointcut("execution(* com.panda.aop.*.*(..))")
    public void mypoint(){}
}
```

## 十一、Spring的事务控制（？？？）

## 十二、MyBatis

### 1.MyBatis的简介

#### 1.1原始jdbc操作的分析

- 原始jdbc开发存在的问题如下：
  - 数据库连接创建、释放频繁造成系统资源浪费从而影响系统性能
  - sql语句在代码中硬编码，造成代码不易维护，实际应用sql变化的可能较大，sql变动需要改变Java代码
  - 查询操作时，需要手动将结果集中的数据手动封装到实体中。插入操作时，需要手动将实体的数据设置到sql语句的占位符位置
- 应对上述问题给出的解决方案：
  - 使用数据库连接池初始化连接资源
  - 将sql语句抽取到xml配置文件中
  - 使用反射、内省等底层技术，自动将实体与表进行属性与字段的自动映射。

### 2.MyBatis的快速入门

#### 2.1开发步骤

- 添加MyBatis坐标

```xml
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
            <version>3.5.7</version>
        </dependency>
```

- 创建User表

- 编写User实体类
- 编写映射文件UserMapper.xml
- 编写核心文件SqlMapConfig.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<!--数据源环境-->
<environments default="developement">
    <environment id="developement"> 
        <transactionManager type=" "></transactionManager>
        <dataSource type="POOLED">
        	<property name="driver" value="com.mysql.jdbc.Driver"></property>
            <property name="url" value="jdbc:mysql://localhost:3306/crud"></property>
            <property name="username" value="root"></property>
            <property name="password" value="123456"></property>
        </dataSource>
    </environment>
</environments>
```

- 编写测试类

```java
//加载核心配置文件
InputStream resourceAsStream = Resources.getResourceAsStream("SqlMapConfig.xml");
//获得SQLSession工厂对象
SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(resourceAsStream);
//获得SQLSession对象
SqlSession sqlSession = sqlSessionFactory.openSession();
//执行sql语句
List<User> userList = sqlSession.selectList("userMapper.findAll");
//打印结果
System.out.println(userList);
//MyBatis中默认事务是不提交的，当执行更新的操作的时候，是需要手动提交事务的
sqlSession.commit();
//释放资源
sqlSession.close();
```

### 3.MyBatis的映射文件概述   

- DTD约束头？？？

###  ![image-20211004164950965](https://man957.oss-cn-hangzhou.aliyuncs.com/img/image-20211004164950965.png)

### 4.MyBatis的增删改查操作

#### 4.1插入操作需要注意的小问题

- 插入语句使用insert标签
- 在映射文件中使用parameterType属性指定要插入的数据类型
- SQL语句中使用#{实体属性名}方式引用实体中的属性值
- 插入操作使用的API是sqlSession.insert("命名空间.id",实体对象)
- 插入操作设计数据库数据变化，所以要使用sqlSession对象显示提交事务。即sqlSession.commit()

### 5.MyBatis的核心配置文件概述

![image-20211004171720076](https://man957.oss-cn-hangzhou.aliyuncs.com/img/image-20211004171720076.png)

#### 5.1 Mapper标签:加载映射配置

![image-20211004173000988](https://man957.oss-cn-hangzhou.aliyuncs.com/img/image-20211004173000988.png)

#### 5.2 typeAliases标签：设置类型别名

```xml
<!--配置typeAliases,为com.itheima.domain.User定义别名为User-->
<!--注意点：在configuration里面进行配置的时候，配置的标签要按一定的顺序-->
<typeAliases>
	<typeAlias type="com.itheima.domain.User" alias="User"></typeAlias>
</typeAliases>
```

### 6.MyBatis的相应API

### 7.MyBatis的Dao层实现

#### 7.1 传统开发方式

- 手动对Dao进行实现
- 与代理开发的主要区别是：是否手动对接口进行实现

#### 7.2 代理开发方式

<b>代理开发方式介绍</b>

Mapper接口开发方法只需要程序员编写Mapper接口（相当于Dao接口），由MyBatis框架根据接口定义创建接口的动态代理对象，代理对象的方法同上边Dao接口实现类方法。

Mapper接口开发需要遵循一下规范：

- Mapper.xml文件中的namespace与mapper接口的全限定名相同

- Mapper接口方法名和Mapper.xml中定义的每个statement的id相同
- Mapper接口方法的输入参数类型和Mapper.xml中定义的每个sql的parameterType的类型相同（主要看集合内部装的类型）
- Mapper接口方法的输出参数类型和Mapper.xml中定义的每个sql的resultType的类型相同

**编写UserMapper接口**

![image-20211004195221539](https://man957.oss-cn-hangzhou.aliyuncs.com/img/image-20211004195221539.png)

### 8.MyBatis映射文件深入

#### 8.1 动态sql语句

- if语句使用

```xml
    <!--第一种写法--> 
	<select id="queryByUname" resultMap="User" >
        select * from user
        <include refid="whereUser"></include>
    </select>
	<!--sql片段进行的抽取-->
	<sql id="whereUser">
        <where>
            <!--下面是根据名字进行的模糊查询-->
            <if test="uname!=null">and uname like '%${uname,jdbcType=VARCHAR}%'</if>
        </where>
    </sql>
	<!--第二种写法-->
	<select id="queryByUname" resultMap="User" >
        select * from user
        <where>
            <if test="uname!=null">and uname like '%${uname,jdbcType=VARCHAR}%'</if>
        </where>
    </select>
```

- foreach语句的使用

```xml
	<select id="findByIds" parameterType="list" resultType="User">
        select * from user 
        <where>
            <foreach collection="list" open="id in ("  close=")" item="id" separator=",">
            	#{id}
            </foreach>
        </where>
	</select>
```

### 9.MyBatis核心配置文件深入

#### 9.1 typeHandlers标签（？？？）

#### 9.2 plugins标签

MyBati是可以使用第三方的插件对功能进行扩展，分页助手PageHelper是将分页的复杂操作进行封装，使用简单的方式即可获得分页的相关数据。

开发步骤：

- 导入通用PageHelper的坐标

```xml
<!--分页助手-->
<dependency>
    <groupId>com.github.pagehelper</groupId>
    <artifactId>pagehelper</artifactId>
    <version>3.7.5</version>
</dependency>
<dependency>
    <groupId>com.github.jsqlparser</groupId>
    <artifactId>jsqlparser</artifactId>
    <version>0.9.1</version>
</dependency>
```



- 在mybatis核心配置文件中配置PageHelper插件

```xml
<!--配置分页助手插件-->
<plugins>
    <plugin interceptor="com.github.pagehelper.PageHelper">
    	<property name="dialect" value="mysql"></property>
    </plugin>
</plugins>
```



- 测试分页数据获取

```java
//设置分页相关参数，当前页+每页显示的条数
PageHelper.startPage(1,3);//第一个参数是pageNum,第二个参数是pageSize

//PageHelper中有一个对象PageInfo可以查看相关的分页信息
//获得与分页相关的参数的，如下图所示
```

![image-20211004221503120](https://man957.oss-cn-hangzhou.aliyuncs.com/img/image-20211004221503120.png)

### 10.MyBatis的多表操作

#### 10.1一对一配置实现

```xml
<!--OrderMapper的配置-->
<resultMap id="orderMap" type="order">
	<!--当Bean中含有另外的对象的时候，不能自动映射的时候，则需要手动指定字段与实体属性之间的映射关系
		column:数据表的字段名称
 		property:实体的属性名称
	-->
    <id column="oid" property="id"></id><!--代表主键-->
    <result column="ordertime" property="ordertime"></result>
    <result column="ordertime" property="ordertime"></result>
    <result column="total" property="total"></result>
    <result column="uid" property="user.uid"></result>
    <result column="username" property="user.username"></result>
    <result column="password" property="user.password"></result>
    <result column="birthday" property="user.birthday"></result>
</resultMap>
<select id="findAll" resultMap="orderMap">
	select *,o.id oid from orders o,user u where o.id=u.id
</select>

<!--第二种的匹配的方式-->
    <result column="uid" property="user.uid"></result>
    <result column="username" property="user.username"></result>
    <result column="password" property="user.password"></result>
    <result column="birthday" property="user.birthday"></result>
<!--用下面这句话进行替换-->
	<!--
		property:当前实体（order）中属性名称（private User user）
		javaType:当前实体（order）中属性的类型（User）
	-->
	<association property="user" javaType="com.panda.dao.User">
        <id column="uid" property="id"></id>
        <result column="username" property="username"></result>
        <result column="password" property="password"></result>
        <result column="birthday" property="birthday"></result>
	</association>
```

#### 10.2 一对多配置实现

```xml
<!--配置集合信息
	property:集合名称
	ofType：当前集合中的数据类型-->
	<collection property="user" ofType="com.panda.dao.Order">
        <id column="uid" property="id"></id>
        <result column="username" property="username"></result>
        <result column="password" property="password"></result>
        <result column="birthday" property="birthday"></result>
	</collection>
```

#### 10.3 多对多配置实现

- 与一对多的区别：多一张表，需要将中间表融入到查询语句当中才能查出想要的结果

### 11.MyBatis的注解开发

#### 11.1 MyBatis的常用注解

![image-20211005094913744](https://man957.oss-cn-hangzhou.aliyuncs.com/img/image-20211005094913744.png)

```xml
<!--注意：注解的配置和xml的配置类似，但是注解的配置，映射配置仍然需要-->
<!--这时候是加载映射关系而不是加载映射配置，因为使用注解xml配置文件将不再需要-->
<mappers>
    <!--指定接口所在的包-->
	<package name="com.panda.mapper"></package>
</mappers>

```

#### 11.2 一对一注解的封装

```java
//普通的方式进行封装
@Select("select *,o.id oid from orders o,user u where o.uid=u.id")
@Results({
	@Result(column = "oid",property = "id"),
    @Result(column = "ordertime",property = "ordertime"),
    @Result(column = "total",property = "total"),
    @Result(column = "uid",property = "user.id"),
    @Result(column = "username",property = "user.uesrname"),
    @Result(column = "password",property = "user.password")
})
public List<Order> findAll(); 

//对应xml中association的方式进行一对一的配置
//注解中进行处理的方式主要通过多条语句联合查询得到
@Select("select * from orders)
@Results({
	@Result(column = "id",property = "id"),
    @Result(column = "ordertime",property = "ordertime"),
    @Result(column = "total",property = "total"),
    @Result(
    	property="user",//要封装的属性的名称
        column="uid",//根据那个字段去查询user表的数据
        javaType=User.class,//要封装的实体的类型
        //select属性 代表查询那个接口的方法获得数据
        one = @One(select="com.panda.mapper.UserMapper.findById")
    )
})
```

#### 11.3 一对多注解封装

```java
@Select("select * from Users)
@Results({
	@Result(column = "id",property = "id"),
    @Result(column = "username",property = "username"),
    @Result(column = "password",property = "password"),
    @Result(
    	property="orderList",//要封装的属性的名称
        column="id",//根据那个字段去查询user表的数据
        javaType=List.class,//要封装的实体的类型
        //select属性 代表查询那个接口的方法获得数据
        many = @Many(select="com.panda.mapper.UserMapper.findById")
    )
})
```

#### 11.4 多对多注解封装

## 十三、SSM整合

类加载路径

## 十四、相关技术

### 1.swagger

#### 1.1项目中集成 Swagger

- 集成 Swagger 我们使用封装好了的 Starter 包，代码如下所示。

```xml
<!-- Swagger -->
 <dependency>
   <groupId>com.spring4all</groupId>
   <artifactId>swagger-spring-boot-starter</artifactId>
   <version>1.7.1.RELEASE</version>
 </dependency>
```

- 在启动类中使用 @EnableSwagger2Doc 开启 Swagger，代码如下所示。

```java
    @EnableSwagger2Doc
    @SpringBootApplication
    public class AuthApplication {
        public static void main(String[] args) {
            SpringApplication.run(AuthApplication.class, args);
        }
    }
```

#### 1.2 使用Swagger生成文档

Swagger 是通过注解的方式来生成对应的 API，在接口上我们需要加上各种注解来描述这个接口，关于 Swagger 注解的使用在教程后面会有详细讲解，本节只是带大家快速使用 Swagger，使用方法代码如下所示。

```java
@ApiOperation(value = "新增用户")
@ApiResponses({ @ApiResponse(code = 200, message = "OK", response = UserDto.class) })
@PostMapping("/user")
public UserDto addUser(@RequestBody AddUserParam param) {   
    System.err.println(param.getName());    
    return new UserDto();
}
```

参数类定义代码如下所示。

```java
@Data
@ApiModel(value = "com.biancheng.auth.param.AddUserParam", description = "新增用户参数")
public class AddUserParam {

    @ApiModelProperty(value = "ID")
    private String id;

    @ApiModelProperty(value = "名称")
    private String name;

    @ApiModelProperty(value = "年龄")
    private int age;
}
```

接口查看地址可以通过服务地址 /swagger-ui.html 来访问，见图 1。

