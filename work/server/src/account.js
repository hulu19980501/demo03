const { readArrayFromFile, myWriteFile } = require("./fileUtil");
const { findRoleById, updateRoleUseCount } = require("./role");
const { v4 } = require("uuid");
const dayjs = require("dayjs");
const Router = require("koa-router");

//从读取accounts数据并初始化accountList
const filePath = "./public/account.json";
const accountList = readArrayFromFile(filePath);

//在index.js中会加载到'/api'下
const router = new Router();

router.post("/accounts", addAccount);

router.put("/accounts/:id", updateAccount);

router.delete("/accounts/:id", deleteAccount);
router.get("/accounts", getAccounts);
router.get("/accountDetail/:id", getAccountDetail);
module.exports = { accountsRouter: router.routes() };

function getAccountsByInfo(
  list,
  {
    username,
    email,
    phone,
    role,
    createBeginTime,
    createEndTime,
    updateBeginTime,
    updateEndTime,
  }
) {
  //通过数组的filter方法不断筛选出符合筛选条件的结果
  let accounts = list;
  if (username) {
    //若数组成员的username等于传入的username则保留
    accounts = accounts.filter((value) => {
      return value.username === username;
    });
  }
  if (email) {
    accounts = accounts.filter((value) => {
      return value.email === email;
    });
  }
  if (phone) {
    accounts = accounts.filter((value) => {
      return value.phone === phone;
    });
  }
  if (role) {
    accounts = accounts.filter((value) => {
      return value.role === role;
    });
  }
  if (
    (createBeginTime === 0 || createBeginTime) &&
    (createEndTime === 0 || createEndTime)
  ) {
    //若数组成员的createtime在createBeginTime与createEndTime之间则保留
    accounts = accounts.filter((value) => {
      return (
        value.createtime <= createEndTime && value.createtime >= createBeginTime
      );
    });
  }
  if (
    (updateBeginTime === 0 || updateBeginTime) &&
    (updateEndTime === 0 || updateEndTime)
  ) {
    accounts = accounts.filter((value) => {
      return (
        value.updatetime <= updateEndTime && value.updatetime >= updateBeginTime
      );
    });
  }
  return accounts;
}

async function addAccount(ctx, next) {
  if (!ctx.request.body) ctx.request.body = {};
  /*
    使用解构从ctx.request.body中获取username、password、role、email、phone，
    特别地，当解构出的email、phone是undefined时,由于email、phone是非必选项，将其值设置为空串''
    此处的role实际上是roleId
    */
  let { username, password, role, email = "", phone = "" } = ctx.request.body;
  if (username && password && role) {
    //检查username、password、role三个必选项是否传入。
    let roleIndex = findRoleById(role);
    if (roleIndex === -1) {
      //由于必定现有角色再有账户，因此检查传入的roleId是否合法
      console.log("accounts-post:传入的角色id在角色列表中不存在,返回状态码400");
      ctx.status = 400;
      ctx.body = { msg: "角色id(role)参数不正确,请求失败" };
      return;
    }
    updateRoleUseCount(roleIndex, "add");
    //此处使用毫秒时间戳
    let now = dayjs().valueOf();
    let newAccount = {
      id: v4(),
      username,
      password,
      email,
      phone,
      role,
      createtime: now,
      updatetime: now,
    };
    accountList.push(newAccount);
    myWriteFile(accountList, filePath);
    console.log("accounts-post:已成功添加新账户");
    //因为应答的参数格式实际上与newAccount是完全相同的，因此此处直接使用newAccount解构来构造ctx.body
    ctx.body = {
      ...newAccount,
    };

    /*
        若传入了第二个next，则next函数会在此处被调用
        因此若大家平常在编写代码时要设置形如router.get('/api',isLogin,addAbc)形式的路由时
        应当在isLogin的合适位置加上await next()语句，以确保addAbc被调用。
        若在整个isLogin中都没有调用next的地方，则addAbc将不会被触发
        */
    await next();
  } else {
    console.log("accounts-post:传参出错,返回状态码400");
    ctx.status = 400;
    ctx.body = { msg: "参数不正确，请求失败" };
    return;
  }
}

