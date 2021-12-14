var image = document.getElementById("imageUpload");

var models = "/library";

Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri("/library"),
    faceapi.nets.faceLandmark68Net.loadFromUri("/library"),
    faceapi.nets.ssdMobilenetv1.loadFromUri("/library")
]).then(startImage())

function startImage() {
    const container = document.createElement("div")
    container.style.position = "relative"
    document.body.append(container);
    document.body.append("MODELS LOADED");
    image.addEventListener("change", async () => {
        //Takes file and converts it to an image that is usable by the api
        let input = await faceapi.bufferToImage(image.files[0])
        container.append(input)
        const canvas = faceapi.createCanvasFromMedia(input);
        container.append(canvas)
        const displaySize = { width: input.width, height: input.height }
        faceapi.matchDimensions(canvas, displaySize)
        const detections = await faceapi.detectAllFaces(input).withFaceLandmarks().withFaceDescriptors()
        const faceDescriptions = faceapi.resizeResults(detections, displaySize);
        //const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
        faceDescriptions.forEach(detection => {
            const box = detection.detection.box
            const drawBox = new faceapi.draw.DrawBox(box, {label: "Face"})
            drawBox.draw(canvas)
        })
    })
}