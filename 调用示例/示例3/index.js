const client_id = "请填入client_id";
const client_secret = "请填入client_secret";
const sn = "请填入sn";
let access_token = "";

// 通用请求错误处理
const errHandler = error => {
  if (error.response) {
    // 请求成功，但是状态码在2xx外
    const { data, status } = error.response;
    console.error({
      title: `请求错误 ${status}`,
      message: data.message
    });
  } else {
    // 请求成功失败，没有网络 或者开了代理
    console.error({
      title: "请求错误",
      message: "请检查网络或者关闭代理"
    });
  }
};

// 发起请求获取access_token
const getAccessToken = (client_id, client_secret) => {
  return axios
    .post("http://api.reiniot.com/v1/auth/token", {
      client_id,
      client_secret
    })
    .then(response => {
      access_token = response.data.access_token;
      // 请求成功并设置之后的请求头中加入token，用于鉴权
      axios.defaults.headers.common["Authorization"] = "Bearer " + access_token;
    })
    .catch(errHandler);
};

// 保持直播
const keepLive = sn => {
  return axios
    .post(`http://api.reiniot.com/v1/devices/${sn}/keep-live`)
    .then(function({ data }) {
      console.log({
        title: "请求成功",
        message: data.message
      });
    })
    .catch(errHandler);
};

// 获取视频地址
const getLiveAddress = sn => {
  return axios
    .post(`http://api.reiniot.com/v1/devices/${sn}/live`)
    .then(response => {
      return response.data;
    })
    .catch(errHandler);
};

const app = async () => {
  await getAccessToken(client_id, client_secret);
  await keepLive(sn);
  await keepLive(sn);
  // 每隔5秒调一次保持直播
  setInterval(() => {
    keepLive(sn);
  }, 5000);
  const data = await getLiveAddress(sn);
  console.log(data);

  Object.keys(data).forEach(key => {
    let type = "";
    if (key === "rtmp") {
      type = "rtmp/mp4";
    }
    if (key === "hls") {
      type = "application/x-mpegURL";
    }
    if (key === "flv") {
      type = "video/x-flv";
    }

    const source = {
      src: data[key],
      type
    };
    console.log(source, key);

    const $video = document.createElement("video");
    $video.className = "video-js vjs-big-play-centered";
    $video.id = key;

    document.body.appendChild($video);

    // 设置播放器
    const player = videojs(key, {
      flash: { swf: "./vendor/video-js.swf" },
      techOrder: ["html5", "flash"],
      width: 580,
      height: 420,
      controlBar: {
        playbackRateMenuButton: false,
        remainingTimeDisplay: false,
        progressControl: false
      },
      autoplay: true,
      sources: [source]
    });

  });
};

app();
