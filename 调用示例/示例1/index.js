function isEmpty(obj) {
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  for (var key in obj) {
    if (hasOwnProperty.call(obj, key)) return false;
  }
  return true;
}

Vue.component("vd", {
  props: ["url", "type"],
  template: `
  <template> 
<div>
<video
ref="vd"
class="video-js vjs-big-play-centered"
></video>
</div>
  </template>
          `,
  watch: {
    url: function(newValue) {
      console.log({ newValue });
      this.source.src = newValue;
      console.log({ source: this.source });
      this.player.src(this.source);
    }
  },
  data() {
    let type = "";
    if (this.type === "rtmp") {
      type = "rtmp/mp4";
    }
    if (this.type === "hls") {
      type = "application/x-mpegURL"; // video/mp4  application/x-mpegURL
    }
    if (this.type === "flv") {
      type = "video/x-flv"; // video/x-flv
    }

    this.type;

    return {
      player: null,
      source: {
        src: this.url,
        type
      }
    };
  },
  mounted() {
    this.player = videojs(this.$refs.vd, {
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
      sources: [this.source]
    });

    this.player.on("error", function(err) {
      console.log({ err });
    });
  },
  beforeDestroy() {
    console.log("dispose", this.url, this.id);
    this.player.dispose();
  }
});

const codeMessage = {
  200: "服务器成功返回请求的数据。",
  201: "新建或修改数据成功。",
  202: "一个请求已经进入后台排队（异步任务）。",
  204: "删除数据成功。",
  400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
  401: "用户没有权限（令牌、用户名、密码错误）。",
  403: "用户得到授权，但是访问是被禁止的。",
  404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
  406: "请求的格式不可得。",
  410: "请求的资源被永久删除，且不会再得到的。",
  422: "当创建一个对象时，发生一个验证错误。",
  500: "服务器发生错误，请检查服务器。",
  502: "网关错误。",
  503: "服务不可用，服务器暂时过载或维护。",
  504: "网关超时。"
};

const app = new Vue({
  el: "#app",
  data: {
    t:
      "https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8",
    labelPosition: "right",
    form: {
      client_id: "请填入client_id",
      client_secret: "请填入client_secret",
      access_token: "",
      sn: "请填入sn",
      live: {}
    }
  },
  watch: {
    "form.access_token": function(newValue) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + newValue;
    }
  },
  methods: {
    keep: function() {
      const _ = this;
      axios
        .post(`http://api.reiniot.com/v1/devices/${_.form.sn}/keep-live`)
        .then(function({ data }) {
          _.$notify.success({
            title: "请求成功",
            message: data.message
          });
        })
        .catch(function(error) {
          if (error.response) {
            // 请求成功但是状态码在2xx外
            const { data, status } = error.response;
            _.$notify.error({
              title: `请求错误 ${status}`,
              message: `${data.message || codeMessage[status]}`
            });
          } else {
            // 没有网络 或者开了代理
            _.$notify.error({
              title: "请求错误",
              message: "请检查网络或者关闭代理"
            });
          }
        });
    },
    getAccessToken: function() {
      const _ = this;
      axios
        .post("http://api.reiniot.com/v1/auth/token", {
          client_id: _.form.client_id,
          client_secret: _.form.client_secret
        })
        .then(function(response) {
          _.form.access_token = response.data.access_token;
          axios.defaults.headers.common["Authorization"] = _.form.access_token;
        })
        .catch(function(error) {
          if (error.response) {
            // 请求成功但是状态码在2xx外
            const { data, status } = error.response;
            _.$notify.error({
              title: `请求错误 ${status}`,
              message: `${data.message || codeMessage[status]}`
            });
          } else {
            // 没有网络 或者开了代理
            _.$notify.error({
              title: "请求错误",
              message: "请检查网络或者关闭代理"
            });
          }
          _.form.access_token = "";
        });
    },
    getLiveAddress: function() {
      const _ = this;
      axios
        .post(`http://api.reiniot.com/v1/devices/${_.form.sn}/live`)
        .then(function(response) {
          _.form.live = response.data;
        })
        .catch(function(error) {
          if (error.response) {
            // 请求成功但是状态码在2xx外
            const { data, status } = error.response;
            _.$notify.error({
              title: `请求错误 ${status}`,
              message: `${data.message || codeMessage[status]}`
            });
          } else {
            // 没有网络 或者开了代理
            _.$notify.error({
              title: "请求错误",
              message: "请检查网络或者关闭代理"
            });
          }
          _.form.live = {};
        });
    }
  },
  mounted: function() {
    this.$nextTick(function() {});
  }
});
