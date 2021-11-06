console.clear();
let distance = 0;
let isWatching = true;

let gameStarted = false;
let distanceSinceWatching = 0;
let startTime = Date.now();
const elDistance = document.querySelector(".distance .total");
const elStart = document.querySelector(".start");
const elHowTo = document.querySelector(".howto");
const elGame = document.querySelector(".game");
const elContainer = document.querySelector(".container");
const elTime = document.querySelector(".timer .time");
const elMovement = document.querySelector(".movement");
const elReplay1 = document.querySelector(".replay1");
const elReplay2 = document.querySelector(".replay2");
const elDead = document.querySelector(".dead");
const elWin = document.querySelector(".win");
const audioDoll = new Audio(
  "https://assets.codepen.io/127738/squid-game-sound.mp3"
);
const audioDollDuration = 5.433469;
const shotGun = new Audio("https://assets.codepen.io/127738/shotgun.mp3");
shotGun.volume = 0.2;
const sigh = new Audio("https://assets.codepen.io/127738/sigh.mp3");

const MAX_TIME = 60;
const FINISH_DISTANCE = 100;
const IN_GAME_MAX_DISTANCE = 4000;
const MAX_MOVEMENT = 180;

let playing = false;

let mycamvas;

function init() {
  let initialized = false;
  if (initialized) return;

  let processfn = function (video, dt) {
    // -----
    // if (!isWatching) {
    //   distance += _dist;
    //   /* If user reached the end */
    //   if (distance > IN_GAME_MAX_DISTANCE) {
    //     reachedEnd();
    //   }
    // } else {
    //   distanceSinceWatching += _dist;
    //   if (distanceSinceWatching > MAX_MOVEMENT) {
    //     dead();
    //   }
    // }
  };
  console.log(startTime);

  updateTimer(MAX_TIME - (Date.now() - startTime) / 1000);

  /* Check if reached timeout */
  if ((Date.now() - startTime) / 1000 > MAX_TIME) {
    timeOut();
  }

  initialized = true;
  playing = true;
  updateWatching();
}

elStart.addEventListener("click", () => {
  init();
  gameStarted = true;

  elContainer.classList.add("is-playing");
  elHowTo.classList.remove("is-visible");
});

function reachedEnd() {
  watchingTween.kill();
  sigh.currentTime = 0;
  sigh.play();
  audioDoll.pause();

  playing = false;
  elWin.classList.add("is-visible");
  elContainer.classList.remove("is-playing");
}

function timeOut() {
  watchingTween.kill();
  audioDoll.pause();
  shotGun.currentTime = 0;
  shotGun.play();

  playing = false;
  elDead.classList.add("is-visible");
  elContainer.classList.remove("is-playing");
}

function dead() {
  watchingTween.kill();
  audioDoll.pause();
  shotGun.currentTime = 0;
  shotGun.play();

  playing = false;
  elDead.classList.add("is-visible");
  elContainer.classList.remove("is-playing");
}

let watchingTween = null;
function updateWatching() {
  console.log("heree????");
  if (!playing) return;

  isWatching = !isWatching;

  let duration = Math.random() * 3.5 + 2.5;
  if (isWatching) {
    duration = Math.random() * 2 + 2;
  }
  if (!isWatching) {
    audioDoll.currentTime = 0;
    audioDoll.playbackRate = (audioDollDuration - 0.5) / duration;
    audioDoll.play();
  }
  gsap.to(head.rotation, {
    y: isWatching ? 0 : -Math.PI,
    duration: 0.4,
  });
  watchingTween = gsap.to(
    {},
    {
      duration,
      onComplete: updateWatching,
    }
  );

  if (!isWatching) {
    distanceSinceWatching = 0;
  }
}

function updateTimer(timeLeft) {
  let min = `${Math.floor(timeLeft / 60)}`;
  if (min.length === 1) {
    min = `0${min}`;
  }
  let sec = `${Math.floor(timeLeft % 60)}`;
  if (sec.length === 1) {
    sec = `0${sec}`;
  }
  if (timeLeft < 0) {
    min = "00";
    sec = "00";
  }
  elTime.innerHTML = `${min}:${sec}`;
}

/* THREEJS PART */
const scene = new THREE.Scene();
let sceneWidth = 0;
if (window.innerWidth / window.innerHeight > 1.9) {
  sceneWidth = window.innerWidth * 0.6;
} else {
  sceneWidth = window.innerWidth * 0.95;
}
let sceneHeight = sceneWidth / 2;
const camera = new THREE.PerspectiveCamera(
  75,
  sceneWidth / sceneHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true,
});
renderer.setSize(sceneWidth, sceneHeight);

elGame.appendChild(renderer.domElement);

camera.position.y = 2.8;
camera.position.z = 11;

const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
scene.add(light);
const light2 = new THREE.AmbientLight(0x404040, 1.2);
scene.add(light2);
const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(100, 1000, 100);
scene.add(spotLight);

