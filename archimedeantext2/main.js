var body = d3.select('body');
var container = d3.select('.container');

var r = 150;

var mask = [innerWidth/2,innerHeight/2];

var img = container.append('img')
  .attr('src', 'Archimedes.png')
  .attr('width', r * 1.2)
  .style('left', (mask[0] - r*.6) + 'px')
  .style('top', (mask[1] - r*.6) + 'px');

var graf = d3.select("p")
  .call(split)
  .style('height', function(d,i) { return this.getBoundingClientRect().height + 'px'; });
var words = graf.selectAll("span").call(positionAbsolutely);

d3.select(window).on('scroll', wrap);
wrap();

function wrap() {
  var bbox = container.node().getBoundingClientRect();
  words.each(function(d,i) {
    var dy = mask[1] - (d.y + bbox.top + d.height);
    var displacementMagnitude = Math.sqrt( Math.pow(r,2) - Math.pow(dy,2) ) || 0;
    var displacement = (d.x + bbox.left + d.width/2) < mask[0] ? -displacementMagnitude : displacementMagnitude;
    d3.select(this)
      .style('left', function(d) { return (d.x + displacement) + "px"; });
  })
}

function split(selection) {
  selection.each(function(d,i) {
    var text = this.innerText.split(" ");
    this.innerHTML = '';
    text.forEach(function(word,j) {
      this.innerHTML += "<span>" + word + "</span> ";
    }, this);
    d3.select(this).selectAll("span")
      .each(function(dd,ii) {
        d3.select(this).datum({
          "x": this.offsetLeft,
          "y": this.offsetTop,
          "width": this.offsetWidth,
          "height": this.offsetHeight
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

// :)