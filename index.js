console.clear();
let distance = 0;
let isWatching = true;

let gameStarted = false;
let distanceSinceWatching = 0;
let startTime = Date.now();
const elIntro = document.querySelector(".intro");
const elStart = document.querySelector(".start");
const elHowTo = document.querySelector(".howto");
const elGame = document.querySelector(".game");
const elContainer = document.querySelector(".container");
const elTime = document.querySelector(".timer .time");
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

const MAX_MOVEMENT = 15;
const GAME_TIME = 15;

const countdownEl = document.querySelector(".countdown");
let countdownInterval;
let timerInterval;
let playing = false;
let playerHasWon;
let gameFinished = false;
let isDead = false;

function init() {
  let initialized = false;
  if (initialized) return;

  initialized = true;
  playing = true;
  updateWatching();
}

elStart.addEventListener("click", () => {
  startCountdown();
  const startCounter = setTimeout(() => {
    init();
    gameStarted = true;
    initTimer();

    elContainer.classList.add("is-playing");
    elHowTo.classList.replace("is-howto-visible", "is-hidden");
    elIntro.classList.replace("is-visible", "is-hidden");
    clearTimeout(startCounter);
    clearInterval(countdownInterval);
  }, 5000);
});

const initTimer = (time) => {
  let maxTime = time ? time : 14;

  timerInterval = setInterval(() => {
    // clear interval if the player has reached the end
    if (playerHasWon) {
      clearInterval(timerInterval);
      return;
    }
    const formatSeconds = maxTime < 10 ? `0${maxTime}` : maxTime;
    elTime.innerHTML = `00:${formatSeconds}`;
    if (maxTime > 0) {
      maxTime--;
    } else {
      // timeout
      timeOut();
      clearInterval(timerInterval);
      return;
    }
  }, 1000);
};

const resetCounter = () => {
  initTimer(GAME_TIME);
};

const startCountdown = () => {
  let countdown = 5;
  countdownEl.innerHTML = countdown;

  countdownInterval = setInterval(() => {
    countdown--;
    countdownEl.innerHTML = countdown;
  }, 1000);
};

function reachedEnd() {
  if (!gameFinished) {
    if (watchingTween) {
      watchingTween.kill();
    }

    sigh.currentTime = 0;
    sigh.play();
    audioDoll.pause();

    playing = false;
    elHowTo.classList.replace("is-hidden", "is-howto-visible");
    elWin.classList.replace("is-hidden", "is-visible");
    elContainer.classList.remove("is-playing");
    clearInterval(timerInterval);
    gameFinished = true;
  }
}

function timeOut() {
  isDead = true;
  if (watchingTween) {
    watchingTween.kill();
  }
  audioDoll.pause();
  shotGun.currentTime = 0;
  shotGun.play();

  playing = false;
  elHowTo.classList.replace("is-hidden", "is-howto-visible");
  elDead.classList.replace("is-hidden", "is-visible");
  elContainer.classList.remove("is-playing");
  clearInterval(timerInterval);
}

function dead() {
  isDead = true;
  if (watchingTween) {
    watchingTween.kill();
  }

  audioDoll.pause();
  shotGun.currentTime = 0;
  shotGun.play();

  playing = false;
  elHowTo.classList.replace("is-hidden", "is-howto-visible");
  elDead.classList.replace("is-hidden", "is-visible");
  elContainer.classList.remove("is-playing");
  clearInterval(timerInterval);
}

let watchingTween = null;
function updateWatching() {
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

/* THREEJS PART */
const scene = new THREE.Scene();
let sceneWidth = 0;
if (window.innerWidth / window.innerHeight > 1.9) {
  sceneWidth = window.innerWidth * 0.8;
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

    elStart.innerHTML = "Start";
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
    sceneWidth = window.innerWidth * 0.8;
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
  gameFinished = false;
  isDead = false;
  elContainer.classList.add("is-playing");
  elHowTo.classList.replace("is-howto-visible", "is-hidden");
  elDead.classList.replace("is-visible", "is-hidden");
  elWin.classList.replace("is-visible", "is-hidden");
  distance = 0;
  isWatching = true;
  distanceSinceWatching = 0;
  playing = true;
  updateWatching();
  startTime = Date.now();
  resetCounter();
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
  let previousPositions = [];

  async function poseDetection() {
    const poses = await detector.estimatePoses(video);

    if (poses[0]) {
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

      const currentPositions = [
        {
          x: leftShoulder.x,
          y: leftShoulder.y,
          movementThreshold: 15,
        },
        {
          x: rightShoulder.x,
          y: rightShoulder.y,
          movementThreshold: 15,
        },
        {
          x: leftElbow.x,
          y: leftElbow.y,
          movementThreshold: 20,
        },
        {
          x: rightElbow.x,
          y: rightElbow.y,
          movementThreshold: 20,
        },
        {
          x: leftHip.x,
          y: leftHip.y,
          movementThreshold: 100,
        },
        {
          x: rightHip.x,
          y: rightHip.y,
          movementThreshold: 100,
        },
        {
          x: leftKnee.x,
          y: leftKnee.y,
          movementThreshold: 100,
        },
        {
          x: rightKnee.x,
          y: rightKnee.y,
          movementThreshold: 100,
        },
        {
          x: leftAnkle.x,
          y: leftAnkle.y,
          movementThreshold: 100,
        },
        {
          x: rightAnkle.x,
          y: rightAnkle.y,
          movementThreshold: 100,
        },
      ];

      const hasReachedEnd = detectReachedEnd(rightShoulder, leftShoulder);

      if (hasReachedEnd && !isDead) {
        reachedEnd();
        playerHasWon = true;
      }

      if (previousPositions[0] && gameStarted && isWatching) {
        detectMovement(currentPositions, previousPositions);
      }

      previousPositions = currentPositions;
    }

    requestAnimationFrame(poseDetection);
  }

  poseDetection();
};

const detectReachedEnd = (rightShoulder, leftShoulder) => {
  // if (rightShoulder.x < 400) {
  if (rightShoulder.x < 400 && window.innerWidth - leftShoulder.x < 1000) {
    return true;
  }
  return false;
};

const detectMovement = (currentPositions, previousPositions) => {
  let shouldersRatio =
    ((currentPositions[0].x - currentPositions[1].x) * 100) / window.innerWidth;

  // let movementLimit = shouldersRatio > 10 ? 30 : 15;
  let movementLimit;
  if (shouldersRatio > 15) {
    movementLimit = 100;
  } else if (shouldersRatio < 15 && shouldersRatio > 5) {
    movementLimit = 50;
  } else if (shouldersRatio < 5) {
    movementLimit = 3;
  }

  currentPositions.map((p, i) => {
    if (p.x - previousPositions[i].x > Math.abs(movementLimit)) {
      if (!isDead) {
        dead();
      }
    }
  });
};

initDetection();
