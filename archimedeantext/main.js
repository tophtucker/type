var container = d3.select('.container');

var r = 150;

var mouse = [-1000,-1000];
d3.select('body').on("mousemove", function() { 
  mouse = d3.mouse(container.node()); 
});

var img = container.append('img')
  .attr('src', 'Archimedes.png')
  .attr('width', r * 1.5);

var graf = d3.select("p")
  .call(split)
  .style('height', function(d,i) { return this.getBoundingClientRect().height + 'px'; });
var letters = graf.selectAll("span").call(positionAbsolutely);

d3.timer(render);

function render(t) {
  letters.each(function(d,i) {

    img
      .style('left', (mouse[0] - r*.75) + 'px')
      .style('top', (mouse[1] - r*.75) + 'px');

    var dy = mouse[1] - d.y;
    var displacementMagnitude = Math.sqrt( Math.pow(r,2) - Math.pow(dy,2) ) || 0;
    var displacement = d.x < mouse[0] ? -displacementMagnitude : displacementMagnitude;

    d3.select(this)
      .style('left', function(d) { return (d.x + displacement) + "px"; })

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
          "x": this.offsetLeft,
          "y": this.offsetTop
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