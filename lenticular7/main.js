var gamma = 0,  // - left-to-right + (radians)
    beta = 0,   // - back-to-front + (radians)
    alpha = 0;  // compass direction (radians)

if (window.DeviceOrientationEvent) {
  window.addEventListener('deviceorientation', function(e) {
    gamma   = e.gamma * (Math.PI / 180);
    beta    = e.beta  * (Math.PI / 180);
    alpha   = e.alpha * (Math.PI / 180);
  });
}

function getPattern(pixelSize, bandWidth, offset, color) {
  var width = height = pixelSize;

  bandWidth = bandWidth % 1;
  offset = offset % 1;

  var pattern = document.createElement('canvas');
  var ctx = pattern.getContext('2d');
  pattern.setAttribute('width', width);
  pattern.setAttribute('height', height);

  ctx.fillStyle = color;
  ctx.fillRect(offset*width, 0, bandWidth*width, height);
  ctx.fillRect((offset-1)*width, 0, bandWidth*width, height);

  return pattern;
}

function render(t, ctx) {

  d3.select("canvas").node().setAttribute('width', innerWidth * 2);
  d3.select("canvas").node().setAttribute('height', innerHeight * 2);
  ctx.font = "800 " + (innerWidth/2) + "px helvetica, arial, sans-serif";
  ctx.textBaseline = 'middle';
  ctx.textAlign = "center";
  ctx.scale(2,2);

  ctx.globalCompositeOperation = "source-over";

  ctx.clearRect(0,0,innerWidth,innerHeight);

  ctx.fillStyle = ctx.createPattern(getPattern(10, .5, Math.sin(gamma + alpha)+1, "#000000"), "repeat");
  ctx.fillRect(0,0,innerWidth,innerHeight);

  ctx.fillStyle = ctx.createPattern(getPattern(9, .5, Math.cos(beta)+1, "#000000"), "repeat");
  ctx.fillText("Fake", innerWidth*.5, innerHeight/2);

}

function init() {
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  canvas.setAttribute('width', innerWidth);
  canvas.setAttribute('height', innerHeight);
  // ctx.scale(2,2);

  // Add our demo to the HTML
  document.body.appendChild(canvas);

  ctx.font = "800 400px helvetica, arial, sans-serif";
  ctx.textBaseline = 'middle';
  ctx.textAlign = "center";

  d3.timer(function(t) { render(t, ctx); });
}

init();
