const socket = io("localhost:3000");
socket.on("msg", msg => {
  app.items.unshift(msg);
});

window.data = {};
window.data.mode = 2;

var pointShaderF = `uniform vec3 color;
// uniform sampler2D texture;
varying float vLight;
varying float vBoost;
varying vec2 vUv;
void main() {
// vec2 lightness = (gl_PointCoord - 0.5) * 10.0;
// float lt = max(0.0, 1.0 - sqrt((lightness.x * lightness.x) + (lightness.y * lightness.y)));
// vec3 c = vec3(pow(lt, 3.0), pow(lt, 4.0), pow(lt, 6.0));

vec3 c;

//gold
//c = vec3(0.5 + 0.5 * pow(vBoost, 2.0), 0.3 + 0.7 * pow(vBoost, 4.0), 0.2 + 0.8 * pow(vBoost, 10.0));

//galaxy
// c = vec3(1.5 * pow(vBoost, 3.0), 1.5 * pow(vBoost, 4.0), 1.2 * pow(vBoost, 3.0));

//platium
c = vec3(1.5 * pow(vBoost, 2.0), 1.5 * pow(vBoost, 2.5), 1.2 * pow(vBoost, 2.6));

gl_FragColor = vec4(c, vLight * vLight);
// gl_FragColor = gl_FragColor * texture2D(texture, gl_PointCoord);
}`;

var pointShaderV = `attribute float size;
attribute float offset;
attribute float spd;
attribute vec3 velocity;
uniform float time;
attribute vec3 customColor;
varying float vLight;
varying float vBoost;
varying vec2 vUv;

float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

float noise(vec3 p){
vec3 a = floor(p);
vec3 d = p - a;
d = d * d * (3.0 - 2.0 * d);

vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
vec4 k1 = perm(b.xyxy);
vec4 k2 = perm(k1.xyxy + b.zzww);

vec4 c = k2 + a.zzzz;
vec4 k3 = perm(c);
vec4 k4 = perm(c + 1.0);

vec4 o1 = fract(k3 * (1.0 / 41.0));
vec4 o2 = fract(k4 * (1.0 / 41.0));

vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

return o4.y * d.y + o4.x * (1.0 - d.y);
}

void main() {
float size = 3.0;
vec3 noiseVec = position.xyz / 10.0;
vec3 noiseVec2 = position.xyz / 100.0;
noiseVec.x += time * 0.3;
noiseVec2.x += time * 0.1;
noiseVec.y += time * 0.1;
// vec3 pos = velocity * sin(time) + position;
vec3 pos = position;
pos.y += (noise(noiseVec) - 0.5) * 5.0;
pos.y += (noise(noiseVec2) - 0.5) * 50.0;
pos.y += sin(offset + time * spd) * 0.5;
vUv = uv;
vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
vLight = 0.5 * (cos(mvPosition.x / 10.0 + time + offset) * sin(mvPosition.z / 20.0 + time - offset) * 0.5 + 0.5 + (noise(noiseVec * 2.0)));
vBoost = .5 * (cos(mvPosition.x / 5.0 + time + offset) * cos(mvPosition.z / 3.0 + time - offset) * 0.5 + 0.5 + (noise(noiseVec * 5.0)));
gl_PointSize = size * (40.0 / -mvPosition.z);
gl_PointSize = sqrt(gl_PointSize);
gl_Position = projectionMatrix * mvPosition;
}`;

var renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

var geometry = new THREE.BufferGeometry();

var pcount = 150000;
var attrs = {
  offset: new THREE.BufferAttribute(new Float32Array(pcount), 1),
  spd: new THREE.BufferAttribute(new Float32Array(pcount), 1),
  customColor: new THREE.BufferAttribute(new Float32Array(pcount * 3), 3),
  position: new THREE.BufferAttribute(new Float32Array(pcount * 3), 3),
  velocity: new THREE.BufferAttribute(new Float32Array(pcount * 3), 3)
};

for (var i = 0; i < pcount; i++) {
  var i3 = i * 3;
  attrs.spd.array[i] = Math.random() + 1.0;
  attrs.offset.array[i] = Math.random();
  attrs.velocity.array[i3] = (0.5 - Math.random()) * 10;
  attrs.velocity.array[i3 + 1] = (0.5 - Math.random()) * 10;
  attrs.velocity.array[i3 + 2] = (0.5 - Math.random()) * 10;
  attrs.position.array[i3 + 0] = (0.5 - Math.random()) * 450;
  attrs.position.array[i3 + 1] =
    Math.pow(Math.random(), 8) * 45.5 * (Math.random() > 0.5 ? 1.0 : -1.0);
  attrs.position.array[i3 + 2] = (0.5 - Math.random()) * 350;
}

