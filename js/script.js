const $ = (s) => document.querySelector(s);
const pages = [
  [
    "1.jpg",
    "That first smile",
    "एक मुस्कान, और मैं हार गया।",
    "याद है, वो कंप्यूटर क्लास? सब अपनी स्क्रीन में खोए थे, और मैं बस एक मुस्कान में। हाथ पर सिर टिकाए तुम, आँखों में हल्की-सी शरारत। उस दिन मुझे नहीं पता था कि ये मुस्कान एक दिन मेरे हर दिन की वजह बन जाएगी।",
    "50% 12%",
  ],
  [
    "3.jpg",
    "Café evening",
    "ख़ामोशी में भी तुम्हारी आवाज़ है।",
    "कैफ़े की उस टेबल पर तुम किसी और तरफ़ देख रही थीं, और मैं चुपके से तुम्हें। तुम्हारे साथ खामोशी भी बोलती है, और मुझे सबसे ज़्यादा वही सुनना पसंद है। तुम पास हो तो न कुछ कहना ज़रूरी लगता है, न कुछ माँगना।",
    "50% 30%",
  ],
  [
    "2.jpg",
    "Colours of Diksha",
    "तुम हो, तो हर दिन त्योहार है।",
    "घाघरा-चोली, हाथ में डांडिया, माथे पर बिंदी और आँखों में चमक। तुम जब सजती हो तो त्योहार भी तुमसे रौनक उधार लेते हैं। पर मुझे सबसे प्यारी तुम तब लगती हो, जब बिना किसी सजावट के बस खिलखिलाकर हँस देती हो।",
    "50% 25%",
  ],
  [
    "4.jpg",
    "Golden hour",
    "वक़्त रुक गया था, उस सुनहरी शाम में।",
    "ढलते सूरज की सुनहरी रोशनी, तुम्हारा हाथ मेरे चेहरे पर, और तुम्हारी आँखों में वो अपनापन। उस एक पल में लगा कि वक़्त ने भी साँस रोक ली है। काश, वो शाम कभी ख़त्म ही न होती।",
    "50% 50%",
  ],
  [
    "5.jpg",
    "By the waterfall",
    "तुम साथ हो, तो हर सफ़र मंज़िल है।",
    "झरने की आवाज़, ठंडी हवा और तुम्हारा साथ। मैंने पानी को नहीं देखा, बस तुम्हारे बगल में खड़ा रहा और मन ही मन माँग लिया कि ज़िंदगी के हर सफ़र में तुम यूँ ही मेरे साथ रहो।",
    "50% 40%",
  ],
  [
    "6.jpg",
    "My sweetest prayer",
    "तुम मेरी बिन माँगी दुआ हो।",
    "लाल साड़ी में, चाँदी की झुमकों के साथ, तुम्हें देखा तो लगा कि दुआएँ सच में कबूल होती हैं। तुम मेरी वो दुआ हो जो मैंने माँगी भी नहीं थी, फिर भी ऊपर वाले ने मुझे दे दी। जन्मदिन मुबारक हो, दीक्षा।",
    "50% 20%",
  ],
];
let cur = 0,
  stage = 0;
const words = (t, o = 0) =>
  t
    .split(" ")
    .map((w, i) => `<span class="w" style="--i:${i + o}">${w}</span>`)
    .join(" ");
