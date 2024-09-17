
var x = 0;
var y = 0;
var normalizedX = 0;
var normalizedY = 0;
var savedStyles = {};
var modelRunning = false;

var outputCanvas;
var outputContext;
var inputCanvas;
var inputContext;
var coordinatesDisplay;

var script = document.createElement('script');
script.onload = function () {
    //do stuff with the script
    console.log('opencv loaded');
};
script.src = "https://docs.opencv.org/master/opencv.js";
document.head.appendChild(script); //or something of the likes

hands_init = function()
{
    outputCanvas = document.getElementById('outputCanvas');
    outputContext = outputCanvas.getContext('2d');
    inputCanvas = document.getElementById('inputCanvas');
    inputContext = inputCanvas.getContext('2d');
    coordinatesDisplay = document.getElementById('coordinates');

    // Initial draw of the input canvas
    drawInputCanvas();
    updateCoordinates();
                               

    setTimeout(onOpenCvReady, 2500);
          
    inputCanvas.addEventListener("mousedown", (event) => {
                            
        function eventHandler(e) {
            updatePosition(e);
            updateCoordinates();
        }
                                
        document.addEventListener("mousemove", eventHandler);
                                
        document.addEventListener("mouseup", () => {
            document.removeEventListener("mousemove",eventHandler);
            updateCoordinates();
        });
        updatePosition(event);
                                
    });


    
}        

function setTableHeight() {
    var windowHeight = $(window).height();
    var windowWidth = $(window).width();
    
    if(windowWidth > 640){
        var tableHeight = windowHeight - 370;
    } else {
        var tableHeight = windowHeight - 340;
    }
    
    $('#hands_column').css('height', tableHeight + 'px');
}


$(document).ready(function() {
    setTableHeight();
});


// Adjust height on window resize
$(window).resize(function() {
    setTableHeight();
});


function drawInputCanvas() 
{
    inputContext.clearRect(0, 0, inputCanvas.width, inputCanvas.height);

    // Draw all saved styles
    for (const styleName in savedStyles) {
        const [normalizedX, normalizedY] = savedStyles[styleName];
        const savedX = (normalizedX + 8) / 16 * inputCanvas.width;
        const savedY = ((-normalizedY + 8) / 16) * inputCanvas.height;

        inputContext.beginPath();
        inputContext.arc(savedX, savedY, 2, 0, 2 * Math.PI);
        inputContext.fillStyle = 'blue';
        inputContext.fill();
        inputContext.stroke();

        // Draw label
        inputContext.font = '14px Arial';
        inputContext.fillText(styleName, savedX + 5, savedY - 5);
    }

        // Draw the red circle representing the input
        inputContext.beginPath();
        inputContext.arc(x, y, 5, 0, 2 * Math.PI);
        inputContext.fillStyle = 'red';
        inputContext.fill();
        inputContext.stroke();
}

function saveStyle() {
    const styleName = document.getElementById('styleName').value;
    savedStyles[styleName] = [((x / inputCanvas.width) * 16 - 8), ((-y / inputCanvas.height) * 16 + 8)];
    drawInputCanvas();
}

function checkClosest() {
    const currentNormalizedX = ((x / inputCanvas.width) * 16 - 8);
    const currentNormalizedY = ((-y / inputCanvas.height) * 16 + 8);

    // Calculate distances to all saved styles
    const distances = [];
    for (const styleName in savedStyles) {
        const [normalizedX, normalizedY] = savedStyles[styleName];
        const distance = Math.sqrt((normalizedX - currentNormalizedX) ** 2 + (normalizedY - currentNormalizedY) ** 2);
        distances.push({ styleName, distance });
    }
    // Sort distances and display the 3 closest in the div
    distances.sort((a, b) => a.distance - b.distance);
    const closestStyles = distances.slice(0, 3);

    const savedStylesDiv = document.getElementById('savedStyles');
    savedStylesDiv.innerHTML = '<strong>Closest Styles:</strong>';
    closestStyles.forEach(({ styleName, distance }) => {
        savedStylesDiv.innerHTML += `<p>${styleName}: ${distance.toFixed(2)}</p>`;
    });
}

function updateCoordinates() {
    normalizedX = (x / inputCanvas.width) * 16 - 8;
    normalizedY = -((y / inputCanvas.height) * 16 - 8);

    // Update the coordinates display
    coordinatesDisplay.textContent = `X: ${normalizedX.toFixed(2)}, Y: ${normalizedY.toFixed(2)}`;

    // Run the model if it's not already running
    if (!modelRunning) {
        modelRunning = true;
        runModel(normalizedX, normalizedY);
    }
}

