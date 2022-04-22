let options, reference;

let withBoxes = true
let scoreThreshold = 0.5
let inputSize = 224

function resizeCanvasAndResults(dimensions, canvas, results) {
  const { width, height } = dimensions instanceof HTMLVideoElement
    ? faceapi.getMediaDimensions(dimensions)
    : dimensions
  canvas.width = width
  canvas.height = height

  return faceapi.resizeResults(results, { width: 300, height: 300 })
}

function drawLandmarks(dimensions, canvas, results, withBoxes = true) {
  const resizedResults = resizeCanvasAndResults(dimensions, canvas, results)

  if (withBoxes) {
    // faceapi.drawDetection(canvas, resizedResults.map(det => det.detection))
  }

  const faceLandmarks = resizedResults.map(det => det.landmarks)
  const drawLandmarksOptions = {
    lineWidth: 2,
    drawLines: true,
    color: 'green'
  }

  // faceapi.drawLandmarks(canvas, faceLandmarks, drawLandmarksOptions)
}

async function onPlay() {
  const overlay = document.querySelector('canvas')
  const videoEl = document.querySelector('video')
  if (videoEl.paused || videoEl.ended || !faceapi.nets.tinyFaceDetector.params)
    return setTimeout(() => onPlay())

  const result = await faceapi.detectSingleFace(videoEl, options).withFaceLandmarks().withFaceDescriptor()

  if (result) {
    const faceMatcher = new faceapi.FaceMatcher(result)
    drawLandmarks(videoEl, overlay, [result], withBoxes)

    if (reference) {
      const bestMatch = faceMatcher.findBestMatch(reference.descriptor)
      document.querySelector('#rss').textContent = bestMatch._distance
    }
  }

  setTimeout(() => onPlay())
}

async function run() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: {width: 300, height: 300},
    audio: false
  })
  const videoEl = document.querySelector('video')
  videoEl.srcObject = stream;

  options = new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })

  const imgEle = document.querySelector('img')
  reference = await faceapi.detectSingleFace(imgEle, options).withFaceLandmarks().withFaceDescriptor()
}

Promise.all([
  faceapi.nets.ssdMobilenetv1.loadFromUri('models'),
  faceapi.loadTinyFaceDetectorModel('models'),
  faceapi.loadFaceLandmarkModel('models'),
  faceapi.loadFaceRecognitionModel('models'),
  faceapi.nets.tinyFaceDetector.loadFromUri('models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('models'),
]).then(run)
