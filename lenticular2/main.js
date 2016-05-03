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

  ctx.clearRect(0,0,innerWidth,innerHeight);

  ctx.fillStyle = ctx.createPattern(getPattern(.5, t/100), "repeat");
  ctx.fillRect(0,0,innerWidth,innerHeight);

  ctx.fillStyle = ctx.createPattern(getPattern(.7, t/100), "repeat");
  ctx.fillText("Tapas are small plates", innerWidth/2, innerHeight*.4);

  ctx.fillStyle = ctx.createPattern(getPattern(.5, 0), "repeat");
  ctx.fillText("you share with friends", innerWidth/2, innerHeight*.6);

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