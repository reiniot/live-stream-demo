<h1 align="center">live-stream-demo</h1>


## Usage

### Use bash

```bash
$ git clone git@github.com:reiniot/live-stream-demo.git
$ cd live-stream-demo
$ npm install
$ node index &
```

### change rtmp config
```bash
$ vim live-stream-demo/public/config.js
var rtmp = "rtmp://192.168.0.10:1935/live/myStream";

change ip address
your ip address is 192.168.1.1
edit live-stream-demo/public/config.js
var rtmp = "rtmp://192.168.1.1:1935/live/myStream";
```

### 使用方式

```bash
浏览器访问 https://github.com/reiniot/live-stream-demo/archive/master.zip 下载文件
然后修改rtmp地址 在live-stream-demo/public目录下的config.js
修改ip地址
例如
本来内容是 var rtmp = "rtmp://192.168.0.10:1935/live/myStream";
现在ip为 192.168.1.1
则修改为 var rtmp = "rtmp://192.168.1.1:1935/live/myStream";
```

### 启动方式

```bash
打开命令行 进入live-stream-demo的目录
输入
node index &
然后回车
```