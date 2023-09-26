# 账号管理系统后端

## 使用指南

1. 从 git 上将文件夹克隆至本地后，使用以下指令安装依赖包

```
    npm i
```

2. 在安装好依赖包之后，用户可以通过使用下面的指令启动服务端

```
    npm run start
```

3. 在项目启动后，服务端会监听本机的 3001 端口，用户可以向对应接口发送合法的请求。
4. 对于不合法的请求，如参数不足等情况，服务端将会返回 400 的状态码。

## 项目说明

- 项目数据存储在./public/account.json 和./public/role.json，在项目启动时，会利用文件读取初始信息。若项目中暂无以上文件，则会自动初始化新建。请同学们务必在有角色的基础上创立账号。
- 项目使用 dayjs 包生成创建时间与修改时间，实际存储的是毫秒的时间戳。
- 项目使用 uuid-v4 为各个账户和角色生成 id
- 项目为使用者内置了简单的使用日志，可以在终端界面查看项目的运行信息。
- accounts-get 请求中 pageIndex 从 0 开始，请一定注意。

## 项目结构

```shell
|--src //代码目录
  |--index.js    //项目的入口文件
  |--account.js  //accounts子路由
  |--role.js     //role子路由
  |--fileUtil.js //与文件相关的工具类
```

学生需编写的接口'/api/accountDetail/{id}'可在 account.js 文件下编写。

## 接口说明

- 以下所有提到的 role，都是对应 role 对象的 id
- 接口的返回数据形式可以查看大作业文档中的对应截图
- post 请求 /api/accounts
  - 请求 body：
    - 必选参数：username , password , role(此处的 role 应传入 role 对应的 id)
    - 可选参数：email , phone(若不传入，则会自动置空串)
  - 错误检查：
    - 若必选参数不足，则返回状态码 400
    - 若 role 的 id 无效，则返回状态码 400
- get 请求 /api/accounts
  - query 参数:
    - 必选参数:pageIndex,pageSize(注:pageIndex 从 0 开始)
    - 可选参数:phone,email,role,createBeginTime,createEndTime,updateBeginTime,updateEndTime
    - 注：若传入可选参数，系统会根据用户传入的参数进行对应的条件筛选
  - 错误检查：
    - 若必选参数不足，则返回状态码 400
- put 请求 /api/accounts/:id
  - 形如：/api/accounts/bc1562ac-83fa-4ed3-b871-36c05ff20874
  - 请求 body：
    - 非必选参数：username、password、email、phone、role
  - 错误检查：
    - 若必选参数不足，则返回状态码 400
    - 若 id 参数无效，为用户返回对应的错误信息，但不返回错误的状态码
- delete 请求 /api/accounts/:id
  - 形如：/api/accounts/bc1562ac-83fa-4ed3-b871-36c05ff20874
  - 错误检查：
    - 若 api 路径未传入 id，返回状态码 400
    - 若 id 参数无效，为用户返回对应的错误信息，但不返回错误的状态码
- post 请求 /api/role
  - 请求 body:
    - 必选参数:name,description
  - 错误检查：
    - 若必选参数不足，返回状态码 400
- get 请求 /api/role
  - 为用户返回角色列表
- put 请求 /api/role/:id
  - 形如：/api/role/36ea9660-e0c6-4288-bf2c-3b41a08c8651
  - 错误检查：
    - 若 api 路径未传入 id，返回状态码 400
    - 若 id 参数无效，为用户返回对应的错误信息，但不返回错误的状态码
- delete 请求 /api/role/:id
  - 形如：/api/role/36ea9660-e0c6-4288-bf2c-3b41a08c8651
  - 错误检查：
    - 若 api 路径未传入 id，返回状态码 400
    - 若 id 参数无效，为用户返回对应的错误信息，但不返回错误的状态码
