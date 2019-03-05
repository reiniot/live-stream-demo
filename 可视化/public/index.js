const socket = io("localhost:3000");
socket.on("msg", msg => {
  if (app.items.length > 6) {
    const last = app.items.pop();
    clearTimeout(last.timer);
  }
  const timer = setTimeout(() => {
    const index = app.items.indexOf(msg);
    app.items.splice(index, 1);
  }, 5000);
  msg.timer = timer;
  msg.time = dayjs().format("YYYY/MM/DD HH:mm:ss");
  app.items.unshift(msg);
});

dayjs.locale("zh-cn");
const app = new Vue({
  el: "#app",
  data: {
    time: dayjs().format("HH:mm:ss"),
    date: dayjs().format("YYYY/MM/DD dddd"),
    items: [],
    db
  },
  methods: {
    dayjs
    // remove: function() {
    //   this.items.pop();
    // }
  },
  mounted: function() {
    this.$nextTick(function() {
      setInterval(() => {
        this.time = dayjs().format("HH:mm:ss");
        this.date = dayjs().format("YYYY/MM/DD dddd");
      }, 300);

      const player = videojs("player", {
        flash: { swf: "./vendor/video-js.swf" },
        techOrder: ["flash"],
        // width: 16 * 50,
        // height: 9 * 50,
        //  vjs-fluid
        // controls: true,
        liveui: true,
        fluid: true,
        // controlBar: {
        //   playbackRateMenuButton: false,
        //   remainingTimeDisplay: false,
        //   progressControl: false
        // },
        autoplay: true,
        sources: [
          {
            src: rtmp,
            type: "rtmp/mp4"
          }
        ]
      });

      window.player = player;

      player.on("ready", err => {
        console.log("ready");
      });
      player.on("error", err => {
        console.log("error");
      });
      player.on("play", err => {
        console.log("play");
      });
      player.on("networkState", err => {
        console.log("networkState");
      });
      player.on("readyState", err => {
        console.log("readyState");
      });
      player.on("waiting", err => {
        console.log("waiting");
      });
      player.on("stalled", err => {
        console.log("stalled");
      });
      player.on("abort", err => {
        console.log("abort");
      });
      player.on("canplay", err => {
        console.log("canplay");
        player.error(null);
      });
      player.on("pause", err => {
        console.log("pause");
      });
      player.on("progress", err => {
        console.log("progress");
      });
    });
  }
});
