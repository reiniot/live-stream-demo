var request = require("request");
var fs = require("fs");

var API = "http://localhost:3000";

request.post(
  {
    url: `${API}/upload`,
    formData: {
        file: fs.createReadStream("./dashboard.jpg"),
      user_id: "ouzztest2222222",
      score: "ouzz@qq.com"
    }
  },
  (err, res, body) => {
    console.log(err);
  }
);