for (var i in attrs) {
  geometry.addAttribute(i, attrs[i]);
}

var points = new THREE.ShaderMaterial({
  uniforms: {
    color: {
      type: "c",
      value: new THREE.Color(0xffffff)
    },
    time: {
      type: "f",
      value: 0
    }
  },
  vertexShader: pointShaderV,
  fragmentShader: pointShaderF,
  blending: THREE.AdditiveBlending,
  depthTest: false,
  transparent: true
});

var p = new THREE.Points(geometry, points);
p.frustumCulled = false;
scene.add(p);

camera.position.z = 70;
camera.position.y = 10;

const PRECISION = 0.01;
var deltaT = 0;
function ease(f, t, sp, precision) {
  precision = precision || PRECISION;
  if (Math.abs(f - t) < precision) {
    return t;
  }
  return f + (t - f) * sp * deltaT;
}

var all = [];
var removal = [];
var t = (Date.now() / 1000) % 1000000;
var prevT = (Date.now() / 1000) % 1000000;
function update() {
  deltaT = (t - prevT) * 60;
  prevT = t;
  if (deltaT < 0) {
    deltaT = 1;
  }
  if (deltaT > 3) {
    deltaT = 1;
  }
  t = (Date.now() % 1000000) * 0.001;
  if (removal.length > 0) {
    var _new = [];
    for (var i = 0; i < all.length; i++) {
      if (removal.indexOf(all[i]) >= 0) {
        continue;
      }
      _new.push(all[i]);
    }
    removal = [];
    all = _new;
  }
  for (var i = 0; i < all.length; i++) {
    all[i](t, deltaT);
  }
}

function enable(func) {
  if (all.indexOf(func) >= 0) {
    return;
  }
  all.push(func);
}

function disable(func) {
  if (removal.indexOf(func) >= 0) {
    return;
  }
  removal.push(func);
}

var updator = {
  update,
  enable,
  disable,
  ease
};

var update = function() {
  updator.update();
  return requestAnimationFrame(update);
};
update();

var eased_y = 10;
var target_y = 10;
updator.enable(() => {
  eased_y = updator.ease(eased_y, target_y, 0.1, 0.001);
  target_y = window.data.mode == 2 ? 30 : 10;
  camera.position.y = eased_y;
  points.uniforms.time.value = (Date.now() / 1000) % 10000;
  points.needsUpdate = true;
  renderer.render(scene, camera);
});

document.getElementById("bg").appendChild(renderer.domElement);

dayjs.locale("zh-cn");

const app = new Vue({
  el: "#app",
  data: {
    time: dayjs().format("HH:mm:ss"),
    date: dayjs().format("YYYY/MM/DD dddd"),
    items: []
  },
  methods: {
    // randomIndex: function() {
    //   return Math.floor(Math.random() * this.items.length);
    // },
    // add: function() {
    //   this.items.unshift(this.nextNum++);
    // },
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

      var num1 = 722037070;
      var num2 = 420500830;

      function fnum(id, newnum, num) {
        var options = {
          useEasing: true,
          useGrouping: true,
          separator: ",",
          decimal: "."
        };
        var demo = new CountUp(id, num, newnum, 0, 1.5, options);
        if (!demo.error) {
          demo.start();
        } else {
          console.error(demo.error);
        }
      }

      function loop() {
        var newnum1 = num1 + Math.random() * 3000;
        var newnum2 = num2 + Math.random() * 4000;
        fnum("num1", newnum1, num1);
        fnum("num2", newnum2, num2);
        num1 = newnum1;
        num2 = newnum2;
      }
      loop();
      setInterval(() => {
        loop();
      }, 2000);

      const player = videojs("player", {
        flash: { swf: "./vendor/video-js.swf" },
        techOrder: ["flash"],
        width: 16 * 50,
        height: 9 * 50,
        //  vjs-fluid
        // controls: true,
        controlBar: {
          playbackRateMenuButton: false,
          remainingTimeDisplay: false,
          progressControl: false
        },
        autoplay: true,
        // poster: "./assets/oceans.png",
        sources: [
          {
            src: "rtmp://192.168.0.231:1935/live&home",
            type: "rtmp/mp4"
          }
        ]
      });
      player.on("ready", err => {
        // console.log(2222, err);
      });
      player.on("error", err => {
        // console.log(1111, err);
      });
    });
  }
});
