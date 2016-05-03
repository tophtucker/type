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

  ctx.fillStyle = ctx.createPattern(getPattern(15, .5, 2*t/1000, "#000000"), "repeat");
  ctx.fillRect(0,0,innerWidth,innerHeight);

  d3.range(5).forEach(function(d) {

    var h = (innerHeight/4) * Math.sin((t*d)/1000) + innerHeight/2;
    var w = (d % 2 == 0) ? 14 : 16;

    ctx.fillStyle = ctx.createPattern(getPattern(w, .5, (t*d)/1000, "#000000"), "repeat");
    ctx.fillText("Fake", innerWidth*.5, h);

  })

}

function init() {
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  canvas.setAttribute('width', innerWidth);
  canvas.setAttribute('height', innerHeight);

  // Add our demo to the HTML
  document.body.appendChild(canvas);

  ctx.font = "800 400px helvetica, arial, sans-serif";
  ctx.textBaseline = 'middle';
  ctx.textAlign = "center";

  d3.timer(function(t) { render(t, ctx); });
}

init();