function showPage(d) {
  cur = Math.max(0, Math.min(pages.length, cur + d));
  if (cur == pages.length) {
    cur = pages.length - 1;
    go(3);
    return;
  }
  const p = pages[cur];
  $("#book").innerHTML =
    `<div class="spread"><div class="pic"><img src="photos/${p[0]}" style="object-position:${p[4]}" alt=""></div><div class="txt"><h2>${p[1]}</h2><div class="pull">${p[2]}</div><p>${words(p[3])}</p></div></div>`;
  $("#dots").innerHTML = pages
    .map((_, i) => `<i class="${i == cur ? "a" : ""}"></i>`)
    .join("");
}
$("#next").onclick = () => showPage(1);
$("#prev").onclick = () => showPage(-1);
let sx = 0;
addEventListener("touchstart", (e) => (sx = e.touches[0].clientX));
addEventListener("touchend", (e) => {
  if (stage != 2) return;
  const d = e.changedTouches[0].clientX - sx;
  if (Math.abs(d) > 60) showPage(d < 0 ? 1 : -1);
});
// text splitting
document.querySelectorAll("h1").forEach((h) => {
  let i = 0;
  h.querySelectorAll(".chars").forEach((e) => {
    e.innerHTML = [...e.textContent]
      .map(
        (c) =>
          `<span class="ch" style="--i:${i++}">${c == " " ? "&nbsp;" : c}</span>`,
      )
      .join("");
  });
});
let wo = 0;
document.querySelectorAll(".hp").forEach((p) => {
  p.innerHTML = words(p.textContent, wo);
  wo += p.textContent.split(" ").length;
});

/* ---------- 3D ---------- */
const R = new THREE.WebGLRenderer({
  canvas: $("#gl"),
  antialias: true,
  alpha: true,
});
R.setPixelRatio(Math.min(devicePixelRatio, 2));
const S = new THREE.Scene();
const C = new THREE.PerspectiveCamera(50, 1, 0.1, 200);
S.add(new THREE.AmbientLight(0xffd6ec, 0.7));
const pl = new THREE.PointLight(0xffb0d0, 1.6, 40);
pl.position.set(3, 5, 5);
S.add(pl);
const pl2 = new THREE.PointLight(0x9b5cff, 1.4, 40);
pl2.position.set(-5, 2, -3);
S.add(pl2);
function glow(c) {
  const k = document.createElement("canvas");
  k.width = k.height = 64;
  const x = k.getContext("2d"),
    g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, c);
  g.addColorStop(0.3, c + "aa");
  g.addColorStop(1, "#0000");
  x.fillStyle = g;
  x.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(k);
}
const GL = glow("#ffffff");
// stars
const sg = new THREE.BufferGeometry(),
  sp = [];