async function updateAccount(ctx, next) {
  if (!ctx.request.body) ctx.request.body = {};
  const id = ctx.params.id; //取出路径参数id
  if (id) {
    let { username, password, email, phone, role } = ctx.request.body;
    //检查用户要修改的账户是否存在，若存在则修改，否则返回不存在的提示信息
    let index = accountList.findIndex((v) => v.id === id);
    if (index === -1) {
      console.log("accounts-put:未找到对应的账户id");
      ctx.body = { msg: "根据所传id无法找到对应账户" };
    } else {
      //由于5个body参数均为非必须参数，因此此处若用户未传或传入的参数不合法，我们为用户继承旧账户的对应值
      let oldAccount = accountList[index];
      if (!username) username = oldAccount.username;
      if (!password) password = oldAccount.password;
      if (!(email || email === "")) email = oldAccount.email;
      if (!(phone || phone === "")) phone = oldAccount.phone;
      if (!role) role = oldAccount.role;
      //检测要修改的角色id是否存在
      let oldRoleIndex = findRoleById(oldAccount.role);
      let newRoleIndex = findRoleById(role);
      if (newRoleIndex === -1) {
        console.log("accounts-put:未找到对应的角色id");
        ctx.body = { msg: "所传角色id不合法" };
      } else {
        //更新角色计数，旧减新加
        updateRoleUseCount(oldRoleIndex, "subtract");
        updateRoleUseCount(newRoleIndex, "add");
        let newAccount = {
          id,
          username,
          password,
          email,
          phone,
          role,
          createtime: oldAccount.createtime,
          updatetime: dayjs().valueOf(),
        };
        accountList[index] = newAccount;
        myWriteFile(accountList, filePath);
        console.log("accounts-put:已成功修改对应账户");
        ctx.body = { ...newAccount };
        await next();
      }
    }
  } else {
    console.log("accounts-put:请求参数出错,未获取到id,返回状态码400");
    ctx.status = 400;
    ctx.body = { msg: "路径参数不正确,请求失败" };
    return;
  }
}

async function deleteAccount(ctx, next) {
  const id = ctx.params.id; //获取路径参数
  if (id) {
    let index = accountList.findIndex((v) => v.id === id);
    if (index === -1) {
      console.log("accounts-delete:未找到对应的账户id");
      ctx.body = {
        id,
        is_deleted: "false",
      };
    } else {
      //账户被删除，更新角色计数
      let roleIndex = findRoleById(accountList[index].role);
      updateRoleUseCount(roleIndex, "subtract");
      //删除对应账户并写入文件
      accountList.splice(index, 1);
      myWriteFile(accountList, filePath);
      console.log("accounts-delete:已成功删除对应账户");
      ctx.body = {
        id,
        is_deleted: "true",
      };
    }
  } else {
    ctx.status = 400;
    console.log("accounts-delete:路径参数不正确,返回状态码400");
    ctx.body = { msg: "路径参数不正确,请求失败" };
  }
}

//一定注意pageIndex的下标从0开始
async function getAccounts(ctx, next) {
  let {
    username,
    email,
    phone,
    role,
    pageIndex,
    pageSize,
    createBeginTime,
    createEndTime,
    updateBeginTime,
    updateEndTime,
  } = ctx.query;
  if (pageIndex && pageSize && Number(pageIndex) >= 0 && Number(pageSize) > 0) {
    //本次请求参数都是query参数，为undefined|string|string[]类型，因此此处将其转换为数字类型
    pageIndex = Number(pageIndex);
    pageSize = Number(pageSize);
    createBeginTime = Number(createBeginTime);
    createEndTime = Number(createEndTime);
    updateBeginTime = Number(updateBeginTime);
    updateEndTime = Number(updateEndTime);
    let accounts = getAccountsByInfo(accountList, {
      username,
      email,
      phone,
      role,
      createBeginTime,
      createEndTime,
      updateBeginTime,
      updateEndTime,
    });
    console.log("accounts-get:已成功获取对应账户列表");
    ctx.body = {
      code: 1,
      data: {
        pageIndex,
        pageSize,
        pageTotal: Math.ceil(accounts.length / pageSize), //向上取整计算页面总数
        pageRow: accounts.length,
        result: accounts.slice(
          pageIndex * pageSize,
          (pageIndex + 1) * pageSize
        ), //使用slice得到数组对应页码中的成员。
        msg: "已成功完成查找",
      },
    };
    await next();
  } else {
    console.log("accounts-get:请求参数不正确,返回状态码400");
    ctx.status = 400;
    ctx.body = {
      msg: "请求参数不正确,请求失败",
    };
    return;
  }
}

async function getAccountDetail(ctx, next) {
  const id = ctx.params.id; //获取路径参数
  if (id) {
    const result = accountList.find((value) => value.id === id);
    if (result) {
      console.log("userInfor-get:已成功获取对应用户信息列表");
      ctx.body = {
        code: 1,
        data: {
          result,
          msg: "已成功完成查找",
        },
      };
    } else {
      console.log("userInfor-get:请求id不正确,返回状态码404");
      ctx.status = 404;
      ctx.body = {
        msg: "该id不存在",
      };
    }
    await next();
  } else {
    ctx.status = 400;
    console.log("accounts-delete:路径参数不正确,返回状态码400");
    ctx.body = { msg: "路径参数不正确,请求失败" };
    return;
  }
}
