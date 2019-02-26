const del = require("del");
const express = require("express");
const multer = require("multer");
const morgan = require("morgan");
const cors = require("cors");
const log4js = require("log4js");

del.sync(["./uploads/*"]); // delete uploads files sync

log4js.configure({
  appenders: {
    error: { type: "file", filename: "./log/error.log" }
  },
  categories: { default: { appenders: ["error"], level: "error" } }
});

const error = log4js.getLogger("error");

const upload = multer({
  storage: multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, "./uploads");
    },
    filename: function(req, file, cb) {
      cb(null, file.originalname);
    }
  })
});

const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

app.use(morgan("dev"));
app.use(cors());
app.use("/uploads", express.static("./uploads"));
app.use("/public", express.static("./public"));

io.on("connection", socket => {
  socket.on("test", data => {
    io.emit("msg", data);
  });
});

app.post(
  "/upload",
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "file1", maxCount: 1 }
  ]),
  (req, res) => {
    if (req.files && req.files.file && req.files.file1 && req.files.file[0] && req.files.file1[0]) {
      io.emit("msg", {
        file: req.files.file[0].filename,
        file1: req.files.file1[0].filename,
        id: req.body.user_id,
        score: req.body.score
      });
      res.status(200).end();
    } else{
      error.error({
        file: req.files,
        id: req.body.user_id,
        score: req.body.score
      });
      return res.status(500).end();
    }
  }
);

// app.post("/upload2", upload.single("file"), (req, res) => {
//   if (!req.file) {
//     error.error({
//       file: req.file,
//     });
//     res.status(500).end();
//   } else {
//     io.emit("msg2", {
//       file: req.file.filename,
//     });
//     res.status(200).end();
//   }
// });

app.use((req, res) => {
  res.status(404).send("not found");
});

app.use((err, req, res, next) => {
  error.error(err);
  res.status(500).send("server error");
});

http.listen(3000);
