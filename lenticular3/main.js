function getPattern(bandWidth, offset) {
  var width = 8,
      height = 8;

  var pattern = document.createElement('canvas');
  var ctx = pattern.getContext('2d');
  pattern.setAttribute('width', width);
  pattern.setAttribute('height', height);

  ctx.fillRect(offset%width,0,bandWidth*width,height);
  ctx.fillRect((offset%width-width)%width,0,bandWidth*width,height);

  return pattern;
}

function render(t, ctx) {

  ctx.globalCompositeOperation = "source-over";

  ctx.clearRect(0,0,innerWidth,innerHeight);

  ctx.fillStyle = ctx.createPattern(getPattern(.1, t/100), "repeat");
  ctx.fillRect(0,0,innerWidth,innerHeight);

  ctx.font = "800 400px helvetica, arial, sans-serif";
  ctx.fillStyle = ctx.createPattern(getPattern(.3, t/100), "repeat");
  ctx.fillText("Steph", t/30 % innerWidth, innerHeight*.33);

  ctx.globalCompositeOperation = "xor";
  ctx.font = "800 350px helvetica, arial, sans-serif";
  ctx.fillStyle = ctx.createPattern(getPattern(.3, t/100), "repeat");
  ctx.fillText("Tracy", innerWidth - (t/20 % innerWidth), innerHeight*.5);

  ctx.globalCompositeOperation = "source-over";
  ctx.font = "800 175px helvetica, arial, sans-serif";
  ctx.fillStyle = ctx.createPattern(getPattern(.5, t/100), "repeat");
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