for (let i = 0; i < 1600; i++) {
  const r = 20 + Math.random() * 60,
    t = Math.random() * 6.28,
    u = Math.acos(2 * Math.random() - 1);
  sp.push(
    r * Math.sin(u) * Math.cos(t),
    r * Math.sin(u) * Math.sin(t),
    r * Math.cos(u),
  );
}
sg.setAttribute("position", new THREE.Float32BufferAttribute(sp, 3));
const stars = new THREE.Points(
  sg,
  new THREE.PointsMaterial({
    size: 0.55,
    map: GL,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }),
);
S.add(stars);
// heart + rings
const hs = new THREE.Shape();
hs.moveTo(0, -1);
hs.bezierCurveTo(-1.6, 0.2, -0.9, 1.3, 0, 0.5);
hs.bezierCurveTo(0.9, 1.3, 1.6, 0.2, 0, -1);
const hm = new THREE.MeshStandardMaterial({
  color: 0xff4f8b,
  emissive: 0xff2a6d,
  emissiveIntensity: 0.7,
  metalness: 0.3,
  roughness: 0.25,
});
const heart = new THREE.Mesh(
  new THREE.ExtrudeGeometry(hs, {
    depth: 0.35,
    bevelEnabled: true,
    bevelThickness: 0.15,
    bevelSize: 0.12,
    bevelSegments: 6,
  }),
  hm,
);
heart.geometry.center();
const hg = new THREE.Group();
hg.add(heart);
const halo = new THREE.Sprite(
  new THREE.SpriteMaterial({
    map: glow("#ff5fa0"),
    blending: THREE.AdditiveBlending,
    transparent: true,
  }),
);
halo.scale.setScalar(6);
hg.add(halo);
const rings = [];
for (let k = 0; k < 3; k++) {
  const g = new THREE.BufferGeometry(),
    p = [],
    r = 2 + k * 0.7;
  for (let i = 0; i < 160; i++) {
    const a = (i / 160) * 6.28;
    p.push(Math.cos(a) * r, Math.sin(a * 3 + k) * 0.08, Math.sin(a) * r);
  }
  g.setAttribute("position", new THREE.Float32BufferAttribute(p, 3));
  const m = new THREE.Points(
    g,
    new THREE.PointsMaterial({
      size: 0.16,
      map: glow(["#ffd98a", "#ff8fbd", "#b98cff"][k]),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  m.rotation.set(1.1 + k * 0.5, k, k * 0.7);
  rings.push(m);
  hg.add(m);
}
S.add(hg);
// cake
const cake = new THREE.Group(),
  cream = new THREE.MeshStandardMaterial({ color: 0xfff1e4, roughness: 0.5 }),
  pink = new THREE.MeshStandardMaterial({ color: 0xff8fb8, roughness: 0.4 });
function txtTex() {
  const k = document.createElement("canvas");
  k.width = 1024;
  k.height = 128;
  const x = k.getContext("2d");
  x.fillStyle = "#fff1e4";
  x.fillRect(0, 0, 1024, 128);
  x.fillStyle = "#c23b73";
  x.font = "600 54px Georgia,serif";
  x.textAlign = "center";
  x.textBaseline = "middle";
  x.fillText("Happy Birthday Diksha ♥", 256, 68);
  x.fillText("Happy Birthday Diksha ♥", 768, 68);
  return new THREE.CanvasTexture(k);
}
const plate = new THREE.Mesh(
  new THREE.CylinderGeometry(2.1, 2.1, 0.1, 64),
  new THREE.MeshStandardMaterial({
    color: 0xf4c97a,
    metalness: 0.8,
    roughness: 0.25,
  }),
);
plate.position.y = -0.05;
cake.add(plate);
const l1 = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.9, 64), cream);
l1.position.y = 0.45;
cake.add(l1);
const l2 = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 0.75, 64), [
  new THREE.MeshStandardMaterial({ map: txtTex() }),
  cream,
  cream,
]);
l2.position.y = 1.28;
cake.add(l2);
[
  [1.5, 0.9],
  [1.05, 1.65],
].forEach(([r, y], j) => {
  const t = new THREE.Mesh(new THREE.TorusGeometry(r, 0.07, 12, 64), pink);
  t.rotation.x = Math.PI / 2;
  t.position.y = y;
  cake.add(t);
  const n = j ? 22 : 34;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * 6.28,
      b = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), pink);
    b.position.set(Math.cos(a) * (r - 0.02), y + 0.1, Math.sin(a) * (r - 0.02));
    cake.add(b);
  }
  for (let i = 0; i < n; i++) {
    const a = ((i + 0.5) / n) * 6.28,
      d = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), pink);
    d.scale.y = 2 + Math.random() * 3;
    d.position.set(Math.cos(a) * r, y - 0.12, Math.sin(a) * r);
    cake.add(d);
  }
});
const can = new THREE.Mesh(
  new THREE.CylinderGeometry(0.06, 0.06, 0.55, 16),
  new THREE.MeshStandardMaterial({ color: 0xf4c97a, emissive: 0x553300 }),
);
can.position.y = 2;
cake.add(can);
const flame = new THREE.Sprite(
  new THREE.SpriteMaterial({
    map: glow("#ffc861"),
    blending: THREE.AdditiveBlending,
    transparent: true,
  }),
);
flame.position.y = 2.45;
cake.add(flame);
const fl = new THREE.PointLight(0xffb454, 1.6, 8);
fl.position.y = 2.5;
cake.add(fl);
cake.position.y = -0.9;
cake.visible = false;
S.add(cake);
// floating photo frames
const frames = [];
for (let i = 1; i <= 6; i++) {
  const g = new THREE.Group();
  const back = new THREE.Mesh(
    new THREE.PlaneGeometry(1.66, 2.16),
    new THREE.MeshBasicMaterial({
      color: 0xfff6ee,
      transparent: true,
      opacity: 0,
    }),
  );
  back.position.z = -0.01;
  const m = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }),
    ph = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 2), m);
  new THREE.TextureLoader().load(IMG[i + ".jpg"], (t) => {
    const a = t.image.width / t.image.height,
      f = 0.75;
    if (a > f) {
      t.repeat.x = f / a;
      t.offset.x = (1 - t.repeat.x) / 2;
    } else {
      t.repeat.y = a / f;
      t.offset.y = (1 - t.repeat.y) / 2;
    }
    m.map = t;
    m.needsUpdate = true;
  });
  g.add(back, ph);
  g.userData = { m, back };
  S.add(g);
  frames.push(g);
}
// balloons
const bal = [],
  bms = [],
  bc = [0xff5f9e, 0xffc86b, 0xb98cff, 0x6bd6ff, 0xff8a6b];