async function runModel(normalizedX, normalizedY) {
    const inputArr = new Float32Array([normalizedX, normalizedY]);
    const dims = [1, 2];
    const inputTensor = new ort.Tensor("float32", inputArr, dims);

    try {
    // create a session
    const options = { executionProviders: ['wasm'], graphOptimizationLevel: 'all' };   
    const myOrtSession = await ort.InferenceSession.create("/static/assets/hands/decoder.onnx", options);
    // execute the model
    const feeds = { "input": inputTensor };
    const outputs = await myOrtSession.run(feeds);
    // consume the output
    const outputTensor = outputs["output"];
    const outputTensorData = outputTensor.data;

    if (outputTensorData) 
    {
        const channels = 1;  // Number of channels in the output tensor
        const canvasSize = 64;  // Size of the canvas

        // Create an RGB image data with the same size as the output tensor
        const imageData = outputContext.createImageData(canvasSize, canvasSize);

        // Map values from -1 to 1 to the [0, 255] range and multiply by 256
        const mapValue = (value) => (Math.round((value) * 256));

        // Duplicate the single channel to create an RGB image
        for (let i = 0; i < imageData.data.length; i += 4) {
            const pixelValue = mapValue(outputTensorData[i / 4]);
            imageData.data[i] = pixelValue;  // Red channel
            imageData.data[i + 1] = pixelValue;  // Green channel
            imageData.data[i + 2] = pixelValue;  // Blue channel
            imageData.data[i + 3] = 255;  // Alpha channel (fully opaque)
        }

        // Draw the resized image on the output canvas
        outputContext.putImageData(imageData, 0, 0);
    }
    } catch (error) {
        console.error("Error running the model:", error);
    } finally {
        modelRunning = false;
    }
}

                                
                            

function updatePosition(event) {
    const rect = inputCanvas.getBoundingClientRect();
    x = event.clientX - rect.left;
    y = event.clientY - rect.top;

    // Constrain x and y values within the canvas
    x = Math.max(0, Math.min(x, inputCanvas.width));
    y = Math.max(0, Math.min(y, inputCanvas.height));

    drawInputCanvas();
}
 

let img;

function onOpenCvReady() {
//cv['onRuntimeInitialized'] = () => {
    loadDefaultImage();
    document.getElementById('fileInput').addEventListener('change', handleFileSelect);
//};
}

function loadDefaultImage() {
    const defaultImage = new Image();
    defaultImage.src = '/static/assets/hands/sample.png';
    defaultImage.onload = function () {
        // img = cv.imread(defaultImage);

        displayImage('canvas1', img);
        performOperations();
    };
}


function handleFileSelect(event) 
{
        const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) 
        {
            const imgElement = document.createElement('img');
            imgElement.src = e.target.result;
            imgElement.onload = function () {
                img = cv.imread(imgElement);

                //Resize image:
                const scaledCanvas = document.getElementById('canvas1');

                // Calculate scaling factors to preserve aspect ratio
                const scaleFactorX = scaledCanvas.width / img.cols;
                const scaleFactorY = scaledCanvas.height / img.rows;
                const scaleFactor = Math.min(scaleFactorX, scaleFactorY);

                // Resize the image using OpenCV.js
                scaledMat = new cv.Mat();
                cv.resize(img, scaledMat, new cv.Size(0, 0), scaleFactor, scaleFactor, cv.INTER_AREA);

                // Display the user-loaded image on canvas1
                const ctx = scaledCanvas.getContext('2d');
                //fill black
                ctx.clearRect(0, 0, scaledCanvas.width, scaledCanvas.height);

                displayImage('canvas1', scaledMat);

                // Perform operations
                performOperations();
            };
        };
        reader.readAsDataURL(file);
    }
}

