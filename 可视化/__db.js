const fs = require("fs");
const iconv = require("iconv-lite");

const stream = fs.createReadStream("./摩看人脸识别.csv", {
  encoding: "binary"
});
let data = "";
stream.on("error", err => {
  console.error(err);
});
stream.on("data", chunk => {
  data += chunk;
});
stream.on("end", () => {
  const buf = Buffer.from(data, "binary");
  const str = iconv.decode(buf, "GBK"); // 得到正常的字符串，没有乱码
  const table = [];
  const rows = str.split("\r\n");
  for (var i = 0; i < rows.length; i++) {
    table.push(rows[i].split(","));
  }
  table.shift();
  table.pop();
  console.log(table);
  const jsonObj = {};
  table.map(user => {
    jsonObj[user[1]] = {
      name: user[2],
      pos: user[3]
    };
  });
  fs.writeFileSync('./public/db.js', 'const db = '+JSON.stringify(jsonObj))
});
