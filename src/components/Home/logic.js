let sceneWidth = 0;
let sceneHeight = sceneWidth / 2;
// eslint-disable-next-line no-undef
let head = new THREE.Group();
let elGame,
  elStart,
  elTime,
  elContainer,
  elHowTo,
  // eslint-disable-next-line no-unused-vars
  elDistance,
  // eslint-disable-next-line no-unused-vars
  elMovement,
  elDead,
  elWin;
const MAX_TIME = 60;
let startTime = Date.now();
// eslint-disable-next-line no-unused-vars
let distance = 0;
let isWatching = true;

let gameStarted = false;
// eslint-disable-next-line no-unused-vars
let distanceSinceWatching = 0;
// eslint-disable-next-line no-unused-vars
const FINISH_DISTANCE = 100;
// eslint-disable-next-line no-unused-vars
const IN_GAME_MAX_DISTANCE = 4000;
// eslint-disable-next-line no-unused-vars
const MAX_MOVEMENT = 180;
let playing = false;
let watchingTween = null;

const audioDoll = new Audio(
  "https://assets.codepen.io/127738/squid-game-sound.mp3"
);
const audioDollDuration = 5.433469;
const shotGun = new Audio("https://assets.codepen.io/127738/shotgun.mp3");
shotGun.volume = 0.2;
const sigh = new Audio("https://assets.codepen.io/127738/sigh.mp3");

export const startLogic = () => {
  // console.clear();

  elDistance = document.querySelector(".distance .total");
  elStart = document.querySelector(".start");
  elHowTo = document.querySelector(".howto");
  elGame = document.querySelector(".game");

  elContainer = document.querySelector(".container");
  elTime = document.querySelector(".timer .time");
  elMovement = document.querySelector(".movement");
  // elReplay1 = document.querySelector(".replay1");

  // elReplay2 = document.querySelector(".replay2");
  elDead = document.querySelector(".dead");
  elWin = document.querySelector(".win");
};

// eslint-disable-next-line no-unused-vars
const reachedEnd = () => {
  watchingTween.kill();
  sigh.currentTime = 0;
  sigh.play();
  audioDoll.pause();

  playing = false;
  elWin.classList.add("is-visible");
  elContainer.classList.remove("is-playing");
};

// eslint-disable-next-line no-unused-vars
const dead = () => {
  watchingTween.kill();
  audioDoll.pause();
  shotGun.currentTime = 0;
  shotGun.play();

  playing = false;
  elDead.classList.add("is-visible");
  elContainer.classList.remove("is-playing");
};

const timeOut = () => {
  watchingTween.kill();
  audioDoll.pause();
  shotGun.currentTime = 0;
  shotGun.play();

  playing = false;
  elDead.classList.add("is-visible");
  elContainer.classList.remove("is-playing");
};

const updateWatching = () => {
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

  // eslint-disable-next-line no-undef
  gsap.to(head.rotation, {
    y: isWatching ? 0 : -Math.PI,
    duration: 0.4,
  });
  // eslint-disable-next-line no-undef
  watchingTween = gsap.to(
    {},
    {
      duration,
      onComplete: updateWatching,
    }
  );

  if (!isWatching) {
    // eslint-disable-next-line no-undef
    distanceSinceWatching = 0;
  }
};

const updateTimer = (timeLeft) => {
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
};

const init = () => {
  let initialized = false;
  if (initialized) return;

  // var processfn = function (video, dt) {
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
  // };

  updateTimer(MAX_TIME - (Date.now() - startTime) / 1000);

  /* Check if reached timeout */
  if ((Date.now() - startTime) / 1000 > MAX_TIME) {
    timeOut();
  }

  initialized = true;
  playing = true;
  updateWatching();
};

export const start = () => {
  init();
  gameStarted = true;

  elContainer.classList.add("is-playing");
  elHowTo.classList.remove("is-visible");
};

export const replay = () => {
  elContainer.classList.add("is-playing");
  elDead.classList.remove("is-visible");
  elWin.classList.remove("is-visible");
  distance = 0;
  isWatching = true;
  distanceSinceWatching = 0;
  playing = true;
  updateWatching();
  startTime = Date.now();
};

