const fs = require("fs");
const path = require("path");

function myWriteFile(data, filePath) {
  fs.writeFileSync(filePath, JSON.stringify(data), "utf-8");
}

function readArrayFromFile(filePath) {
  try {
    let datajson = fs.readFileSync(filePath, "utf-8");
    let data = JSON.parse(datajson);
    if (!Array.isArray(data)) {
      //文件存在但数据不存在或者数据不合法，则重置文件
      throw new Error();
    } else {
      return data;
    }
  } catch (error) {
    //当filePath处的文件不存在时，fs.readFileSync会抛出error，此时我们新建文件并返回空数据
    myWriteFile([], filePath);
    return [];
  }
}

//导出文件工具函数
module.exports = { readArrayFromFile, myWriteFile };
