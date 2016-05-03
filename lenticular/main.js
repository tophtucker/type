function getPattern(t, amp) {  
  var width = 8,
      height = 8;

  var pattern = document.createElement('canvas');
  var ctx = pattern.getContext('2d');
  pattern.setAttribute('width', width);
  pattern.setAttribute('height', height);

  var fraction = 2*Math.sin(t) + 5 + amp;

  ctx.fillRect(0,0,width/fraction,height);

  return pattern;
}

function render(t, ctx) {

  ctx.clearRect(0,0,innerWidth,innerHeight);

  ctx.fillStyle = ctx.createPattern(getPattern(t/500, 0), "repeat");
  ctx.fillRect(0,0,innerWidth,innerHeight);

  ctx.fillStyle = ctx.createPattern(getPattern(t/500 + Math.PI/2, -1.2), "repeat");
  ctx.fillText("Steph", t/30 % innerWidth, innerHeight*.25);

  ctx.fillStyle = ctx.createPattern(getPattern(t/1000 + Math.PI/2, -1), "repeat");
  ctx.fillText("Tracy", innerWidth - (t/20 % innerWidth), innerHeight*.50);

  ctx.fillStyle = ctx.createPattern(getPattern(0, -1), "repeat");
  ctx.fillText("Toph", t/10 % innerWidth, innerHeight*.75);

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