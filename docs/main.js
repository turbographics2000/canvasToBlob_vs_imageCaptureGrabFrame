const video = document.createElement('video');
const cnv = document.createElement('canvas');
const ctx = cnv.getContext('2d');
let imageCapture;
let cnt = 0;
let canvasToBlobStart, imageCaptureGrabFrameStart, imageCaptureTakePhotoStart;

navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
    video.srcObject = stream;
    video.onloadedmetadata = _ => {
        video.play();
        cnv.width = video.videoWidth;
        cnv.height = video.videoHeight;
        canvasToBlobStart = performance.now();
        canvasToBlob();
    }
    imageCapture = new ImageCapture(stream.getVideoTracks()[0]);
});

function canvasToBlob() {
    cnt++;
    ctx.drawImage(video, 0, 0);
    cnv.toBlob(blob => {
        if (cnt === 100) {
            let duration = performance.now() - canvasToBlobStart;
            const p = document.createElement('p');
            p.textContent = 'Canvas.toBlob(): ' + duration;
            document.body.appendChild(p);
            cnt = 0;
            imageCaptureGrabFrameStart = performance.now();
            imageCaptureGrabFrame();
        } else {
            canvasToBlob();
        }
    });
}

function imageCaptureGrabFrame() {
    cnt++;
    imageCapture.grabFrame().then(imageBitmap => {
        if (cnt === 100) {
            let duration = performance.now() - imageCaptureGrabFrameStart;
            const p = document.createElement('p');
            p.textContent = 'ImageCapture.grabFrame(): ' + duration;
            document.body.appendChild(p);
            cnt = 0;
            imageCaptureTakePhotoStart = performance.now();
            imageCaptureTakePhoto();
        } else {
            imageCaptureGrabFrame();
        }
    }).catch(err => console.log(err));
}

function imageCaptureTakePhoto() {
    cnt++;
    imageCapture.takePhoto().then(blob => {
        if (cnt === 100) {
            let duration = performance.now() - imageCaptureTakePhotoStart;
            const p = document.createElement('p');
            p.textContent = 'ImageCapture.takePhoto(): ' + duration;
            document.body.appendChild(p);
        } else {
            imageCaptureTakePhoto();
        }
    }).catch(err => console.log(err));
}