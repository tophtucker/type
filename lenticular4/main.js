var mouse, mouseScale = d3.scale.linear()
  .domain([0,innerWidth])
  .range([3,45]);

document.onmousemove = function(e) {
  mouse = [e.clientX, e.clientY];
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

  ctx.globalCompositeOperation = "source-over";

  ctx.clearRect(0,0,innerWidth,innerHeight);

  var px = mouse ? mouseScale(mouse[0]) : 18;

  ctx.fillStyle = ctx.createPattern(getPattern(px, .1, t/1000, "#FF0000"), "repeat");
  ctx.fillRect(0,0,innerWidth,innerHeight);

  ctx.fillStyle = ctx.createPattern(getPattern(px, .1, t/1000 + .33, "#00FF00"), "repeat");
  ctx.fillRect(0,0,innerWidth,innerHeight);

  ctx.fillStyle = ctx.createPattern(getPattern(px, .1, t/1000 + .67, "#0000FF"), "repeat");
  ctx.fillRect(0,0,innerWidth,innerHeight);

  ctx.font = "800 400px helvetica, arial, sans-serif";
  ctx.fillStyle = ctx.createPattern(getPattern(px, .2, t/1000, "#FF0000"), "repeat");
  ctx.fillText("Steph", t/30 % innerWidth, innerHeight*.33);

  ctx.font = "800 350px helvetica, arial, sans-serif";
  ctx.fillStyle = ctx.createPattern(getPattern(px, .2, t/1000 + .33, "#00FF00"), "repeat");
  ctx.fillText("Tracy", innerWidth - (t/20 % innerWidth), innerHeight*.5);

  ctx.font = "800 175px helvetica, arial, sans-serif";
  ctx.fillStyle = ctx.createPattern(getPattern(px, .2, t/1000 + .67, "#0000FF"), "repeat");
  ctx.fillText("Toph", t/10 % innerWidth, innerHeight*.67);

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
