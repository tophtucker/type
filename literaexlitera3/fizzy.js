function CanvasText(container, message) {

  var width = container.offsetWidth;
  var height = container.offsetHeight;

  // This is the context we use to get a bitmap of text using
  // the getImageData function.
  var r = document.createElement('canvas');
  var s = r.getContext('2d');

  r.setAttribute('width', width);
  r.setAttribute('height', height);

  container.appendChild(r);

  // Stores bitmap image
  var pixels = [];

  s.font = "800 180px helvetica, arial, serif";
  s.textBaseline = 'middle';
  s.textAlign = "center";

  // This function creates a bitmap of pixels based on your message
  // It's called every time we change the message property.
  var createBitmap = function (msg) {

    s.fillStyle = "#fff";
    s.fillRect(0, 0, width, height);

    s.fillStyle = "#222";
    s.fillText(msg, width/2, height/2);

    // Pull reference
    var imageData = s.getImageData(0, 0, width, height);
    pixels = imageData.data;

  };

  // Returns x, y coordinates for a given index in the pixel array.
  var getPosition = function (i) {
    return {
      x: (i - (width * 4) * Math.floor(i / (width * 4))) / 4,
      y: Math.floor(i / (width * 4))
    };
  };

  // Returns a color for a given pixel in the pixel array.
  this.getColor = function (x, y) {
    var base = (Math.floor(y) * width + Math.floor(x)) * 4;
    var c = {
      r: pixels[base + 0],
      g: pixels[base + 1],
      b: pixels[base + 2],
      a: pixels[base + 3]
    };

    return "rgb(" + c.r + "," + c.g + "," + c.b + ")";
  };

  // createBitmap(message);

  var img = new Image();   // Create new img element
  img.addEventListener("load", function() {
    // execute drawImage statements here
    s.drawImage(img,0,0);
    var imageData = s.getImageData(0, 0, width, height);
    pixels = imageData.data;
  }, false);
  img.src = 'bloomberg.png'; // Set source path

}
