const socket = io("localhost:3000");

// 下面
socket.on("msg1", msg => {
  if (app.items.length > 14) {
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

// 右侧
socket.on("msg2", msg => {
  if (app.items2.length > 7) {
    const last = app.items2.pop();
    clearTimeout(last.timer);
  }
  const timer = setTimeout(() => {
    const index = app.items2.indexOf(msg);
    app.items2.splice(index, 1);
  }, 5000);
  msg.timer = timer;
  msg.time = dayjs().format("YYYY/MM/DD HH:mm:ss");
  app.items2.unshift(msg);
});

dayjs.locale("zh-cn");
const app = new Vue({
  el: "#app",
  data: {
    time: dayjs().format("HH:mm:ss"),
    date: dayjs().format("YYYY/MM/DD dddd"),
    items: [],
    items2: []
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

      const player2 = videojs("player2", {
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
            src: rtmp2,
            type: "rtmp/mp4"
          }
        ]
      });


    });
  }
});