for (let i = 0; i < 9; i++) {
  const g = new THREE.Group(),
    mt = new THREE.MeshStandardMaterial({
      color: bc[i % 5],
      roughness: 0.15,
      metalness: 0.1,
      emissive: bc[i % 5],
      emissiveIntensity: 0.18,
    });
  const b = new THREE.Mesh(new THREE.SphereGeometry(0.45, 24, 24), mt);
  b.scale.y = 1.25;
  const kn = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.12, 8), mt);
  kn.position.y = -0.6;
  kn.rotation.x = Math.PI;
  const ln = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -0.66, 0),
      new THREE.Vector3(0, -1.8, 0),
    ]),
    new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.4,
    }),
  );
  g.add(b, kn, ln);
  g.userData = {
    x0: (Math.random() - 0.5) * 2,
    sp: 0.35 + Math.random() * 0.4,
    ph: Math.random() * 6,
    ox: 0,
  };
  b.userData.g = g;
  g.position.set(0, -8 + Math.random() * 16, -2 - Math.random() * 3);
  bal.push(g);
  bms.push(b);
  S.add(g);
}
// confetti + mouse trail
const N = 800,
  cp = new Float32Array(N * 3).fill(-999),
  cc = new Float32Array(N * 3),
  cv = [],
  cg = new THREE.BufferGeometry();
let bi = 0;
for (let i = 0; i < N; i++) cv.push(new THREE.Vector3());
cg.setAttribute("position", new THREE.BufferAttribute(cp, 3));
cg.setAttribute("color", new THREE.BufferAttribute(cc, 3));
S.add(
  new THREE.Points(
    cg,
    new THREE.PointsMaterial({
      size: 0.16,
      vertexColors: true,
      map: GL,
      transparent: true,
      depthWrite: false,
    }),
  ),
);
const pal = ["#ff7aa8", "#f4c97a", "#b98cff", "#ffffff", "#7ad7ff"].map(
  (c) => new THREE.Color(c),
);
function burst(y, n = 400, spread = 7, x = 0, z = 0) {
  for (let k = 0; k < n; k++) {
    const i = bi++ % N;
    cp.set(
      [x + (Math.random() - 0.5) * 0.5, y, z + (Math.random() - 0.5) * 0.5],
      i * 3,
    );
    cv[i].set(
      (Math.random() - 0.5) * spread,
      Math.random() * spread * 0.9 + 2,
      (Math.random() - 0.5) * spread,
    );
    const c = pal[k % 5];
    cc.set([c.r, c.g, c.b], i * 3);
  }
  cg.attributes.color.needsUpdate = true;
}
const TN = 140,
  tp = new Float32Array(TN * 3).fill(-999),
  tc = new Float32Array(TN * 3),
  tl = new Float32Array(TN),
  tv = [],
  tg = new THREE.BufferGeometry();