function performOperations() {
    // Desaturation
    const imgGray = new cv.Mat();
    cv.cvtColor(img, imgGray, cv.COLOR_RGBA2GRAY);

    // Auto-contrast
    alpha = 1.7 // Contrast control (1.0-3.0)
    beta = -90 // Brightness control (0-100)
    cv.convertScaleAbs(imgGray,imgGray, alpha, beta)

    // Adjust levels
    const imgInv = new cv.Mat();
    //cv.threshold(imgGray, imgAdjusted, 192, 255, cv.THRESH_BINARY_INV);
    cv.bitwise_not(imgGray,imgInv);


    // Apply thresholding
    const imgTreshold = new cv.Mat();
    cv.threshold(imgInv, imgTreshold, 128, 255, cv.THRESH_BINARY);//cv.THRESH_BINARY_INV

    // Find contours in the binary mask
    const contours = new cv.MatVector();
    const hierarchy = new cv.Mat();
    cv.findContours(imgTreshold, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

    if (contours.size() < 1) {
        console.log('no contours')
        return;
    }

    // Find the largest contour
    let maxContourIdx = 0;
    let maxContourArea = cv.contourArea(contours.get(maxContourIdx));
    for (let i = 1; i < contours.size(); i++) {
        const area = cv.contourArea(contours.get(i));
        if (area > maxContourArea) {
        maxContourArea = area;
        maxContourIdx = i;
        }
    }

    // Calculate the bounding box for the largest contour
    const rect = cv.boundingRect(contours.get(maxContourIdx));

    // Calculate the size of the 1:1 bounding box
    const maxSide = Math.max(rect.width, rect.height);

    const borderSize = maxSide/2;
    // Calculate the coordinates of the top-left corner of the bounding box
    rect.x = Math.max(0, rect.x + rect.width / 2 - maxSide / 2 +borderSize);
    rect.y = Math.max(0, rect.y + rect.height / 2 - maxSide / 2 +borderSize);

    rect.width = maxSide;
    rect.height = maxSide;

    // Add a white border before cropping
    const borderedImage = new cv.Mat();

    cv.copyMakeBorder(imgInv, borderedImage, borderSize, borderSize, borderSize, borderSize, cv.BORDER_CONSTANT, [0, 0, 0, 0]);

    // Crop and re-center the image
    const croppedImage = borderedImage.roi(rect);
                        
    //Resize image:
    const dsize = new cv.Size(64, 64);
    cv.resize(croppedImage, croppedImage, dsize, 0, 0, cv.INTER_AREA);

    // Display the processed image on canvas2
    const imgColor = new cv.Mat();
    cv.cvtColor(croppedImage, imgColor, cv.COLOR_GRAY2RGBA);
                        

    displayImage('canvas2', imgColor);

    // Clean up
    imgColor.delete();
    imgGray.delete();
    imgTreshold.delete();
    contours.delete();
    hierarchy.delete();
    borderedImage.delete();
    croppedImage.delete();
                        
    //Do the magic:
    processImage();
}


function displayImage(canvasId, mat) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const imgData = new ImageData(new Uint8ClampedArray(mat.data), mat.cols, mat.rows);
    ctx.putImageData(imgData, 0, 0);
}
                        

async function processImage() {
    const canvas = document.getElementById('canvas2');
    const ctx = canvas.getContext('2d');

    // Read the image data from the canvas
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Convert the image data to a 1-channel Float32Array
    const float32Array = new Float32Array(imageData.data.length / 4);
    for (let i = 0; i < float32Array.length; i++) {
        float32Array[i] = imageData.data[i * 4] / 255.0; // Assuming the image is grayscale
    }

    // Repeat the same image 32 times to form a batch
    const batchedFloat32Array = new Float32Array(float32Array.length * 32);
    for (let i = 0; i < 32; i++) {
        batchedFloat32Array.set(float32Array, i * float32Array.length);
    }

    // Create an ONNX session
    const options = { executionProviders: ['wasm'], graphOptimizationLevel: 'all' };
    const ortSession = await ort.InferenceSession.create("/static/assets/hands/encoder.onnx", options);

    // Create an input tensor
    const inputTensor = new ort.Tensor('float32', new Float32Array(batchedFloat32Array), [32, 1, 64, 64]);

                        
    // Execute the model
    const feeds = { "input": inputTensor };
    const outputs = await ortSession.run(feeds);

    // Consume the output
    const outputTensor = outputs["output"];
    const outputTensorData = outputTensor.data;

    // Display the output values in an HTML div
    const outputDiv = document.getElementById('outputValues');
                        
    normalizedX = outputTensorData[0];
    normalizedY = outputTensorData[1];
    outputDiv.innerHTML = `Output Values: \nx=${normalizedX.toFixed(2)}, \ny=${normalizedY.toFixed(2)}`;
                    
    //updatePosition   
    x = (normalizedX + 8) / 16 * inputCanvas.width;
    y = ((-normalizedY + 8) / 16) * inputCanvas.height;
    // Constrain x and y values within the canvas
    x = Math.max(0, Math.min(x, inputCanvas.width));
    y = Math.max(0, Math.min(y, inputCanvas.height));

    drawInputCanvas();
                        
    updateCoordinates();
}      


