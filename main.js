var image = document.getElementById("imageUpload");

var models = "/library";

Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri(models),
    faceapi.nets.faceLandmark68Net.loadFromUri(models),
    faceapi.nets.ssdMobilenetv1.loadFromUri(models)
]).then(startImage());

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
        let detections = await faceapi.detectAllFaces(input)
        const displaySize = {width: image.width, height: image.height}
        faceapi.matchDimensions(canvas, displaySize)
        .withFaceLandmarks().withFaceDescriptors()
        document.body.append(detections.length)
        faceDescriptions = faceapi.resizeResults(detections, displaySize);
        faceapi.draw.drawDetections(canvas, faceDescriptions)
        faceDescriptions.forEach(detection => {
            const box = detection.detection.box
            const draw = faceapi.draw.drawBox(box, {label: "face"})
            drawBox.draw(canvas)
        })
    });
}