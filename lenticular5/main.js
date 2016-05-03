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

  ctx.globalCompositeOperation = "source-over";

  ctx.clearRect(0,0,innerWidth,innerHeight);

  ctx.fillStyle = ctx.createPattern(getPattern(10, .5, t/1000, "#000000"), "repeat");
  ctx.fillRect(0,0,innerWidth,innerHeight);

  ctx.font = "800 800px helvetica, arial, sans-serif";
  ctx.fillStyle = ctx.createPattern(getPattern(10, .5, t/1000, "#000000"), "repeat");
  ctx.fillText("Josh", t/30 % innerWidth, innerHeight*.5);

  ctx.font = "800 400px helvetica, arial, sans-serif";
  ctx.fillStyle = ctx.createPattern(getPattern(11, .5, t/1000, "#000000"), "repeat");
  ctx.fillText("Steph", t/30 % innerWidth, innerHeight*.25);

  ctx.font = "800 200px helvetica, arial, sans-serif";
  ctx.fillStyle = ctx.createPattern(getPattern(9, .5, 3*t/1000, "#000000"), "repeat");
  ctx.fillText("Tracy", t/20 % innerWidth, innerHeight*.5);

  ctx.font = "800 100px helvetica, arial, sans-serif";
  ctx.fillStyle = ctx.createPattern(getPattern(12, .5, 0, "#000000"), "repeat");
  ctx.fillText("Toph", (innerWidth*.5 - t/1000) % innerWidth, innerHeight*.75);

}

function init() {
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  canvas.setAttribute('width', innerWidth);
  canvas.setAttribute('height', innerHeight);

  // Add our demo to the HTML
  document.body.appendChild(canvas);

  ctx.font = "800 82px helvetica, arial, sans-serif";
  ctx.textBaseline = 'middle';
  ctx.textAlign = "center";

  d3.timer(function(t) { render(t, ctx); });
}

init();