let ti = 0;
for (let i = 0; i < TN; i++) tv.push(new THREE.Vector3());
tg.setAttribute("position", new THREE.BufferAttribute(tp, 3));
tg.setAttribute("color", new THREE.BufferAttribute(tc, 3));
S.add(
  new THREE.Points(
    tg,
    new THREE.PointsMaterial({
      size: 0.28,
      vertexColors: true,
      map: GL,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  ),
);
// input
let portrait = false,
  px = 0,
  py = 0,
  nx = 0,
  ny = 0,
  drag = false,
  lx = 0,
  rot = 0,
  hov = false,
  mp = new THREE.Vector3();
const rc = new THREE.Raycaster();
function mouseWorld() {
  const v = new THREE.Vector3(nx, ny, 0.5)
    .unproject(C)
    .sub(C.position)
    .normalize();
  return C.position.clone().add(v.multiplyScalar(-C.position.z / v.z));
}
function resize() {
  const w = innerWidth,
    h = innerHeight;
  R.setSize(w, h);
  C.aspect = w / h;
  C.updateProjectionMatrix();
  portrait = w / h < 0.8;
}
addEventListener("resize", resize);
resize();
addEventListener("pointermove", (e) => {
  px = e.clientX / innerWidth - 0.5;
  py = e.clientY / innerHeight - 0.5;
  nx = px * 2;
  ny = -py * 2;
  document.documentElement.style.setProperty(
    "--rx",
    (-py * 7).toFixed(2) + "deg",
  );
  document.documentElement.style.setProperty(
    "--ry",
    (px * 9).toFixed(2) + "deg",
  );
  mp = mouseWorld();
  for (let k = 0; k < 2; k++) {
    const i = ti++ % TN;
    tp.set(
      [
        mp.x + (Math.random() - 0.5) * 0.2,
        mp.y + (Math.random() - 0.5) * 0.2,
        mp.z,
      ],
      i * 3,
    );
    tv[i].set((Math.random() - 0.5) * 0.02, Math.random() * 0.02, 0);
    tl[i] = 1;
    (k ? pal[0] : pal[1]).toArray(tc, i * 3);
  }
  if (stage == 0) {
    rc.setFromCamera(new THREE.Vector2(nx, ny), C);
    hov = rc.intersectObject(heart).length > 0;
  }
  if (drag && stage == 1) {
    rot += (e.clientX - lx) * 0.01;
    lx = e.clientX;
  }
});
addEventListener("pointerdown", (e) => {
  drag = true;
  lx = e.clientX;
  rc.setFromCamera(
    new THREE.Vector2(
      (e.clientX / innerWidth) * 2 - 1,
      -(e.clientY / innerHeight) * 2 + 1,
    ),
    C,
  );
  const h = rc.intersectObjects(bms)[0];
  if (h) {
    const g = h.object.userData.g;
    burst(g.position.y, 160, 6, g.position.x, g.position.z);
    g.position.y = -9;
  } else if (stage == 0 && rc.intersectObject(heart).length) {
    burst(hg.position.y, 350, 8);
    hV += 0.12;
  } else if (stage == 3) burst(2, 300, 8);
});
addEventListener("pointerup", () => (drag = false));
// stages
let blown = false,
  camT = new THREE.Vector3(0, 0, 9),
  punch = 0,
  hS = 0,
  hV = 0,
  cS = 0,
  cV = 0,
  hk = 1;
function go(n) {
  stage = n;
  document
    .querySelectorAll(".stage")
    .forEach((e, i) => e.classList.toggle("on", i == n));
  hg.visible = n == 0;
  cake.visible = n == 1;
  punch = 1;
  if (n == 0) {
    hS = 0;
    hV = 0;
  }
  if (n == 1) {
    cS = 0;
    cV = 0;
    burst(2, 200, 6);
  }
  if (n == 2) {
    cur = 0;
    showPage(0);
  }
  if (n == 3) burst(2, 500, 9);
  camT.set(0, n == 1 ? 1.3 : 0, n == 1 ? (portrait ? 10 : 8) : 9);
}
document.querySelectorAll("[data-go]").forEach(
  (b) =>
    (b.onclick = () => {
      go(+b.dataset.go);
      startSong();
    }),
);
$("#blow").onclick = () => {
  if (!blown) {
    blown = true;
    flame.visible = false;
    fl.intensity = 0;
    burst(2.3);
    $("#wishmsg").textContent = "May every wish come true ✨";
    $("#blow").textContent = "See our story 💞";
  } else go(2);
};
$("#again").onclick = () => {
  blown = false;
  flame.visible = true;
  fl.intensity = 1.6;
  $("#blow").textContent = "Blow out the candle 🎂";
  $("#wishmsg").textContent =
    "Close your eyes, wish from the heart, then blow out the candle";
  go(0);
};
/* ---------- music: your song.mp3, a file you pick, or a built-in music-box tune ---------- */
const song = $("#song");
let AC,
  master,
  mode = null,
  playing = false,
  timer;
const MEL = [
  [7, 0.75],
  [7, 0.25],
  [9, 1],
  [7, 1],
  [12, 1],
  [11, 2],
  [7, 0.75],
  [7, 0.25],
  [9, 1],
  [7, 1],
  [14, 1],
  [12, 2],
  [7, 0.75],
  [7, 0.25],
  [19, 1],
  [16, 1],
  [12, 1],
  [11, 1],
  [9, 2],
  [17, 0.75],
  [17, 0.25],
  [16, 1],
  [12, 1],
  [14, 1],
  [12, 2],
];
function synthStart() {
  master = AC.createGain();
  master.gain.value = 0.55;
  const d = AC.createDelay(),
    fb = AC.createGain();
  d.delayTime.value = 0.33;
  fb.gain.value = 0.38;
  master.connect(AC.destination);
  master.connect(d);
  d.connect(fb);
  fb.connect(d);
  d.connect(AC.destination);
  const B = 0.6;
  let L = 0;
  MEL.forEach((m) => (L += m[1] * B));
  (function loop() {
    let t = AC.currentTime + 0.1;
    MEL.forEach(([n, b]) => {
      const f = 261.63 * Math.pow(2, n / 12);
      [
        [f, "sine", 0.28],
        [f * 2, "triangle", 0.08],
        [f * 3.01, "sine", 0.03],
      ].forEach(([fq, ty, v]) => {
        const o = AC.createOscillator(),
          g = AC.createGain();
        o.type = ty;
        o.frequency.value = fq;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(v, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0008, t + b * B * 2.2);
        o.connect(g);
        g.connect(master);
        o.start(t);
        o.stop(t + b * B * 2.3);
      });
      t += b * B;
    });
    timer = setTimeout(loop, (L + 1.2) * 1000);
  })();
  mode = "synth";
}
function startSong() {
  if (mode) {
    return;
  }
  AC = AC || new (window.AudioContext || window.webkitAudioContext)();
  AC.resume();
  song
    .play()
    .then(() => {
      mode = "file";
    })
    .catch(() => synthStart());
  playing = true;
}
$("#mute").onclick = () => {
  if (!mode) {
    startSong();
    return;
  }
  if (playing) {
    mode == "file" ? song.pause() : AC.suspend();
    playing = false;
  } else {
    mode == "file" ? song.play() : AC.resume();
    playing = true;
  }
};
$("#file").onchange = (e) => {
  const f = e.target.files[0];
  if (!f) return;
  if (mode == "synth") {
    clearTimeout(timer);
    master.gain.value = 0;
  }
  AC = AC || new (window.AudioContext || window.webkitAudioContext)();
  if (AC.state == "suspended") AC.resume();
  song.src = URL.createObjectURL(f);
  song.play();
  mode = "file";
  playing = true;
};
/* ---------- render loop ---------- */
let last = performance.now();
(function loop(now) {
  requestAnimationFrame(loop);
  const t = now / 1000,
    dt = Math.min((now - last) / 1000, 0.05);
  last = now;
  stars.rotation.y = t * 0.012 + px * 0.2;
  stars.rotation.x = py * 0.15;
  hV += (1 - hS) * 0.12;
  hV *= 0.86;
  hS += hV;
  hk += ((hov ? 1.15 : 1) - hk) * 0.1;
  hg.scale.setScalar(Math.max(hS, 0.001) * hk);
  hg.position.y = portrait ? 1.2 : 0.3;
  hg.rotation.y = Math.sin(t * 0.6) * 0.4 + px * 1.4;
  hg.rotation.x = py * 0.7;
  heart.scale.setScalar(0.8 * (1 + Math.sin(t * (hov ? 7 : 3)) * 0.06));
  hm.emissiveIntensity = hov ? 1.3 : 0.7;
  rings.forEach(
    (r, i) => (r.rotation.z += (0.004 + (hov ? 0.02 : 0)) * (i + 1)),
  );
  cV += (1 - cS) * 0.12;
  cV *= 0.86;
  cS += cV;
  if (cake.visible) {
    if (!drag) rot += 0.004;
    cake.rotation.y = rot;
    cake.rotation.x = py * 0.18;
    cake.rotation.z = -px * 0.1;
    cake.scale.setScalar(Math.max(cS, 0.001));
    cake.position.y = -0.9 + Math.sin(t) * 0.05;
    flame.scale.set(
      0.6 + Math.sin(t * 14) * 0.06,
      1 + Math.sin(t * 11) * 0.1,
      1,
    );
    flame.position.x = Math.sin(t * 9) * 0.02 - px * 0.05;
  }
  // frames
  const fo = stage == 1 ? 0 : stage == 0 ? (portrait ? 0.55 : 0.95) : 0.4;
  frames.forEach((g, k) => {
    const s = k % 2 ? 1 : -1,
      X = portrait ? 2.1 : 5.6,
      sc = portrait ? 0.65 : 1;
    g.position.set(
      s * (X + Math.sin(t * 0.5 + k) * 0.3),
      (k - 2.5) * (portrait ? 1.25 : 1.3) + Math.sin(t * 0.8 + k * 2) * 0.25,
      -3 - (k % 3) * 0.8,
    );
    g.rotation.set(
      py * 0.25,
      -s * 0.35 + px * 0.5,
      Math.sin(t * 0.6 + k) * 0.08,
    );
    g.scale.setScalar(sc);
    const u = g.userData;
    u.m.opacity += (fo - u.m.opacity) * 0.06;
    u.back.material.opacity = u.m.opacity;
  });
  // balloons
  bal.forEach((g) => {
    const u = g.userData,
      W = portrait ? 3 : 7;
    g.position.y += u.sp * dt;
    if (g.position.y > 8) {
      g.position.y = -8;
      u.x0 = (Math.random() - 0.5) * 2;
    }
    const dx = g.position.x - mp.x,
      dy = g.position.y - mp.y,
      d = Math.hypot(dx, dy);
    if (d < 2.2 && d > 0.01) u.ox += (dx / d) * (2.2 - d) * 0.06;
    u.ox *= 0.96;
    g.position.x = u.x0 * W + Math.sin(t * 0.8 + u.ph) * 0.4 + u.ox;
    g.rotation.z = Math.sin(t + u.ph) * 0.12;
  });
  // particles
  for (let i = 0; i < N; i++) {
    if (cp[i * 3 + 1] < -50) continue;
    cv[i].y -= 0.06;
    cp[i * 3] += cv[i].x * 0.016;
    cp[i * 3 + 1] += cv[i].y * 0.016;
    cp[i * 3 + 2] += cv[i].z * 0.016;
    cv[i].multiplyScalar(0.995);
    if (cp[i * 3 + 1] < -9) cp[i * 3 + 1] = -999;
  }
  cg.attributes.position.needsUpdate = true;
  for (let i = 0; i < TN; i++) {
    if (tl[i] <= 0) {
      tp[i * 3 + 1] = -999;
      continue;
    }
    tl[i] -= 0.03;
    tp[i * 3] += tv[i].x;
    tp[i * 3 + 1] += tv[i].y - 0.004;
    tc[i * 3] *= 0.95;
    tc[i * 3 + 1] *= 0.95;
    tc[i * 3 + 2] *= 0.95;
  }
  tg.attributes.position.needsUpdate = true;
  tg.attributes.color.needsUpdate = true;
  punch *= 0.93;
  C.fov = 50 + punch * 16;
  C.updateProjectionMatrix();
  C.position.lerp(
    new THREE.Vector3(camT.x + px * 1.2, camT.y - py * 0.8, camT.z),
    0.05,
  );
  C.lookAt(0, stage == 1 ? 0.6 : 0, 0);
  R.render(S, C);
})(performance.now());
