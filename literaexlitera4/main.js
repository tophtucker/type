var noiseScale = 300;
var noiseStrength = 10;
var noise = noiser(4,.8);

var dv = .001;
var mouse = [-1000,-1000];
d3.select("body").on("mousemove", function() { 
  mouse = d3.mouse(this); 
});

var graf = d3.select("p")
  .call(split)
  .style('height', function(d,i) { return this.getBoundingClientRect().height + 'px'; });
var letters = graf.selectAll("span").call(positionAbsolutely);

var restorativeEffect = d3.scale.linear()
  .domain([0,200])
  .range([1,0])
  .clamp(true);

var driftDampening = d3.scale.linear()
  .domain([0,200])
  .range([0,1])
  .clamp(true);

var highlight = d3.scale.linear()
  .domain([0,100])
  .range([.1,1])
  .clamp(true);

d3.timer(render);

function render(t) {
  letters.each(function(d,i) {

    var distMouseToLetter = distance(mouse, [d.x,d.y]);
    var distMouseToOrigin = distance(mouse, [d.bb.left,d.bb.top]);

    d.v = (d.v + dv) * (driftDampening(distMouseToOrigin));

    var restoreX = restorativeEffect(distMouseToOrigin) * (d.x - d.bb.left);
    var restoreY = restorativeEffect(distMouseToOrigin) * (d.y - d.bb.top);

    var angle = noise(d.x / noiseScale, d.y / noiseScale) * noiseStrength;
    var driftX = driftDampening(distMouseToOrigin) *  Math.cos(angle) * d.v;
    var driftY = driftDampening(distMouseToOrigin) * -Math.sin(angle) * d.v;

    d.x += driftX - restoreX;
    d.y += driftY - restoreY;

    d3.select(this)
      .style('left', function(d) { return d.x + "px"; })
      .style('top', function(d) { return d.y + "px"; })
      .style('opacity', function(d) { return highlight(distMouseToLetter); });

  });
}

function split(selection) {
  selection.each(function(d,i) {
    var text = this.innerText.split("");
    this.innerHTML = '';
    text.forEach(function(letter,j) {
      this.innerHTML += "<span>" + letter + "</span>";
    }, this);
    d3.select(this).selectAll("span")
      .each(function(dd,ii) {
        d3.select(this).datum({
          "bb": this.getBoundingClientRect(),
          "x": this.getBoundingClientRect().left,
          "y": this.getBoundingClientRect().top,
          "v": 0
        });
      });
  });
}

function positionAbsolutely(selection) {
  selection.each(function(d,i) {
    d3.select(this)
      .style('left', function(d) { return d.x + "px"; })
      .style('top', function(d) { return d.y + "px"; })
      .style('position', 'absolute');
  });
}

function distance(a,b) {
  var dx = b[0] - a[0];
  var dy = b[1] - a[1];
  return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
}