let head = new THREE.Group();
scene.add(head);
const loader = new THREE.GLTFLoader();
loader.load(
  "https://assets.codepen.io/127738/Squid_game_doll.gltf",
  (gltf) => {
    scene.add(gltf.scene);
    head.add(gltf.scene.children[0].children[0].children[0].children[1]);
    head.add(gltf.scene.children[0].children[0].children[0].children[1]);
    head.add(gltf.scene.children[0].children[0].children[0].children[2]);
    head.children[0].position.y = -8;
    head.children[1].position.y = -8;
    head.children[2].position.y = -8;
    head.children[0].position.z = 1;
    head.children[1].position.z = 1;
    head.children[2].position.z = 1;
    head.children[0].scale.setScalar(1);
    head.children[1].scale.setScalar(1);
    head.children[2].scale.setScalar(1);
    head.position.y = 8;
    head.position.z = -1;

    elStart.classList.add("is-ready");
  },
  (xhr) => {
    console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
  },
  (error) => {
    console.log("An error happened", error);
  }
);

renderer.setAnimationLoop(renderWebGL);

function renderWebGL() {
  renderer.render(scene, camera);
}

/* On Resize */
function onWindowResize() {
  if (window.innerWidth / window.innerHeight > 1.9) {
    sceneWidth = window.innerWidth * 0.6;
  } else {
    sceneWidth = window.innerWidth * 0.95;
  }
  sceneHeight = sceneWidth / 2;
  camera.aspect = sceneWidth / sceneHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(sceneWidth, sceneHeight);
}
window.addEventListener("resize", onWindowResize, false);
onWindowResize();

function replay() {
  elContainer.classList.add("is-playing");
  elDead.classList.remove("is-visible");
  elWin.classList.remove("is-visible");
  distance = 0;
  isWatching = true;
  distanceSinceWatching = 0;
  playing = true;
  updateWatching();
  startTime = Date.now();
}
elReplay1.addEventListener("click", () => {
  replay();
});
elReplay2.addEventListener("click", () => {
  replay();
});

// ------------
// TFJS PART
// ------------

const videoWidth = window.innerWidth;
const videoHeight = window.innerHeight;

function isAndroid() {
  return /Android/i.test(navigator.userAgent);
}

function isiOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isMobile() {
  return isAndroid() || isiOS();
}

async function setupCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error(
      "Browser API navigator.mediaDevices.getUserMedia not available"
    );
  }

  const video = document.getElementById("video");
  video.width = videoWidth;
  video.height = videoHeight;

  const mobile = isMobile();
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: "user",
      width: mobile ? undefined : videoWidth,
      height: mobile ? undefined : videoHeight,
    },
  });
  video.srcObject = stream;

  return new Promise((resolve) => {
    video.onloadedmetadata = () => resolve(video);
  });
}

const initDetection = async () => {
  const detector = await poseDetection.createDetector(
    poseDetection.SupportedModels.MoveNet
  );

  let video;

  try {
    video = await setupCamera();
    video.play();
    detectPosesRealTime(detector);
  } catch (e) {
    throw e;
  }
};

const detectPosesRealTime = async (detector) => {
  const poses = await detector.estimatePoses(video);

  const deltas = [];
  const previousPositions = [];
  const currentPositions = [];
  let previousLeftShoulderPosition = {};

  async function poseDetection() {
    const poses = await detector.estimatePoses(video);

    if (poses) {
      const leftShoulder = poses[0].keypoints.find(
        (k) => k.name === "left_shoulder"
      );
      const rightShoulder = poses[0].keypoints.find(
        (k) => k.name === "right_shoulder"
      );
      const leftElbow = poses[0].keypoints.find((k) => k.name === "left_elbow");
      const rightElbow = poses[0].keypoints.find(
        (k) => k.name === "right_elbow"
      );
      const leftHip = poses[0].keypoints.find((k) => k.name === "left_hip");
      const rightHip = poses[0].keypoints.find((k) => k.name === "right_hip");
      const leftKnee = poses[0].keypoints.find((k) => k.name === "left_knee");
      const rightKnee = poses[0].keypoints.find((k) => k.name === "right_knee");
      const leftAnkle = poses[0].keypoints.find((k) => k.name === "left_ankle");
      const rightAnkle = poses[0].keypoints.find(
        (k) => k.name === "right_ankle"
      );

      const currentLeftShoulderPosition = {
        x: leftShoulder.x,
        y: leftShoulder.y,
      };

      if (previousLeftShoulderPosition.x && gameStarted) {
        if (
          currentLeftShoulderPosition.x - previousLeftShoulderPosition.x >
          Math.abs(20)
        ) {
          console.log("I MOVEDDDDD");
          // dead();
        }
      }

      previousLeftShoulderPosition = currentLeftShoulderPosition;
    }

    requestAnimationFrame(poseDetection);
  }

  poseDetection();
};

// initDetection();
