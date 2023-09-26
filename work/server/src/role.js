const { readArrayFromFile, myWriteFile } = require("./fileUtil");
const { v4 } = require("uuid");
const Router = require("koa-router");

//从读取role数据并初始化roleList
const filePath = "./public/role.json";
const roleList = readArrayFromFile(filePath);

//在index.js中会加载到'/api'下
const router = new Router();

router.post("/role", addRole);

router.put("/role/:id", updateRole);

router.delete("/role/:id", deleteRole);

router.get("/role", getRoles);

module.exports = {
  roleRouter: router.routes(),
  findRoleById,
  updateRoleUseCount,
};

function findRoleById(id) {
  return roleList.findIndex((v) => v.id === id);
}

function updateRoleUseCount(index, action) {
  if (action === "add") {
    roleList[index].useCount++;
  } else if (action === "subtract") {
    roleList[index].useCount--;
  }
  myWriteFile(roleList, filePath);
}

async function addRole(ctx, next) {
  if (!ctx.request.body) ctx.request.body = {};
  let { name, description } = ctx.request.body; //使用解构从ctx.request.body中获取name与description
  if (name && description) {
    //检查name与description是否合法，即其不为undefied、''、null等
    let newRole = {
      id: v4(),
      name,
      description,
      useCount: 0,
    };
    roleList.push(newRole);
    console.log("role-post:已成功添加对应角色");
    myWriteFile(roleList, filePath);

    //因为应答的参数格式实际上与newRole是完全相同的，因此此处直接使用newRole解构来构造ctx.body
    ctx.body = { ...newRole };
    await next();
  } else {
    console.log("role-post:请求参数不正确,返回状态码400");
    ctx.status = 400;
    ctx.body = {
      msg: "请求参数不正确，请重新请求",
    };
  }
}

async function updateRole(ctx, next) {
  if (!ctx.request.body) ctx.request.body = {};
  const id = ctx.params.id; //获取路径参数id
  if (id) {
    //取body参数并检验是否合法
    let { name, description } = ctx.request.body;
    if (id && name && description) {
      //检验id对应的role是否在roleList中存在
      let index = findRoleById(id);
      if (index === -1) {
        console.log("role-put:根据id未找到要更新的角色项");
        ctx.body = { msg: "未找到要更新的角色项" };
      } else {
        let newRole = {
          id,
          name,
          description,
          useCount: roleList[index].useCount,
        };
        roleList[index] = newRole;
        console.log("role-put:已成功修改对应角色信息");
        myWriteFile(roleList, filePath);
        ctx.body = { id, name, description };
        await next();
      }
    } else {
      console.log("role-put:请求参数不正确,返回状态码400");
      ctx.status = 400;
      ctx.body = { msg: "请求参数不正确,请重新请求" };
    }
  } else {
    console.log("role-put:路径参数不正确,返回状态码400");
    ctx.body = {
      msg: "路径参数不正确,请重新请求",
    };
  }
}

async function deleteRole(ctx, next) {
  const id = ctx.params.id; //取路径参数
  if (id) {
    //检验id对应的role是否在roleList中存在
    let index = findRoleById(id);
    if (index === -1) {
      console.log("role-delete:根据所传id未找到对应角色,删除失败");
      ctx.body = {
        id,
        is_deleted: "删除失败,根据所传id未找到对应角色。",
      };
    } else {
      if (roleList[index].useCount > 0) {
        console.log(
          "role-delete:当前角色正在被使用,禁止删除,请在删除相关用户后删除角色"
        );
        ctx.body = {
          id,
          is_deleted:
            "删除失败,当前角色正在被使用,禁止删除,请在删除相关用户后删除角色",
        };
      } else {
        roleList.splice(index, 1);
        console.log("role-delete:已删除对应角色");
        myWriteFile(roleList, filePath);
        ctx.body = {
          id,
          is_deleted: "成功删除",
        };
        await next();
      }
    }
  } else {
    console.log("role-delete:请求参数不正确,返回状态码400");
    ctx.status = 400;
    ctx.body = { msg: "路径参数不正确,请求失败" };
  }
}

async function getRoles(ctx, next) {
  console.log("role-get:已成功返回对应角色信息");
  ctx.body = {
    code: 1,
    data: {
      total: roleList.length,
      result: roleList,
    },
    msg: "已为您返回对应角色数据",
  };
  await next();
}