/* On Resize */
function onWindowResize(camera, renderer) {
  if (window.innerWidth / window.innerHeight > 1.9) {
    sceneWidth = window.innerWidth * 0.6;
  } else {
    sceneWidth = window.innerWidth * 0.95;
  }
  sceneHeight = sceneWidth / 2;
  camera.aspect = sceneWidth / sceneHeight;
  // console.log(camera);
  // camera.updateProjectionMatrix();

  renderer.setSize(sceneWidth, sceneHeight);
}

export const setupThreeScene = (elGame) => {
  // eslint-disable-next-line no-undef
  const scene = new THREE.Scene();

  if (window.innerWidth / window.innerHeight > 1.9) {
    sceneWidth = window.innerWidth * 0.6;
  } else {
    sceneWidth = window.innerWidth * 0.95;
  }

  // eslint-disable-next-line no-undef
  const camera = new THREE.PerspectiveCamera(
    75,
    sceneWidth / sceneHeight,
    0.1,
    1000
  );
  // eslint-disable-next-line no-undef
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });
  renderer.setSize(sceneWidth, sceneHeight);

  elGame.appendChild(renderer.domElement);

  camera.position.y = 2.8;
  camera.position.z = 11;

  // eslint-disable-next-line no-undef
  const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
  scene.add(light);
  // eslint-disable-next-line no-undef
  const light2 = new THREE.AmbientLight(0x404040, 1.2);
  scene.add(light2);
  // eslint-disable-next-line no-undef
  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(100, 1000, 100);
  scene.add(spotLight);

  //   let head = new THREE.Group();
  scene.add(head);
  // eslint-disable-next-line no-undef
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

  if (camera && renderer) {
    window.addEventListener("resize", onWindowResize, false);
    onWindowResize(camera, renderer);
  }
};

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

export const initDetection = async () => {
  // eslint-disable-next-line no-undef
  const detector = await poseDetection.createDetector(
    // eslint-disable-next-line no-undef
    poseDetection.SupportedModels.MoveNet
  );

  let video;

  // eslint-disable-next-line no-useless-catch
  try {
    video = await setupCamera();
    // console.log("VIDEO", video);
    video.play();
    detectPosesRealTime(detector, video);
  } catch (e) {
    throw e;
  }
};

const detectPosesRealTime = async (detector, video) => {
  // eslint-disable-next-line no-unused-vars
  const deltas = [];
  // eslint-disable-next-line no-unused-vars
  const previousPositions = [];
  // eslint-disable-next-line no-unused-vars
  const currentPositions = [];
  let previousLeftShoulderPosition = {};

  async function poseDetection() {
    const poses = await detector.estimatePoses(video);

    if (poses[0]) {
      const leftShoulder = poses[0].keypoints.find(
        (k) => k.name === "left_shoulder"
      );
      // eslint-disable-next-line no-unused-vars
      const rightShoulder = poses[0].keypoints.find(
        (k) => k.name === "right_shoulder"
      );
      // eslint-disable-next-line no-unused-vars
      const leftElbow = poses[0].keypoints.find((k) => k.name === "left_elbow");
      // eslint-disable-next-line no-unused-vars
      const rightElbow = poses[0].keypoints.find(
        (k) => k.name === "right_elbow"
      );
      // eslint-disable-next-line no-unused-vars
      const leftHip = poses[0].keypoints.find((k) => k.name === "left_hip");
      // eslint-disable-next-line no-unused-vars
      const rightHip = poses[0].keypoints.find((k) => k.name === "right_hip");
      // eslint-disable-next-line no-unused-vars
      const leftKnee = poses[0].keypoints.find((k) => k.name === "left_knee");
      // eslint-disable-next-line no-unused-vars
      const rightKnee = poses[0].keypoints.find((k) => k.name === "right_knee");
      // eslint-disable-next-line no-unused-vars
      const leftAnkle = poses[0].keypoints.find((k) => k.name === "left_ankle");
      // eslint-disable-next-line no-unused-vars
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
          //   dead();
        }
      }

      previousLeftShoulderPosition = currentLeftShoulderPosition;
    }

    requestAnimationFrame(poseDetection);
  }

  poseDetection();
};

// initDetection();
