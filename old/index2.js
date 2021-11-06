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
