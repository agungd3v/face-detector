let image = document.querySelector('img')
let video = document.querySelector('video')
let canvas = document.querySelector('canvas')
let ctx = canvas.getContext('2d')
let displaySize, model;

let width = 300
let height = 300

const startSteam = () => {
  navigator.mediaDevices.getUserMedia({
    video: {width, height},
    audio : false
  }).then((steam) => {video.srcObject = steam})
}

const detectFace = async () => {
  const prediction = await model.estimateFaces(video, false)
  ctx.drawImage(video, 0, 0, width, height)

  prediction.forEach(pre => {
    // ctx.beginPath()
    // ctx.lineWidth = 2
    // ctx.strokeStyle = 'blue'
    // ctx.rect(pre.topLeft[0], pre.topLeft[1], pre.bottomRight[0] - pre.topLeft[0], pre.bottomRight[1], pre.topLeft[1])
    // ctx.stroke()

    ctx.fillStyle = 'red'
    pre.landmarks.forEach(landmark => {
      ctx.fillRect(landmark[0], landmark[1], 5, 5)
    })
  })
}

startSteam()

video.addEventListener('loadeddata', async () => {
  model = await blazeface.load()
  setInterval(detectFace, 100)
})

// Promise.all([
//   faceapi.nets.ageGenderNet.loadFromUri('models'),
//   faceapi.nets.ssdMobilenetv1.loadFromUri('models'),
//   faceapi.nets.tinyFaceDetector.loadFromUri('models'),
//   faceapi.nets.faceLandmark68Net.loadFromUri('models'),
//   faceapi.nets.faceRecognitionNet.loadFromUri('models'),
//   faceapi.nets.faceExpressionNet.loadFromUri('models')
// ]).then(startSteam)


// async function detect() {
//   const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors()

//   ctx.clearRect(0,0, width, height)
//   const resizedDetections = faceapi.resizeResults(detections, displaySize)
//   faceapi.draw.drawDetections(canvas, resizedDetections)

//   resizedDetections.forEach(result => {
//     new faceapi.draw.DrawTextField ([], result.detection.box.bottomRight).draw(canvas)
//   })
// }

// video.addEventListener('play', () => {
//   displaySize = {width, height}
//   faceapi.matchDimensions(canvas, displaySize)

//   setInterval(detect, 2000)
// })
